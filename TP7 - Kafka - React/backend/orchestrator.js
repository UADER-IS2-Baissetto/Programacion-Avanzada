/**
 * orchestrator.js
 * - CONECTA a Postgres y LISTEN al canal 'txn_commands'
 * - Procesa cada TransactionInitiated y publica eventos en la tabla txn_events
 * - NOTIFY txn_events con cada evento (escape manual del payload)
 *
 * Ejecutar:
 *   set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tp7_kafka
 *   node orchestrator.js
 */

const { createClient } = require('./dbClient');

// Canales
const TXN_COMMANDS_CHANNEL = 'txn_commands';
const TXN_EVENTS_CHANNEL = 'txn_events';

// Simulaciones (puedes tunear probabilidades)
function simulateHold() {
  return Math.random() < 0.85; // 85% success
}
function simulateFraud() {
  const r = Math.random();
  if (r < 0.8) return 'LOW';
  if (r < 0.95) return 'MEDIUM';
  return 'HIGH';
}

// Escapa comillas simples para inyectar en NOTIFY 'payload'
function escapeForSqlString(s) {
  return s.replace(/'/g, "''");
}

async function processCommand(payloadObj, writerClient) {
  const transactionId = payloadObj.transactionId;
  console.log(`[orchestrator] procesando ${payloadObj.type} tx=${transactionId}`);

  try {
    // 1) FundsReserved
    const holdOk = simulateHold();
    const fundsReserved = {
      type: 'FundsReserved',
      transactionId,
      timestamp: Date.now(),
      body: { ok: holdOk, holdId: holdOk ? `hold-${Math.floor(Math.random() * 1e6)}` : null, amount: payloadObj.body.amount }
    };
    // insertar evento en tabla
    await writerClient.query(
      'INSERT INTO txn_events(transaction_id, type, payload) VALUES($1, $2, $3)',
      [transactionId, fundsReserved.type, fundsReserved]
    );
    // notificar
    await writerClient.query(`NOTIFY ${TXN_EVENTS_CHANNEL}, '${escapeForSqlString(JSON.stringify(fundsReserved))}'`);

    if (!holdOk) {
      const reversed = { type: 'Reversed', transactionId, timestamp: Date.now(), body: { reason: 'Insufficient funds (simulated)' } };
      await writerClient.query('INSERT INTO txn_events(transaction_id, type, payload) VALUES($1, $2, $3)', [transactionId, reversed.type, reversed]);
      await writerClient.query(`NOTIFY ${TXN_EVENTS_CHANNEL}, '${escapeForSqlString(JSON.stringify(reversed))}'`);
      return;
    }

    // 2) FraudChecked
    const risk = simulateFraud();
    const fraudChecked = { type: 'FraudChecked', transactionId, timestamp: Date.now(), body: { risk } };
    await writerClient.query('INSERT INTO txn_events(transaction_id, type, payload) VALUES($1, $2, $3)', [transactionId, fraudChecked.type, fraudChecked]);
    await writerClient.query(`NOTIFY ${TXN_EVENTS_CHANNEL}, '${escapeForSqlString(JSON.stringify(fraudChecked))}'`);

    if (risk === 'HIGH') {
      const reversed = { type: 'Reversed', transactionId, timestamp: Date.now(), body: { reason: 'High fraud risk' } };
      await writerClient.query('INSERT INTO txn_events(transaction_id, type, payload) VALUES($1, $2, $3)', [transactionId, reversed.type, reversed]);
      await writerClient.query(`NOTIFY ${TXN_EVENTS_CHANNEL}, '${escapeForSqlString(JSON.stringify(reversed))}'`);
      return;
    }

    // 3) Committed
    const ledgerTxId = `ledger-${Math.floor(Math.random() * 1e9)}`;
    const committed = { type: 'Committed', transactionId, timestamp: Date.now(), body: { ledgerTxId } };
    await writerClient.query('INSERT INTO txn_events(transaction_id, type, payload) VALUES($1, $2, $3)', [transactionId, committed.type, committed]);
    await writerClient.query(`NOTIFY ${TXN_EVENTS_CHANNEL}, '${escapeForSqlString(JSON.stringify(committed))}'`);

    // 4) Notified
    const notified = { type: 'Notified', transactionId, timestamp: Date.now(), body: { channels: ['email'] } };
    await writerClient.query('INSERT INTO txn_events(transaction_id, type, payload) VALUES($1, $2, $3)', [transactionId, notified.type, notified]);
    await writerClient.query(`NOTIFY ${TXN_EVENTS_CHANNEL}, '${escapeForSqlString(JSON.stringify(notified))}'`);

    console.log(`[orchestrator] fin tx=${transactionId}`);
  } catch (err) {
    console.error('[orchestrator] error procesando comando:', err);
    // intento escribir en DLQ
    try {
      await writerClient.query('INSERT INTO txn_dlq(transaction_id, payload, error) VALUES($1, $2, $3)', [transactionId, payloadObj, String(err)]);
    } catch (e) {
      console.error('[orchestrator] fallo guardando DLQ:', e);
    }
  }
}

async function start() {
  const listenerClient = createClient();
  const writerClient = createClient();

  await listenerClient.connect();
  await writerClient.connect();

  // asegurar tablas existen (solo si no las creaste a mano)
  await writerClient.query(`
    CREATE TABLE IF NOT EXISTS txn_events (
      id bigserial PRIMARY KEY,
      transaction_id uuid NOT NULL,
      type text NOT NULL,
      payload jsonb,
      created_at timestamptz DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS txn_dlq (
      id bigserial PRIMARY KEY,
      transaction_id uuid,
      payload jsonb,
      error text,
      created_at timestamptz DEFAULT now()
    );
  `);

  // LISTEN canal de comandos
  await listenerClient.query(`LISTEN ${TXN_COMMANDS_CHANNEL}`);
  console.log(`[orchestrator] escuchando canal ${TXN_COMMANDS_CHANNEL}`);

  listenerClient.on('notification', async (msg) => {
    try {
      const payload = JSON.parse(msg.payload);
      // procesar en background (no bloqueante)
      processCommand(payload, writerClient);
    } catch (err) {
      console.error('[orchestrator] error parseando notificacion:', err);
    }
  });

  listenerClient.on('error', (err) => console.error('[orchestrator] listener error', err));
}

start().catch(err => {
  console.error('Error arrancando orchestrator', err);
  process.exit(1);
});

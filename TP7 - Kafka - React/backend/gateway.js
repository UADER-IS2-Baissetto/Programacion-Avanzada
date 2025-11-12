/**
 * gateway.js
 * - LISTEN txn_events en Postgres
 * - abre WebSocket server (por defecto puerto 8080)
 * - reenvía eventos a clientes, con posibilidad de suscribirse por transactionId o userId
 *
 * Ejecutar:
 *   set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tp7_kafka
 *   node gateway.js
 */

const WebSocket = require('ws');
const { createClient } = require('./dbClient');

const PORT = process.env.PORT_GATEWAY || 8080;
const EVENTS_CHANNEL = 'txn_events';

async function start() {
  const listenerClient = createClient();
  await listenerClient.connect();

  // asegurar tabla events existe (si no la creaste)
  await listenerClient.query(`
    CREATE TABLE IF NOT EXISTS txn_events (
      id bigserial PRIMARY KEY,
      transaction_id uuid NOT NULL,
      type text NOT NULL,
      payload jsonb,
      created_at timestamptz DEFAULT now()
    );`);

  await listenerClient.query(`LISTEN ${EVENTS_CHANNEL}`);
  console.log(`[gateway] escuchando canal ${EVENTS_CHANNEL}`);

  const wss = new WebSocket.Server({ port: PORT });
  console.log(`[gateway] WebSocket escuchando en ws://0.0.0.0:${PORT}`);

  // manejo conexiones
  wss.on('connection', (ws) => {
    ws.subscriptions = { userId: null, transactionId: null };
    ws.send(JSON.stringify({ type: 'connected', message: 'Gateway activo' }));

    ws.on('message', (msg) => {
      try {
        const obj = JSON.parse(msg.toString());
        if (obj.action === 'subscribe') {
          if (obj.transactionId) ws.subscriptions.transactionId = obj.transactionId;
          if (obj.userId) ws.subscriptions.userId = obj.userId;
          ws.send(JSON.stringify({ type: 'subscribed', subscriptions: ws.subscriptions }));
        }
      } catch (err) {
        // ignore bad messages
      }
    });
  });

  // cuando llega NOTIFY txn_events, reenvío a los clientes
  listenerClient.on('notification', (msg) => {
    try {
      const evt = JSON.parse(msg.payload); // payload JSON.stringified en orchestrator/api
      // broadcast con filtrado por subscripciones
      wss.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return;
        const sub = client.subscriptions || {};
        // prioriza transactionId
        if (sub.transactionId && sub.transactionId === evt.transactionId) {
          client.send(JSON.stringify(evt));
          return;
        }
        // luego userId si coincide con evt.body.userId
        if (sub.userId && evt.body && String(evt.body.userId) === String(sub.userId)) {
          client.send(JSON.stringify(evt));
          return;
        }
        // sin subscripción -> broadcast todo
        if (!sub.transactionId && !sub.userId) {
          client.send(JSON.stringify(evt));
        }
      });
    } catch (err) {
      console.error('[gateway] error parseando evento', err);
    }
  });

  listenerClient.on('error', (err) => console.error('[gateway] listener error', err));
}

start().catch(err => {
  console.error('Error arrancando gateway', err);
  process.exit(1);
});

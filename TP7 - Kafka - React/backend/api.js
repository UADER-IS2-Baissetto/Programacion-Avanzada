// API: recibe POST /transactions y publica a txn_commands (Postgres + NOTIFY)
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('./dbClient');

const app = express();
app.use(bodyParser.json());

const TXN_CHANNEL = 'txn_commands';

const cors = require('cors');
app.use(cors());


async function start() {
  const client = createClient();
  await client.connect();
  console.log('API conectado a Postgres');

  // Asegurate de tener la tabla creada (si ejecutás init.sql manualmente, no es necesario)
  await client.query(`
    CREATE TABLE IF NOT EXISTS txn_commands (
      transaction_id uuid PRIMARY KEY,
      payload jsonb NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  `);

  app.post('/transactions', async (req, res) => {
    try {
      const { fromAccount, toAccount, amount, currency = 'ARS', userId } = req.body;
      if (!fromAccount || !toAccount || !amount || !userId) {
        return res.status(400).json({ error: 'falta campo' });
      }

      const transactionId = uuidv4();
      const payload = {
        type: 'TransactionInitiated',
        transactionId,
        timestamp: Date.now(),
        body: { fromAccount, toAccount, amount, currency, userId }
      };

      // Inserto en tabla de comandos
      await client.query(
        'INSERT INTO txn_commands(transaction_id, payload) VALUES($1, $2)',
        [transactionId, payload]
      );

      // Notifico para que orchestrator lo lea inmediatamente
      const payloadString = JSON.stringify(payload);
      await client.query(`NOTIFY ${TXN_CHANNEL}, '${payloadString.replace(/'/g, "''")}'`);


      return res.status(201).json({ transactionId });
      } catch (err) {
        console.error('❌ Error interno en POST /transactions:', err.message, err.stack);
        return res.status(500).json({ error: err.message });
      }
});

  const port = process.env.PORT_API || 3001;
  app.listen(port, () => console.log(`API escuchando en ${port}`));
}

start().catch(err => {
  console.error('Error arrancando API', err);
  process.exit(1);
});

// Cliente PG común
const { Client } = require('pg');

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/TP7%20Kafka';
function createClient() {
  const client = new Client({ connectionString });
  return client;
}

module.exports = { createClient };

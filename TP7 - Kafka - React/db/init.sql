-- Crear DB:
-- CREATE DATABASE "TP7 Kafka";

-- Dar permisos al usuario default:
-- GRANT ALL PRIVILEGES ON DATABASE "TP7 Kafka" TO postgres;

-- Contenido: tablas y indices
CREATE TABLE IF NOT EXISTS txn_commands (
  transaction_id uuid PRIMARY KEY,
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

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

-- índice por transaction_id para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_txn_events_txn ON txn_events(transaction_id)0;

-- eventos
CREATE TABLE IF NOT EXISTS eventos (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50),
  descripcion TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


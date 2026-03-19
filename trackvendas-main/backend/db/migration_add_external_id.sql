-- Adds external_id for future integrations
ALTER TABLE sales ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE;

-- Seed data

-- Stores
INSERT INTO stores (id, name, manager_id, active) VALUES
  ('s1', 'Loja Centro', NULL, TRUE),
  ('s2', 'Loja Shopping Norte', NULL, TRUE),
  ('s3', 'Loja Bairro Sul', NULL, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Users (password: 123456)
INSERT INTO users (id, name, email, password_hash, role, store_id, active) VALUES
  ('u1', 'Carlos Silva', 'carlos@loja.com', crypt('123456', gen_salt('bf')), 'vendedor', 's1', TRUE),
  ('u2', 'Ana Gerente', 'ana@loja.com', crypt('123456', gen_salt('bf')), 'gerente', 's1', TRUE),
  ('u3', 'Roberto Admin', 'roberto@loja.com', crypt('123456', gen_salt('bf')), 'dono', 's1', TRUE),
  ('u4', 'Maria Santos', 'maria@loja.com', crypt('123456', gen_salt('bf')), 'vendedor', 's1', TRUE),
  ('u5', 'Joao Lima', 'joao@loja.com', crypt('123456', gen_salt('bf')), 'gerente', 's2', TRUE),
  ('u6', 'Fernanda Costa', 'fernanda@loja.com', crypt('123456', gen_salt('bf')), 'vendedor', 's2', TRUE),
  ('u7', 'Pedro Alves', 'pedro@loja.com', crypt('123456', gen_salt('bf')), 'vendedor', 's2', TRUE),
  ('u8', 'Lucas Oliveira', 'lucas@loja.com', crypt('123456', gen_salt('bf')), 'vendedor', 's3', TRUE)
ON CONFLICT (id) DO NOTHING;

UPDATE stores SET manager_id = 'u2' WHERE id = 's1';
UPDATE stores SET manager_id = 'u5' WHERE id = 's2';
UPDATE stores SET manager_id = 'u2' WHERE id = 's3';

-- Vendor-store links
INSERT INTO vendor_stores (vendor_id, store_id) VALUES
  ('u1', 's1'),
  ('u4', 's1'),
  ('u6', 's2'),
  ('u7', 's2'),
  ('u8', 's3')
ON CONFLICT DO NOTHING;

-- Loss reasons
INSERT INTO loss_reasons (id, label, requires_note) VALUES
  ('1', 'Preco alto', FALSE),
  ('2', 'Credito negado', FALSE),
  ('3', 'Falta de mercadoria', FALSE),
  ('4', 'Cliente apenas olhando', FALSE),
  ('5', 'Troca', FALSE),
  ('6', 'Outros', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Sales
INSERT INTO sales (id, vendor_id, store_id, amount, date) VALUES
  ('sale1', 'u1', 's1', 1250, '2026-03-17'),
  ('sale2', 'u1', 's1', 890, '2026-03-16'),
  ('sale3', 'u1', 's1', 2100, '2026-03-15'),
  ('sale4', 'u4', 's1', 1750, '2026-03-17'),
  ('sale5', 'u4', 's1', 620, '2026-03-16'),
  ('sale6', 'u6', 's2', 3200, '2026-03-17'),
  ('sale7', 'u6', 's2', 1100, '2026-03-16'),
  ('sale8', 'u7', 's2', 980, '2026-03-17'),
  ('sale9', 'u7', 's2', 2400, '2026-03-15'),
  ('sale10', 'u8', 's3', 1500, '2026-03-17'),
  ('sale11', 'u8', 's3', 870, '2026-03-16'),
  ('sale12', 'u1', 's1', 1450, '2026-03-14'),
  ('sale13', 'u4', 's1', 2200, '2026-03-14'),
  ('sale14', 'u6', 's2', 1800, '2026-03-14'),
  ('sale15', 'u7', 's2', 950, '2026-03-14')
ON CONFLICT (id) DO NOTHING;

-- Losses
INSERT INTO loss_records (id, vendor_id, store_id, reason_id, note, created_at) VALUES
  ('l1', 'u1', 's1', '1', NULL, '2026-03-17T10:30:00'),
  ('l2', 'u1', 's1', '3', NULL, '2026-03-17T11:15:00'),
  ('l3', 'u1', 's1', '4', NULL, '2026-03-16T14:00:00'),
  ('l4', 'u4', 's1', '2', NULL, '2026-03-17T09:45:00'),
  ('l5', 'u4', 's1', '1', NULL, '2026-03-16T16:30:00'),
  ('l6', 'u6', 's2', '1', NULL, '2026-03-17T10:00:00'),
  ('l7', 'u6', 's2', '5', NULL, '2026-03-16T13:20:00'),
  ('l8', 'u7', 's2', '4', NULL, '2026-03-17T15:00:00'),
  ('l9', 'u7', 's2', '6', 'Cliente desistiu na hora do pagamento', '2026-03-15T11:30:00'),
  ('l10', 'u8', 's3', '3', NULL, '2026-03-17T09:00:00'),
  ('l11', 'u8', 's3', '2', NULL, '2026-03-16T10:45:00'),
  ('l12', 'u1', 's1', '1', NULL, '2026-03-14T10:00:00'),
  ('l13', 'u6', 's2', '2', NULL, '2026-03-14T14:00:00')
ON CONFLICT (id) DO NOTHING;

-- Fabric Print D1 schema.
-- Most entities are stored as a JSON document in `data`, with the columns we
-- filter or sort on pulled out alongside it.

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_products_sort ON products (sort_order);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 0,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user',
  password_hash TEXT,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  order_status TEXT NOT NULL DEFAULT 'Pending',
  total_paise INTEGER NOT NULL DEFAULT 0,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_rzp ON orders (razorpay_order_id);

-- Singleton documents: customizer settings, swatch books, seed marker.
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Esquema D1 (SQLite) de Biomáster Academy
CREATE TABLE IF NOT EXISTS users(
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL DEFAULT '',
  pw_hash TEXT NOT NULL, pw_salt TEXT NOT NULL, created_at INTEGER NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0); -- 1 = comprobó acceso al correo (enlace de restablecimiento)
CREATE TABLE IF NOT EXISTS sessions(
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS subscriptions(
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT, status TEXT NOT NULL DEFAULT 'none',
  stripe_customer TEXT, stripe_sub TEXT,
  current_period_end INTEGER, cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  card_brand TEXT, card_last4 TEXT, updated_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS subs_customer ON subscriptions(stripe_customer);
CREATE TABLE IF NOT EXISTS progress(
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data TEXT NOT NULL, updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS lessons(
  id TEXT PRIMARY KEY, module TEXT NOT NULL, position INTEGER NOT NULL, title TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '', video_url TEXT NOT NULL DEFAULT '', free INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS stripe_events(id TEXT PRIMARY KEY, received_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS throttle(key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS password_resets(
  token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS orders(
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL, currency TEXT NOT NULL, method TEXT NOT NULL, provider TEXT NOT NULL,
  amount INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending', provider_ref TEXT,
  created_at INTEGER NOT NULL, paid_at INTEGER);
CREATE INDEX IF NOT EXISTS orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_ref ON orders(provider, provider_ref);

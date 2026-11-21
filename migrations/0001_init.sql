CREATE TABLE purchases (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,              -- 'stripe' | 'tribute' | 'mock'
  external_id TEXT NOT NULL UNIQUE,  -- stripe session.id / tribute purchase id
  email TEXT,
  telegram_user_id INTEGER,
  amount INTEGER NOT NULL,           -- minor units
  currency TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'ru',
  created_at TEXT NOT NULL
);
CREATE INDEX purchases_email ON purchases(email);

CREATE TABLE access_tokens (
  token TEXT PRIMARY KEY,
  purchase_id TEXT REFERENCES purchases(id),  -- NULL for the shared Tribute token
  created_at TEXT NOT NULL,
  last_used_at TEXT,
  revoked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX access_tokens_purchase ON access_tokens(purchase_id);

-- resend-link rate limit: one row per request
CREATE TABLE resend_requests (
  key TEXT NOT NULL,          -- email or ip
  created_at TEXT NOT NULL
);
CREATE INDEX resend_requests_key ON resend_requests(key, created_at);

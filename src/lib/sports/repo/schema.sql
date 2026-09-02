-- Open Mirror sports — first-party results network.
--
-- Three tables, no ORM, no migration framework. The crawler's archive stays in
-- committed files; this is only what production must write durably.

CREATE TABLE IF NOT EXISTS sports_credentials (
  id           TEXT PRIMARY KEY,
  token_hash   TEXT NOT NULL UNIQUE,   -- SHA-256. The token itself is never stored.
  school_id    TEXT NOT NULL,
  label        TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL,
  revoked_at   TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  use_count    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS sports_credentials_school ON sports_credentials (school_id);

CREATE TABLE IF NOT EXISTS sports_submissions (
  id            TEXT PRIMARY KEY,
  fingerprint   TEXT NOT NULL UNIQUE,  -- idempotency: one report, however many taps
  origin        TEXT NOT NULL,
  credential_id TEXT,
  status        TEXT NOT NULL,
  reason        TEXT,
  event_id      TEXT,
  payload       JSONB NOT NULL,
  received_at   TIMESTAMPTZ NOT NULL,
  client_key    TEXT
);
CREATE INDEX IF NOT EXISTS sports_submissions_status ON sports_submissions (status, received_at DESC);

-- Canonical events written after the file archive: submissions, corrections,
-- and any event a submission merged into. Read on top of the file archive.
CREATE TABLE IF NOT EXISTS sports_events (
  id         TEXT PRIMARY KEY,
  event_date DATE NOT NULL,
  payload    JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS sports_events_date ON sports_events (event_date DESC);

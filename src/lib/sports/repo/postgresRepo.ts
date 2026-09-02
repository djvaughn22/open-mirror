// ─────────────────────────────────────────────────────────────────────────────
// The Postgres repository — what makes production writes survive.
//
// Chosen because it is what the rest of this estate already runs on (Neon, via
// `pg`, addressed by DATABASE_URL), so it adds a table to a system the owner
// already operates rather than a second infrastructure universe. Free tier,
// durable, and serverless-friendly through Neon's pooled endpoint.
//
// Events are read from BOTH stores: the committed file archive the crawler
// writes, plus this table, with the database winning on any shared id. That is
// deliberate — it means a submission can correct or corroborate a crawled event
// without the archive being rewritten, and the crawler keeps working untouched.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";

import { fileEventStore } from "../graph/eventStore.ts";
import type { SportsRepository } from "./types.ts";
import type { CanonicalEvent } from "../graph/types.ts";
import type { StoredCredential, SubmissionRecord } from "../submit/types.ts";

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

function getPool(connectionString: string): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
      // Neon requires TLS; the pooled endpoint presents a valid certificate.
      ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: true },
    });
  }
  return pool;
}

/** Create the tables on first use. Idempotent, so it is safe on every cold start. */
async function ensureSchema(p: Pool): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = readFileSync(join(process.cwd(), "src", "lib", "sports", "repo", "schema.sql"), "utf8");
      await p.query(sql);
    })().catch((error) => {
      // A failed migration must not be cached as done.
      schemaReady = undefined;
      throw error;
    });
  }
  return schemaReady;
}

const toIso = (v: unknown): string | undefined =>
  v instanceof Date ? v.toISOString() : typeof v === "string" ? v : undefined;

function rowToCredential(r: Record<string, unknown>): StoredCredential {
  return {
    id: String(r.id),
    tokenHash: String(r.token_hash),
    schoolId: String(r.school_id),
    label: String(r.label),
    createdAt: toIso(r.created_at) ?? new Date(0).toISOString(),
    revokedAt: toIso(r.revoked_at),
    lastUsedAt: toIso(r.last_used_at),
    useCount: Number(r.use_count ?? 0),
  };
}

function rowToSubmission(r: Record<string, unknown>): SubmissionRecord {
  return {
    id: String(r.id),
    fingerprint: String(r.fingerprint),
    origin: r.origin as SubmissionRecord["origin"],
    credentialId: r.credential_id ? String(r.credential_id) : undefined,
    input: r.payload as SubmissionRecord["input"],
    status: r.status as SubmissionRecord["status"],
    reason: r.reason ? String(r.reason) : undefined,
    eventId: r.event_id ? String(r.event_id) : undefined,
    receivedAt: toIso(r.received_at) ?? new Date(0).toISOString(),
    clientKey: r.client_key ? String(r.client_key) : undefined,
  };
}

export function postgresRepository(connectionString: string): SportsRepository {
  const p = getPool(connectionString);
  const ready = async () => {
    await ensureSchema(p);
    return p;
  };

  return {
    async listEvents() {
      const db = await ready();
      const { rows } = await db.query("SELECT payload FROM sports_events");
      const byId = new Map<string, CanonicalEvent>();
      // File archive first, database second: the database is written later and
      // therefore wins on any id the two share.
      for (const e of fileEventStore.list()) byId.set(e.id, e);
      for (const r of rows) {
        const e = r.payload as CanonicalEvent;
        byId.set(e.id, e);
      }
      return [...byId.values()].sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date)));
    },

    async getEvent(id) {
      const db = await ready();
      const { rows } = await db.query("SELECT payload FROM sports_events WHERE id = $1", [id]);
      if (rows.length > 0) return rows[0].payload as CanonicalEvent;
      return fileEventStore.get(id);
    },

    async saveEvent(event) {
      const db = await ready();
      await db.query(
        `INSERT INTO sports_events (id, event_date, payload, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
        [event.id, event.date, JSON.stringify(event)],
      );
    },

    async listSubmissions(options) {
      const db = await ready();
      const params: unknown[] = [];
      let sql = "SELECT * FROM sports_submissions";
      if (options?.status) {
        params.push(options.status);
        sql += ` WHERE status = $${params.length}`;
      }
      sql += " ORDER BY received_at DESC";
      if (options?.limit) {
        params.push(options.limit);
        sql += ` LIMIT $${params.length}`;
      }
      const { rows } = await db.query(sql, params);
      return rows.map(rowToSubmission);
    },

    async saveSubmission(record) {
      const db = await ready();
      await db.query(
        `INSERT INTO sports_submissions
           (id, fingerprint, origin, credential_id, status, reason, event_id, payload, received_at, client_key)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (fingerprint) DO UPDATE
           SET status = EXCLUDED.status, reason = EXCLUDED.reason, event_id = EXCLUDED.event_id`,
        [
          record.id,
          record.fingerprint,
          record.origin,
          record.credentialId ?? null,
          record.status,
          record.reason ?? null,
          record.eventId ?? null,
          JSON.stringify(record.input),
          record.receivedAt,
          record.clientKey ?? null,
        ],
      );
    },

    async findSubmissionByFingerprint(fingerprint) {
      const db = await ready();
      const { rows } = await db.query("SELECT * FROM sports_submissions WHERE fingerprint = $1", [fingerprint]);
      return rows.length > 0 ? rowToSubmission(rows[0]) : undefined;
    },

    async findCredentialByHash(tokenHash) {
      const db = await ready();
      const { rows } = await db.query("SELECT * FROM sports_credentials WHERE token_hash = $1", [tokenHash]);
      return rows.length > 0 ? rowToCredential(rows[0]) : undefined;
    },

    async listCredentials() {
      const db = await ready();
      const { rows } = await db.query("SELECT * FROM sports_credentials ORDER BY created_at DESC");
      return rows.map(rowToCredential);
    },

    async saveCredential(credential) {
      const db = await ready();
      await db.query(
        `INSERT INTO sports_credentials
           (id, token_hash, school_id, label, created_at, revoked_at, last_used_at, use_count)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE
           SET revoked_at = EXCLUDED.revoked_at,
               last_used_at = EXCLUDED.last_used_at,
               use_count = EXCLUDED.use_count`,
        [
          credential.id,
          credential.tokenHash,
          credential.schoolId,
          credential.label,
          credential.createdAt,
          credential.revokedAt ?? null,
          credential.lastUsedAt ?? null,
          credential.useCount,
        ],
      );
    },

    async revokeCredential(id, at) {
      const db = await ready();
      const { rowCount } = await db.query(
        "UPDATE sports_credentials SET revoked_at = $2 WHERE id = $1 AND revoked_at IS NULL",
        [id, at],
      );
      return (rowCount ?? 0) > 0;
    },

    async writable() {
      try {
        const db = await ready();
        await db.query("SELECT 1");
        return true;
      } catch {
        return false;
      }
    },
    describe: () => "Postgres (DATABASE_URL)",
  };
}

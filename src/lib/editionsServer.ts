// Storage + delivery for edition requests. Saves to Postgres (DATABASE_URL, the
// same Neon the sports desk uses) and, if Resend is configured, emails the
// owner. "Accepted" means: saved to the database OR emailed to the owner.
// If neither works, the caller must say so and fall back to plain email.

import { randomInt } from "node:crypto";
import { Pool } from "pg";
import { ownerMailText, type EditionClean } from "./editions.ts";
import { STUDIO } from "./products.ts";

let pool: Pool | undefined;
let ready: Promise<void> | undefined;

function dbUrl(): string | undefined {
  const u = process.env.DATABASE_URL?.trim();
  return u ? u : undefined;
}

export function deliveryConfigured(): { db: boolean; email: boolean } {
  return {
    db: !!dbUrl(),
    email: !!(process.env.RESEND_API_KEY?.trim() && (process.env.EDITIONS_FROM_EMAIL?.trim() || process.env.PARTNERSHIP_FROM_EMAIL?.trim() || process.env.DEVICE_REQUEST_FROM_EMAIL?.trim())),
  };
}

async function save(r: EditionClean, ref: string): Promise<boolean> {
  const url = dbUrl();
  if (!url) return false;
  pool ??= new Pool({ connectionString: url, max: 2, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 8_000, ssl: url.includes("localhost") ? undefined : { rejectUnauthorized: true } });
  ready ??= pool.query(`CREATE TABLE IF NOT EXISTS edition_requests (
      ref text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(), property text NOT NULL,
      name text NOT NULL, email text NOT NULL, business text NOT NULL, message text NOT NULL,
      status text NOT NULL DEFAULT 'new')`).then(() => undefined).catch((e) => { ready = undefined; throw e; });
  try {
    await ready;
    await pool.query("INSERT INTO edition_requests (ref, property, name, email, business, message) VALUES ($1,$2,$3,$4,$5,$6)", [ref, r.property, r.name, r.email, r.business, r.message]);
    return true;
  } catch {
    return false; // never log contents
  }
}

async function emailOwner(r: EditionClean, ref: string): Promise<boolean> {
  const c = deliveryConfigured();
  if (!c.email) return false;
  const from = (process.env.EDITIONS_FROM_EMAIL || process.env.PARTNERSHIP_FROM_EMAIL || process.env.DEVICE_REQUEST_FROM_EMAIL)!.trim();
  const mail = ownerMailText(r, ref);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [STUDIO.email], reply_to: r.email, subject: mail.subject, text: mail.text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function makeRef(): string {
  return `ED-${randomInt(100000, 999999)}`;
}

export async function deliver(r: EditionClean): Promise<{ accepted: boolean; ref: string; saved: boolean; emailed: boolean }> {
  const ref = makeRef();
  const [saved, emailed] = await Promise.all([save(r, ref), emailOwner(r, ref)]);
  return { accepted: saved || emailed, ref, saved, emailed };
}

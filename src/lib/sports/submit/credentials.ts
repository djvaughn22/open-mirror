// ─────────────────────────────────────────────────────────────────────────────
// School reporting credentials.
//
// The whole security model in one paragraph: a school gets a long random token
// in a link. We store only its SHA-256 hash, so the database cannot leak a
// working credential and neither can a backup. Verification hashes what was
// presented and compares in constant time. A credential is scoped to exactly
// one school and can be revoked, which takes effect on the next request.
//
// Deliberately NOT built: accounts, passwords, sessions, roles, expiry
// policies. A coach should tap a link and report a score. Everything else is
// product we would have to maintain for no gain.
// ─────────────────────────────────────────────────────────────────────────────

import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

import type { SportsRepository } from "../repo/types.ts";
import type { StoredCredential } from "./types.ts";

/** 32 bytes of randomness, url-safe. Not guessable, and short enough to text. */
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/** Constant-time compare so a failed lookup cannot be timed. */
export function hashesMatch(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export interface IssuedCredential {
  credential: StoredCredential;
  /** Shown ONCE, at issue. Never stored, never logged, never re-displayable. */
  token: string;
}

export async function issueCredential(
  repo: SportsRepository,
  options: { schoolId: string; label: string; now?: string },
): Promise<IssuedCredential> {
  const token = generateToken();
  const credential: StoredCredential = {
    id: randomUUID(),
    tokenHash: hashToken(token),
    schoolId: options.schoolId,
    label: options.label,
    createdAt: options.now ?? new Date().toISOString(),
    useCount: 0,
  };
  await repo.saveCredential(credential);
  return { credential, token };
}

export type CredentialCheck =
  | { ok: true; credential: StoredCredential }
  | { ok: false; reason: "unknown" | "revoked" | "malformed" };

/**
 * Resolve a presented token.
 *
 * Returns the same shape for "no such token" and "revoked token" callers must
 * not distinguish to the client — the page says "this link is not active"
 * either way, so a probe cannot learn which schools have ever had a link.
 */
export async function verifyToken(repo: SportsRepository, token: string): Promise<CredentialCheck> {
  const trimmed = (token ?? "").trim();
  // Bound the work an attacker can make us do, and reject obvious junk before
  // touching the database.
  if (trimmed.length < 20 || trimmed.length > 200 || !/^[A-Za-z0-9_-]+$/.test(trimmed)) {
    return { ok: false, reason: "malformed" };
  }
  const found = await repo.findCredentialByHash(hashToken(trimmed));
  if (!found) return { ok: false, reason: "unknown" };
  if (!hashesMatch(found.tokenHash, hashToken(trimmed))) return { ok: false, reason: "unknown" };
  if (found.revokedAt) return { ok: false, reason: "revoked" };
  return { ok: true, credential: found };
}

/** Record use. Best-effort: a failed counter update must never fail a report. */
export async function noteCredentialUse(
  repo: SportsRepository,
  credential: StoredCredential,
  now: string,
): Promise<void> {
  try {
    await repo.saveCredential({ ...credential, lastUsedAt: now, useCount: credential.useCount + 1 });
  } catch {
    // Intentionally swallowed. The score matters; the counter does not.
  }
}

/** The link a school is given. Built once, at issue time. */
export function reportingLink(siteUrl: string, token: string): string {
  return `${siteUrl.replace(/\/$/, "")}/sports/report/${token}`;
}

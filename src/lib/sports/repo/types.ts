// ─────────────────────────────────────────────────────────────────────────────
// The persistence boundary.
//
// Above this line, the sports engine knows nothing about where records live.
// Below it there are two implementations and they serve different masters:
//
//   FILES     — the crawler's archive. Committed, diffable, reviewable in a
//               pull request. Perfect for machine-gathered results, useless for
//               anything a stranger submits from a phone at 9pm.
//   POSTGRES  — durable production writes. This is what makes a first-party
//               results network possible at all: a coach's submission has to
//               survive without the owner committing a file.
//
// Both are read together. A canonical event stored in the database wins over
// the same id in the file archive, because the database is where corrections
// and submissions land after the archive was written.
// ─────────────────────────────────────────────────────────────────────────────

import type { CanonicalEvent } from "../graph/types.ts";
import type { StoredCredential, SubmissionRecord } from "../submit/types.ts";

export interface SportsRepository {
  /** Every canonical event, file archive and database merged. */
  listEvents(): Promise<CanonicalEvent[]>;
  getEvent(id: string): Promise<CanonicalEvent | undefined>;
  /** Write a canonical event durably. Throws when the store is read-only. */
  saveEvent(event: CanonicalEvent): Promise<void>;

  /** Every submission ever received, including the ones held for review. */
  listSubmissions(options?: { status?: SubmissionRecord["status"]; limit?: number }): Promise<SubmissionRecord[]>;
  saveSubmission(record: SubmissionRecord): Promise<void>;
  /** Used for idempotency: the same report sent twice is one submission. */
  findSubmissionByFingerprint(fingerprint: string): Promise<SubmissionRecord | undefined>;

  /** Credential lookup by token hash. Raw tokens are never stored or queried. */
  findCredentialByHash(tokenHash: string): Promise<StoredCredential | undefined>;
  listCredentials(): Promise<StoredCredential[]>;
  saveCredential(credential: StoredCredential): Promise<void>;
  revokeCredential(id: string, at: string): Promise<boolean>;

  /** False when this deployment cannot accept writes, so the UI can say so. */
  writable(): Promise<boolean>;
  /** Human-readable, for the operator desk. Never includes a connection string. */
  describe(): string;
}

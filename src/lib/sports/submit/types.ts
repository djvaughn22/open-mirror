// ─────────────────────────────────────────────────────────────────────────────
// First-party submissions.
//
// The whole point of this layer: a submission is EVIDENCE, not truth. It enters
// the same canonical pipeline every crawled observation goes through, and it is
// judged by where it came from.
//
//   authorized  — a school holding its own reporting link. First-party, and the
//                 school is the actual authority on its own final score, so it
//                 may publish on its own.
//   public      — a parent, a fan, anyone. Real information, unverified origin.
//                 Never publishes alone. It can corroborate, or it waits.
//   operator    — a correction made by the desk.
//
// Nothing here lets "authorized" override a contradiction. If a school reports
// a score that disagrees with a crawled official page, that is a conflict and
// the event fails closed exactly as it would between two crawlers.
// ─────────────────────────────────────────────────────────────────────────────

import type { HomeAway, SportId } from "../graph/types.ts";

export type SubmissionOrigin = "authorized" | "public" | "operator";

export type SubmissionStatus =
  /** Accepted and published straight through. */
  | "published"
  /** Held for a human: public origin, a conflict, or an unresolved school. */
  | "review"
  /** Rejected before it ever became an observation. */
  | "rejected";

/** What the form collects. Deliberately tiny. */
export interface SubmissionInput {
  /** Canonical school id of the team reporting. Server-side for authorized. */
  schoolId: string;
  sport: SportId;
  /** Free text as typed. Resolved against the school registry, never trusted raw. */
  opponentName: string;
  /** Points for the reporting school. */
  ourScore: number;
  theirScore: number;
  /** ISO calendar date. */
  date: string;
  homeAway: HomeAway;
  /** One short factual note. Optional, never required, never invented. */
  note?: string;
  /** Who filled the form in, for the desk. Never published. */
  reporterName?: string;
}

export interface StoredCredential {
  id: string;
  /** SHA-256 of the token. The token itself is shown once, at issue, and never stored. */
  tokenHash: string;
  /** The only school this credential may report for. */
  schoolId: string;
  /** Human label for the desk: "MICDS athletics office". */
  label: string;
  createdAt: string;
  revokedAt?: string;
  lastUsedAt?: string;
  useCount: number;
}

export interface SubmissionRecord {
  id: string;
  /** Stable hash of the meaningful fields, so a double-tap is one submission. */
  fingerprint: string;
  origin: SubmissionOrigin;
  /** Credential id for authorized submissions. Never the token. */
  credentialId?: string;
  input: SubmissionInput;
  status: SubmissionStatus;
  /** Why it went to review or was rejected. Shown on the desk. */
  reason?: string;
  /** The canonical event it became, when it became one. */
  eventId?: string;
  receivedAt: string;
  /** Coarse, for rate limiting and abuse review only. Never published. */
  clientKey?: string;
}

/** How a published fact credits a submission. Never leaks a token or an id. */
export function submissionCredit(origin: SubmissionOrigin, schoolName: string): string {
  if (origin === "authorized") return `${schoolName} Athletics`;
  if (origin === "operator") return "Open Mirror desk";
  return "Community report";
}

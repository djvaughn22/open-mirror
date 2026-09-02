// ─────────────────────────────────────────────────────────────────────────────
// One report in, one published game out — or one honest reason why not.
//
// This is the ingestion core every future channel funnels into: the school
// link today, an email parser or an API later. They all build a SubmissionInput
// and call submitResult. There is exactly one place where a submission becomes
// evidence, so there is exactly one place the trust rules live.
//
//   submission → validate → observation → resolve → match existing event
//              → conflict check → canonical event → story → brief → feed
//
// The rules that must not erode:
//   · a PUBLIC submission never publishes on its own, however plausible
//   · an AUTHORIZED submission publishes, but never overrides a contradiction
//   · a school reports its own game as "we 28, they 21"; orientation is
//     normalized here, and getting it backwards would invert every winner
// ─────────────────────────────────────────────────────────────────────────────

import { createHash, randomUUID } from "node:crypto";

import { buildEvent } from "../graph/confidence.ts";
import { clusterObservations, eventId } from "../graph/dedupe.ts";
import { normalizeObservations } from "../graph/normalize.ts";
import { buildSchoolIndex, resolveSchool } from "../graph/resolve.ts";
import { sportMeta } from "../graph/sports.ts";
import { ST_LOUIS } from "../metros/stLouis.ts";
import type { SportsRepository } from "../repo/types.ts";
import type { CanonicalEvent, NormalizedObservation, RawObservation } from "../graph/types.ts";
import type { SubmissionInput, SubmissionOrigin, SubmissionRecord } from "./types.ts";

/** How a submission identifies itself as a source. Scoped, never a token. */
export function submissionSourceId(origin: SubmissionOrigin, schoolId: string): string {
  return `submission-${origin}:${schoolId}`;
}

export function isSubmissionSource(sourceId: string): boolean {
  return sourceId.startsWith("submission-");
}

/** Public reports are evidence, never authority. Used by the trust layer. */
export function isTrustedSource(sourceId: string): boolean {
  return !sourceId.startsWith("submission-public:");
}

export const SUBMISSION_LIMITS = {
  maxScore: 300,
  maxNoteLength: 240,
  maxNameLength: 80,
  /** How far back a report may reach. Older results belong to the desk. */
  maxDaysAgo: 30,
} as const;

export type ValidationError =
  | "unknown-school"
  | "unknown-sport"
  | "unknown-opponent"
  | "same-school"
  | "bad-score"
  | "bad-date"
  | "future-date"
  | "too-old"
  | "note-too-long"
  | "tie-not-allowed";

export interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
  /** Present only when ok. */
  observation?: RawObservation;
  opponentSchoolId?: string;
}

const INDEX = buildSchoolIndex(ST_LOUIS.schools);
const SCHOOLS = new Map(ST_LOUIS.schools.map((s) => [s.id, s]));

const dayNumber = (iso: string) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);

/**
 * Everything that can be checked without asking the archive.
 *
 * Deliberately strict about scores: a submitted number goes straight to a
 * published scoreline, so a non-integer, a negative, or an implausible value is
 * refused rather than clamped.
 */
export function validateSubmission(
  input: SubmissionInput,
  options: { today: string; origin: SubmissionOrigin; now: string },
): ValidationResult {
  const errors: ValidationError[] = [];

  const school = SCHOOLS.get(input.schoolId);
  if (!school) errors.push("unknown-school");

  const meta = sportMeta(input.sport);
  if (!meta) errors.push("unknown-sport");

  const opponent = resolveSchool(input.opponentName ?? "", INDEX);
  if (!opponent.school) errors.push("unknown-opponent");
  else if (school && opponent.school.id === school.id) errors.push("same-school");

  for (const score of [input.ourScore, input.theirScore]) {
    if (!Number.isInteger(score) || score < 0 || score > SUBMISSION_LIMITS.maxScore) {
      errors.push("bad-score");
      break;
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date ?? "") || Number.isNaN(Date.parse(`${input.date}T00:00:00Z`))) {
    errors.push("bad-date");
  } else {
    const delta = dayNumber(options.today) - dayNumber(input.date);
    // A game cannot have been played tomorrow.
    if (delta < 0) errors.push("future-date");
    else if (delta > SUBMISSION_LIMITS.maxDaysAgo) errors.push("too-old");
  }

  if ((input.note ?? "").length > SUBMISSION_LIMITS.maxNoteLength) errors.push("note-too-long");

  // Some sports cannot end level. Accepting a tie there would publish a result
  // that could not have happened.
  if (meta && input.ourScore === input.theirScore && meta.setScored) errors.push("tie-not-allowed");

  if (errors.length > 0) return { ok: false, errors: [...new Set(errors)] };

  const observation: RawObservation = {
    sourceId: submissionSourceId(options.origin, input.schoolId),
    // A submission's "page" is the school's own page on this site — a real,
    // resolvable URL, and never anything that hints at a credential.
    sourceUrl: `/sports/schools/${input.schoolId}`,
    fetchedAt: options.now,
    reportingSchool: school!.name,
    opponent: opponent.school!.name,
    date: input.date,
    sportLabel: sportMeta(input.sport)!.label,
    levelLabel: "Varsity",
    homeAway: input.homeAway,
    // Orientation: the school reports ITS score first. scoreFor belongs to the
    // reporting school, and the pipeline reads it that way everywhere.
    result: input.ourScore > input.theirScore ? "W" : input.ourScore < input.theirScore ? "L" : "T",
    scoreFor: input.ourScore,
    scoreAgainst: input.theirScore,
  };

  return { ok: true, errors: [], observation, opponentSchoolId: opponent.school!.id };
}

/** Same report, however many times the button is tapped. */
export function fingerprintOf(input: SubmissionInput, origin: SubmissionOrigin): string {
  const opponent = resolveSchool(input.opponentName ?? "", INDEX).school?.id ?? (input.opponentName ?? "").toLowerCase().trim();
  return createHash("sha256")
    .update([origin, input.schoolId, opponent, input.sport, input.date, input.ourScore, input.theirScore].join("|"))
    .digest("hex");
}

export interface SubmitOptions {
  repo: SportsRepository;
  input: SubmissionInput;
  origin: SubmissionOrigin;
  credentialId?: string;
  clientKey?: string;
  now?: string;
  today?: string;
}

export interface SubmitOutcome {
  status: SubmissionRecord["status"];
  record: SubmissionRecord;
  /** The canonical event, when one was created or updated. */
  event?: CanonicalEvent;
  errors: ValidationError[];
  /** Safe to show the submitter. Never mentions a credential or a store. */
  message: string;
  /** True when this exact report had already been received. */
  duplicate: boolean;
}

export async function submitResult(options: SubmitOptions): Promise<SubmitOutcome> {
  const now = options.now ?? new Date().toISOString();
  const today = options.today ?? now.slice(0, 10);
  const { repo, input, origin } = options;

  const fingerprint = fingerprintOf(input, origin);
  const existingSubmission = await repo.findSubmissionByFingerprint(fingerprint);
  if (existingSubmission) {
    return {
      status: existingSubmission.status,
      record: existingSubmission,
      event: existingSubmission.eventId ? await repo.getEvent(existingSubmission.eventId) : undefined,
      errors: [],
      duplicate: true,
      message:
        existingSubmission.status === "published"
          ? "This result is already published."
          : "We already have this report and it is waiting on a person.",
    };
  }

  const base: SubmissionRecord = {
    id: randomUUID(),
    fingerprint,
    origin,
    credentialId: options.credentialId,
    input,
    status: "rejected",
    receivedAt: now,
    clientKey: options.clientKey,
  };

  const validation = validateSubmission(input, { today, origin, now });
  if (!validation.ok) {
    const record: SubmissionRecord = { ...base, status: "rejected", reason: validation.errors.join(", ") };
    await repo.saveSubmission(record);
    return {
      status: "rejected",
      record,
      errors: validation.errors,
      duplicate: false,
      message: messageForErrors(validation.errors),
    };
  }

  // ── Into the same pipeline every crawled observation goes through ─────────
  const { observations } = normalizeObservations([validation.observation!], INDEX);
  if (observations.length === 0) {
    // The only realistic cause is the level filter, and the form only ever
    // submits varsity — so this is a bug, reported rather than published.
    const record: SubmissionRecord = { ...base, status: "rejected", reason: "could not be normalized" };
    await repo.saveSubmission(record);
    return { status: "rejected", record, errors: [], duplicate: false, message: "We could not read that result." };
  }

  const submitted = observations[0];
  const cluster = clusterObservations([submitted]).clusters[0];
  const id = eventId(cluster);

  // Merge with whatever we already knew about this game — a crawled result, an
  // EventLink fixture, or an earlier submission.
  const existingEvent = await repo.getEvent(id);
  const priorObservations = (existingEvent?.observations ?? []).filter((o) => o.id !== submitted.id);
  const merged = mergeIntoEvent([...priorObservations, submitted], existingEvent, now);

  // ── Trust ────────────────────────────────────────────────────────────────
  // A public report may corroborate, but it can never be the reason something
  // publishes. Strip public sources and ask whether a trusted account remains.
  const trustedScoreSources = merged.scoreSourceIds.filter(isTrustedSource);
  const publishable = merged.publishable && trustedScoreSources.length > 0;

  const event: CanonicalEvent = { ...merged, publishable };
  await repo.saveEvent(event);

  const status: SubmissionRecord["status"] = publishable ? "published" : "review";
  const reason = publishable
    ? undefined
    : merged.confidence === "conflicted"
      ? "the score does not match what another source reported"
      : trustedScoreSources.length === 0
        ? "community report awaiting corroboration"
        : "held for review";

  const record: SubmissionRecord = { ...base, status, reason, eventId: event.id };
  await repo.saveSubmission(record);

  return {
    status,
    record,
    event,
    errors: [],
    duplicate: false,
    message: publishable
      ? "Published. Your game is live."
      : merged.confidence === "conflicted"
        ? "Thanks — this score does not match another report we have, so a person will check it before it publishes."
        : "Thanks. This is with our desk and will publish once we can confirm it.",
  };
}

/** Rebuild the canonical event from every account we now hold. */
function mergeIntoEvent(
  observations: NormalizedObservation[],
  existing: CanonicalEvent | undefined,
  now: string,
): CanonicalEvent {
  const cluster = clusterObservations(observations).clusters[0];
  const rebuilt = buildEvent(cluster, { metro: "st-louis", now, existing });
  // A fixture-only observation (a calendar entry) can outnumber the score, but
  // the game is final the moment any account carries a result.
  const anyScore = observations.some((o) => o.scoreFor !== undefined && o.scoreAgainst !== undefined);
  return anyScore && rebuilt.status !== "final" ? { ...rebuilt, status: "final" } : rebuilt;
}

function messageForErrors(errors: ValidationError[]): string {
  if (errors.includes("unknown-opponent")) return "We do not recognise that opponent yet. Check the spelling, or tell us and we will add them.";
  if (errors.includes("future-date")) return "That date is in the future.";
  if (errors.includes("too-old")) return "That game is too far back for the quick form — send it to the desk instead.";
  if (errors.includes("bad-score")) return "Those scores do not look right.";
  if (errors.includes("tie-not-allowed")) return "That sport cannot end level — check the score.";
  if (errors.includes("same-school")) return "A team cannot play itself.";
  if (errors.includes("bad-date")) return "That date does not look right.";
  return "We could not accept that report.";
}

// ─────────────────────────────────────────────────────────────────────────────
// Raw observation → normalized observation.
//
// This is the step where a source's words become our identifiers: "Football -
// Varsity" becomes the sport `football` at varsity level, "SLUH" becomes the
// school `sluh`. Everything that cannot be identified is dropped with a stated
// reason and counted, never quietly coerced into the nearest match.
// ─────────────────────────────────────────────────────────────────────────────

import { resolveSchool, type SchoolIndex } from "./resolve.ts";
import { isVarsity, resolveSport } from "./sports.ts";
import type { NormalizedObservation, RawObservation } from "./types.ts";

export type DropReason =
  | "unknown-sport"
  | "not-varsity"
  | "unknown-reporting-school"
  | "self-match"
  | "out-of-window";

export interface NormalizeResult {
  observations: NormalizedObservation[];
  dropped: Array<{ raw: RawObservation; reason: DropReason; detail?: string }>;
  /** Opponent names no source spelling could be matched to. Feeds the review desk. */
  unresolvedNames: string[];
}

/**
 * A stable id for an observation, derived only from what it says. Re-running
 * ingestion on unchanged pages produces the same ids, so events update in place
 * instead of accumulating near-duplicates.
 */
export function observationId(raw: RawObservation, sport: string, reporterId: string, opponentKey: string): string {
  return [raw.sourceId, reporterId, opponentKey, sport, raw.date].join("|");
}

export function normalizeObservations(raws: RawObservation[], index: SchoolIndex): NormalizeResult {
  const observations: NormalizedObservation[] = [];
  const dropped: NormalizeResult["dropped"] = [];
  const unresolved = new Set<string>();

  for (const raw of raws) {
    if (!isVarsity(raw.levelLabel)) {
      dropped.push({ raw, reason: "not-varsity", detail: raw.levelLabel });
      continue;
    }

    // The reporting school comes from our own configuration, so failing here is
    // a configuration bug rather than a messy source, and is worth surfacing.
    const reporter = resolveSchool(raw.reportingSchool, index);
    if (!reporter.school) {
      dropped.push({ raw, reason: "unknown-reporting-school", detail: raw.reportingSchool });
      continue;
    }

    const sport = resolveSport(raw.sportLabel, [raw.levelLabel ?? "", raw.sportHint ?? ""], reporter.school.genderContext);
    if (!sport) {
      dropped.push({ raw, reason: "unknown-sport", detail: raw.sportLabel });
      continue;
    }

    const opponent = resolveSchool(raw.opponent, index);
    if (opponent.school && opponent.school.id === reporter.school.id) {
      // An intra-squad game. Not a matchup, so not an event.
      dropped.push({ raw, reason: "self-match", detail: raw.opponent });
      continue;
    }
    if (!opponent.school) unresolved.add(raw.opponent.trim());

    const played = raw.scoreFor !== undefined && raw.scoreAgainst !== undefined;
    const status: NormalizedObservation["status"] = played || raw.result ? "final" : "scheduled";

    const opponentKey = opponent.school ? opponent.school.id : `unresolved:${raw.opponent.trim().toLowerCase()}`;

    observations.push({
      id: observationId(raw, sport, reporter.school.id, opponentKey),
      sourceId: raw.sourceId,
      sourceUrl: raw.sourceUrl,
      fetchedAt: raw.fetchedAt,
      sourceUpdatedAt: raw.sourceUpdatedAt,
      sport,
      date: raw.date,
      startsAt: raw.startsAt,
      reporter: { schoolId: reporter.school.id, reportedAs: raw.reportingSchool },
      opponent: opponent.school ? { schoolId: opponent.school.id, reportedAs: raw.opponent } : undefined,
      unresolvedOpponent: opponent.school ? undefined : raw.opponent.trim(),
      homeAway: raw.homeAway,
      result: raw.result,
      scoreFor: raw.scoreFor,
      scoreAgainst: raw.scoreAgainst,
      location: raw.location,
      status,
      raw,
    });
  }

  return { observations, dropped, unresolvedNames: [...unresolved].sort() };
}

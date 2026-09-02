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
  | "non-matchup"
  | "out-of-window";

/**
 * Names that are events, not opponents.
 *
 * Every calendar source mixes head-to-head games with meets, invitationals and
 * bracket placeholders — "Clayton Classic", "SWC Tourney #1", "1st Capitol
 * Invitational", "1 PM Field 2". None of those is a school. Left alone they
 * flood the review desk with hundreds of names that will never resolve, which
 * is worse than useless: it buries the handful of real school names that a
 * human actually needs to look at.
 *
 * A cross country meet is a real event we simply do not model yet — two-sided
 * scoring is the wrong shape for it — so it is dropped as a non-matchup rather
 * than being forced into a fixture it does not fit.
 */
const NON_MATCHUP = [
  /\b(invitational|tourney|tournament|classic|jamboree|scrimmage|showcase|festival|relays|championships?)\b/i,
  /\b(meet|quad|tri[- ]?meet|dual meet|duals|multi[- ]?dual)\b/i,
  /\b(field|court|lane|course|site)\s*#?\d+\b/i,
  /^\s*\d{1,2}(:\d{2})?\s*(am|pm)\b/i,
  /\b(tba|tbd|bye|open|practice|conference meet|districts?|sectionals?|state)\b/i,
  /\b(vs\.?\s*)?tournament\b/i,
  /\b(invite|scramble|round robin|kickoff|twilight|cup|thon|shootout|jubilee|dual)\b/i,
  /\b(meeting|parent night|picture day|banquet|fundraiser|senior night)\b/i,
  /\b(park|complex|fairgrounds|golf course|country club)\b/i,
  /\bxc\b/i,
  // A calendar entry naming two OTHER teams — "Clayton vs. University City",
  // "Fox/Seckman", "Alton/Triad" — is a tri-meet or a bracket slot, not this
  // school's opponent. Resolving either half would attribute a game to the
  // wrong pair of schools, which is worse than not covering it.
  /\s(vs\.?|v\.?)\s/i,
  /^[^,]+,[^,]+,/,
  /\w\/\w/,
];

export function isNonMatchupOpponent(name: string): boolean {
  const t = name.replace(/\s+/g, " ").trim();
  if (!t) return true;
  return NON_MATCHUP.some((re) => re.test(t));
}

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
  // One page can list the same game twice — a school's athletics landing page
  // shows it under both "upcoming" and "recent scores". Identical accounts are
  // one account, and stacking them would pad the provenance list with the same
  // link three times.
  const seen = new Set<string>();
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

    // Meets and brackets are dropped before resolution, so they never reach the
    // review desk pretending to be a school we have not learned yet.
    if (isNonMatchupOpponent(raw.opponent)) {
      dropped.push({ raw, reason: "non-matchup", detail: raw.opponent });
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

    const id = observationId(raw, sport, reporter.school.id, opponentKey);
    if (seen.has(id)) continue;
    seen.add(id);

    observations.push({
      id,
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

// ─────────────────────────────────────────────────────────────────────────────
// One game, however many sources saw it.
//
// The common case is two schools publishing the same night from opposite sides:
// SLUH's page says "vs. Hazelwood Central — Win 43-2" and Hazelwood Central's
// page says "at SLUH — Loss 2-43". Those are two independent first-party
// accounts of one event, and recognising that is what turns a scraper into a
// newsroom: it is where corroboration comes from.
//
// Matching is deterministic and conservative — same sport, same two schools,
// same date (±1 day for the late finish that gets filed after midnight). Score
// is never part of the key, because two sources disagreeing about the score is
// exactly the case we must detect rather than split into two events.
// ─────────────────────────────────────────────────────────────────────────────

import type { NormalizedObservation, SportId } from "./types.ts";

export interface EventCluster {
  sport: SportId;
  /** School ids, sorted, so the pairing is order-independent. */
  pair: [string, string];
  date: string;
  observations: NormalizedObservation[];
}

/** The part of the key that cannot vary between two accounts of one game. */
function pairOf(o: NormalizedObservation): [string, string] | undefined {
  if (!o.opponent) return undefined;
  const a = o.reporter.schoolId;
  const b = o.opponent.schoolId;
  if (a === b) return undefined;
  return a < b ? [a, b] : [b, a];
}

const dayNumber = (iso: string) => Math.round(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);

/**
 * Group observations into one cluster per real-world event.
 *
 * Observations whose opponent could not be resolved are returned separately:
 * they are real information — a game happened — but they cannot be matched to
 * a second account, so they become unresolved events for the review desk
 * rather than silently disappearing.
 */
export function clusterObservations(observations: NormalizedObservation[]): {
  clusters: EventCluster[];
  unmatchable: NormalizedObservation[];
} {
  const clusters: EventCluster[] = [];
  const unmatchable: NormalizedObservation[] = [];

  // Deterministic order in, deterministic clusters out — the same input must
  // always produce the same event ids or the archive churns on every run.
  const sorted = [...observations].sort(
    (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
  );

  for (const o of sorted) {
    const pair = pairOf(o);
    if (!pair) {
      unmatchable.push(o);
      continue;
    }
    // The ±1 day tolerance exists for a late finish filed after midnight, and
    // it only makes sense when a result is involved. Two SCHEDULED games on
    // consecutive days are a tournament series — two real, separate games — and
    // merging them invents a date conflict out of a correct calendar.
    const existing = clusters.find((c) => {
      if (c.sport !== o.sport || c.pair[0] !== pair[0] || c.pair[1] !== pair[1]) return false;
      const gap = Math.abs(dayNumber(c.date) - dayNumber(o.date));
      if (gap === 0) return true;
      if (gap > 1) return false;
      const scored = (x: NormalizedObservation) => x.scoreFor !== undefined && x.scoreAgainst !== undefined;
      return scored(o) || c.observations.some(scored);
    });
    if (existing) {
      existing.observations.push(o);
      // Keep the earliest reported date: a game filed after midnight belongs to
      // the night it was played, not to the paperwork.
      if (o.date < existing.date) existing.date = o.date;
    } else {
      clusters.push({ sport: o.sport, pair, date: o.date, observations: [o] });
    }
  }

  return { clusters, unmatchable };
}

/**
 * A stable id for an event. Derived only from the canonical key, so re-running
 * ingestion updates the same file instead of creating a second copy.
 */
export function eventId(cluster: Pick<EventCluster, "sport" | "pair" | "date">): string {
  return `${cluster.date}-${cluster.sport}-${cluster.pair[0]}-${cluster.pair[1]}`;
}

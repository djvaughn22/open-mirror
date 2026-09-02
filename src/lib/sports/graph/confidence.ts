// ─────────────────────────────────────────────────────────────────────────────
// The trust layer. This is where a pile of observations becomes a fact, or
// deliberately fails to.
//
// An observation is evidence. A canonical event is a conclusion, and it carries
// the reason it was reached. The rule everything below serves:
//
//   WHEN SOURCES DISAGREE, WE PUBLISH LESS. WE DO NOT PICK A WINNER.
//
// A model must never be handed two candidate scores and asked which looks
// right. If CBC 35–21 and CBC 34–21 both exist, the score is withheld, the
// event is marked conflicted, and it goes to the desk. Being incomplete is
// survivable. Being confidently wrong about a teenager's game is not.
// ─────────────────────────────────────────────────────────────────────────────

import { clusterObservations, eventId, type EventCluster } from "./dedupe.ts";
import type {
  CanonicalEvent,
  Conflict,
  EventConfidence,
  EventSide,
  NormalizedObservation,
} from "./types.ts";

/** Score as this observation would state it, keyed by school id. */
function scoreMap(o: NormalizedObservation): Record<string, number> | undefined {
  if (o.scoreFor === undefined || o.scoreAgainst === undefined || !o.opponent) return undefined;
  return { [o.reporter.schoolId]: o.scoreFor, [o.opponent.schoolId]: o.scoreAgainst };
}

function scoreSignature(map: Record<string, number>, pair: [string, string]): string {
  return `${pair[0]}:${map[pair[0]] ?? "?"}-${pair[1]}:${map[pair[1]] ?? "?"}`;
}

/** Which school id was at home according to this observation, if it says. */
function homeSchool(o: NormalizedObservation): string | undefined {
  if (o.homeAway === "home") return o.reporter.schoolId;
  if (o.homeAway === "away") return o.opponent?.schoolId;
  return undefined;
}

function groupAccounts<T>(
  observations: NormalizedObservation[],
  valueOf: (o: NormalizedObservation) => T | undefined,
  render: (v: T) => string,
): Array<{ value: string; observationIds: string[]; sourceIds: string[] }> {
  const groups = new Map<string, { observationIds: string[]; sourceIds: Set<string> }>();
  for (const o of observations) {
    const v = valueOf(o);
    if (v === undefined) continue;
    const label = render(v);
    const g = groups.get(label) ?? { observationIds: [], sourceIds: new Set<string>() };
    g.observationIds.push(o.id);
    g.sourceIds.add(o.sourceId);
    groups.set(label, g);
  }
  return [...groups.entries()]
    .map(([value, g]) => ({ value, observationIds: g.observationIds, sourceIds: [...g.sourceIds].sort() }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

/**
 * Two accounts count as independent corroboration only when they come from
 * different sources. The same page fetched twice is one source, not two, and
 * treating it as two would manufacture confidence out of a retry.
 */
function distinctSources(observations: NormalizedObservation[]): string[] {
  return [...new Set(observations.map((o) => o.sourceId))].sort();
}

export interface BuildEventOptions {
  metro: CanonicalEvent["metro"];
  now: string;
  /** Preserved from an existing stored event so createdAt does not move. */
  existing?: CanonicalEvent;
}

export function buildEvent(cluster: EventCluster, opts: BuildEventOptions): CanonicalEvent {
  const { pair, sport, observations } = cluster;
  const id = eventId(cluster);
  const conflicts: Conflict[] = [];

  // ── Score ─────────────────────────────────────────────────────────────────
  const scored = observations.filter((o) => scoreMap(o) !== undefined);
  const scoreAccounts = groupAccounts(scored, scoreMap, (m) => scoreSignature(m, pair));
  let sides: [EventSide, EventSide] = [{ schoolId: pair[0] }, { schoolId: pair[1] }];
  let scoreConflicted = false;

  if (scoreAccounts.length === 1 && scored.length > 0) {
    const map = scoreMap(scored[0])!;
    sides = [
      { schoolId: pair[0], score: map[pair[0]] },
      { schoolId: pair[1], score: map[pair[1]] },
    ];
  } else if (scoreAccounts.length > 1) {
    // Disagreement. The score is withheld entirely — not averaged, not
    // majority-voted, not taken from the "better" source. Withheld.
    scoreConflicted = true;
    conflicts.push({ field: "score", accounts: scoreAccounts });
  }

  // ── Date ──────────────────────────────────────────────────────────────────
  const dateAccounts = groupAccounts(observations, (o) => o.date, (d) => d);
  if (dateAccounts.length > 1) conflicts.push({ field: "date", accounts: dateAccounts });

  // ── Home / away ───────────────────────────────────────────────────────────
  const homeAccounts = groupAccounts(observations, homeSchool, (s) => s);
  let homeKnown = false;
  let ordered = sides;
  if (homeAccounts.length === 1) {
    homeKnown = true;
    const home = homeAccounts[0].value;
    ordered = sides[0].schoolId === home ? sides : [sides[1], sides[0]];
  } else if (homeAccounts.length > 1) {
    conflicts.push({ field: "home-away", accounts: homeAccounts });
  }

  // ── Status ────────────────────────────────────────────────────────────────
  const anyFinal = observations.some((o) => o.status === "final");
  const status: CanonicalEvent["status"] = anyFinal
    ? "final"
    : observations.some((o) => o.status === "scheduled")
      ? "scheduled"
      : "unknown";

  const sourceIds = distinctSources(observations);
  const material = conflicts.some((c) => c.field === "score" || c.field === "date");

  let confidence: EventConfidence;
  if (material) confidence = "conflicted";
  else if (sourceIds.length >= 2) confidence = "confirmed";
  else confidence = "single-source";

  const location =
    observations.map((o) => o.location).find((l) => l !== undefined && l.trim().length > 0) ?? undefined;

  // Freshness is when we last looked, not when the file was first written.
  const lastVerifiedAt = observations.map((o) => o.fetchedAt).sort().slice(-1)[0] ?? opts.now;

  const publishable =
    confidence !== "conflicted" &&
    status === "final" &&
    !scoreConflicted &&
    ordered.every((s) => s.score !== undefined);

  return {
    id,
    version: 1,
    metro: opts.metro,
    sport,
    date: cluster.date,
    startsAt: observations.map((o) => o.startsAt).find(Boolean),
    sides: ordered,
    homeKnown,
    status,
    location,
    confidence,
    conflicts,
    observations: [...observations].sort((a, b) => a.id.localeCompare(b.id)),
    sourceIds,
    unresolvedNames: [],
    publishable,
    createdAt: opts.existing?.createdAt ?? opts.now,
    updatedAt: opts.now,
    lastVerifiedAt,
  };
}

/**
 * An observation naming an opponent we could not identify. It still becomes an
 * event so the desk can see it and add the alias, but it can never publish:
 * half a matchup is not a story, it is a hole in the graph.
 */
export function buildUnresolvedEvent(o: NormalizedObservation, opts: BuildEventOptions): CanonicalEvent {
  const unknownId = `unresolved:${o.unresolvedOpponent ?? "unknown"}`;
  const pair: [string, string] = [o.reporter.schoolId, unknownId];
  return {
    id: `${o.date}-${o.sport}-${o.reporter.schoolId}-unresolved-${o.id.slice(-8)}`,
    version: 1,
    metro: opts.metro,
    sport: o.sport,
    date: o.date,
    startsAt: o.startsAt,
    sides: [
      { schoolId: pair[0], score: o.scoreFor },
      { schoolId: pair[1], score: o.scoreAgainst },
    ],
    homeKnown: o.homeAway === "home" || o.homeAway === "away",
    status: o.status,
    location: o.location,
    confidence: "unresolved",
    conflicts: [],
    observations: [o],
    sourceIds: [o.sourceId],
    unresolvedNames: [o.unresolvedOpponent ?? ""].filter(Boolean),
    publishable: false,
    createdAt: opts.existing?.createdAt ?? opts.now,
    updatedAt: opts.now,
    lastVerifiedAt: o.fetchedAt,
  };
}

/** Full pipeline step: observations in, canonical events out. */
export function reconcile(
  observations: NormalizedObservation[],
  opts: Omit<BuildEventOptions, "existing"> & { existing?: Map<string, CanonicalEvent> },
): CanonicalEvent[] {
  const { clusters, unmatchable } = clusterObservations(observations);
  const events: CanonicalEvent[] = [];
  for (const c of clusters) {
    const id = eventId(c);
    events.push(buildEvent(c, { metro: opts.metro, now: opts.now, existing: opts.existing?.get(id) }));
  }
  for (const o of unmatchable) {
    const e = buildUnresolvedEvent(o, { metro: opts.metro, now: opts.now });
    events.push({ ...e, createdAt: opts.existing?.get(e.id)?.createdAt ?? e.createdAt });
  }
  return events.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

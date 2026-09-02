// ─────────────────────────────────────────────────────────────────────────────
// The metro Story Finder.
//
// Sprint 1's Story Finder compared one team against its own season. This one
// compares every school in the city against every other, and it inherits the
// same rule: EVERY SENTENCE IS WRITTEN BY TYPESCRIPT FROM COUNTED DATA. A
// discovery cannot be wrong unless the archive is wrong.
//
// The trap at city scale is significance we have not earned. Our archive
// started this week. So nothing here ever says "best in school history" or
// "first since 2011" — it says "in games recorded here", and it says it out
// loud, because the honest small claim is what makes the big ones believable
// later.
// ─────────────────────────────────────────────────────────────────────────────

import { sportLabel, sportMeta } from "./graph/sports.ts";
import { hasScore, isTie, winnerOf, type CanonicalEvent, type EventProvenance, type School } from "./graph/types.ts";

export interface MetroDiscovery {
  id: string;
  kind:
    | "win-streak"
    | "unbeaten-start"
    | "shutout"
    | "biggest-margin"
    | "closest-game"
    | "highest-total"
    | "season-record"
    | "first-result";
  /** The sentence itself. Models never author these. */
  text: string;
  strength: number;
  provenance: EventProvenance;
  subject?: string;
}

/** Only events good enough to reason from: published, final, with a real score. */
export function reliable(events: CanonicalEvent[]): CanonicalEvent[] {
  return events.filter((e) => e.publishable && e.status === "final" && hasScore(e));
}

/** Every published event a school appears in, oldest first. */
function gamesFor(events: CanonicalEvent[], schoolId: string): CanonicalEvent[] {
  return events
    .filter((e) => e.sides.some((s) => s.schoolId === schoolId))
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

function resultFor(event: CanonicalEvent, schoolId: string): "W" | "L" | "T" | undefined {
  if (!hasScore(event)) return undefined;
  if (isTie(event)) return "T";
  return winnerOf(event)?.schoolId === schoolId ? "W" : "L";
}

const countWord = (n: number) =>
  ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] ?? String(n);

function calc(method: string, ids: string[]): EventProvenance {
  return { kind: "calculated", method, fromEventIds: ids };
}

/**
 * The phrase that keeps us honest. Everything computed from our own archive is
 * scoped to it, out loud, until the archive is old enough to say more.
 */
const TRACKED = "in games tracked here";

/** Singular unit a margin is measured in for this sport. */
function marginNoun(sport: CanonicalEvent["sport"]): string {
  const noun = sportMeta(sport)?.scoreNoun ?? "points";
  // scoreNoun is plural ("goals", "sets", "runs"); a margin takes the singular.
  return noun.replace(/s$/, "");
}

export interface StoryContext {
  event: CanonicalEvent;
  /** Every published event, this one included. */
  archive: CanonicalEvent[];
  schools: Map<string, School>;
}

const nameOf = (schools: Map<string, School>, id: string) => schools.get(id)?.shortName ?? id;

/**
 * What is genuinely notable about one event, given everything else we know.
 * Returns ranked discoveries; an event with no history behind it correctly
 * returns none, and its brief is one sentence long.
 */
export function findMetroStories(ctx: StoryContext): MetroDiscovery[] {
  const { event, schools } = ctx;
  const found: MetroDiscovery[] = [];
  if (!hasScore(event) || event.status !== "final") return found;

  const archive = reliable(ctx.archive).filter((e) => e.sport === event.sport);
  const priorAll = archive.filter((e) => e.date < event.date);

  const winner = winnerOf(event);
  const loser = event.sides.find((s) => s.schoolId !== winner?.schoolId);

  // ── Streaks and starts, per school ────────────────────────────────────────
  for (const side of event.sides) {
    const id = side.schoolId;
    const name = nameOf(schools, id);
    const mine = gamesFor(archive, id).filter((e) => e.date <= event.date);
    if (mine.length < 2) continue;

    // Count back from tonight until the result changes.
    let streak = 0;
    const streakIds: string[] = [];
    for (let i = mine.length - 1; i >= 0; i -= 1) {
      if (resultFor(mine[i], id) !== "W") break;
      streak += 1;
      streakIds.push(mine[i].id);
    }
    if (streak >= 2) {
      const unbeaten = mine.length === streak;
      found.push({
        id: `streak-${id}`,
        kind: unbeaten ? "unbeaten-start" : "win-streak",
        subject: id,
        strength: 55 + streak * 6 + (unbeaten ? 6 : 0),
        text: unbeaten
          ? `${name} is ${streak}-0 ${TRACKED}.`
          : `That is ${countWord(streak)} straight wins for ${name} ${TRACKED}.`,
        provenance: calc(`counted back through ${name}'s stored results until the result changed`, streakIds),
      });
    }

    // A record is worth stating once there is more than one game behind it.
    const wins = mine.filter((e) => resultFor(e, id) === "W").length;
    const losses = mine.filter((e) => resultFor(e, id) === "L").length;
    const ties = mine.filter((e) => resultFor(e, id) === "T").length;
    if (mine.length >= 3 && streak < 2) {
      const rec = ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
      found.push({
        id: `record-${id}`,
        kind: "season-record",
        subject: id,
        strength: 26,
        text: `${name} is ${rec} ${TRACKED}.`,
        provenance: calc("counted results across every stored game for this school", mine.map((e) => e.id)),
      });
    }
  }

  // ── The scoreline itself ──────────────────────────────────────────────────
  if (winner && loser && loser.score === 0 && winner.score! > 0) {
    found.push({
      id: "shutout",
      kind: "shutout",
      subject: winner.schoolId,
      strength: 58,
      // A shutout is a measurement, not a characterisation, so it is sayable.
      text: `${nameOf(schools, loser.schoolId)} did not score.`,
      provenance: { kind: "source", observationIds: event.observations.map((o) => o.id) },
    });
  }

  if (winner && loser && priorAll.length >= 3) {
    const margin = winner.score! - loser.score!;
    const margins = priorAll.map((e) => Math.abs(e.sides[0].score! - e.sides[1].score!));
    const biggest = Math.max(...margins);
    if (margin > biggest && margin >= 3) {
      found.push({
        id: "biggest-margin",
        kind: "biggest-margin",
        strength: 52,
        // Soccer is decided by goals, volleyball by sets. Calling either a
      // "point" is the kind of small wrongness a local reader notices first.
      text: `The ${margin}-${marginNoun(event.sport)} margin is the widest in ${sportLabel(event.sport).toLowerCase()} ${TRACKED} this season.`,
        provenance: calc(`compared against ${priorAll.length} earlier stored games in this sport`, [event.id, ...priorAll.map((e) => e.id)]),
      });
    }
    const closest = Math.min(...margins);
    if (margin < closest && margin > 0) {
      found.push({
        id: "closest-game",
        kind: "closest-game",
        strength: 50,
        text: `A ${margin}-${marginNoun(event.sport)} game is the closest finish in ${sportLabel(event.sport).toLowerCase()} ${TRACKED} this season.`,
        provenance: calc(`compared against ${priorAll.length} earlier stored games in this sport`, [event.id, ...priorAll.map((e) => e.id)]),
      });
    }
  }

  return rankMetro(found);
}

/**
 * Strongest first, and never two discoveries about the same school — a brief
 * that says "Kirkwood is 3-0" and "three straight for Kirkwood" says one thing
 * twice.
 */
export function rankMetro(found: MetroDiscovery[], limit = 2): MetroDiscovery[] {
  const seenSubject = new Set<string>();
  const seenKind = new Set<string>();
  const out: MetroDiscovery[] = [];
  for (const d of [...found].sort((a, b) => b.strength - a.strength || a.id.localeCompare(b.id))) {
    if (d.subject && seenSubject.has(d.subject)) continue;
    if (seenKind.has(d.kind)) continue;
    if (d.subject) seenSubject.add(d.subject);
    seenKind.add(d.kind);
    out.push(d);
    if (out.length >= limit) break;
  }
  return out;
}

// ── City-wide sections ──────────────────────────────────────────────────────

export interface FeedSection<T> {
  title: string;
  items: T[];
}

/** Games decided by the smallest margins on a given slate. */
export function closestGames(events: CanonicalEvent[], limit = 3): CanonicalEvent[] {
  return reliable(events)
    .filter((e) => !isTie(e))
    .map((e) => ({ e, margin: Math.abs(e.sides[0].score! - e.sides[1].score!) }))
    .sort((a, b) => a.margin - b.margin || a.e.id.localeCompare(b.e.id))
    .slice(0, limit)
    .map((x) => x.e);
}

/** The highest combined scores. Only meaningful within one sport. */
export function highestScoring(events: CanonicalEvent[], limit = 3): CanonicalEvent[] {
  return reliable(events)
    .map((e) => ({ e, total: e.sides[0].score! + e.sides[1].score! }))
    .sort((a, b) => b.total - a.total || a.e.id.localeCompare(b.e.id))
    .slice(0, limit)
    .map((x) => x.e);
}

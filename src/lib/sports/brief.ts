// ─────────────────────────────────────────────────────────────────────────────
// The short brief. This is the artifact the city feed is made of.
//
// Sprint 1 wrote a 700-word game story for one team. At metro scale that is the
// wrong shape entirely: a reader scanning Saturday morning wants forty games in
// two minutes. So a brief is 50–120 words, and when the evidence is thin it is
// SHORTER, never padded to look complete.
//
// The house style, which the sentences below encode:
//   · the score does the work; adjectives do not
//   · no "thrilling", "hard-fought", "proved too much" — characterisations we
//     cannot support from a scoreline
//   · these are teenagers, so a losing team is reported, never mocked
//   · every number traces to a source or to our own arithmetic
//
// Written by TypeScript. A model may rephrase it (see modelWriter) but only
// from these same facts, and only if the fact guard passes the rewrite.
// ─────────────────────────────────────────────────────────────────────────────

import { sportLabel, sportMeta } from "./graph/sports.ts";
import { hasScore, isTie, winnerOf, type CanonicalEvent, type School } from "./graph/types.ts";
import type { MetroDiscovery } from "./metroStories.ts";

const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

/** Weekday from an ISO date, parsed as UTC so it never drifts a day. */
export function weekdayOf(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return WEEKDAY[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

export function longDateOf(isoDate: string): string {
  const [, m, d] = isoDate.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

export interface BriefContext {
  event: CanonicalEvent;
  schools: Map<string, School>;
  discoveries: MetroDiscovery[];
  /** Today, so "Friday night" is only used while it still means this week. */
  today: string;
}

export interface Brief {
  /** "Kirkwood 28, Eureka 21" — the line a reader scans first. */
  scoreline: string;
  headline: string;
  /** One to three sentences. Never padded to reach a length. */
  body: string;
  wordCount: number;
  /** Which discoveries actually made it into the prose, for provenance display. */
  usedDiscoveryIds: string[];
  writtenBy: "engine" | "model";
}

const nameOf = (schools: Map<string, School>, id: string) => schools.get(id)?.shortName ?? id;

/**
 * How to refer to the night. Within a week the weekday is how people actually
 * talk; after that it becomes a date, because "Friday" three weeks later is a
 * lie of implication.
 */
function whenPhrase(date: string, today: string): string {
  const days = Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${date}T00:00:00Z`)) / 86_400_000);
  if (days < 0 || days > 6) return `on ${longDateOf(date)}`;
  const day = weekdayOf(date);
  // "Friday night" is only right for games that actually finish at night, and
  // only football reliably does in this metro.
  return days === 0 ? `${day}` : `${day}`;
}

export function scorelineOf(event: CanonicalEvent, schools: Map<string, School>): string {
  const [a, b] = event.sides;
  if (!hasScore(event)) {
    return `${nameOf(schools, a.schoolId)} vs. ${nameOf(schools, b.schoolId)}`;
  }
  const ordered = a.score! >= b.score! ? [a, b] : [b, a];
  return `${nameOf(schools, ordered[0].schoolId)} ${ordered[0].score}, ${nameOf(schools, ordered[1].schoolId)} ${ordered[1].score}`;
}

export function headlineOf(event: CanonicalEvent, schools: Map<string, School>): string {
  const winner = winnerOf(event);
  const loser = event.sides.find((s) => s.schoolId !== winner?.schoolId);
  const sport = sportLabel(event.sport);

  if (!hasScore(event)) {
    return `${nameOf(schools, event.sides[0].schoolId)} vs. ${nameOf(schools, event.sides[1].schoolId)}, ${sport}`;
  }
  if (isTie(event)) {
    return `${nameOf(schools, event.sides[0].schoolId)} and ${nameOf(schools, event.sides[1].schoolId)} draw ${event.sides[0].score}-${event.sides[1].score}`;
  }
  const margin = (winner?.score ?? 0) - (loser?.score ?? 0);
  const shutout = loser?.score === 0;
  const verb = shutout ? "shuts out" : margin === 1 ? "edges" : "beats";
  return `${nameOf(schools, winner!.schoolId)} ${verb} ${nameOf(schools, loser!.schoolId)}, ${winner!.score}-${loser!.score}`;
}

/** The verb that fits the sport. Soccer teams do not "beat 3-0" the same way. */
function resultVerb(event: CanonicalEvent): string {
  const meta = sportMeta(event.sport);
  if (meta?.setScored) return "beat";
  return "beat";
}

export function buildBrief(ctx: BriefContext): Brief {
  const { event, schools, discoveries, today } = ctx;
  const sport = sportLabel(event.sport).toLowerCase();
  const sentences: string[] = [];
  const used: string[] = [];

  const winner = winnerOf(event);
  const loser = event.sides.find((s) => s.schoolId !== winner?.schoolId);
  const when = whenPhrase(event.date, today);

  // ── Sentence 1: what happened. Always present, always sourced. ────────────
  if (!hasScore(event)) {
    // A scheduled game is a listing, not a story. One line, no invention.
    sentences.push(
      `${nameOf(schools, event.sides[0].schoolId)} and ${nameOf(schools, event.sides[1].schoolId)} meet ${when} in ${sport}.`,
    );
  } else if (isTie(event)) {
    sentences.push(
      `${nameOf(schools, event.sides[0].schoolId)} and ${nameOf(schools, event.sides[1].schoolId)} played to a ${event.sides[0].score}-${event.sides[1].score} draw ${when} in ${sport}.`,
    );
  } else {
    const w = nameOf(schools, winner!.schoolId);
    const l = nameOf(schools, loser!.schoolId);
    // Say where it was played only when we actually know. "At" is a fact.
    const where = event.homeKnown
      ? winner!.schoolId === event.sides[0].schoolId
        ? " at home"
        : ` at ${l}`
      : "";
    sentences.push(`${w} ${resultVerb(event)} ${l} ${winner!.score}-${loser!.score}${where} ${when} in ${sport}.`);
  }

  // ── Sentence 2+: only what the archive can prove. ─────────────────────────
  // Ranked strongest first and capped at two, because a brief with four
  // context sentences is no longer a brief.
  for (const d of discoveries.slice(0, 2)) {
    sentences.push(d.text);
    used.push(d.id);
  }

  const body = sentences.join(" ");
  return {
    scoreline: scorelineOf(event, schools),
    headline: headlineOf(event, schools),
    body,
    wordCount: body.split(/\s+/).filter(Boolean).length,
    usedDiscoveryIds: used,
    writtenBy: "engine",
  };
}

export { nameOf as schoolNameOf };

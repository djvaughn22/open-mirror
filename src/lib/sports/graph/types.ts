// ─────────────────────────────────────────────────────────────────────────────
// The canonical St. Louis sports graph.
//
// The whole product turns on one distinction this file encodes:
//
//   an OBSERVATION is what a source said.
//   a CANONICAL EVENT is what we concluded, and why.
//
// A source is never truth. Two sources reporting the same game produce two
// observations and one event; the event keeps both, so every published number
// can be traced back to the page it came from. When sources disagree we say so
// and publish less. Nothing here is ever written by a model.
// ─────────────────────────────────────────────────────────────────────────────

export type MetroId = "st-louis";

/**
 * Sports are added as sources prove they carry reliable data for them, not
 * speculatively. Each id is the canonical key everything else joins on.
 */
export type SportId =
  | "football"
  | "boys-soccer"
  | "girls-soccer"
  | "girls-volleyball"
  | "boys-volleyball"
  | "girls-swimming"
  | "boys-swimming"
  | "boys-cross-country"
  | "girls-cross-country"
  | "girls-golf"
  | "boys-golf"
  | "girls-tennis"
  | "boys-tennis"
  | "field-hockey"
  | "girls-softball"
  | "baseball"
  | "boys-basketball"
  | "girls-basketball"
  | "ice-hockey"
  | "wrestling"
  | "water-polo";

export interface SportMeta {
  id: SportId;
  /** How a reader sees it: "Football", "Girls Volleyball". */
  label: string;
  /** Season the sport belongs to, used to keep out-of-season noise out of the feed. */
  season: "fall" | "winter" | "spring";
  /** True when the sport's result is a set/match count rather than points. */
  setScored?: boolean;
  /** Verb used in prose: "beat" works for all, but scoring language differs. */
  scoreNoun: string;
}

// ── Schools ─────────────────────────────────────────────────────────────────

export interface School {
  /** Stable slug. Never derived from a source string at runtime. */
  id: string;
  /** Full formal name. */
  name: string;
  /** What a headline uses: "SLUH", "Kirkwood", "Belleville East". */
  shortName: string;
  /** Team nickname, when we actually know it. Never guessed. */
  nickname?: string;
  city: string;
  state: "MO" | "IL";
  metro: MetroId;
  /**
   * Set only for single-sex schools. Their own site writes "Soccer" where a
   * co-ed school writes "Boys Soccer", and without this the sport would have to
   * be dropped as ambiguous. Left undefined for co-ed schools on purpose.
   */
  genderContext?: "boys" | "girls";
  /**
   * Every other way a permitted source spells this school. This registry is the
   * proprietary part — it grows every time an unresolved name is reviewed.
   */
  aliases: string[];
}

export interface SchoolRef {
  schoolId: string;
  /** The exact string the source used, kept for provenance and alias review. */
  reportedAs: string;
}

// ── Sources ─────────────────────────────────────────────────────────────────

export type SourceType = "school-site" | "association" | "conference" | "feed" | "first-party";

export interface SourceMeta {
  id: string;
  name: string;
  type: SourceType;
  metros: MetroId[];
  sports: SportId[];
  /** Why we are allowed to read it. Written out so it can be audited later. */
  permission: string;
  /** Seconds to wait between requests to one host. Honoured by the fetcher. */
  crawlDelaySeconds: number;
  /** How much weight this source carries when observations disagree. */
  reliability: "high" | "medium" | "low";
  homepage: string;
}

// ── Observations ────────────────────────────────────────────────────────────

export type HomeAway = "home" | "away" | "neutral" | "unknown";

/**
 * One line as a source printed it, before we know what any of it means. Raw
 * strings only: resolution happens later so a bad alias never silently becomes
 * a bad fact.
 */
export interface RawObservation {
  sourceId: string;
  /** The exact page this came from. Shown to readers as the credit. */
  sourceUrl: string;
  fetchedAt: string;
  /** When the source itself says the page changed, if it says so at all. */
  sourceUpdatedAt?: string;
  /** The school whose page published this — its own result, first-party. */
  reportingSchool: string;
  opponent: string;
  /** ISO calendar date, YYYY-MM-DD, in the metro's timezone. */
  date: string;
  /** Kickoff/first serve, ISO 8601 with offset, when the source gives one. */
  startsAt?: string;
  /** The source's own words for the sport. Mapped to a SportId on normalize. */
  sportLabel: string;
  /** Weaker sport evidence from the page itself, for tables that name only a level. */
  sportHint?: string;
  /** The source's own words for the level. Only "varsity" survives MVP 1. */
  levelLabel?: string;
  homeAway: HomeAway;
  result?: "W" | "L" | "T";
  /** Points for the reporting school. Undefined when the game has not been played. */
  scoreFor?: number;
  scoreAgainst?: number;
  location?: string;
  status?: string;
}

/** A raw observation after schools and sport have been resolved. */
export interface NormalizedObservation {
  id: string;
  sourceId: string;
  sourceUrl: string;
  fetchedAt: string;
  sourceUpdatedAt?: string;
  sport: SportId;
  date: string;
  startsAt?: string;
  /** Resolved reporting school. */
  reporter: SchoolRef;
  /** Resolved opponent, or undefined when no confident match exists. */
  opponent?: SchoolRef;
  /** Kept verbatim when the opponent could not be resolved. */
  unresolvedOpponent?: string;
  homeAway: HomeAway;
  result?: "W" | "L" | "T";
  scoreFor?: number;
  scoreAgainst?: number;
  location?: string;
  status: "final" | "scheduled" | "unknown";
  raw: RawObservation;
}

// ── Canonical facts ─────────────────────────────────────────────────────────

/** Where a canonical assertion came from. Nothing publishes without one. */
export type EventProvenance =
  /** Read out of one or more permitted public sources. */
  | { kind: "source"; observationIds: string[] }
  /** Computed by our own TypeScript over stored events. Never by a model. */
  | { kind: "calculated"; method: string; fromEventIds: string[] }
  /** Entered or corrected by the operator on the review desk. */
  | { kind: "operator"; approvedByOperator: true }
  /** A characterization, not a measurement. Labeled wherever shown. */
  | { kind: "interpretation"; basis: string };

export type ConflictField = "score" | "date" | "home-away" | "sport" | "status";

export interface Conflict {
  field: ConflictField;
  /** One entry per disagreeing account, so the desk can show the whole picture. */
  accounts: Array<{ value: string; observationIds: string[]; sourceIds: string[] }>;
}

/**
 * How much we trust the event as a whole.
 *   confirmed     — two or more independent sources agree
 *   single-source — exactly one source, no contradiction. Publishable, labeled.
 *   conflicted    — sources disagree on something material. Score withheld.
 *   unresolved    — a participant could not be identified. Never published.
 */
export type EventConfidence = "confirmed" | "single-source" | "conflicted" | "unresolved";

export interface EventSide {
  schoolId: string;
  /** Undefined when the score is unknown or withheld because of a conflict. */
  score?: number;
}

export interface CanonicalEvent {
  id: string;
  version: 1;
  metro: MetroId;
  sport: SportId;
  /** ISO calendar date in the metro timezone. */
  date: string;
  startsAt?: string;
  /** Exactly two sides. Home first when home/away is known. */
  sides: [EventSide, EventSide];
  /** True when we know which side was at home. */
  homeKnown: boolean;
  status: "final" | "scheduled" | "unknown";
  location?: string;
  confidence: EventConfidence;
  conflicts: Conflict[];
  /** Every contributing observation. Dedupe never discards provenance. */
  observations: NormalizedObservation[];
  /** Distinct sources backing this event at all, for the credit line. */
  sourceIds: string[];
  /**
   * Distinct sources that actually reported a SCORE.
   *
   * This is deliberately separate from `sourceIds`. A calendar source can
   * confirm that two schools played on a date and who hosted, while carrying no
   * result at all — real corroboration of the fixture, none of the score.
   * Counting those together would let the page claim "two sources agree" about
   * a number only one of them ever stated.
   */
  scoreSourceIds: string[];
  /** Names a source used that we could not resolve. Drives the review queue. */
  unresolvedNames: string[];
  /** False whenever anything material is unknown, conflicted, or unresolved. */
  publishable: boolean;
  createdAt: string;
  updatedAt: string;
  /** Last time a source run re-observed this event. Freshness, not creation. */
  lastVerifiedAt: string;
}

/** The winning side, or undefined for a tie, a scheduled game, or a conflict. */
export function winnerOf(event: CanonicalEvent): EventSide | undefined {
  const [a, b] = event.sides;
  if (a.score === undefined || b.score === undefined) return undefined;
  if (a.score === b.score) return undefined;
  return a.score > b.score ? a : b;
}

export function loserOf(event: CanonicalEvent): EventSide | undefined {
  const w = winnerOf(event);
  if (!w) return undefined;
  return event.sides.find((s) => s.schoolId !== w.schoolId);
}

export function isTie(event: CanonicalEvent): boolean {
  const [a, b] = event.sides;
  return a.score !== undefined && a.score === b.score;
}

export function hasScore(event: CanonicalEvent): boolean {
  return event.sides.every((s) => s.score !== undefined);
}

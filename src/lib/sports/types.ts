// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — core domain types.
//
// The rule this file exists to enforce: AI CAN WRITE, AI CANNOT MAKE FACTS.
// Every assertion that can reach a reader carries provenance saying where it
// came from. Nothing is publishable without one.
//
// The engine is football-shaped today (one sport, one team — MVP 1) but the
// sport-specific knowledge lives in ./football.ts, not here.
// ─────────────────────────────────────────────────────────────────────────────

/** Where a factual assertion came from. Nothing publishes without one. */
export type Provenance =
  /** Read out of evidence the operator supplied, then approved on the verify screen. */
  | { kind: "evidence"; quote: string; approvedByOperator: true }
  /** Typed or corrected by the operator directly on the verify screen. */
  | { kind: "operator"; approvedByOperator: true }
  /** Computed by our own TypeScript from stored games. Never by a model. */
  | { kind: "calculated"; method: string; fromGameIds: string[] }
  /** A characterization, not a measurement. Must be labeled as such wherever shown. */
  | { kind: "interpretation"; basis: string };

export type Confidence = "high" | "medium" | "low";

/** The three tiers the spec insists never get blended together. */
export type FactTier = "fact" | "calculated" | "interpretation";

export function tierOf(p: Provenance): FactTier {
  if (p.kind === "calculated") return "calculated";
  if (p.kind === "interpretation") return "interpretation";
  return "fact";
}

// ── Evidence ────────────────────────────────────────────────────────────────

export type EvidenceKind = "pasted-text" | "typed-notes" | "stat-export";

export interface EvidenceItem {
  id: string;
  kind: EvidenceKind;
  /** Raw supplied text, retained so any published fact stays traceable. */
  text: string;
  label?: string;
}

// ── Candidate facts (pre-verification) ──────────────────────────────────────

export type CandidateKind =
  | "score"
  | "record"
  | "player-stat"
  | "narrative"
  | "next-game"
  | "game-date";

/**
 * One thing the extractor thinks it read. Candidates are never trusted:
 * they exist only to be shown on the verification screen.
 */
export interface CandidateFact {
  id: string;
  kind: CandidateKind;
  /** Human label shown on the verification screen. */
  label: string;
  /** The value the operator edits. Shape depends on `kind`. */
  value: CandidateValue;
  confidence: Confidence;
  /** The exact span of supplied evidence this was read from. */
  quote: string;
  evidenceId: string;
  /** Why we are unsure — shown to the operator so they only fix what matters. */
  uncertainty?: string;
}

export type CandidateValue =
  | { type: "score"; team: string; teamScore: number; opponent: string; opponentScore: number; homeAway: HomeAway }
  | { type: "record"; wins: number; losses: number; ties: number }
  | { type: "player-stat"; player: string; stat: string; amount: number }
  | { type: "narrative"; text: string; deficit?: { us: number; them: number } }
  | { type: "next-game"; opponent: string; when: string }
  | { type: "game-date"; date: string };

export type HomeAway = "home" | "away" | "neutral" | "unknown";

// ── Stored (approved) game ──────────────────────────────────────────────────

export interface StatValue {
  amount: number;
  provenance: Provenance;
}

export interface PlayerLine {
  name: string;
  /** Keyed by a sport stat id (see ./football.ts). Only verified stats exist here. */
  stats: Record<string, StatValue>;
}

export interface NarrativeFact {
  text: string;
  provenance: Provenance;
  /** Set only when the operator verified an actual trailing score. */
  deficit?: { us: number; them: number };
}

export interface TeamRecord {
  wins: number;
  losses: number;
  ties: number;
}

export interface GameRecord {
  id: string;
  version: 1;
  sport: "football";
  seasonId: string;
  /** ISO calendar date, YYYY-MM-DD. */
  date: string;
  team: string;
  opponent: string;
  homeAway: HomeAway;
  teamScore: number;
  opponentScore: number;
  result: "W" | "L" | "T";
  recordAfter?: TeamRecord;
  players: PlayerLine[];
  narrative: NarrativeFact[];
  next?: { opponent: string; when: string; provenance: Provenance };
  /** Provenance for the score line itself. */
  scoreProvenance: Provenance;
  /** Raw evidence kept for traceability. Not shown to public readers. */
  evidence: EvidenceItem[];
  /** Seeded demo history rather than a real reported game. Labeled publicly. */
  demo?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ── Story Finder output ─────────────────────────────────────────────────────

export type DiscoveryKind =
  | "player-season-high"
  | "player-streak"
  | "team-win-streak"
  | "team-loss-streak"
  | "team-scoring-high"
  | "team-scoring-low"
  | "record-when-player-threshold"
  | "first-this-season"
  | "comeback"
  | "record-change";

export interface Discovery {
  id: string;
  kind: DiscoveryKind;
  /** The sentence, written by TypeScript. Models never author these. */
  text: string;
  tier: FactTier;
  /** 0–100. Used to rank, so the edition is not a stat dump. */
  strength: number;
  provenance: Provenance;
  /** Named subject, so the writer can avoid repeating the same player twice. */
  subject?: string;
}

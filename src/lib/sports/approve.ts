// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — turning approved candidates into a stored game.
//
// This is the one door between "the extractor thinks" and "the archive says".
// A candidate the operator did not keep never gets through it, and every fact
// that does carries the quote or the operator action it came from.
// ─────────────────────────────────────────────────────────────────────────────

import { gameId, validateGame, type Valid } from "./validate.ts";
import type {
  CandidateFact,
  EvidenceItem,
  GameRecord,
  NarrativeFact,
  PlayerLine,
  Provenance,
  StatValue,
} from "./types.ts";

export interface ApprovedCandidate extends CandidateFact {
  /** The operator kept this. Anything not kept is dropped, not stored. */
  kept: boolean;
  /** True when the operator changed the value the extractor proposed. */
  edited?: boolean;
}

function provenanceFor(c: ApprovedCandidate): Provenance {
  return c.edited || !c.quote
    ? { kind: "operator", approvedByOperator: true }
    : { kind: "evidence", quote: c.quote, approvedByOperator: true };
}

export interface ApproveInput {
  candidates: ApprovedCandidate[];
  evidence: EvidenceItem[];
  team: { name: string };
  seasonId: string;
  /** Fallback when the notes carried no date. */
  today: string;
  demo?: boolean;
}

export function approveGame(input: ApproveInput): Valid<GameRecord> {
  const kept = input.candidates.filter((c) => c.kept);
  const errors: string[] = [];

  const scoreCard = kept.find((c) => c.value.type === "score");
  if (!scoreCard || scoreCard.value.type !== "score") {
    return { ok: false, errors: ["A final score is required. Nothing is published without one."] };
  }
  const score = scoreCard.value;
  if (!score.opponent.trim()) errors.push("The opponent has to be named before this game can be published.");

  const dateCard = kept.find((c) => c.value.type === "game-date");
  const date = dateCard && dateCard.value.type === "game-date" ? dateCard.value.date : input.today;

  // Player lines: one per name, stats merged.
  const byPlayer = new Map<string, PlayerLine>();
  for (const c of kept) {
    if (c.value.type !== "player-stat") continue;
    const name = c.value.player.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    const line = byPlayer.get(key) ?? { name, stats: {} as Record<string, StatValue> };
    line.stats[c.value.stat] = { amount: c.value.amount, provenance: provenanceFor(c) };
    byPlayer.set(key, line);
  }

  const narrative: NarrativeFact[] = kept.flatMap((c) =>
    c.value.type === "narrative"
      ? [{ text: c.value.text, provenance: provenanceFor(c), deficit: c.value.deficit }]
      : [],
  );

  const recordCard = kept.find((c) => c.value.type === "record");
  const nextCard = kept.find((c) => c.value.type === "next-game");

  if (errors.length > 0) return { ok: false, errors };

  const draft = {
    id: gameId(date, score.opponent),
    version: 1,
    sport: "football",
    seasonId: input.seasonId,
    date,
    team: input.team.name,
    opponent: score.opponent.trim(),
    homeAway: score.homeAway,
    teamScore: score.teamScore,
    opponentScore: score.opponentScore,
    recordAfter:
      recordCard && recordCard.value.type === "record"
        ? { wins: recordCard.value.wins, losses: recordCard.value.losses, ties: recordCard.value.ties }
        : undefined,
    players: [...byPlayer.values()],
    narrative,
    next:
      nextCard && nextCard.value.type === "next-game" && nextCard.value.opponent.trim()
        ? { opponent: nextCard.value.opponent.trim(), when: nextCard.value.when, provenance: provenanceFor(nextCard) }
        : undefined,
    scoreProvenance: provenanceFor(scoreCard),
    evidence: input.evidence,
    demo: input.demo,
    createdAt: new Date().toISOString(),
  };

  return validateGame(draft);
}

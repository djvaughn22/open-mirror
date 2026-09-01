// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — what goes on the share card.
//
// A card is read in about a second, so it carries four things: the final, one
// supported line about why the game mattered, one standout performance, and
// where to read the rest. Every one of them is derived, never written.
// ─────────────────────────────────────────────────────────────────────────────

import { statShort } from "./football.ts";
import { headlineStats, leadPerformer } from "./storyFinder.ts";
import type { Discovery, GameRecord } from "./types.ts";

export interface ShareCardData {
  final: { team: string; teamScore: number; opponent: string; opponentScore: number; result: "W" | "L" | "T" };
  /** Short all-caps line. Empty when nothing beyond the score is supported. */
  tagline: string;
  standout?: { name: string; stats: string };
  date: string;
  demo: boolean;
}

/** All-caps, four words at most, and only from a calculated discovery. */
export function cardTagline(game: GameRecord, discoveries: Discovery[]): string {
  const comeback = discoveries.find((d) => d.kind === "comeback");
  const deficit = game.narrative.find((n) => n.deficit)?.deficit;
  if (comeback && deficit) return `BACK FROM ${deficit.them - deficit.us} DOWN`;

  const streak = discoveries.find((d) => d.kind === "team-win-streak");
  if (streak) {
    const n = streak.text.match(/won (\w+) straight/i)?.[1];
    if (n) return `${n.toUpperCase()} STRAIGHT`;
  }
  if (discoveries.some((d) => d.kind === "team-scoring-high")) return "SEASON HIGH · TEAM";
  if (discoveries.some((d) => d.kind === "player-season-high")) return "SEASON HIGH";
  if (discoveries.some((d) => d.kind === "player-streak")) return "STREAK CONTINUES";
  return "";
}

export function shareCardData(game: GameRecord, discoveries: Discovery[]): ShareCardData {
  const lead = leadPerformer(game);
  const stats = lead ? headlineStats(game, lead.name, 2) : [];
  return {
    final: {
      team: game.team,
      teamScore: game.teamScore,
      opponent: game.opponent,
      opponentScore: game.opponentScore,
      result: game.result,
    },
    tagline: cardTagline(game, discoveries),
    standout:
      lead && stats.length > 0
        ? { name: lead.name, stats: stats.map((s) => statShort(s.statId, s.amount)).join(" · ") }
        : undefined,
    date: game.date,
    demo: game.demo === true,
  };
}

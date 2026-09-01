// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — history questions, answered by arithmetic.
//
// Every function here is pure and deterministic. No model is ever asked "was
// that a season high?" — the archive is counted. That is what makes the
// resulting sentences safe to publish.
// ─────────────────────────────────────────────────────────────────────────────

import type { GameRecord, TeamRecord } from "./types.ts";

export interface StatPoint {
  gameId: string;
  date: string;
  opponent: string;
  amount: number;
}

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Oldest first, and only games at or before `throughDate`. */
export function upTo(games: GameRecord[], throughDate: string, excludeId?: string): GameRecord[] {
  return games
    .filter((g) => g.date <= throughDate && g.id !== excludeId)
    .sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date)));
}

export function statOf(game: GameRecord, player: string, statId: string): number | undefined {
  const line = game.players.find((p) => sameName(p.name, player));
  return line?.stats[statId]?.amount;
}

/** Every game in which the player recorded this stat, oldest first. */
export function playerSeries(games: GameRecord[], player: string, statId: string): StatPoint[] {
  return games.flatMap((g) => {
    const amount = statOf(g, player, statId);
    return amount === undefined ? [] : [{ gameId: g.id, date: g.date, opponent: g.opponent, amount }];
  });
}

export function highestPoint(points: StatPoint[]): StatPoint | undefined {
  return points.reduce<StatPoint | undefined>((best, p) => (!best || p.amount > best.amount ? p : best), undefined);
}

/**
 * Games at the END of the list, counting backwards, where the player cleared
 * `threshold`. Games the player did not appear in break the run — being absent
 * is not the same as clearing the bar.
 */
export function consecutiveAtLeast(
  games: GameRecord[],
  player: string,
  statId: string,
  threshold: number,
): GameRecord[] {
  const run: GameRecord[] = [];
  for (let i = games.length - 1; i >= 0; i -= 1) {
    const amount = statOf(games[i], player, statId);
    if (amount === undefined || amount < threshold) break;
    run.unshift(games[i]);
  }
  return run;
}

/** Current run of the same result, counting back from the most recent game. */
export function resultStreak(games: GameRecord[]): { result: "W" | "L" | "T"; games: GameRecord[] } | undefined {
  if (games.length === 0) return undefined;
  const result = games[games.length - 1].result;
  const run: GameRecord[] = [];
  for (let i = games.length - 1; i >= 0; i -= 1) {
    if (games[i].result !== result) break;
    run.unshift(games[i]);
  }
  return { result, games: run };
}

export function computedRecord(games: GameRecord[]): TeamRecord {
  return games.reduce<TeamRecord>(
    (acc, g) => ({
      wins: acc.wins + (g.result === "W" ? 1 : 0),
      losses: acc.losses + (g.result === "L" ? 1 : 0),
      ties: acc.ties + (g.result === "T" ? 1 : 0),
    }),
    { wins: 0, losses: 0, ties: 0 },
  );
}

export function formatRecord(r: TeamRecord): string {
  return r.ties > 0 ? `${r.wins}-${r.losses}-${r.ties}` : `${r.wins}-${r.losses}`;
}

/** The team's record in the games where a player cleared a bar. */
export function recordWhenPlayerAtLeast(
  games: GameRecord[],
  player: string,
  statId: string,
  threshold: number,
): { record: TeamRecord; games: GameRecord[] } {
  const matching = games.filter((g) => (statOf(g, player, statId) ?? -1) >= threshold);
  return { record: computedRecord(matching), games: matching };
}

export function teamScoringHigh(games: GameRecord[]): GameRecord | undefined {
  return games.reduce<GameRecord | undefined>((best, g) => (!best || g.teamScore > best.teamScore ? g : best), undefined);
}

export function teamScoringLow(games: GameRecord[]): GameRecord | undefined {
  return games.reduce<GameRecord | undefined>((low, g) => (!low || g.teamScore < low.teamScore ? g : low), undefined);
}

/** Everyone who has a line in any of these games. */
export function playersIn(games: GameRecord[]): string[] {
  const names = new Map<string, string>();
  for (const g of games) for (const p of g.players) names.set(p.name.trim().toLowerCase(), p.name.trim());
  return [...names.values()];
}

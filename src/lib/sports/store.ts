// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — storage.
//
// MVP 1 runs at $0 with no database and no vendor: approved games are plain
// JSON files under data/sports/games/. The operator records a game on their own
// machine, the file is committed, and the push publishes it. That is the whole
// pipeline — a git-backed archive, versioned and diffable, with nothing to pay
// for and nothing to leak.
//
// The seam is real: everything above this file talks to SportsStore, so a
// Postgres or Neon implementation can be dropped in later without touching the
// engine, the Story Finder, or any page.
// ─────────────────────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { validateGame } from "./validate.ts";
import type { GameRecord } from "./types.ts";

export interface SportsStore {
  list(): GameRecord[];
  get(id: string): GameRecord | undefined;
  save(game: GameRecord): void;
  remove(id: string): boolean;
  /** False on read-only hosting: the UI must say so instead of failing quietly. */
  writable(): boolean;
}

const GAMES_DIR = join(process.cwd(), "data", "sports", "games");

function readAll(): GameRecord[] {
  if (!existsSync(GAMES_DIR)) return [];
  const games: GameRecord[] = [];
  for (const file of readdirSync(GAMES_DIR)) {
    if (!file.endsWith(".json")) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(join(GAMES_DIR, file), "utf8"));
    } catch {
      // A malformed archive file is a real problem — surface it, never skip it
      // silently, because a missing game silently changes every calculation.
      throw new Error(`data/sports/games/${file} is not valid JSON`);
    }
    const result = validateGame(parsed);
    if (!result.ok) throw new Error(`data/sports/games/${file} is not a valid game: ${result.errors.join("; ")}`);
    games.push(result.value);
  }
  return games.sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date)));
}

export const fileStore: SportsStore = {
  list: readAll,
  get(id) {
    return readAll().find((g) => g.id === id);
  },
  save(game) {
    mkdirSync(GAMES_DIR, { recursive: true });
    writeFileSync(join(GAMES_DIR, `${game.id}.json`), `${JSON.stringify(game, null, 2)}\n`, "utf8");
  },
  remove(id) {
    const path = join(GAMES_DIR, `${id}.json`);
    if (!existsSync(path)) return false;
    rmSync(path);
    return true;
  },
  writable() {
    try {
      mkdirSync(GAMES_DIR, { recursive: true });
      const probe = join(GAMES_DIR, ".write-probe");
      writeFileSync(probe, "");
      rmSync(probe);
      return true;
    } catch {
      return false;
    }
  },
};

export const store: SportsStore = fileStore;

/** Everything in one season, oldest first. */
export function seasonGames(all: GameRecord[], seasonId: string): GameRecord[] {
  return all.filter((g) => g.seasonId === seasonId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — the Story Finder.
//
// Runs BEFORE any writing happens. It compares tonight's verified game against
// every game already in the archive and reports what is genuinely true and
// genuinely interesting. Every sentence here is written by TypeScript from
// counted data, so a discovery cannot be wrong unless the archive is wrong.
//
// Three tiers, never blended:
//   fact           — measured in this game
//   calculated     — arithmetic over stored games
//   interpretation — a characterization, always labeled as one
// ─────────────────────────────────────────────────────────────────────────────

import { FOOTBALL_STATS, performanceScore, statDef, statPhrase } from "./football.ts";
import {
  computedRecord,
  consecutiveAtLeast,
  formatRecord,
  highestPoint,
  playerSeries,
  playersIn,
  recordWhenPlayerAtLeast,
  resultStreak,
  statOf,
  teamScoringHigh,
  teamScoringLow,
  upTo,
} from "./history.ts";
import type { Discovery, GameRecord } from "./types.ts";

const countWord = (n: number) =>
  ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] ?? String(n);

function calc(method: string, ids: string[]): Discovery["provenance"] {
  return { kind: "calculated", method, fromGameIds: ids };
}

/**
 * @param game    tonight's approved game
 * @param archive every stored game, including tonight's if it is already saved
 */
export function findStories(game: GameRecord, archive: GameRecord[]): Discovery[] {
  const found: Discovery[] = [];
  // The season so far, tonight excluded — "previous" must mean previous.
  const priorSeason = upTo(archive.filter((g) => g.seasonId === game.seasonId), game.date, game.id);
  const withTonight = [...priorSeason, game];

  // ── Per player ────────────────────────────────────────────────────────────
  for (const player of playersIn([game])) {
    for (const def of FOOTBALL_STATS) {
      const tonight = statOf(game, player, def.id);
      if (tonight === undefined || tonight <= 0) continue;

      const prior = playerSeries(priorSeason, player, def.id);
      const priorBest = highestPoint(prior);

      // Season high — only meaningful once there is something to beat.
      if (prior.length >= 1 && priorBest && tonight > priorBest.amount) {
        found.push({
          id: `season-high-${player}-${def.id}`,
          kind: "player-season-high",
          subject: player,
          tier: "calculated",
          strength:
            55 +
            Math.round(def.weight / 4) +
            Math.min(15, Math.round(((tonight - priorBest.amount) / Math.max(priorBest.amount, 1)) * 40)) +
            (def.milestone && tonight >= def.milestone ? 10 : 0),
          text: `${player}'s ${statPhrase(def.id, tonight)} are a season high, past the ${priorBest.amount} against ${priorBest.opponent}.`,
          provenance: calc(`compared tonight against ${prior.length} earlier game(s) this season`, [game.id, ...prior.map((p) => p.gameId)]),
        });
      } else if (
        prior.length >= 2 &&
        priorBest &&
        tonight === priorBest.amount &&
        tonight >= (def.milestone ?? 2)
      ) {
        found.push({
          id: `season-tie-${player}-${def.id}`,
          kind: "player-season-high",
          subject: player,
          tier: "calculated",
          strength: 45,
          text: `${player} matched a season high with ${statPhrase(def.id, tonight)}.`,
          provenance: calc("tied the season's best mark in this stat", [game.id, priorBest.gameId]),
        });
      }

      // A run of games clearing the conventional bar for this stat.
      if (def.milestone && tonight >= def.milestone) {
        const run = consecutiveAtLeast(withTonight, player, def.id, def.milestone);
        if (run.length >= 2) {
          found.push({
            id: `streak-${player}-${def.id}`,
            kind: "player-streak",
            subject: player,
            tier: "calculated",
            strength: 55 + run.length * 8,
            text: `That is ${countWord(run.length)} straight games with at least ${def.milestone} ${def.unit} for ${player}.`,
            provenance: calc(`counted back through consecutive games at or above ${def.milestone} ${def.unit}`, run.map((g) => g.id)),
          });
        }

        // The team's record when this player clears the bar — only worth saying
        // when it has happened enough times to mean something.
        const when = recordWhenPlayerAtLeast(withTonight, player, def.id, def.milestone);
        if (when.games.length >= 3) {
          const r = when.record;
          const perfect = r.losses === 0 && r.ties === 0;
          found.push({
            id: `record-when-${player}-${def.id}`,
            kind: "record-when-player-threshold",
            subject: player,
            tier: "calculated",
            strength: perfect ? 66 : 40,
            text: `${game.team} is ${formatRecord(r)} this season when ${player} reaches ${def.milestone} ${def.unit}.`,
            provenance: calc(`counted results across the ${when.games.length} games meeting that bar`, when.games.map((g) => g.id)),
          });
        }
      }

      // First time all season anyone on the roster did this.
      if (prior.length === 0 && priorSeason.length >= 2 && !priorSeason.some((g) => playersIn([g]).some((n) => (statOf(g, n, def.id) ?? 0) > 0))) {
        found.push({
          id: `first-${def.id}`,
          kind: "first-this-season",
          subject: player,
          tier: "calculated",
          strength: 38 + Math.round(def.weight / 8),
          text: `${player}'s ${statPhrase(def.id, tonight)} were the first ${def.unit} ${game.team} has recorded this season.`,
          provenance: calc(`no earlier game this season recorded this stat`, withTonight.map((g) => g.id)),
        });
      }
    }
  }

  // ── Team ──────────────────────────────────────────────────────────────────
  const streak = resultStreak(withTonight);
  if (streak && streak.games.length >= 2) {
    const verb = streak.result === "W" ? "won" : streak.result === "L" ? "lost" : "tied";
    found.push({
      id: `team-streak`,
      kind: streak.result === "W" ? "team-win-streak" : "team-loss-streak",
      tier: "calculated",
      strength: streak.result === "W" ? 60 + streak.games.length * 5 : 40 + streak.games.length * 4,
      text: `${game.team} has ${verb} ${countWord(streak.games.length)} straight.`,
      provenance: calc("counted back from the most recent game until the result changed", streak.games.map((g) => g.id)),
    });
  }

  if (priorSeason.length >= 2) {
    const high = teamScoringHigh(priorSeason);
    if (high && game.teamScore > high.teamScore) {
      found.push({
        id: "team-scoring-high",
        kind: "team-scoring-high",
        tier: "calculated",
        strength: 62,
        text: `${game.teamScore} points is ${game.team}'s highest total of the season, past the ${high.teamScore} against ${high.opponent}.`,
        provenance: calc(`compared against ${priorSeason.length} earlier games this season`, [game.id, high.id]),
      });
    }
    const low = teamScoringLow(priorSeason);
    if (low && game.teamScore < low.teamScore && game.result === "L") {
      found.push({
        id: "team-scoring-low",
        kind: "team-scoring-low",
        tier: "calculated",
        strength: 44,
        text: `${game.teamScore} points is ${game.team}'s lowest total of the season.`,
        provenance: calc(`compared against ${priorSeason.length} earlier games this season`, [game.id, low.id]),
      });
    }
  }

  // Record after tonight. Prefer what the operator verified; otherwise count.
  const counted = computedRecord(withTonight);
  const stated = game.recordAfter;
  if (stated) {
    found.push({
      id: "record-change",
      kind: "record-change",
      tier: "fact",
      strength: 30,
      text: `${game.team} is ${formatRecord(stated)}.`,
      provenance: { kind: "operator", approvedByOperator: true },
    });
  } else if (withTonight.length >= 2) {
    found.push({
      id: "record-change",
      kind: "record-change",
      tier: "calculated",
      strength: 28,
      text: `${game.team} is ${formatRecord(counted)} in games recorded here this season.`,
      provenance: calc("counted results across every stored game this season", withTonight.map((g) => g.id)),
    });
  }

  // A comeback is only claimable when the operator verified a real deficit.
  const deficit = game.narrative.find((n) => n.deficit)?.deficit;
  if (deficit && game.result === "W") {
    const margin = deficit.them - deficit.us;
    if (margin > 0) {
      found.push({
        id: "comeback",
        kind: "comeback",
        tier: "calculated",
        strength: 75 + Math.min(margin, 21),
        text: `${game.team} came back from ${margin} points down.`,
        provenance: calc("subtracted the verified trailing score", [game.id]),
      });
    }
  }

  return rank(found);
}

/**
 * Keep the edition from becoming a stat dump: strongest first, and no more than
 * two discoveries about any one player or any one kind.
 */
export function rank(found: Discovery[], limit = 5): Discovery[] {
  const perSubject = new Map<string, number>();
  const perKind = new Map<string, number>();
  const out: Discovery[] = [];
  for (const d of [...found].sort((a, b) => b.strength - a.strength || a.id.localeCompare(b.id))) {
    const s = d.subject ? perSubject.get(d.subject) ?? 0 : 0;
    const k = perKind.get(d.kind) ?? 0;
    if (s >= 2 || k >= 2) continue;
    if (d.subject) perSubject.set(d.subject, s + 1);
    perKind.set(d.kind, k + 1);
    out.push(d);
    if (out.length >= limit) break;
  }
  return out;
}

/** The player whose line most deserves the headline. */
export function leadPerformer(game: GameRecord): { name: string; score: number } | undefined {
  return game.players
    .map((p) => ({ name: p.name, score: performanceScore(p.stats) }))
    .sort((a, b) => b.score - a.score)[0];
}

/** The two or three numbers that belong on a share card, strongest first. */
export function headlineStats(game: GameRecord, player: string, max = 2): Array<{ statId: string; amount: number }> {
  const line = game.players.find((p) => p.name === player);
  if (!line) return [];
  return Object.entries(line.stats)
    .map(([statId, v]) => ({ statId, amount: v.amount, weight: statDef(statId)?.weight ?? 0 }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, max)
    .map(({ statId, amount }) => ({ statId, amount }));
}

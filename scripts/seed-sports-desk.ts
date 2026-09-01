// ─────────────────────────────────────────────────────────────────────────────
// Seed the Sports Desk archive with a demo season.
//
//   node --experimental-strip-types scripts/seed-sports-desk.ts
//
// These are DEMO games. Every file is written with `demo: true`, and the desk
// labels demo seasons wherever a reader can see them. Replace them with real
// games by deleting data/sports/games/ and recording your own.
//
// The season exists so the Story Finder has something to compare against on
// day one: a rushing line that climbs 84 → 112 → 104 → 131 → 118, a two-game
// losing patch, and a scoring high to beat.
// ─────────────────────────────────────────────────────────────────────────────

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { validateGame, gameId } from "../src/lib/sports/validate.ts";
import type { GameRecord } from "../src/lib/sports/types.ts";

const TEAM = "Wildwood";
const SEASON = "2026";
const DIR = join(process.cwd(), "data", "sports", "games");

type Line = [name: string, stats: Record<string, number>];

interface Seed {
  date: string;
  opponent: string;
  homeAway: "home" | "away";
  us: number;
  them: number;
  lines: Line[];
  trailed?: [them: number, us: number];
  next?: [opponent: string, when: string];
  note: string;
}

const SEEDS: Seed[] = [
  {
    date: "2026-08-28", opponent: "Parkway", homeAway: "home", us: 28, them: 14,
    lines: [["Mason", { rushingYards: 84, rushingTd: 1 }], ["Cole", { passingYards: 132, passingTd: 2 }], ["Eli", { tackles: 6 }]],
    note: "Beat Parkway 28-14 at home. Mason had 84 rushing and a TD. Cole threw for 132 and 2 scores. Eli had 6 tackles.",
  },
  {
    date: "2026-09-04", opponent: "Rockwood", homeAway: "away", us: 17, them: 24,
    lines: [["Mason", { rushingYards: 71 }], ["Cole", { passingYards: 143, passingTd: 1 }]],
    note: "Lost 17-24 at Rockwood. Mason had 71 rushing. Cole threw for 143 and a touchdown pass.",
  },
  {
    date: "2026-09-11", opponent: "Kirkwood", homeAway: "home", us: 21, them: 10,
    lines: [["Mason", { rushingYards: 112, rushingTd: 2 }], ["Eli", { tackles: 9, interceptions: 1 }]],
    note: "Beat Kirkwood 21-10. Mason had 112 rushing and 2 TD. Eli had 9 tackles and a pick.",
  },
  {
    date: "2026-09-18", opponent: "Webster", homeAway: "away", us: 13, them: 35,
    lines: [["Mason", { rushingYards: 104, rushingTd: 1 }], ["Cole", { passingYards: 121 }]],
    trailed: [28, 6],
    note: "Lost 13-35 at Webster. We were down 28-6. Mason had 104 rushing and a TD. Cole threw for 121.",
  },
  {
    date: "2026-09-25", opponent: "Ladue", homeAway: "home", us: 35, them: 21,
    lines: [["Mason", { rushingYards: 131, rushingTd: 2 }], ["Cole", { passingYards: 168, passingTd: 1 }], ["Eli", { interceptions: 1, tackles: 7 }]],
    note: "Beat Ladue 35-21. Mason had 131 rushing and 2 TD. Cole threw for 168 and a touchdown pass. Eli had a pick and 7 tackles.",
  },
  {
    date: "2026-10-02", opponent: "Fox", homeAway: "away", us: 24, them: 20,
    lines: [["Mason", { rushingYards: 118, rushingTd: 1 }], ["Cole", { passingYards: 98, passingTd: 1 }], ["Eli", { sacks: 2, tackles: 8 }]],
    trailed: [17, 7],
    note: "Won 24-20 at Fox. We were down 17-7. Mason had 118 rushing and a TD. Cole threw for 98 and a score. Eli had 2 sacks and 8 tackles.",
  },
  {
    // The note from the spec, recorded through the desk exactly as an operator
    // would type it. This is the game the Story Finder has the most to say about.
    date: "2026-10-09", opponent: "Lafayette", homeAway: "home", us: 42, them: 35,
    lines: [["Mason", { rushingYards: 186, rushingTd: 3 }], ["Eli", { interceptions: 1 }]],
    trailed: [21, 7],
    next: ["Eureka", "Friday"],
    note: "Won 42-35 over Lafayette. We were down 21-7. Mason had 186 rushing and 3 TD. Eli had a late pick. We're 5-2 now and Eureka is Friday.",
  },
];

let wins = 0;
let losses = 0;
mkdirSync(DIR, { recursive: true });

for (const s of SEEDS) {
  if (s.us > s.them) wins += 1; else losses += 1;
  const evidenceId = "seed-1";
  const draft = {
    id: gameId(s.date, s.opponent),
    version: 1,
    sport: "football",
    seasonId: SEASON,
    date: s.date,
    team: TEAM,
    opponent: s.opponent,
    homeAway: s.homeAway,
    teamScore: s.us,
    opponentScore: s.them,
    recordAfter: { wins, losses, ties: 0 },
    players: s.lines.map(([name, stats]) => ({
      name,
      stats: Object.fromEntries(
        Object.entries(stats).map(([id, amount]) => [
          id,
          { amount, provenance: { kind: "evidence", quote: s.note, approvedByOperator: true } },
        ]),
      ),
    })),
    narrative: s.trailed
      ? [{
          text: `${TEAM} trailed ${s.trailed[0]}-${s.trailed[1]}.`,
          provenance: { kind: "evidence", quote: s.note, approvedByOperator: true },
          deficit: { them: s.trailed[0], us: s.trailed[1] },
        }]
      : [],
    next: s.next
      ? { opponent: s.next[0], when: s.next[1], provenance: { kind: "evidence", quote: s.note, approvedByOperator: true } }
      : undefined,
    scoreProvenance: { kind: "evidence", quote: s.note, approvedByOperator: true },
    evidence: [{ id: evidenceId, kind: "pasted-text", text: s.note, label: "Coach's note" }],
    demo: true,
    createdAt: new Date(`${s.date}T23:30:00Z`).toISOString(),
  };

  const result = validateGame(draft);
  if (!result.ok) {
    console.error(`seed ${s.opponent} failed validation:\n  ${result.errors.join("\n  ")}`);
    process.exit(1);
  }
  const game: GameRecord = result.value;
  writeFileSync(join(DIR, `${game.id}.json`), `${JSON.stringify(game, null, 2)}\n`, "utf8");
  console.log(`wrote ${game.id}.json  (${game.result} ${game.teamScore}-${game.opponentScore})`);
}

console.log(`\nDemo season seeded: ${wins}-${losses} through ${SEEDS.length} games.`);

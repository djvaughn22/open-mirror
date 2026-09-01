// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — the one team this desk covers (MVP 1 is deliberately single-team).
//
// Changing teams is a one-file edit. Everything else derives from here.
// The default below is the demo team the seeded season uses; seeded games are
// flagged `demo: true` and are labeled as a demo season wherever readers see them.
// ─────────────────────────────────────────────────────────────────────────────

export interface DeskTeam {
  /** Short name used in prose: "Wildwood beat Lafayette 42-35." */
  name: string;
  /** Mascot, used for headlines: "WILDCATS RALLY…". */
  mascot: string;
  /** Other ways the operator writes the team in notes. Keeps them out of player lists. */
  aliases: string[];
  sport: "football";
  level: string;
  /** Accent for the Sports Desk inside the Open Mirror flat palette. */
  accent: string;
}

export const TEAM: DeskTeam = {
  name: process.env.SPORTS_DESK_TEAM_NAME ?? "Wildwood",
  mascot: process.env.SPORTS_DESK_TEAM_MASCOT ?? "Wildcats",
  aliases: (process.env.SPORTS_DESK_TEAM_ALIASES ?? "Wildcats,Wildwood High,WHS").split(",").map((s) => s.trim()).filter(Boolean),
  sport: "football",
  level: process.env.SPORTS_DESK_TEAM_LEVEL ?? "High school football",
  accent: "#38BDF8",
};

/** The season a new game lands in unless the evidence says otherwise. */
export function currentSeasonId(date = new Date()): string {
  // Football seasons are named for the calendar year they start in; anything
  // in January or February belongs to the previous autumn.
  const y = date.getFullYear();
  return String(date.getMonth() <= 1 ? y - 1 : y);
}

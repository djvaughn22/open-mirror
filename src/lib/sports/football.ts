// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — the football adapter.
//
// One sport for MVP 1. Everything football-specific lives here: which stats
// exist, how they read in a sentence, which ones are worth a headline, and the
// thresholds the Story Finder measures against. Adding a second sport later
// means adding a sibling file, not editing the engine.
// ─────────────────────────────────────────────────────────────────────────────

export interface StatDef {
  id: string;
  /** Verification-screen label. */
  label: string;
  /** Reads inside a sentence: "186 rushing yards". */
  unit: string;
  /** Singular/plural noun for counted things: "3 touchdowns". */
  countNoun?: [singular: string, plural: string];
  /** Higher = more likely to lead the coverage. */
  weight: number;
  /** A "big game" line for this stat, when one is conventional. */
  milestone?: number;
  /** Words in messy notes that mean this stat. Order matters — longest first. */
  aliases: string[];
}

export const FOOTBALL_STATS: StatDef[] = [
  { id: "rushingYards", label: "Rushing yards", unit: "rushing yards", weight: 90, milestone: 100,
    aliases: ["rushing yards", "yards rushing", "rush yards", "yds rushing", "rushing yds", "rushing", "on the ground"] },
  { id: "rushingTd", label: "Rushing TD", unit: "rushing touchdowns", countNoun: ["rushing touchdown", "rushing touchdowns"], weight: 88,
    aliases: ["rushing touchdowns", "rushing touchdown", "rushing tds", "rushing td", "td rushing", "rush tds", "rush td"] },
  { id: "rushingAttempts", label: "Carries", unit: "carries", countNoun: ["carry", "carries"], weight: 30,
    aliases: ["carries", "carry", "rushing attempts", "rush attempts", "att rushing"] },
  { id: "passingYards", label: "Passing yards", unit: "passing yards", weight: 85, milestone: 200,
    aliases: ["passing yards", "yards passing", "pass yards", "passing yds", "passing", "through the air"] },
  { id: "passingTd", label: "Passing TD", unit: "touchdown passes", countNoun: ["touchdown pass", "touchdown passes"], weight: 84,
    aliases: ["touchdown passes", "touchdown pass", "passing touchdowns", "passing touchdown", "passing tds", "passing td", "td passes", "td pass"] },
  { id: "completions", label: "Completions", unit: "completions", countNoun: ["completion", "completions"], weight: 25,
    aliases: ["completions", "completed", "of"] },
  { id: "receivingYards", label: "Receiving yards", unit: "receiving yards", weight: 80, milestone: 100,
    aliases: ["receiving yards", "yards receiving", "rec yards", "receiving yds", "receiving"] },
  { id: "receivingTd", label: "Receiving TD", unit: "receiving touchdowns", countNoun: ["receiving touchdown", "receiving touchdowns"], weight: 78,
    aliases: ["receiving touchdowns", "receiving touchdown", "receiving tds", "receiving td", "td catches", "td catch"] },
  { id: "receptions", label: "Catches", unit: "catches", countNoun: ["catch", "catches"], weight: 40,
    aliases: ["receptions", "reception", "catches", "catch", "grabs"] },
  { id: "touchdowns", label: "Touchdowns", unit: "touchdowns", countNoun: ["touchdown", "touchdowns"], weight: 86,
    aliases: ["touchdowns", "touchdown", "tds", "td", "scores"] },
  { id: "tackles", label: "Tackles", unit: "tackles", countNoun: ["tackle", "tackles"], weight: 55, milestone: 10,
    aliases: ["tackles", "tackle", "stops"] },
  { id: "sacks", label: "Sacks", unit: "sacks", countNoun: ["sack", "sacks"], weight: 70,
    aliases: ["sacks", "sack"] },
  { id: "interceptions", label: "Interceptions", unit: "interceptions", countNoun: ["interception", "interceptions"], weight: 72,
    aliases: ["interceptions", "interception", "picks", "pick", "ints", "int"] },
  { id: "fumblesRecovered", label: "Fumble recoveries", unit: "fumble recoveries", countNoun: ["fumble recovery", "fumble recoveries"], weight: 60,
    aliases: ["fumble recoveries", "fumble recovery", "recovered fumbles", "recovered a fumble", "fumble recovered"] },
  { id: "fieldGoals", label: "Field goals", unit: "field goals", countNoun: ["field goal", "field goals"], weight: 58,
    aliases: ["field goals", "field goal", "fgs", "fg"] },
];

const BY_ID = new Map(FOOTBALL_STATS.map((s) => [s.id, s]));

export function statDef(id: string): StatDef | undefined {
  return BY_ID.get(id);
}

/** "186 rushing yards", "3 rushing touchdowns", "1 interception". */
export function statPhrase(id: string, amount: number): string {
  const def = BY_ID.get(id);
  if (!def) return `${amount} ${id}`;
  if (def.countNoun) {
    const [one, many] = def.countNoun;
    return `${amount} ${amount === 1 ? one : many}`;
  }
  return `${amount} ${def.unit}`;
}

/** Short form for the share card: "186 YDS", "3 TD". */
export function statShort(id: string, amount: number): string {
  switch (id) {
    case "rushingYards":
    case "passingYards":
    case "receivingYards":
      return `${amount} YDS`;
    case "rushingTd":
    case "passingTd":
    case "receivingTd":
    case "touchdowns":
      return `${amount} TD`;
    case "interceptions":
      return `${amount} INT`;
    case "sacks":
      return `${amount} SACK${amount === 1 ? "" : "S"}`;
    case "tackles":
      return `${amount} TKL`;
    case "receptions":
      return `${amount} REC`;
    case "rushingAttempts":
      return `${amount} CAR`;
    case "fieldGoals":
      return `${amount} FG`;
    default:
      return `${amount}`;
  }
}

/**
 * Aliases sorted longest-first so "rushing touchdowns" wins over "rushing"
 * and "touchdown passes" wins over "touchdown".
 */
export const STAT_ALIASES: Array<{ alias: string; statId: string }> = FOOTBALL_STATS
  .flatMap((s) => s.aliases.map((alias) => ({ alias, statId: s.id })))
  // "of" and "completed" are too greedy for free-text scanning; the extractor
  // reaches for them only inside an explicit completion pattern.
  .filter((a) => a.statId !== "completions")
  .sort((a, b) => b.alias.length - a.alias.length);

/** How much a single line matters when choosing who leads the coverage. */
export function performanceScore(stats: Record<string, { amount: number }>): number {
  let score = 0;
  for (const [id, v] of Object.entries(stats)) {
    const def = BY_ID.get(id);
    if (!def) continue;
    const milestoneBonus = def.milestone && v.amount >= def.milestone ? 25 : 0;
    // Yardage stats are large numbers; counted stats are small. Normalize.
    const magnitude = def.countNoun ? Math.min(v.amount * 12, 60) : Math.min(v.amount / 3, 60);
    score += (def.weight / 100) * magnitude + milestoneBonus;
  }
  return Math.round(score);
}

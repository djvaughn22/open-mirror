// ─────────────────────────────────────────────────────────────────────────────
// The sports the wire knows how to talk about.
//
// A sport is listed here only when a permitted source actually carries results
// for it. The feed shows a filter for a sport only when events exist, so this
// table never promises coverage we do not have.
// ─────────────────────────────────────────────────────────────────────────────

import type { SportId, SportMeta } from "./types.ts";

export const SPORTS: SportMeta[] = [
  { id: "football", label: "Football", season: "fall", scoreNoun: "points" },
  { id: "boys-soccer", label: "Boys Soccer", season: "fall", scoreNoun: "goals" },
  { id: "girls-soccer", label: "Girls Soccer", season: "spring", scoreNoun: "goals" },
  { id: "girls-volleyball", label: "Girls Volleyball", season: "fall", setScored: true, scoreNoun: "sets" },
  { id: "boys-volleyball", label: "Boys Volleyball", season: "spring", setScored: true, scoreNoun: "sets" },
  { id: "field-hockey", label: "Field Hockey", season: "fall", scoreNoun: "goals" },
  { id: "boys-swimming", label: "Boys Swimming & Diving", season: "winter", scoreNoun: "points" },
  { id: "girls-swimming", label: "Girls Swimming & Diving", season: "fall", scoreNoun: "points" },
  { id: "boys-cross-country", label: "Boys Cross Country", season: "fall", scoreNoun: "points" },
  { id: "girls-cross-country", label: "Girls Cross Country", season: "fall", scoreNoun: "points" },
  { id: "boys-golf", label: "Boys Golf", season: "spring", scoreNoun: "strokes" },
  { id: "girls-golf", label: "Girls Golf", season: "fall", scoreNoun: "strokes" },
  { id: "boys-tennis", label: "Boys Tennis", season: "spring", setScored: true, scoreNoun: "points" },
  { id: "girls-tennis", label: "Girls Tennis", season: "fall", setScored: true, scoreNoun: "points" },
  { id: "girls-softball", label: "Softball", season: "fall", scoreNoun: "runs" },
  { id: "baseball", label: "Baseball", season: "spring", scoreNoun: "runs" },
  { id: "boys-basketball", label: "Boys Basketball", season: "winter", scoreNoun: "points" },
  { id: "girls-basketball", label: "Girls Basketball", season: "winter", scoreNoun: "points" },
  { id: "ice-hockey", label: "Ice Hockey", season: "winter", scoreNoun: "goals" },
  { id: "wrestling", label: "Wrestling", season: "winter", scoreNoun: "points" },
  { id: "water-polo", label: "Water Polo", season: "spring", scoreNoun: "goals" },
];

const BY_ID = new Map(SPORTS.map((s) => [s.id, s]));

export function sportMeta(id: SportId): SportMeta | undefined {
  return BY_ID.get(id);
}

export function sportLabel(id: SportId): string {
  return BY_ID.get(id)?.label ?? id;
}

/**
 * Map a source's own wording onto a canonical sport.
 *
 * Deliberately conservative: an unrecognised label returns undefined and the
 * observation is dropped with a note rather than guessed into the wrong sport.
 * The gender prefix matters — "soccer" on a girls' team page is not the same
 * event stream as "soccer" on a boys' page, and merging them would be a lie.
 */
export function resolveSport(label: string, hints: string[] = [], genderContext?: "boys" | "girls"): SportId | undefined {
  const text = [label, ...hints].join(" ").toLowerCase().replace(/[^a-z ]+/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return undefined;

  // A single-sex school writes "Soccer", not "Boys Soccer", because on its own
  // site there is no ambiguity. The school registry supplies that context so we
  // do not have to either drop the game or guess at the wrong sport.
  const girls = /\b(girls?|womens?|female|lady)\b/.test(text) || (genderContext === "girls" && !/\b(boys?|mens?|male)\b/.test(text));
  const boys = /\b(boys?|mens?|male)\b/.test(text) || (genderContext === "boys" && !/\b(girls?|womens?|female|lady)\b/.test(text));

  const gendered = (base: string): SportId | undefined => {
    if (girls) return `girls-${base}` as SportId;
    if (boys) return `boys-${base}` as SportId;
    return undefined;
  };

  if (/\bfootball\b/.test(text)) {
    // Girls flag football is a different sport from 11-man football. We do not
    // yet carry it, so it is dropped rather than folded in.
    if (/\bflag\b/.test(text)) return undefined;
    return "football";
  }
  if (/\bsoccer\b/.test(text)) return gendered("soccer");
  if (/\bvolleyball\b/.test(text)) return gendered("volleyball");
  if (/\bfield hockey\b/.test(text)) return "field-hockey";
  if (/\bice hockey\b|\bhockey\b/.test(text)) return "ice-hockey";
  if (/\bcross country\b|\bxc\b/.test(text)) return gendered("cross-country");
  if (/\bswim/.test(text) || /\bdiving\b/.test(text)) return gendered("swimming");
  if (/\bgolf\b/.test(text)) return gendered("golf");
  if (/\btennis\b/.test(text)) return gendered("tennis");
  if (/\bsoftball\b/.test(text)) return "girls-softball";
  if (/\bbaseball\b/.test(text)) return "baseball";
  if (/\bbasketball\b/.test(text)) return gendered("basketball");
  if (/\bwrestl/.test(text)) return "wrestling";
  if (/\bwater polo\b/.test(text)) return "water-polo";
  return undefined;
}

/**
 * MVP 1 covers varsity only. Anything that names a lower level is dropped, and
 * an unlabelled team is treated as varsity because that is how school sites
 * label their top team — they qualify the others.
 */
export function isVarsity(levelLabel: string | undefined): boolean {
  if (!levelLabel) return true;
  // Sites write the same level a dozen ways — "JV", "Jr Varsity", "C-Team",
  // "Freshman B". Separators are flattened first so the word boundaries below
  // actually bite; without this, "C-Team" reads as varsity and a sophomore
  // result lands in the city feed as if it were Friday night's game.
  const t = ` ${levelLabel.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim()} `;
  return !/ (jv|jr varsity|junior varsity|freshman|freshmen|frosh|sophomore|soph|novice|reserve|[abc] team|team [abc]|9th|10th|middle|jr high|junior high) /.test(t);
}

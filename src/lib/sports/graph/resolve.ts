// ─────────────────────────────────────────────────────────────────────────────
// School identity resolution.
//
// Sources spell the same school a dozen ways. "SLUH", "St. Louis U. High",
// "St Louis University High School" and "St. Louis U High" are one place.
// "Lutheran North" and "Lutheran South" are two, and nothing in this file is
// allowed to merge them.
//
// The rule that makes this safe: WHEN IN DOUBT, LEAVE IT UNRESOLVED.
// An unresolved name lands on the review desk and becomes an alias a human
// approved. A wrong merge silently corrupts every record, streak and standing
// downstream, and nobody notices for weeks. Only one of those is recoverable.
// ─────────────────────────────────────────────────────────────────────────────

import type { School, SchoolRef } from "./types.ts";

/**
 * Strip a school name down to the part that identifies it.
 *
 * Removes punctuation, expands "St."/"Mt.", and drops the suffixes every source
 * adds or omits at random ("High School", "HS", "Senior High", "Academy" is
 * kept because it distinguishes real schools).
 */
export function normalizeSchoolName(raw: string): string {
  let t = ` ${raw.toLowerCase()} `;
  t = t.replace(/[’']/g, "").replace(/[.,]/g, " ").replace(/[-–—/]/g, " ");
  t = t.replace(/&/g, " and ");
  t = t.replace(/\bst\b/g, "saint").replace(/\bste\b/g, "sainte").replace(/\bmt\b/g, "mount");
  t = t.replace(/\bsr\b/g, "senior").replace(/\bjr\b/g, "junior");
  t = t.replace(/\bacad\b/g, "academy");
  t = t.replace(/\bcath\b/g, "catholic").replace(/\bchr\b/g, "christian");
  t = t.replace(/\bco op\b|\bcoop\b/g, " ");
  // "H.S." arrives as "h s" once the periods are gone; rejoin it so the suffix
  // stripper below recognises it.
  t = t.replace(/\bh s\b/g, "hs");
  // Suffixes that carry no identity. "Academy", "Prep" and "College" are NOT
  // in this list: they separate real, distinct schools in this metro.
  // "Oakville", "Oakville High School" and "Oakville Sr. High School" are one
  // school. "Senior" has to go too — leaving it in cost thirteen observations
  // of a real school that the registry already knew about.
  t = t.replace(/\b(high school|highschool|high|hs|senior high|sr high|school|schools|senior)\b/g, " ");
  return t.replace(/\s+/g, " ").trim();
}

/** Compact key used for exact matching after normalization. */
function key(raw: string): string {
  return normalizeSchoolName(raw).replace(/\s+/g, "");
}

export interface SchoolIndex {
  byId: Map<string, School>;
  /** Normalized key → school ids. More than one id means the key is ambiguous. */
  byKey: Map<string, string[]>;
  schools: School[];
}

export function buildSchoolIndex(schools: School[]): SchoolIndex {
  const byId = new Map<string, School>();
  const byKey = new Map<string, string[]>();

  const add = (k: string, id: string) => {
    if (!k) return;
    const list = byKey.get(k) ?? [];
    if (!list.includes(id)) list.push(id);
    byKey.set(k, list);
  };

  for (const school of schools) {
    byId.set(school.id, school);
    add(key(school.name), school.id);
    add(key(school.shortName), school.id);
    for (const alias of school.aliases) add(key(alias), school.id);
  }
  return { byId, byKey, schools };
}

export type ResolutionReason =
  | "exact"
  | "alias"
  | "unique-prefix"
  | "ambiguous"
  | "no-match"
  | "empty";

export interface Resolution {
  school?: School;
  reason: ResolutionReason;
  /** Every school the name could have meant. Non-empty only when ambiguous. */
  candidates: string[];
}

/**
 * Words that mean "this is a different team at the same school", not a school.
 * They are stripped before matching so "Kirkwood JV" still finds Kirkwood — the
 * level filter, not the resolver, decides whether to keep it.
 */
const TEAM_QUALIFIERS =
  /\b(varsity|jv|junior varsity|freshman|frosh|sophomore|soph|boys?|girls?|mens?|womens?|a team|b team|c team|red|white|blue|gold|black|green)\b/g;

/**
 * Resolve one source-supplied name to a canonical school.
 *
 * Three tiers, each strictly safer than a fuzzy score:
 *   1. exact match on the normalized name, short name or a registered alias
 *   2. the same after stripping team qualifiers
 *   3. a unique whole-word prefix match — "Belleville East" only resolves if
 *      exactly one school starts that way, so "Belleville" alone stays unresolved
 *      while both Belleville East and Belleville West exist.
 *
 * There is deliberately no edit-distance fallback. Similar names in this metro
 * are usually genuinely different schools.
 */
export function resolveSchool(rawName: string, index: SchoolIndex): Resolution {
  const raw = (rawName ?? "").trim();
  if (!raw) return { reason: "empty", candidates: [] };

  const direct = index.byKey.get(key(raw));
  if (direct) {
    if (direct.length === 1) return { school: index.byId.get(direct[0]), reason: "exact", candidates: direct };
    return { reason: "ambiguous", candidates: direct };
  }

  const stripped = normalizeSchoolName(raw).replace(TEAM_QUALIFIERS, " ").replace(/\s+/g, " ").trim();
  if (stripped && stripped !== normalizeSchoolName(raw)) {
    const hit = index.byKey.get(stripped.replace(/\s+/g, ""));
    if (hit) {
      if (hit.length === 1) return { school: index.byId.get(hit[0]), reason: "alias", candidates: hit };
      return { reason: "ambiguous", candidates: hit };
    }
  }

  // Unique whole-word prefix. Guarded hard: a one-word query only counts when
  // it is the school's entire identifying name, which the exact tier already
  // covers, so this tier never turns "Lutheran" into "Lutheran North".
  const query = stripped || normalizeSchoolName(raw);
  const words = query.split(" ").filter(Boolean);
  if (words.length >= 2) {
    const matches = index.schools.filter((s) => {
      const candidates = [s.name, s.shortName, ...s.aliases].map((n) => normalizeSchoolName(n));
      return candidates.some((c) => {
        const cw = c.split(" ").filter(Boolean);
        if (cw.length < words.length) return false;
        return words.every((w, i) => cw[i] === w);
      });
    });
    const ids = [...new Set(matches.map((m) => m.id))];
    if (ids.length === 1) return { school: index.byId.get(ids[0]), reason: "unique-prefix", candidates: ids };
    if (ids.length > 1) return { reason: "ambiguous", candidates: ids };
  }

  return { reason: "no-match", candidates: [] };
}

/** Convenience: resolve and keep the string the source used, for provenance. */
export function resolveRef(rawName: string, index: SchoolIndex): SchoolRef | undefined {
  const r = resolveSchool(rawName, index);
  if (!r.school) return undefined;
  return { schoolId: r.school.id, reportedAs: rawName.trim() };
}

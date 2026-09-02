// What the report form offers, derived from real data rather than a static list.

import { SPORTS, sportLabel } from "../graph/sports.ts";
import { ST_LOUIS } from "../metros/stLouis.ts";
import type { CanonicalEvent, SportId } from "../graph/types.ts";

export interface ReportOption {
  id: string;
  label: string;
}

/**
 * Sports offered to a reporter.
 *
 * Sports this school has actually been seen playing come first, because that is
 * almost always the answer; the rest follow so a school reporting a sport we
 * have never tracked is not blocked by our own ignorance.
 */
export function sportOptionsFor(schoolId: string, events: CanonicalEvent[]): ReportOption[] {
  const seen = new Set<SportId>();
  for (const e of events) {
    if (e.sides.some((s) => s.schoolId === schoolId)) seen.add(e.sport);
  }
  const known = SPORTS.filter((s) => seen.has(s.id)).map((s) => ({ id: s.id, label: s.label }));
  const rest = SPORTS.filter((s) => !seen.has(s.id)).map((s) => ({ id: s.id, label: s.label }));
  return [...known, ...rest];
}

/** Every school in the metro, so the opponent box can autocomplete. */
export function opponentOptions(excludeSchoolId?: string): ReportOption[] {
  return ST_LOUIS.schools
    .filter((s) => s.id !== excludeSchoolId)
    .map((s) => ({ id: s.id, label: s.name }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function schoolOptions(): ReportOption[] {
  return ST_LOUIS.schools.map((s) => ({ id: s.id, label: s.name })).sort((a, b) => a.label.localeCompare(b.label));
}

export { sportLabel };

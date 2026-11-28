// Helpers the Learning pages share: which resources belong to a subject, in
// what order, and why. The order is documented and has nothing to do with
// money (there are no affiliate links in Learning):
//   1. Made for this exact subject before discipline-wide sources.
//   2. Easier first ("start", then "any", then "deeper").
//   3. Free with no account before free with an account.
//   4. Open-licensed and public sources before free-to-read ones.
//   5. Our own free tools last within a tie, so outside sources lead.
// Every entry is a checked, working link (resources.ts).

import { RESOURCES, type Resource, type PathwayId } from "./resources.ts";
import { DISCIPLINES, type Subject } from "./taxonomy.ts";

const LEVEL_RANK = { start: 0, any: 1, deeper: 2 } as const;
const COST_RANK = { free: 0, "free-account": 1, "free-paid-cert": 2, "free-paid-exam": 3, "free-limited": 4 } as const;
const LICENSE_RANK = { open: 0, gov: 0, free: 1 } as const;

export function rankResources(list: { r: Resource; exact: boolean }[]): Resource[] {
  return [...list]
    .sort((a, b) =>
      Number(b.exact) - Number(a.exact) ||
      LEVEL_RANK[a.r.level] - LEVEL_RANK[b.r.level] ||
      COST_RANK[a.r.cost] - COST_RANK[b.r.cost] ||
      LICENSE_RANK[a.r.license] - LICENSE_RANK[b.r.license] ||
      Number(!!a.r.ours) - Number(!!b.r.ours) ||
      a.r.title.localeCompare(b.r.title),
    )
    .map((x) => x.r);
}

/** Resources for one subject: its own first, then its discipline's. */
export function resourcesFor(subject: Pick<Subject, "slug">, discipline: string): Resource[] {
  const exact = RESOURCES.filter((r) => r.subjects?.includes(subject.slug)).map((r) => ({ r, exact: true }));
  const broad = RESOURCES.filter((r) => !r.subjects?.includes(subject.slug) && r.disciplines?.includes(discipline)).map((r) => ({ r, exact: false }));
  return rankResources([...exact, ...broad]);
}

/** Resources picked for a reason to learn. */
export function resourcesForPath(path: PathwayId): Resource[] {
  return rankResources(RESOURCES.filter((r) => r.paths?.includes(path)).map((r) => ({ r, exact: true })));
}

/** The night every outside link in Learning was last opened (see resources.ts `checked`). */
export const CHECKED_ON = "November 27, 2026";

export function subjectCount(): number {
  return DISCIPLINES.reduce((n, d) => n + d.subjects.length, 0);
}

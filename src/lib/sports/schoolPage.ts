// ─────────────────────────────────────────────────────────────────────────────
// One school's automatic sports desk.
//
// This is the page a coach sees thirty seconds after reporting a score, and it
// is the reason they report the next one. So it has to look like coverage, not
// like a database view.
//
// The discipline that makes it trustworthy: everything here is counted from
// events we actually hold, and it says so. We do not know a school's real
// season record — we know the record in games we tracked, which is a different
// and much smaller claim. Printing the first as if it were the second is the
// fastest way to lose a school's trust, and they would be right to go.
// ─────────────────────────────────────────────────────────────────────────────

import { buildBrief, type Brief } from "./brief.ts";
import { sportLabel } from "./graph/sports.ts";
import { findMetroStories } from "./metroStories.ts";
import { ST_LOUIS } from "./metros/stLouis.ts";
import { hasScore, isTie, winnerOf, type CanonicalEvent, type School, type SportId } from "./graph/types.ts";

export interface SchoolResult {
  event: CanonicalEvent;
  brief: Brief;
  outcome: "W" | "L" | "T";
  opponentName: string;
  /** Who reported it, in words a reader understands. Never a token or a host. */
  credits: string[];
}

export interface SchoolSportSummary {
  sport: SportId;
  label: string;
  /** Counted from stored games only. The page must say so. */
  wins: number;
  losses: number;
  ties: number;
  games: number;
}

export interface SchoolPageData {
  school: School;
  results: SchoolResult[];
  upcoming: Array<{ event: CanonicalEvent; opponentName: string; date: string }>;
  sports: SchoolSportSummary[];
  totalTracked: number;
  lastUpdated?: string;
}

const SCHOOLS = new Map(ST_LOUIS.schools.map((s) => [s.id, s]));

export function schoolById(id: string): School | undefined {
  return SCHOOLS.get(id);
}

/** Every school we hold at least one event for — the ones worth a page. */
export function schoolsWithCoverage(events: CanonicalEvent[]): Array<{ school: School; games: number }> {
  const counts = new Map<string, number>();
  for (const e of events) {
    if (!e.publishable) continue;
    for (const side of e.sides) counts.set(side.schoolId, (counts.get(side.schoolId) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([id, games]) => ({ school: SCHOOLS.get(id), games }))
    .filter((x): x is { school: School; games: number } => Boolean(x.school))
    .sort((a, b) => b.games - a.games || a.school.name.localeCompare(b.school.name));
}

/**
 * A human credit line for each account behind an event.
 *
 * A school that reported its own final is named as the school. A crawled page
 * is credited to the school that published it. Neither exposes a vendor host,
 * a source id, or anything about a credential.
 */
export function creditsFor(event: CanonicalEvent, schools: Map<string, School>): string[] {
  const out = new Set<string>();
  for (const o of event.observations) {
    const name = schools.get(o.reporter.schoolId)?.shortName ?? o.reporter.reportedAs;
    if (o.sourceId.startsWith("submission-authorized:")) out.add(`${name} Athletics`);
    else if (o.sourceId.startsWith("submission-public:")) out.add("Community report");
    else if (o.sourceId.startsWith("submission-operator:")) out.add("Open Mirror desk");
    else out.add(name);
  }
  return [...out];
}

export function buildSchoolPage(schoolId: string, allEvents: CanonicalEvent[], today: string): SchoolPageData | undefined {
  const school = SCHOOLS.get(schoolId);
  if (!school) return undefined;

  const schools = SCHOOLS;
  const mine = allEvents.filter((e) => e.sides.some((s) => s.schoolId === schoolId));
  const published = mine.filter((e) => e.publishable && e.status === "final" && hasScore(e));

  const opponentOf = (e: CanonicalEvent) => {
    const other = e.sides.find((s) => s.schoolId !== schoolId);
    return schools.get(other?.schoolId ?? "")?.shortName ?? other?.schoolId.replace(/^unresolved:/, "") ?? "";
  };

  const results: SchoolResult[] = published
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
    .slice(0, 20)
    .map((event) => ({
      event,
      brief: buildBrief({
        event,
        schools,
        discoveries: findMetroStories({ event, archive: published, schools }),
        today,
      }),
      outcome: isTie(event) ? "T" : winnerOf(event)?.schoolId === schoolId ? "W" : "L",
      opponentName: opponentOf(event),
      credits: creditsFor(event, schools),
    }));

  const bySport = new Map<SportId, SchoolSportSummary>();
  for (const e of published) {
    const s = bySport.get(e.sport) ?? { sport: e.sport, label: sportLabel(e.sport), wins: 0, losses: 0, ties: 0, games: 0 };
    s.games += 1;
    if (isTie(e)) s.ties += 1;
    else if (winnerOf(e)?.schoolId === schoolId) s.wins += 1;
    else s.losses += 1;
    bySport.set(e.sport, s);
  }

  const upcoming = mine
    .filter((e) => e.status === "scheduled" && e.date >= today && e.confidence !== "unresolved")
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .slice(0, 6)
    .map((event) => ({ event, opponentName: opponentOf(event), date: event.date }));

  return {
    school,
    results,
    upcoming,
    sports: [...bySport.values()].sort((a, b) => b.games - a.games || a.label.localeCompare(b.label)),
    totalTracked: published.length,
    lastUpdated: mine.flatMap((e) => e.observations.map((o) => o.fetchedAt)).sort().slice(-1)[0],
  };
}

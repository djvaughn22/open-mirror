// ─────────────────────────────────────────────────────────────────────────────
// St. Louis. The first metro, and the shape every later one copies.
//
// Everything specific to this city is here: which schools exist, and which
// pages we are permitted to read. Adding Kansas City later means writing a file
// like this one — not touching the engine, the feed or the writer.
//
// WHY THESE PAGES AND NOT OTHERS
// The team pages below are first-party: each school publishing its own results
// on its own site. Before any host was added its robots.txt was read and its
// crawl delay honoured, and each URL was confirmed by hand to serve a
// server-rendered schedule table. Sources deliberately NOT automated, and why,
// are recorded in docs/SPORTS_SOURCES.md — the short version is that MSHSAA
// disallows crawlers outright and IHSA's scoreboard republishes MaxPreps.
// ─────────────────────────────────────────────────────────────────────────────

import { ST_LOUIS_SCHOOLS } from "./stLouisSchools.ts";
import type { MetroConfig } from "./types.ts";
import type { FinalsiteTeamPage } from "../sources/finalsiteAthletics.ts";

/**
 * One entry per page we read. A school's athletics landing page lists every
 * team at once, so it is preferred: one polite request covers every sport that
 * school plays. Per-sport pages are listed only where the landing page does not
 * carry results.
 */
const TEAM_PAGES: FinalsiteTeamPage[] = [
  { schoolId: "sluh", schoolName: "SLUH", url: "https://www.sluh.org/athletics/teams-schedules" },
  { schoolId: "sluh", schoolName: "SLUH", url: "https://www.sluh.org/athletics/teams-schedules/football", sportHint: "football" },
  { schoolId: "sluh", schoolName: "SLUH", url: "https://www.sluh.org/athletics/teams-schedules/soccer", sportHint: "soccer" },
  { schoolId: "de-smet", schoolName: "De Smet Jesuit", url: "https://www.desmet.org/athletics/teams/football", sportHint: "football" },
  { schoolId: "de-smet", schoolName: "De Smet Jesuit", url: "https://www.desmet.org/athletics/teams/soccer", sportHint: "soccer" },
  { schoolId: "priory", schoolName: "Priory", url: "https://www.priory.org/athletics/sports/soccer", sportHint: "soccer" },
  { schoolId: "priory", schoolName: "Priory", url: "https://www.priory.org/athletics/sports/football", sportHint: "football" },
];

export const ST_LOUIS: MetroConfig = {
  id: "st-louis",
  name: "St. Louis",
  displayName: "St. Louis High School Sports",
  timezone: "America/Chicago",
  states: ["MO", "IL"],
  schools: ST_LOUIS_SCHOOLS,
  sources: { finalsiteTeamPages: TEAM_PAGES },
};

export const METROS: Record<string, MetroConfig> = { "st-louis": ST_LOUIS };

export function metroById(id: string): MetroConfig | undefined {
  return METROS[id];
}

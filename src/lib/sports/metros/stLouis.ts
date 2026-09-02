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
import type { EventLinkSchool } from "../sources/eventlink.ts";
import type { FinalsiteTeamPage } from "../sources/finalsiteAthletics.ts";
import type { MascotMediaTeamPage } from "../sources/mascotMedia.ts";

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
  { schoolId: "vianney", schoolName: "St. John Vianney", url: "https://www.vianney.com/athletics" },
];

/**
 * EventLink is what most of St. Louis actually runs on, so this is where the
 * breadth comes from — but it carries no scores. These schools contribute
 * fixtures: who played whom, when, and who hosted. That corroborates a score
 * reported elsewhere and fills the schedule rail; it never publishes a result
 * on its own.
 */
const EVENTLINK_SCHOOLS: EventLinkSchool[] = [
  { schoolId: "brentwood", schoolName: "Brentwood", slug: "brentwood-eagles" },
  { schoolId: "chaminade", schoolName: "Chaminade", slug: "chaminade-college-preparatory-school" },
  { schoolId: "clayton", schoolName: "Clayton", slug: "clayton-high-school" },
  { schoolId: "duchesne", schoolName: "Duchesne", slug: "duchesne-pioneers" },
  { schoolId: "eureka", schoolName: "Eureka", slug: "eureka-sr-high-school" },
  { schoolId: "fox", schoolName: "Fox", slug: "fox-high-school" },
  { schoolId: "francis-howell", schoolName: "Francis Howell", slug: "francis-howell-high-school" },
  { schoolId: "francis-howell-central", schoolName: "Francis Howell Central", slug: "francis-howell-central-high-school" },
  { schoolId: "francis-howell-north", schoolName: "Francis Howell North", slug: "francis-howell-north-high-school" },
  { schoolId: "hazelwood-central", schoolName: "Hazelwood Central", slug: "hazelwood-central-high-school" },
  { schoolId: "hazelwood-east", schoolName: "Hazelwood East", slug: "hazelwood-east-high-school" },
  { schoolId: "hazelwood-west", schoolName: "Hazelwood West", slug: "hazelwood-west-high-school" },
  { schoolId: "ladue", schoolName: "Ladue", slug: "ladue-horton-watkins-high-school" },
  { schoolId: "lindbergh", schoolName: "Lindbergh", slug: "lindbergh-high-school" },
  { schoolId: "lutheran-south", schoolName: "Lutheran South", slug: "lutheran-high-school-south" },
  { schoolId: "maplewood-rh", schoolName: "Maplewood Richmond Heights", slug: "maplewood-richmond-heights-high-school" },
  { schoolId: "marquette", schoolName: "Marquette", slug: "marquette-high-school" },
  { schoolId: "mehlville", schoolName: "Mehlville", slug: "mehlville-high-school" },
  { schoolId: "parkway-central", schoolName: "Parkway Central", slug: "parkway-central-high-school" },
  { schoolId: "parkway-north", schoolName: "Parkway North", slug: "parkway-north-high-school" },
  { schoolId: "parkway-south", schoolName: "Parkway South", slug: "parkway-south-high-school" },
  { schoolId: "parkway-west", schoolName: "Parkway West", slug: "parkway-west-high-school" },
  { schoolId: "st-charles", schoolName: "St. Charles", slug: "st-charles-high-school" },
  { schoolId: "university-city", schoolName: "University City", slug: "university-city-high-school" },
  { schoolId: "vianney", schoolName: "St. John Vianney", slug: "st-john-vianney-high-school" },
  { schoolId: "washington", schoolName: "Washington", slug: "washington-high-school" },
  { schoolId: "webster-groves", schoolName: "Webster Groves", slug: "wghs" },
];

/**
 * Mascot Media sites publish full results — score, W/L, venue — with sport,
 * gender and level all stated outright. Fewer schools than EventLink, but these
 * are the ones that can actually produce a brief.
 */
const MASCOT_PAGES: MascotMediaTeamPage[] = [
  ...["football/boys", "soccer/boys", "field hockey/girls", "volleyball/girls", "swimming and diving/girls", "cross country/girls", "cross country/boys", "golf/girls", "tennis/girls"].map(
    (sport) => ({ schoolId: "micds", schoolName: "MICDS", url: `https://www.micdsathletics.com/sport/${sport}/?tab=schedule` }),
  ),
  ...["football/boys", "soccer/boys", "volleyball/girls", "softball/girls", "golf/girls", "tennis/girls", "cross country/coed"].map(
    (sport) => ({ schoolId: "collinsville", schoolName: "Collinsville", url: `https://www.kahokathletics.com/sport/${sport}/?tab=schedule` }),
  ),
];

export const ST_LOUIS: MetroConfig = {
  id: "st-louis",
  name: "St. Louis",
  displayName: "St. Louis High School Sports",
  timezone: "America/Chicago",
  states: ["MO", "IL"],
  schools: ST_LOUIS_SCHOOLS,
  sources: {
    finalsiteTeamPages: TEAM_PAGES,
    eventLinkSchools: EVENTLINK_SCHOOLS,
    mascotMediaPages: MASCOT_PAGES,
  },
};

export const METROS: Record<string, MetroConfig> = { "st-louis": ST_LOUIS };

export function metroById(id: string): MetroConfig | undefined {
  return METROS[id];
}

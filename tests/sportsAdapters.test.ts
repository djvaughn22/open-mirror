// ─────────────────────────────────────────────────────────────────────────────
// Coverage-expansion adapter tests.
//
// The Sprint 2 suite locks the pipeline. This one locks the two platforms that
// made the pipeline worth scaling, and specifically the mistakes each one is
// capable of causing:
//
//   EventLink   — carries NO scores. If an observation from it ever arrives
//                 with a result, an unplayed game reaches the feed.
//   MascotMedia — prints a date with no year, and heads the page with a banner
//                 on one site and the sport on another. Both cost real data
//                 before they were caught.
//
// Fixtures only. Nothing here touches the network.
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { buildBrief } from "../src/lib/sports/brief.ts";
import { reconcile } from "../src/lib/sports/graph/confidence.ts";
import { buildSocialPost } from "../src/lib/sports/social.ts";
import { isNonMatchupOpponent, normalizeObservations } from "../src/lib/sports/graph/normalize.ts";
import { memoryEventStore } from "../src/lib/sports/graph/eventStore.ts";
import { buildSchoolIndex, resolveSchool } from "../src/lib/sports/graph/resolve.ts";
import { ingestMetro } from "../src/lib/sports/ingest.ts";
import { ST_LOUIS } from "../src/lib/sports/metros/stLouis.ts";
import { politeFetcher } from "../src/lib/sports/sources/http.ts";
import { ST_LOUIS_SCHOOLS } from "../src/lib/sports/metros/stLouisSchools.ts";
import { parseFinalsiteScoreList } from "../src/lib/sports/sources/finalsiteAthletics.ts";
import {
  eventsUrl,
  expandLevel,
  parseEventLinkEvents,
  splitCalendarTitle,
} from "../src/lib/sports/sources/eventlink.ts";
import {
  cancellationOf,
  pageSport,
  parseMascotMediaPage,
  parseMonthDay,
  parseResultCell,
  selectedLevel,
  selectedSeason,
  stripTournamentPrefix,
  yearForMonth,
} from "../src/lib/sports/sources/mascotMedia.ts";

const fixture = (name: string) => readFileSync(join(process.cwd(), "tests", "fixtures", name), "utf8");
const EVENTLINK = fixture("eventlink-events.json");
const MASCOT = fixture("mascot-collinsville-football.html");
const INDEX = buildSchoolIndex(ST_LOUIS_SCHOOLS);
const NOW = "2026-09-01T12:00:00.000Z";

// ── EventLink ───────────────────────────────────────────────────────────────

const eventlinkObs = () =>
  parseEventLinkEvents(EVENTLINK, {
    school: { schoolId: "eureka", schoolName: "Eureka", slug: "eureka-sr-high-school" },
    fetchedAt: NOW,
    since: "2026-08-01",
    until: "2026-12-31",
  });

test("EventLink observations never carry a result, because EventLink has none", () => {
  const observations = eventlinkObs();
  assert.ok(observations.length > 0, "the fixture yields fixtures");
  for (const o of observations) {
    assert.equal(o.result, undefined, "a calendar cannot report a result");
    assert.equal(o.scoreFor, undefined);
    assert.equal(o.scoreAgainst, undefined);
  }
});

test("EventLink fixtures normalize to scheduled events that can never publish", () => {
  const { observations } = normalizeObservations(eventlinkObs(), INDEX);
  for (const o of observations) assert.equal(o.status, "scheduled");

  const events = reconcile(observations, { metro: "st-louis", now: NOW });
  for (const e of events) {
    assert.equal(e.publishable, false, "a game with no score is a listing, not a story");
    assert.deepEqual(e.scoreSourceIds, [], "a calendar source never corroborates a score");
  }
});

test("EventLink cancellations and non-games are dropped", () => {
  const observations = eventlinkObs();
  assert.ok(
    !observations.some((o) => /cancelled opponent/i.test(o.opponent)),
    "a cancelled game was not played",
  );
  assert.ok(!observations.some((o) => /practice/i.test(o.opponent)), "a practice is not a game");
});

test("EventLink calendar titles split into a sport the resolver can read", () => {
  assert.deepEqual(splitCalendarTitle("Tennis (Girls V)"), { sportLabel: "Girls Tennis", levelLabel: "V" });
  assert.deepEqual(splitCalendarTitle("Football (Boys JV)"), { sportLabel: "Boys Football", levelLabel: "JV" });
  // A bare level with no gender still yields the sport.
  assert.equal(splitCalendarTitle("Softball (V)").sportLabel, "Softball");
});

test("EventLink level codes expand so the varsity filter can act on them", () => {
  assert.equal(expandLevel("V"), "Varsity");
  assert.equal(expandLevel("JV"), "Junior Varsity");
  assert.equal(expandLevel("9th"), "Freshman");
  // Anything unrecognised passes through rather than being assumed varsity.
  assert.equal(expandLevel("Gold"), "Gold");
  assert.equal(expandLevel(undefined), undefined);
});

test("the EventLink URL asks for exactly the requested window", () => {
  const url = eventsUrl("eureka-sr-high-school", "2026-08-20", "2026-09-08");
  assert.match(url, /handler=Events/);
  assert.match(url, /2026-08-20T00%3A00%3A00\.000Z/);
  assert.match(url, /2026-09-08T23%3A59%3A59\.999Z/);
});

// ── Mascot Media ────────────────────────────────────────────────────────────

test("a Mascot Media page parses into dated results", () => {
  const observations = parseMascotMediaPage(MASCOT, {
    page: {
      schoolId: "collinsville",
      schoolName: "Collinsville",
      url: "https://www.kahokathletics.com/sport/football/boys/?tab=schedule",
    },
    fetchedAt: NOW,
    since: "2026-08-01",
    until: "2026-12-31",
  });

  assert.ok(observations.length > 0);
  const played = observations.find((o) => o.scoreFor !== undefined);
  assert.ok(played, "the fixture contains a completed game");
  // The year is not printed anywhere in the row — it comes from the season.
  assert.match(played.date, /^2026-\d{2}-\d{2}$/);
  assert.equal(played.sportLabel, "boys football");
  assert.equal(played.levelLabel, "Varsity");
  assert.ok(played.result === "W" || played.result === "L" || played.result === "T");
});

test("the sport comes from the URL, not the page heading", () => {
  // Collinsville heads the page "BOYS FOOTBALL"; MICDS heads it "THE OFFICIAL
  // SITE OF MICDS Athletics". Trusting the heading dropped every MICDS result.
  assert.equal(pageSport("https://x.test/sport/football/boys/?tab=schedule", ""), "boys football");
  assert.equal(pageSport("https://x.test/sport/field%20hockey/girls/", ""), "girls field hockey");
  // "coed" is not a gender the sport resolver should have to ignore.
  assert.equal(pageSport("https://x.test/sport/cross%20country/coed/", ""), "cross country");
  // A banner heading with no URL sport resolves to nothing rather than garbage.
  assert.equal(pageSport("https://x.test/", "<h1>THE OFFICIAL SITE OF MICDS Athletics</h1>"), undefined);
});

test("a year is derived from the season, not from today", () => {
  // A school year runs July to June, so the month decides which half.
  assert.equal(yearForMonth("2026-2027", 8), 2026);
  assert.equal(yearForMonth("2026-2027", 12), 2026);
  assert.equal(yearForMonth("2026-2027", 1), 2027);
  assert.equal(yearForMonth("2026-2027", 5), 2027);
  assert.equal(yearForMonth("nonsense", 8), undefined);
});

test("dates and result cells are read strictly, or not at all", () => {
  assert.deepEqual(parseMonthDay("Aug 21 / 7:00 PM"), { month: 8, day: 21 });
  assert.deepEqual(parseMonthDay("Sep. 5"), { month: 9, day: 5 });
  assert.equal(parseMonthDay("TBD"), undefined);

  assert.deepEqual(parseResultCell("L 20 - 53"), { result: "L", scoreFor: 20, scoreAgainst: 53 });
  assert.deepEqual(parseResultCell("W 14 - 10"), { result: "W", scoreFor: 14, scoreAgainst: 10 });
  // Statuses are not scores and must not become them.
  assert.deepEqual(parseResultCell("Cancelled"), {});
  assert.deepEqual(parseResultCell(""), {});
  assert.deepEqual(parseResultCell("PPD"), {});
});

test("the season and level actually shown on the page are the ones used", () => {
  assert.equal(selectedSeason(MASCOT), "2026-2027");
  assert.equal(selectedLevel(MASCOT), "Varsity");
});

test("cancelled rows and tournament prefixes are handled, not guessed at", () => {
  assert.equal(cancellationOf("Marquette High School (CANCELED)"), true);
  assert.equal(cancellationOf("Marquette High School"), false);

  // The bracket is not the opponent; the school after the dash is.
  assert.equal(stripTournamentPrefix("Metro League Tournament - Parkway Central"), "Parkway Central");
  assert.equal(stripTournamentPrefix("Tournament - Webster Groves"), "Webster Groves");
  assert.equal(stripTournamentPrefix("Ladue Horton Watkins High School"), "Ladue Horton Watkins High School");
});

// ── The shared non-matchup filter ───────────────────────────────────────────

test("meets, brackets and venues are not opponents", () => {
  for (const name of [
    "SWC Tourney #1",
    "1st Capitol Invitational",
    "Clayton Classic",
    "1 PM Field 2",
    "Webster Scramble",
    "Arnold City Park",
    "Round Robin",
    "Parent Meeting",
    "Fleet Feet XC Kickoff",
    "Jamboree",
    // A calendar entry naming two OTHER teams is a tri-meet slot, not a game
    // this school played.
    "Clayton vs. University City",
    "Fox/Seckman",
  ]) {
    assert.equal(isNonMatchupOpponent(name), true, `"${name}" is not a school`);
  }

  // Real schools must survive the filter, including the awkward ones.
  for (const name of [
    "Parkway Central",
    "Mary Institute and St. Louis Country Day",
    "McCluer South-Berkeley",
    "St. Louis University High School",
    "Father McGivney Catholic High School",
  ]) {
    assert.equal(isNonMatchupOpponent(name), false, `"${name}" is a school`);
  }
});

test("a school named with a Sr. High suffix still resolves", () => {
  // Thirteen observations of Oakville were lost to this before it was fixed.
  assert.equal(resolveSchool("Oakville Sr. High School", INDEX).school?.id, "oakville");
  assert.equal(resolveSchool("Oakville", INDEX).school?.id, "oakville");
  assert.equal(resolveSchool("Eureka Sr High School", INDEX).school?.id, "eureka");
});

test("a bare ambiguous city name does not resolve to a metro school", () => {
  // "Columbia" is Columbia, Illinois in this metro and Columbia, Missouri
  // outside it. A tournament row that says only "Columbia" cannot be assigned.
  assert.equal(resolveSchool("Columbia", INDEX).school, undefined);
  assert.equal(resolveSchool("Columbia (IL)", INDEX).school?.id, "columbia-il");
});

// ── Mixing platforms ────────────────────────────────────────────────────────

test("a calendar source corroborates the fixture without corroborating the score", () => {
  const scoreObs = {
    sourceId: "mascot-media:kahokathletics.com",
    sourceUrl: "https://www.kahokathletics.com/sport/football/boys/?tab=schedule",
    fetchedAt: NOW,
    reportingSchool: "Collinsville",
    opponent: "Alton",
    date: "2026-08-28",
    sportLabel: "boys football",
    levelLabel: "Varsity",
    homeAway: "home" as const,
    result: "W" as const,
    scoreFor: 14,
    scoreAgainst: 10,
  };
  const calendarObs = {
    sourceId: "eventlink:alton-high-school",
    sourceUrl: "https://websites.eventlink.com/s/alton-high-school",
    fetchedAt: NOW,
    reportingSchool: "Alton",
    opponent: "Collinsville",
    date: "2026-08-28",
    sportLabel: "Boys Football",
    levelLabel: "Varsity",
    homeAway: "away" as const,
  };

  const { observations } = normalizeObservations([scoreObs, calendarObs], INDEX);
  const [event] = reconcile(observations, { metro: "st-louis", now: NOW });

  assert.equal(event.observations.length, 2, "both accounts are kept");
  assert.equal(event.sourceIds.length, 2, "two sources touched this game");
  assert.equal(event.scoreSourceIds.length, 1, "but only one of them reported a score");
  assert.equal(
    event.confidence,
    "single-source",
    "a calendar confirming the fixture must not be presented as agreement on the score",
  );
  assert.equal(event.publishable, true, "it is still publishable — one sourced score, no contradiction");
  assert.equal(event.status, "final");
});

test("the same game listed twice on one page is one account, not two", () => {
  // A school's athletics landing page shows a result under both "upcoming" and
  // "recent scores". Counting that twice pads the provenance with the same link.
  const one = {
    sourceId: "school-site-finalsite:sluh.org",
    sourceUrl: "https://www.sluh.org/athletics/teams-schedules",
    fetchedAt: NOW,
    reportingSchool: "SLUH",
    opponent: "St. Mary's",
    date: "2026-09-01",
    sportLabel: "Soccer",
    levelLabel: "Varsity",
    homeAway: "home" as const,
    result: "W" as const,
    scoreFor: 7,
    scoreAgainst: 0,
  };
  const { observations } = normalizeObservations([one, { ...one }], INDEX);
  assert.equal(observations.length, 1);
});

test("two scheduled games on consecutive days stay two games", () => {
  // A tournament series is not a date conflict. Only a result gets the
  // after-midnight tolerance.
  const base = {
    sourceId: "eventlink:marquette-high-school",
    sourceUrl: "https://websites.eventlink.com/s/marquette-high-school",
    fetchedAt: NOW,
    reportingSchool: "Marquette",
    opponent: "Rockwood Summit",
    sportLabel: "Girls Softball",
    levelLabel: "Varsity",
    homeAway: "home" as const,
  };
  const { observations } = normalizeObservations(
    [
      { ...base, date: "2026-08-28" },
      { ...base, date: "2026-08-29" },
    ],
    INDEX,
  );
  const events = reconcile(observations, { metro: "st-louis", now: NOW });
  assert.equal(events.length, 2, "two scheduled games, two events");
  for (const e of events) assert.equal(e.conflicts.length, 0, "and no invented date conflict");

  // A late-filed RESULT still merges across midnight.
  const scored = normalizeObservations(
    [
      { ...base, date: "2026-08-28", scoreFor: 5, scoreAgainst: 2, result: "W" as const },
      {
        ...base,
        sourceId: "eventlink:rockwood-summit",
        reportingSchool: "Rockwood Summit",
        opponent: "Marquette",
        homeAway: "away" as const,
        date: "2026-08-29",
        scoreFor: 2,
        scoreAgainst: 5,
        result: "L" as const,
      },
    ],
    INDEX,
  ).observations;
  assert.equal(reconcile(scored, { metro: "st-louis", now: NOW }).length, 1);
});

test("the share card never claims a score is confirmed when one source reported it", () => {
  const scoreObs = {
    sourceId: "school-site-finalsite:sluh.org",
    sourceUrl: "https://www.sluh.org/athletics/teams-schedules/football",
    fetchedAt: NOW,
    reportingSchool: "SLUH",
    opponent: "Hazelwood Central",
    date: "2026-08-28",
    sportLabel: "Football",
    levelLabel: "Varsity",
    homeAway: "home" as const,
    result: "W" as const,
    scoreFor: 43,
    scoreAgainst: 2,
  };
  const calendarObs = {
    sourceId: "eventlink:hazelwood-central-high-school",
    sourceUrl: "https://websites.eventlink.com/s/hazelwood-central-high-school",
    fetchedAt: NOW,
    reportingSchool: "Hazelwood Central",
    opponent: "St. Louis University High School",
    date: "2026-08-28",
    sportLabel: "Boys Football",
    levelLabel: "Varsity",
    homeAway: "away" as const,
  };
  const { observations } = normalizeObservations([scoreObs, calendarObs], INDEX);
  const [event] = reconcile(observations, { metro: "st-louis", now: NOW });

  const schools = new Map(ST_LOUIS_SCHOOLS.map((s) => [s.id, s]));
  const brief = buildBrief({ event, schools, discoveries: [], today: "2026-08-29" });
  const post = buildSocialPost(event, brief, schools, "https://example.test");

  assert.notEqual(post.card.kicker, "CONFIRMED FINAL", "two sources touched it; only one reported the score");
  assert.equal(post.card.corroborated, false);
  // Credits name the schools, not the vendors whose software they run on.
  assert.deepEqual([...post.card.credits].sort(), ["Hazelwood Central", "SLUH"]);
  assert.ok(!post.caption.includes("eventlink.com"));
});

// ── Finalsite's other shape: a cross-sport scores list ──────────────────────

const SCORELIST = fixture("finalsite-scorelist.html");

test("a Finalsite scores list parses the same facts a schedule table would", () => {
  const observations = parseFinalsiteScoreList(SCORELIST, {
    page: { schoolId: "de-smet", schoolName: "De Smet Jesuit", url: "https://www.desmet.org/athletics" },
    fetchedAt: NOW,
    since: "2026-08-01",
    until: "2026-12-31",
  });

  assert.ok(observations.length > 0, "the fixture yields entries");
  // This element is cross-sport: one request, several sports.
  assert.ok(new Set(observations.map((o) => o.sportLabel)).size >= 2);

  const played = observations.find((o) => o.scoreFor !== undefined);
  assert.ok(played, "at least one entry carries a result");
  assert.match(played.date, /^2026-\d{2}-\d{2}$/);

  // This widget prints no venue, and "vs." is not trustworthy on these sites,
  // so home/away must stay unknown rather than be guessed.
  for (const o of observations) assert.equal(o.homeAway, "unknown");
});

test("the scores list still respects the varsity line", () => {
  const observations = parseFinalsiteScoreList(SCORELIST, {
    page: { schoolId: "de-smet", schoolName: "De Smet Jesuit", url: "https://www.desmet.org/athletics" },
    fetchedAt: NOW,
    since: "2026-08-01",
    until: "2026-12-31",
  });
  // Labels here are undivided ("Soccer Junior Varsity"), so the level has to
  // fall back to the whole label or JV results publish as varsity.
  const { observations: normalized } = normalizeObservations(observations, INDEX);
  for (const o of normalized) {
    assert.doesNotMatch(o.raw.levelLabel ?? "", /junior varsity|sophomore|freshmen|\bjv\b/i);
  }
});

// ── Politeness and resilience ───────────────────────────────────────────────

test("a server that says 'not now' is retried; a refusal is not", async () => {
  let attempts429 = 0;
  let attempts404 = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input);
    if (url.includes("busy")) {
      attempts429 += 1;
      if (attempts429 === 1) return new Response("", { status: 429 });
      return new Response("ok", { status: 200 });
    }
    attempts404 += 1;
    return new Response("", { status: 404 });
  }) as typeof fetch;

  try {
    // crawlDelaySeconds 0 keeps the test instant; the backoff multiplies it.
    const get = politeFetcher({ crawlDelaySeconds: 0, retries: 1 });
    assert.equal(await get("https://example.test/busy"), "ok");
    assert.equal(attempts429, 2, "429 is retried once");

    await assert.rejects(() => get("https://example.test/gone"), /HTTP 404/);
    assert.equal(attempts404, 1, "a 404 means no, and is not repeated");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// ── Coverage metrics ────────────────────────────────────────────────────────

test("a direct score reporter is a school whose OWN source carried a score", async () => {
  const store = memoryEventStore();
  const metro = {
    ...ST_LOUIS,
    sources: {
      eventLinkSchools: [],
      mascotMediaPages: [],
      finalsiteTeamPages: [
        {
          schoolId: "sluh",
          schoolName: "SLUH",
          url: "https://www.sluh.org/athletics/teams-schedules/football",
          sportHint: "football",
        },
      ],
    },
  };
  const { report } = await ingestMetro({
    metro,
    since: "2026-08-01",
    until: "2026-12-31",
    now: NOW,
    store,
    fetcher: async () => readFileSync(join(process.cwd(), "tests", "fixtures", "sluh-football.html"), "utf8"),
  });

  // SLUH reported; Hazelwood Central appears on the feed but told us nothing.
  assert.deepEqual(report.directScoreReporterIds, ["sluh"]);
  assert.equal(report.directScoreReportingSchools, 1);
  assert.equal(report.schoolsWithPublishedEvents, 2, "one result names two schools");
  assert.ok(
    report.schoolsWithPublishedEvents > report.directScoreReportingSchools,
    "these two numbers must not be conflated",
  );
  assert.equal(report.completedEvents, 1);
  assert.equal(report.resultsCoverageRatio, 1);
  assert.deepEqual(report.coverageLeaks, []);
});

test("a completed game that cannot publish is counted as a coverage leak", async () => {
  const store = memoryEventStore();
  const metro = {
    ...ST_LOUIS,
    sources: {
      eventLinkSchools: [],
      mascotMediaPages: [],
      finalsiteTeamPages: [
        { schoolId: "sluh", schoolName: "SLUH", url: "https://x.test/a", sportHint: "football" },
      ],
    },
  };
  // A real, completed game against a school we cannot identify.
  const html = `<div class="fsAthleticsTeamName">Football - Varsity</div>
    <table class="fsEventTable"><tbody><tr>
      <td class="fsAthleticsOpponents"><span class="fsAthleticsOpponentName">Somewhere Unknown High</span></td>
      <td class="fsAthleticsDate"><time datetime="2026-08-28T19:00:00-05:00"></time></td>
      <td class="fsAthleticsLocations">SLUH</td>
      <td class="fsAthleticsResult">Win</td>
      <td class="fsAthleticsScore">21-7</td>
    </tr></tbody></table>`;

  const { report } = await ingestMetro({
    metro,
    since: "2026-08-01",
    until: "2026-12-31",
    now: NOW,
    store,
    fetcher: async () => html,
  });

  assert.equal(report.completedEvents, 1);
  assert.equal(report.publishableEvents, 0);
  assert.equal(report.resultsCoverageRatio, 0);
  assert.deepEqual(report.coverageLeaks, [{ reason: "unresolved opponent", count: 1 }]);
});

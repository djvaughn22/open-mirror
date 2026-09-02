// ─────────────────────────────────────────────────────────────────────────────
// St. Louis wire regression tests.
//
//   npm test
//
// Four things are locked here, in order of how much damage getting them wrong
// would do:
//
//   1. ENTITY RESOLUTION — one school must not become two, and two schools must
//      never become one. A wrong merge quietly corrupts every streak and record
//      built on top of it.
//   2. CONFLICT HANDLING — when sources disagree, we publish less. There is no
//      code path anywhere that picks the more plausible score.
//   3. THE VARSITY LINE — a JV result must never surface as Friday night's game.
//   4. BRIEF LENGTH — thin evidence produces a short brief, never a padded one.
//
// The pipeline test runs end to end with no network at all: fixture HTML in,
// published brief out.
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { buildBrief } from "../src/lib/sports/brief.ts";
import { buildCityFeed } from "../src/lib/sports/feed.ts";
import { buildEvent, reconcile } from "../src/lib/sports/graph/confidence.ts";
import { clusterObservations, eventId } from "../src/lib/sports/graph/dedupe.ts";
import { memoryEventStore } from "../src/lib/sports/graph/eventStore.ts";
import { normalizeObservations } from "../src/lib/sports/graph/normalize.ts";
import { buildSchoolIndex, normalizeSchoolName, resolveSchool } from "../src/lib/sports/graph/resolve.ts";
import { isVarsity, resolveSport } from "../src/lib/sports/graph/sports.ts";
import { ingestMetro } from "../src/lib/sports/ingest.ts";
import { findMetroStories } from "../src/lib/sports/metroStories.ts";
import { ST_LOUIS } from "../src/lib/sports/metros/stLouis.ts";
import { ST_LOUIS_SCHOOLS } from "../src/lib/sports/metros/stLouisSchools.ts";
import { buildSocialPost, cardKicker } from "../src/lib/sports/social.ts";
import {
  parseFinalsiteTeamPage,
  parseScore,
  splitTeamName,
} from "../src/lib/sports/sources/finalsiteAthletics.ts";
import type { CanonicalEvent, RawObservation, School } from "../src/lib/sports/graph/types.ts";

const INDEX = buildSchoolIndex(ST_LOUIS_SCHOOLS);
const SCHOOLS = new Map<string, School>(ST_LOUIS_SCHOOLS.map((s) => [s.id, s]));
const NOW = "2026-09-01T12:00:00.000Z";

const resolvedId = (name: string) => resolveSchool(name, INDEX).school?.id;

// ── 1. Entity resolution ────────────────────────────────────────────────────

test("every spelling of one school resolves to the same canonical school", () => {
  for (const spelling of [
    "SLUH",
    "St. Louis U. High",
    "St Louis University High School",
    "St. Louis University High",
    "St. Louis U High",
    "saint louis university high school",
  ]) {
    assert.equal(resolvedId(spelling), "sluh", `"${spelling}" should resolve to SLUH`);
  }

  assert.equal(resolvedId("De Smet"), "de-smet");
  assert.equal(resolvedId("DeSmet Jesuit"), "de-smet");
  assert.equal(resolvedId("De Smet Jesuit High School"), "de-smet");
  // The suffix is noise; the identity is not.
  assert.equal(resolvedId("Kirkwood High School"), "kirkwood");
  assert.equal(resolvedId("Kirkwood"), "kirkwood");
  // "H.S." survives the punctuation stripper.
  assert.equal(resolvedId("St. Mary's H.S."), "st-mary-s");
});

test("similarly named but genuinely different schools are never merged", () => {
  assert.equal(resolvedId("Lutheran North"), "lutheran-north");
  assert.equal(resolvedId("Lutheran South"), "lutheran-south");
  assert.notEqual(resolvedId("Lutheran North"), resolvedId("Lutheran South"));

  assert.equal(resolvedId("Belleville East"), "belleville-east");
  assert.equal(resolvedId("Belleville West"), "belleville-west");
  assert.notEqual(resolvedId("Belleville East"), resolvedId("Belleville West"));

  assert.equal(resolvedId("Parkway Central"), "parkway-central");
  assert.equal(resolvedId("Parkway West"), "parkway-west");
  assert.notEqual(resolvedId("Parkway Central"), resolvedId("Parkway West"));

  // Francis Howell, Francis Howell Central and Francis Howell North are three
  // schools that share a name and a district. This is the case most likely to
  // be silently wrong.
  assert.equal(resolvedId("Francis Howell"), "francis-howell");
  assert.equal(resolvedId("Francis Howell North"), "francis-howell-north");
  assert.equal(resolvedId("Francis Howell Central"), "francis-howell-central");
});

test("an ambiguous or unknown name stays unresolved rather than guessing", () => {
  // "Lutheran" alone cannot mean North, South or St. Charles. Refusing to
  // choose is the correct behaviour, not a gap.
  const lutheran = resolveSchool("Lutheran", INDEX);
  assert.equal(lutheran.school, undefined);

  // A school we have never heard of resolves to nothing and goes to review.
  const stranger = resolveSchool("Kennett HS", INDEX);
  assert.equal(stranger.school, undefined);
  assert.equal(stranger.reason, "no-match");

  assert.equal(resolveSchool("", INDEX).reason, "empty");
});

test("name normalization strips only the parts that carry no identity", () => {
  assert.equal(normalizeSchoolName("St. Louis University High School"), "saint louis university");
  assert.equal(normalizeSchoolName("Kirkwood HS"), "kirkwood");
  // "Academy" distinguishes real schools here, so it must survive.
  assert.ok(normalizeSchoolName("Incarnate Word Academy").includes("academy"));
});

// ── 2. Level and sport ──────────────────────────────────────────────────────

test("non-varsity teams are excluded however the school spells them", () => {
  for (const level of ["JV", "Jr Varsity", "Junior Varsity", "C-Team", "B-Team", "Freshmen White", "Sophomore"]) {
    assert.equal(isVarsity(level), false, `"${level}" must not count as varsity`);
  }
  for (const level of ["Varsity", "Varsity Soccer", undefined]) {
    assert.equal(isVarsity(level), true, `"${level}" should count as varsity`);
  }
});

test("an undivided team name still yields a level, so JV cannot slip through", () => {
  // De Smet heads its tables "Junior Varsity" with no sport and no dash. If the
  // level came back undefined it would default to varsity.
  assert.deepEqual(splitTeamName("Football - Varsity"), { sportLabel: "Football", levelLabel: "Varsity" });
  const undivided = splitTeamName("Junior Varsity");
  assert.equal(isVarsity(undivided.levelLabel), false);
});

test("a sport is resolved conservatively, and gendered by school context", () => {
  assert.equal(resolveSport("Football"), "football");
  assert.equal(resolveSport("Girls Volleyball"), "girls-volleyball");
  // An all-boys school writes "Soccer" because on its own site there is no
  // ambiguity; without that context the sport must stay unresolved.
  assert.equal(resolveSport("Soccer"), undefined);
  assert.equal(resolveSport("Soccer", [], "boys"), "boys-soccer");
  assert.equal(resolveSport("Soccer", [], "girls"), "girls-soccer");
  // Girls flag football is a different sport we do not carry, not football.
  assert.equal(resolveSport("Girls Flag Football"), undefined);
  assert.equal(resolveSport("Underwater Basket Weaving"), undefined);
});

// ── 3. Parsing a real page ──────────────────────────────────────────────────

const FIXTURE = readFileSync(join(process.cwd(), "tests", "fixtures", "sluh-football.html"), "utf8");

test("a real school athletics page parses into facts, not guesses", () => {
  const observations = parseFinalsiteTeamPage(FIXTURE, {
    page: { schoolId: "sluh", schoolName: "SLUH", url: "https://www.sluh.org/athletics/teams-schedules/football" },
    fetchedAt: NOW,
    since: "2026-08-01",
    until: "2026-12-31",
  });

  const played = observations.find((o) => o.scoreFor !== undefined);
  assert.ok(played, "the fixture contains one completed game");
  assert.equal(played.opponent, "Hazelwood Central");
  assert.equal(played.date, "2026-08-28");
  assert.equal(played.scoreFor, 43);
  assert.equal(played.scoreAgainst, 2);
  assert.equal(played.sportLabel, "Football");
  assert.equal(played.levelLabel, "Varsity");

  // Scrimmages and jamborees have no opponent to resolve, so they are not games.
  assert.ok(!observations.some((o) => /scrimmage|jamboree/i.test(o.opponent)));

  // Home/away comes from the venue, never from a "vs." that some sites print on
  // every row regardless.
  assert.equal(played.homeAway, "home");
  const away = observations.find((o) => o.opponent === "CBC");
  assert.equal(away?.homeAway, "away");
});

test("a score is read only when it is unambiguously a score", () => {
  assert.deepEqual(parseScore("43-2"), [43, 2]);
  assert.deepEqual(parseScore(" 28 - 21 "), [28, 21]);
  assert.equal(parseScore(""), undefined);
  assert.equal(parseScore("TBD"), undefined);
  assert.equal(parseScore("25-20, 25-18"), undefined);
});

// ── 4. Dedupe and corroboration ─────────────────────────────────────────────

/** Two schools' pages describing the same game from opposite sides. */
function twoSidedGame(opts: { homeScore: number; awayScoreAsReportedByAway?: number }): RawObservation[] {
  const base = { date: "2026-08-28", sportLabel: "Football", levelLabel: "Varsity", fetchedAt: NOW };
  return [
    {
      ...base,
      sourceId: "school-site-finalsite:sluh.org",
      sourceUrl: "https://www.sluh.org/athletics/teams-schedules/football",
      reportingSchool: "SLUH",
      opponent: "De Smet Jesuit",
      homeAway: "home",
      result: "W",
      scoreFor: opts.homeScore,
      scoreAgainst: 21,
    },
    {
      ...base,
      sourceId: "school-site-finalsite:desmet.org",
      sourceUrl: "https://www.desmet.org/athletics/teams/football",
      reportingSchool: "De Smet",
      opponent: "St. Louis U. High",
      homeAway: "away",
      result: "L",
      scoreFor: 21,
      scoreAgainst: opts.awayScoreAsReportedByAway ?? opts.homeScore,
    },
  ];
}

test("two schools reporting the same game produce one event with both sources kept", () => {
  const { observations } = normalizeObservations(twoSidedGame({ homeScore: 35 }), INDEX);
  assert.equal(observations.length, 2);

  const { clusters } = clusterObservations(observations);
  assert.equal(clusters.length, 1, "one game, not two");

  const event = buildEvent(clusters[0], { metro: "st-louis", now: NOW });
  assert.equal(event.confidence, "confirmed");
  assert.equal(event.sourceIds.length, 2, "both schools are kept as independent sources");
  assert.equal(event.observations.length, 2, "dedupe must never discard provenance");
  assert.equal(event.publishable, true);

  // The score reads the same whichever side reported it.
  const sluh = event.sides.find((s) => s.schoolId === "sluh");
  const desmet = event.sides.find((s) => s.schoolId === "de-smet");
  assert.equal(sluh?.score, 35);
  assert.equal(desmet?.score, 21);
  assert.equal(event.homeKnown, true);
  assert.equal(event.sides[0].schoolId, "sluh", "the home side is listed first");
});

test("an event id is stable, so re-running ingestion updates rather than duplicates", () => {
  const first = normalizeObservations(twoSidedGame({ homeScore: 35 }), INDEX).observations;
  const second = normalizeObservations(twoSidedGame({ homeScore: 35 }), INDEX).observations;
  const a = clusterObservations(first).clusters[0];
  const b = clusterObservations(second).clusters[0];
  assert.equal(eventId(a), eventId(b));

  const merged = reconcile([...first, ...second], { metro: "st-louis", now: NOW });
  assert.equal(merged.length, 1, "the same game observed twice is still one event");
});

// ── 5. Conflict: the rule the whole product rests on ────────────────────────

test("when two sources disagree on the score, the score is withheld and nothing is published", () => {
  // SLUH says it won 35-21. De Smet says it lost 21-34. One of them is wrong,
  // and we do not know which.
  const raws = twoSidedGame({ homeScore: 35, awayScoreAsReportedByAway: 34 });
  const { observations } = normalizeObservations(raws, INDEX);
  const event = buildEvent(clusterObservations(observations).clusters[0], { metro: "st-louis", now: NOW });

  assert.equal(event.confidence, "conflicted");
  assert.equal(event.publishable, false, "a conflicted game must never publish");
  assert.ok(
    event.sides.every((s) => s.score === undefined),
    "the score is withheld entirely — not averaged, not majority-voted, not taken from the better source",
  );

  const conflict = event.conflicts.find((c) => c.field === "score");
  assert.ok(conflict, "the disagreement is recorded rather than swallowed");
  assert.equal(conflict.accounts.length, 2, "both accounts are kept so a human can settle it");
  // Both observations survive so the review desk can show the whole picture.
  assert.equal(event.observations.length, 2);
});

test("an opponent we cannot identify becomes an unresolved event, never a published one", () => {
  const raw: RawObservation = {
    sourceId: "school-site-finalsite:sluh.org",
    sourceUrl: "https://www.sluh.org/athletics/teams-schedules/football",
    fetchedAt: NOW,
    reportingSchool: "SLUH",
    opponent: "Some School We Have Never Heard Of",
    date: "2026-08-28",
    sportLabel: "Football",
    levelLabel: "Varsity",
    homeAway: "home",
    result: "W",
    scoreFor: 30,
    scoreAgainst: 7,
  };
  const normalized = normalizeObservations([raw], INDEX);
  assert.equal(normalized.observations.length, 1);
  assert.deepEqual(normalized.unresolvedNames, ["Some School We Have Never Heard Of"]);

  const events = reconcile(normalized.observations, { metro: "st-louis", now: NOW });
  assert.equal(events.length, 1);
  assert.equal(events[0].confidence, "unresolved");
  assert.equal(events[0].publishable, false, "half a matchup is a hole in the graph, not a story");
  assert.ok(events[0].unresolvedNames.includes("Some School We Have Never Heard Of"));
});

// ── 6. The brief ────────────────────────────────────────────────────────────

function eventFrom(raws: RawObservation[]): CanonicalEvent {
  const { observations } = normalizeObservations(raws, INDEX);
  return reconcile(observations, { metro: "st-louis", now: NOW })[0];
}

test("thin evidence produces a short factual brief, with nothing padded in", () => {
  const event = eventFrom(twoSidedGame({ homeScore: 35 }));
  const brief = buildBrief({ event, schools: SCHOOLS, discoveries: [], today: "2026-08-29" });

  assert.equal(brief.scoreline, "SLUH 35, De Smet 21");
  assert.match(brief.body, /^SLUH beat De Smet 35-21 at home Friday in football\.$/);
  assert.ok(brief.wordCount <= 12, `a one-fact game gets one sentence, got ${brief.wordCount} words`);

  // The house style bans exactly the phrases that make an AI recap read like one.
  for (const filler of [
    /thrilling/i, /hard-fought/i, /showcased/i, /resilience/i, /determination/i,
    /proved too much/i, /statement win/i, /dominant performance/i,
  ]) {
    assert.doesNotMatch(brief.body, filler, `briefs must not contain ${filler}`);
  }
});

test("richer evidence produces a longer brief that is still entirely grounded", () => {
  const event = eventFrom(twoSidedGame({ homeScore: 35 }));
  const archive: CanonicalEvent[] = [
    eventFrom([
      {
        sourceId: "school-site-finalsite:sluh.org",
        sourceUrl: "https://www.sluh.org/x",
        fetchedAt: NOW,
        reportingSchool: "SLUH",
        opponent: "Chaminade",
        date: "2026-08-21",
        sportLabel: "Football",
        levelLabel: "Varsity",
        homeAway: "home",
        result: "W",
        scoreFor: 28,
        scoreAgainst: 7,
      },
    ]),
    event,
  ];

  const discoveries = findMetroStories({ event, archive, schools: SCHOOLS });
  const brief = buildBrief({ event, schools: SCHOOLS, discoveries, today: "2026-08-29" });

  assert.ok(discoveries.length > 0, "two wins in the archive is a streak worth stating");
  assert.ok(brief.wordCount > 12, "more evidence means a longer brief");
  assert.ok(brief.wordCount <= 120, `a brief stays a brief, got ${brief.wordCount} words`);
  // Everything computed from our own short archive says so out loud.
  assert.match(brief.body, /tracked here/);
  assert.doesNotMatch(brief.body, /school history|all-time|best ever|first since/i);
});

test("the story finder never claims significance the archive cannot support", () => {
  const event = eventFrom(twoSidedGame({ homeScore: 35 }));
  // A single game with nothing behind it yields no discoveries at all.
  const discoveries = findMetroStories({ event, archive: [event], schools: SCHOOLS });
  assert.deepEqual(discoveries, []);
});

// ── 7. End to end, with no network ──────────────────────────────────────────

test("fixture page in, published brief out: the whole pipeline with no network", async () => {
  const store = memoryEventStore();
  const metro = {
    ...ST_LOUIS,
    sources: {
      finalsiteTeamPages: [
        { schoolId: "sluh", schoolName: "SLUH", url: "https://www.sluh.org/athletics/teams-schedules/football", sportHint: "football" },
      ],
    },
  };

  const { report, events, briefs } = await ingestMetro({
    metro,
    since: "2026-08-01",
    until: "2026-12-31",
    now: NOW,
    store,
    fetcher: async () => FIXTURE,
  });

  assert.equal(report.sources[0].succeeded, 1);
  assert.equal(report.sources[0].failed, 0);
  assert.ok(report.rawObservations > 0);
  assert.equal(report.modelCalls, 0, "the wire runs without calling any model");
  assert.equal(report.estimatedCostUsd, 0, "and without spending anything");

  const published = events.filter((e) => e.publishable);
  assert.equal(published.length, 1, "one completed game in the fixture");
  const brief = briefs.get(published[0].id);
  assert.ok(brief);
  assert.match(brief.body, /SLUH beat Hazelwood Central 43-2/);

  // The feed built from that store shows the game, credited to its source.
  const feed = buildCityFeed({ events: store.list(), today: "2026-08-29" });
  assert.equal(feed.days.length, 1);
  assert.equal(feed.days[0].stories.length, 1);
  assert.deepEqual(
    feed.days[0].stories[0].sources.map((s) => s.label),
    ["sluh.org"],
  );
  assert.deepEqual(feed.sports.map((s) => s.id), ["football"]);
});

test("a source that fails is reported, and does not take the run down with it", async () => {
  const store = memoryEventStore();
  const metro = {
    ...ST_LOUIS,
    sources: {
      finalsiteTeamPages: [
        { schoolId: "sluh", schoolName: "SLUH", url: "https://www.sluh.org/a", sportHint: "football" },
        { schoolId: "de-smet", schoolName: "De Smet", url: "https://www.desmet.org/b", sportHint: "football" },
      ],
    },
  };

  const { report } = await ingestMetro({
    metro,
    since: "2026-08-01",
    until: "2026-12-31",
    now: NOW,
    store,
    fetcher: async (url) => {
      if (url.includes("desmet")) throw new Error("HTTP 503");
      return FIXTURE;
    },
  });

  assert.equal(report.sources[0].succeeded, 1);
  assert.equal(report.sources[0].failed, 1);
  assert.equal(report.sources[0].failures[0].reason, "HTTP 503");
  // One school's site being down is a partial wire, not a broken one.
  assert.ok(report.canonicalEvents > 0);
});

test("the feed never shows an event that is conflicted, unresolved or unplayed", () => {
  const conflicted = eventFrom(twoSidedGame({ homeScore: 35, awayScoreAsReportedByAway: 34 }));
  const good = eventFrom(twoSidedGame({ homeScore: 35 }));
  const feed = buildCityFeed({ events: [conflicted, { ...good, id: "other" }], today: "2026-08-29" });

  const shownIds = feed.days.flatMap((d) => d.stories.map((s) => s.event.id));
  assert.ok(!shownIds.includes(conflicted.id), "a conflicted game stays off the feed");
  assert.equal(feed.withheld.conflicted, 1, "and is counted, out loud, as held back");
});

// ── 8. Syndication ──────────────────────────────────────────────────────────

test("every channel gets the same facts, credited, with nothing invented", () => {
  const event = eventFrom(twoSidedGame({ homeScore: 35 }));
  const brief = buildBrief({ event, schools: SCHOOLS, discoveries: [], today: "2026-08-29" });
  const post = buildSocialPost(event, brief, SCHOOLS, "https://example.test");

  // The caption is the brief. There is no second, punchier version of the truth.
  assert.ok(post.caption.includes(brief.body));
  assert.ok(post.caption.includes(brief.scoreline));
  assert.match(post.caption, /Reported by .*sluh\.org.*\./);
  assert.match(post.caption, /Reported by .*desmet\.org.*\./);

  assert.equal(post.card.corroborated, true);
  assert.deepEqual([...post.card.credits].sort(), ["desmet.org", "sluh.org"]);
  assert.equal(post.url, "https://example.test/sports/" + event.id);

  // Hashtags are derived from the two schools and the sport, so they cannot
  // drift from what the post says.
  assert.ok(post.hashtags.includes("#SLUH"));
  assert.ok(post.hashtags.includes("#DeSmet"));

  // A card kicker is only ever a measurement.
  const shutout = eventFrom(
    twoSidedGame({ homeScore: 35 }).map((o) =>
      o.reportingSchool === "SLUH" ? { ...o, scoreAgainst: 0 } : { ...o, scoreFor: 0 },
    ),
  );
  assert.equal(cardKicker(shutout), "SHUTOUT");
});

test("a stale unresolved record is cleared once the school name resolves", async () => {
  const stale: CanonicalEvent = {
    ...eventFrom([
      {
        sourceId: "school-site-finalsite:sluh.org",
        sourceUrl: "https://www.sluh.org/x",
        fetchedAt: NOW,
        reportingSchool: "SLUH",
        opponent: "A Name We Did Not Know Yet",
        date: "2026-08-28",
        sportLabel: "Football",
        levelLabel: "Varsity",
        homeAway: "home",
        result: "W",
        scoreFor: 43,
        scoreAgainst: 2,
      },
    ]),
  };
  assert.equal(stale.confidence, "unresolved");

  const store = memoryEventStore([stale]);
  const metro = {
    ...ST_LOUIS,
    sources: {
      finalsiteTeamPages: [
        { schoolId: "sluh", schoolName: "SLUH", url: "https://www.sluh.org/athletics/teams-schedules/football", sportHint: "football" },
      ],
    },
  };

  // The same night is re-read, and this time the opponent resolves. The old
  // "could not identify" record must not sit in the review queue forever asking
  // for an alias that now exists.
  const { report } = await ingestMetro({
    metro,
    since: "2026-08-01",
    until: "2026-12-31",
    now: NOW,
    store,
    fetcher: async () => FIXTURE,
  });

  assert.equal(report.prunedStale, 1);
  assert.equal(store.get(stale.id), undefined);

  // A published game is our record, and is never pruned.
  assert.ok(store.list().some((e) => e.publishable));
});

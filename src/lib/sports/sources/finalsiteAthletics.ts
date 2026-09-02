// ─────────────────────────────────────────────────────────────────────────────
// Adapter: school-published athletics schedules (Finalsite Athletics).
//
// WHY THIS SOURCE, AND WHY IT IS THE RIGHT ONE
//
// A large share of St. Louis high schools run their websites on Finalsite, and
// its athletics element renders each team's schedule and results as a plain
// server-rendered table. That gives us something better than a scoreboard
// aggregator: a FIRST-PARTY result, published by the school itself, on a page
// the school maintains precisely so people will read and share it.
//
// It is also the only category that survives a hard look at permissions:
//   · MSHSAA's robots.txt ends with a blanket `User-agent: * / Disallow: /`,
//     so Missouri's association site is off limits and we do not touch it.
//   · IHSA's ScoreZone is permitted by robots but states on the page that its
//     scores are supplied by MaxPreps. Reading it would launder a source we are
//     not allowed to use, so we do not touch that either.
//   · Newspaper coverage is somebody else's copyrighted journalism.
// School athletics pages are none of those things.
//
// WHAT WE TAKE, AND WHAT WE DO NOT
// Scores, dates, opponents and home/away — facts about a game, which are not
// copyrightable expression. We never copy a sentence of anyone's prose, and
// every fact keeps a link back to the page that reported it.
//
// One adapter, many schools: adding a school is a row of configuration, not code.
// ─────────────────────────────────────────────────────────────────────────────

import { normalizeSchoolName } from "../graph/resolve.ts";
import { attr, cellsOf, rowsOf, tablesWithClass, textOf } from "./html.ts";
import type { FetchContext, SourceRunResult, SportsSourceAdapter } from "./types.ts";
import type { HomeAway, RawObservation, SourceMeta } from "../graph/types.ts";

/** One team page on one school's site. */
export interface FinalsiteTeamPage {
  /** Canonical school id the page belongs to. */
  schoolId: string;
  /** The name the school publishes itself under, used as the reporting school. */
  schoolName: string;
  url: string;
  /**
   * The sport this page covers, for sites that head their tables with only a
   * level ("Varsity", "Freshmen White") and put the sport in the URL. Used as a
   * hint, never as an override: a table that names its own sport wins.
   */
  sportHint?: string;
}

/**
 * Each school publishes independently, so each school is its own source for
 * trust purposes even though one adapter reads them all. This is what makes
 * corroboration real: when SLUH and De Smet both report the same game, that is
 * two accounts, not one source counted twice.
 */
export function publisherSourceId(page: FinalsiteTeamPage): string {
  return `${FINALSITE_SOURCE_META.id}:${new URL(page.url).host.replace(/^www\./, "")}`;
}

export const FINALSITE_SOURCE_META: SourceMeta = {
  id: "school-site-finalsite",
  name: "School athletics pages",
  type: "school-site",
  metros: ["st-louis"],
  // Populated from whatever the configured team pages actually carry, not from
  // an aspirational list. The registry reports coverage, it does not promise it.
  sports: [],
  permission:
    "First-party results published by each school on its own athletics page. Each host's robots.txt is checked and its crawl delay honoured; only factual scores, dates, opponents and home/away are read, never prose.",
  crawlDelaySeconds: 5,
  reliability: "high",
  homepage: "https://www.finalsite.com/",
};

// ── Parsing one schedule table ──────────────────────────────────────────────

/**
 * "Football - Varsity" → { sportLabel: "Football", levelLabel: "Varsity" }
 *
 * Not every site uses the dash. Some write "Varsity Soccer", or head a table on
 * a football page with nothing but "Junior Varsity". When there is no divider
 * the whole label has to serve as BOTH candidates — otherwise the level reads
 * as undefined, `isVarsity` defaults to true, and a school's JV result gets
 * published as Friday night's varsity game. That is not a hypothetical: De Smet
 * labels its tables exactly this way.
 */
export function splitTeamName(teamName: string): { sportLabel: string; levelLabel?: string } {
  const clean = teamName.replace(/\s+/g, " ").trim();
  const parts = clean.split(/\s+[-–—]\s+/);
  if (parts.length >= 2) return { sportLabel: parts[0].trim(), levelLabel: parts.slice(1).join(" - ").trim() };
  return { sportLabel: clean, levelLabel: clean || undefined };
}

/**
 * "43-2" → [43, 2], team first. Anything else — a set list, a placeholder, a
 * blank — returns undefined so the game stays scoreless rather than guessed.
 */
export function parseScore(text: string): [number, number] | undefined {
  const m = text.replace(/\s+/g, "").match(/^(\d{1,3})[-–—](\d{1,3})$/);
  if (!m) return undefined;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return undefined;
  return [a, b];
}

export function parseResult(text: string): "W" | "L" | "T" | undefined {
  const t = text.trim().toLowerCase();
  if (t.startsWith("win") || t === "w") return "W";
  if (t.startsWith("loss") || t.startsWith("lose") || t === "l") return "L";
  if (t.startsWith("tie") || t.startsWith("draw") || t === "t") return "T";
  return undefined;
}

/** The ISO calendar date out of `<time datetime="2026-08-28T18:00:00-05:00">`. */
export function parseDateCell(cellHtml: string): { date?: string; startsAt?: string } {
  const dt = attr(cellHtml, "time", "datetime");
  if (!dt) return {};
  const m = dt.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!m) return {};
  return { date: m[1], startsAt: dt.length > 10 ? dt : undefined };
}

/**
 * Which school hosted.
 *
 * The "vs." marker is NOT trustworthy: several school sites render `vs.` on
 * every row, home or away, so believing it labelled half a schedule wrong on
 * the first real page this parser ever read. The venue cell is the honest
 * signal, and when the venue names neither school — a neutral site, a blank
 * cell — we say we do not know instead of guessing. `homeKnown: false` costs a
 * preposition in the brief; a wrong one costs the reader's trust.
 */
function homeAwayOf(opponentCellHtml: string, opponentName: string, location: string, schoolName: string): HomeAway {
  // An explicit "at" is a positive statement, and the sites that bother to
  // render it mean it.
  if (/class="[^"]*fsAthleticsAt\b/.test(opponentCellHtml)) return "away";

  const venue = normalizeSchoolName(location);
  if (venue) {
    const mine = normalizeSchoolName(schoolName);
    const theirs = normalizeSchoolName(opponentName);
    const names = (a: string, b: string) => a.length > 0 && b.length > 0 && (a === b || a.startsWith(`${b} `) || b.startsWith(`${a} `) || a.includes(b) || b.includes(a));
    const isMine = names(venue, mine);
    const isTheirs = names(venue, theirs);
    // A venue that reads as both is no evidence at all.
    if (isMine && !isTheirs) return "home";
    if (isTheirs && !isMine) return "away";
  }
  return "unknown";
}

/**
 * The other shape Finalsite serves athletics in.
 *
 * A school's athletics landing page often carries a "recent scores" element
 * built from <article> items rather than a <table> — same class vocabulary,
 * different container. It is worth reading because it is cross-sport: one
 * request returns that school's latest results in every sport it plays, where
 * the per-sport tables need one request each.
 */
export function parseFinalsiteScoreList(html: string, options: ParseOptions): RawObservation[] {
  const { page, fetchedAt, since, until, note } = options;
  const out: RawObservation[] = [];

  for (const article of html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/gi)) {
    const body = article[1];
    const opponentName = textOf(
      body.match(/<[^>]*class="[^"]*fsAthleticsOpponentName\b[^"]*"[^>]*>([\s\S]*?)<\/[a-z]+>/i)?.[1] ?? "",
    );
    if (!opponentName) continue;
    // Scrimmages and invitationals have no second school to resolve.
    if (/fsAthleticsCustomOpponent/.test(body)) continue;

    const teamLabel = textOf(body.match(/<[^>]*class="[^"]*fsTitle\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "");
    const team = teamLabel ? splitTeamName(teamLabel) : { sportLabel: "", levelLabel: undefined };
    if (!team.sportLabel) {
      note?.(`${page.url}: a scores entry against ${opponentName} named no team and was skipped`);
      continue;
    }

    const { date, startsAt } = parseDateCell(body);
    if (!date) continue;
    if (date < since || date > until) continue;

    const result = parseResult(textOf(body.match(/<[^>]*class="[^"]*fsAthleticsResult\b[^"]*"[^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? ""));
    const score = parseScore(textOf(body.match(/<[^>]*class="[^"]*fsAthleticsScore\b[^"]*"[^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? ""));

    out.push({
      sourceId: publisherSourceId(page),
      sourceUrl: page.url,
      fetchedAt,
      reportingSchool: page.schoolName,
      opponent: opponentName,
      date,
      startsAt,
      sportLabel: team.sportLabel,
      levelLabel: team.levelLabel,
      sportHint: page.sportHint,
      // This widget carries no venue, and the "vs." marker is not trustworthy
      // on these sites, so home/away stays honestly unknown.
      homeAway: "unknown",
      result,
      scoreFor: score?.[0],
      scoreAgainst: score?.[1],
    });
  }

  return out;
}

export interface ParseOptions {
  page: FinalsiteTeamPage;
  fetchedAt: string;
  since: string;
  until: string;
  note?: (message: string) => void;
}

/**
 * Read every schedule table on one team page.
 *
 * A page usually holds several teams (Varsity, JV, freshman). Each table is
 * preceded by its own team name, so the sport and level are read per table
 * rather than assumed from the URL.
 */
export function parseFinalsiteTeamPage(html: string, options: ParseOptions): RawObservation[] {
  const { page, fetchedAt, since, until, note } = options;
  const observations: RawObservation[] = [];

  // A landing page can carry both shapes at once. Both are read; normalization
  // collapses any row that appears in both.
  observations.push(...parseFinalsiteScoreList(html, options));

  for (const table of tablesWithClass(html, "fsEventTable")) {
    const { sportLabel, levelLabel } = splitTeamName(table.precedingText);

    for (const row of rowsOf(table.html)) {
      const cells = cellsOf(row);
      const opponentCell = cells["fsAthleticsOpponents"];
      if (opponentCell === undefined) continue;

      // A school's athletics landing page lists every team together and names
      // the team in the row itself ("Football - Jr Varsity"), while a single
      // team's page names it once above the table. Preferring the row is what
      // lets one fetch per school cover every sport it plays — and it is also
      // what keeps the JV result out of the varsity feed.
      const rowTeam = textOf(cells["fsTitle"] ?? "");
      const team = rowTeam ? splitTeamName(rowTeam) : { sportLabel, levelLabel };

      // A "custom" opponent is a scrimmage, a jamboree or an invitational —
      // not a head-to-head game between two schools. Those carry no matchup to
      // resolve, so they are left out rather than turned into a fake result.
      if (/fsAthleticsCustomOpponent/.test(opponentCell)) continue;

      const opponentName = textOf(opponentCell.match(/<[^>]*class="[^"]*fsAthleticsOpponentName\b[^"]*"[^>]*>([\s\S]*?)<\/[a-z]+>/i)?.[1] ?? "");
      if (!opponentName) continue;

      if (!team.sportLabel) {
        note?.(`${page.url}: a row against ${opponentName} named no team and was skipped`);
        continue;
      }

      const { date, startsAt } = parseDateCell(cells["fsAthleticsDate"] ?? "");
      if (!date) {
        note?.(`${page.url}: a row against ${opponentName} had no readable date`);
        continue;
      }
      if (date < since || date > until) continue;

      const location = textOf(cells["fsAthleticsLocations"] ?? "");
      const result = parseResult(textOf(cells["fsAthleticsResult"] ?? ""));
      const score = parseScore(textOf(cells["fsAthleticsScore"] ?? ""));
      const status = textOf(cells["fsAthleticsStatus"] ?? "");

      observations.push({
        sourceId: publisherSourceId(page),
        sourceUrl: page.url,
        fetchedAt,
        reportingSchool: page.schoolName,
        opponent: opponentName,
        date,
        startsAt,
        sportLabel: team.sportLabel,
        levelLabel: team.levelLabel,
        sportHint: page.sportHint,
        homeAway: homeAwayOf(opponentCell, opponentName, location, page.schoolName),
        result,
        scoreFor: score?.[0],
        scoreAgainst: score?.[1],
        location: location || undefined,
        status: status || undefined,
      });
    }
  }

  return observations;
}

// ── The adapter ─────────────────────────────────────────────────────────────

export function finalsiteAthleticsAdapter(pages: FinalsiteTeamPage[]): SportsSourceAdapter {
  return {
    meta: FINALSITE_SOURCE_META,
    enabled: () => pages.length > 0,
    async fetch(ctx: FetchContext): Promise<SourceRunResult> {
      const fetchedAt = new Date().toISOString();
      const observations: RawObservation[] = [];
      const failures: SourceRunResult["failures"] = [];
      const notes: string[] = [];
      const note = (m: string) => {
        notes.push(m);
        ctx.note(m);
      };
      let succeeded = 0;

      // Pages run concurrently; the fetcher's per-host queue is what keeps each
      // individual school's server to one polite request at a time.
      const results = await Promise.all(
        pages.map(async (page) => {
          try {
            const html = await ctx.get(page.url);
            return { page, html };
          } catch (error) {
            return { page, error: error instanceof Error ? error.message : String(error) };
          }
        }),
      );

      for (const r of results) {
        if ("error" in r && r.error) {
          failures.push({ url: r.page.url, reason: r.error });
          continue;
        }
        succeeded += 1;
        try {
          observations.push(
            ...parseFinalsiteTeamPage(r.html!, { page: r.page, fetchedAt, since: ctx.since, until: ctx.until, note }),
          );
        } catch (error) {
          failures.push({ url: r.page.url, reason: `parse failed: ${error instanceof Error ? error.message : error}` });
        }
      }

      return { sourceId: FINALSITE_SOURCE_META.id, observations, attempted: pages.length, succeeded, failures, notes };
    },
  };
}

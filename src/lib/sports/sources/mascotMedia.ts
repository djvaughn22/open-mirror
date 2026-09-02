// ─────────────────────────────────────────────────────────────────────────────
// Adapter: Mascot Media school athletics sites.
//
// WHY THIS SOURCE
// Mascot Media powers school-branded athletics sites (MICDS, Collinsville) and,
// unlike EventLink, it publishes RESULTS: a schedule table with the final score
// and a W/L/T for every completed game. Sport, gender and level are all
// explicit rather than inferred — the URL is /sport/{sport}/{gender}/ and the
// team level is a selected option on the page — which removes the two biggest
// classes of error the Finalsite adapter had to guess around.
//
// PERMISSION
// robots.txt on these sites is `Allow: /` with only /admin/, /cms/ and /api/
// disallowed, and it names AI crawlers explicitly as allowed. We stay off the
// disallowed paths and read the same public HTML a reader sees, taking factual
// results only.
//
// THE ONE REAL TRAP
// The schedule table prints "Aug 21" with NO YEAR. The year comes from the
// season selector ("2026-2027") — a fall month belongs to the first year, a
// spring month to the second. Guessing "this year" instead would silently
// misfile every January game, and a wrong date breaks dedupe rather than
// showing up as a visible error.
// ─────────────────────────────────────────────────────────────────────────────

import { cellsOf, rowsOf, tablesWithClass, textOf } from "./html.ts";
import type { FetchContext, SourceRunResult, SportsSourceAdapter } from "./types.ts";
import type { HomeAway, RawObservation, SourceMeta } from "../graph/types.ts";

export interface MascotMediaTeamPage {
  schoolId: string;
  schoolName: string;
  /** Full URL of a /sport/{sport}/{gender}/?tab=schedule page. */
  url: string;
}

export const MASCOT_SOURCE_META: SourceMeta = {
  id: "mascot-media",
  name: "School athletics sites (Mascot Media)",
  type: "school-site",
  metros: ["st-louis"],
  sports: [],
  permission:
    "First-party school athletics sites. robots.txt allows all agents except /admin/, /cms/ and /api/, which are not read. Only factual results — score, date, opponent, venue — are taken.",
  crawlDelaySeconds: 3,
  reliability: "high",
  homepage: "https://www.mascotmedia.net/",
};

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

/**
 * "2026-2027" plus a month → the calendar year that month falls in.
 *
 * A school year runs July–June, so July onwards is the first year and January
 * onwards is the second. Anything we cannot read returns undefined and the row
 * is dropped rather than dated by assumption.
 */
export function yearForMonth(season: string, month: number): number | undefined {
  const m = season.match(/^(\d{4})\s*[-–]\s*(\d{4})$/);
  if (!m) return undefined;
  const [first, second] = [Number(m[1]), Number(m[2])];
  if (!Number.isFinite(first) || !Number.isFinite(second)) return undefined;
  return month >= 7 ? first : second;
}

/** "Aug 21 / 7:00 PM" → month/day, ignoring the time. */
export function parseMonthDay(text: string): { month: number; day: number } | undefined {
  const m = text.trim().match(/^([A-Za-z]{3,9})\.?\s+(\d{1,2})\b/);
  if (!m) return undefined;
  const month = MONTHS[m[1].slice(0, 3).toLowerCase()];
  const day = Number(m[2]);
  if (!month || !Number.isFinite(day) || day < 1 || day > 31) return undefined;
  return { month, day };
}

/** "L 20 - 53" → result and both scores, reporting school first. */
export function parseResultCell(text: string): { result?: "W" | "L" | "T"; scoreFor?: number; scoreAgainst?: number } {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return {};
  const m = t.match(/^([WLT])\b\s*,?\s*(\d{1,3})\s*[-–]\s*(\d{1,3})/i);
  if (!m) {
    // A result column can also hold "Cancelled", "Postponed", "PPD" or a bare
    // letter. None of those is a score, and none of them gets guessed at.
    const bare = t.match(/^([WLT])$/i);
    if (bare) return { result: bare[1].toUpperCase() as "W" | "L" | "T" };
    return {};
  }
  return {
    result: m[1].toUpperCase() as "W" | "L" | "T",
    scoreFor: Number(m[2]),
    scoreAgainst: Number(m[3]),
  };
}

/** The team level currently displayed, from the selected option of the team picker. */
export function selectedLevel(html: string): string | undefined {
  for (const select of html.matchAll(/<select[^>]*\bid="sub-\d+"[^>]*>([\s\S]*?)<\/select>/gi)) {
    const chosen = select[1].match(/<option[^>]*\bselected\b[^>]*>([^<]*)</i);
    if (chosen) return textOf(chosen[1]);
  }
  return undefined;
}

/** The season currently displayed, e.g. "2026-2027". */
export function selectedSeason(html: string): string | undefined {
  for (const select of html.matchAll(/<select[^>]*\bid="school-year-\d+"[^>]*>([\s\S]*?)<\/select>/gi)) {
    const chosen = select[1].match(/<option[^>]*\bselected\b[^>]*>([^<]*)</i);
    if (chosen) return textOf(chosen[1]).trim();
  }
  return undefined;
}

/**
 * Sport and gender for a page, taken from its URL: /sport/{sport}/{gender}/.
 *
 * The URL is the structural, reliable answer. The `<h1>` is not: Collinsville
 * heads the page "BOYS FOOTBALL", but MICDS heads it "THE OFFICIAL SITE OF
 * MICDS Athletics", which resolved to no sport at all and silently dropped
 * every MICDS result on the floor. The heading is now only a fallback.
 */
export function pageSport(url: string, html: string): string | undefined {
  const path = (() => {
    try {
      return decodeURIComponent(new URL(url).pathname);
    } catch {
      return url;
    }
  })();
  const m = path.match(/\/sport\/([^/]+)\/([^/?]+)/i);
  if (m) {
    const sport = m[1].replace(/[-_+]/g, " ").trim();
    const gender = m[2].replace(/[-_+]/g, " ").trim();
    // "coed" carries no gender information, so it is left off rather than
    // passed through as a word the sport resolver would have to ignore.
    return /^coed$/i.test(gender) ? sport : `${gender} ${sport}`;
  }
  const h1 = html.match(/<h1[^>]*>([\s\S]{0,120}?)<\/h1>/i);
  const text = h1 ? textOf(h1[1]) : "";
  // A banner is not a sport. Only trust the heading when it actually names one.
  return /\b(football|soccer|volleyball|basketball|baseball|softball|hockey|tennis|golf|swim|cross country|track|wrestl|lacrosse|water polo|field hockey)\b/i.test(text)
    ? text
    : undefined;
}

/**
 * Schedule rows carry status in the opponent text: "Marquette High School
 * (CANCELED)". A cancelled game was not played, so it is not an event.
 */
export function cancellationOf(opponent: string): boolean {
  return /\((?:canceled|cancelled|postponed|ppd|rescheduled)\)/i.test(opponent);
}

/**
 * Tournament rows name the bracket and then the actual opponent:
 * "Metro League Tournament - Parkway Central". The opponent is what matters;
 * a row that names only the bracket has no opponent to resolve.
 */
export function stripTournamentPrefix(opponent: string): string {
  const cleaned = opponent.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const m = cleaned.match(/^(.*\b(?:tournament|tourney|invitational|classic|showcase|cup)\b[^-–—]*)[-–—]\s*(.+)$/i);
  return (m ? m[2] : cleaned).trim();
}

export interface ParseMascotOptions {
  page: MascotMediaTeamPage;
  fetchedAt: string;
  since: string;
  until: string;
  note?: (message: string) => void;
}

export function parseMascotMediaPage(html: string, options: ParseMascotOptions): RawObservation[] {
  const { page, fetchedAt, since, until, note } = options;

  const season = selectedSeason(html);
  if (!season) {
    note?.(`${page.url}: no season could be read, so no row could be dated`);
    return [];
  }
  const sportLabel = pageSport(page.url, html);
  if (!sportLabel) {
    note?.(`${page.url}: the page named no sport`);
    return [];
  }
  const levelLabel = selectedLevel(html);

  const out: RawObservation[] = [];
  for (const table of tablesWithClass(html, "schedule-table")) {
    for (const row of rowsOf(table.html)) {
      const cells = cellsOf(row);
      // Cells are keyed by class, and this table labels its data columns with
      // data-label rather than a class, so read those directly.
      const byLabel = labelledCells(row);

      const when = byLabel["LOCATION & TIME"] ?? cells["event-date-time"] ?? "";
      const dateText = textOf(when.match(/class="[^"]*event-date-time[^"]*"[^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? "");
      const md = parseMonthDay(dateText);
      if (!md) continue;

      const year = yearForMonth(season, md.month);
      if (!year) {
        note?.(`${page.url}: season "${season}" could not be turned into a year`);
        continue;
      }
      const date = `${year}-${String(md.month).padStart(2, "0")}-${String(md.day).padStart(2, "0")}`;
      if (date < since || date > until) continue;

      const rawOpponent = textOf(when.match(/class="[^"]*event-opponent[^"]*"[^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? "");
      if (!rawOpponent) continue;
      if (cancellationOf(rawOpponent)) continue;
      const opponent = stripTournamentPrefix(rawOpponent);
      if (!opponent) continue;

      // "AT" or "VS", written out by the site rather than inferred by us.
      const atVs = textOf(when.match(/class="[^"]*event-at-vs[^"]*"[^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? "").toUpperCase();
      const homeAway: HomeAway = atVs === "AT" ? "away" : atVs === "VS" ? "home" : "unknown";

      const { result, scoreFor, scoreAgainst } = parseResultCell(byLabel["RESULTS"] ? textOf(byLabel["RESULTS"]) : "");

      const site = byLabel["SITE"] ?? "";
      const venue = textOf(site).replace(/\s+/g, " ").trim();

      out.push({
        sourceId: `${MASCOT_SOURCE_META.id}:${new URL(page.url).host.replace(/^www\./, "")}`,
        sourceUrl: page.url,
        fetchedAt,
        reportingSchool: page.schoolName,
        opponent,
        date,
        sportLabel,
        levelLabel,
        homeAway,
        result,
        scoreFor,
        scoreAgainst,
        location: venue || undefined,
      });
    }
  }
  return out;
}

/** Cells of a row keyed by their `data-label`, which is how this table names columns. */
function labelledCells(rowHtml: string): Record<string, string> {
  const cells: Record<string, string> = {};
  for (const m of rowHtml.matchAll(/<td\b([^>]*)>([\s\S]*?)<\/td>/gi)) {
    const label = m[1].match(/data-label="([^"]*)"/i)?.[1];
    if (label && !(label in cells)) cells[label] = m[2];
  }
  return cells;
}

export function mascotMediaAdapter(pages: MascotMediaTeamPage[]): SportsSourceAdapter {
  return {
    meta: MASCOT_SOURCE_META,
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

      const results = await Promise.all(
        pages.map(async (page) => {
          try {
            return { page, html: await ctx.get(page.url) };
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
            ...parseMascotMediaPage(r.html!, { page: r.page, fetchedAt, since: ctx.since, until: ctx.until, note }),
          );
        } catch (error) {
          failures.push({ url: r.page.url, reason: `parse failed: ${error instanceof Error ? error.message : error}` });
        }
      }

      return { sourceId: MASCOT_SOURCE_META.id, observations, attempted: pages.length, succeeded, failures, notes };
    },
  };
}

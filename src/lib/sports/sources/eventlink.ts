// ─────────────────────────────────────────────────────────────────────────────
// Adapter: EventLink school athletics calendars.
//
// WHY THIS SOURCE
// EventLink is what most of St. Louis actually runs on. Rockwood, Parkway,
// Kirkwood, Webster Groves, Lindbergh, Ladue, Clayton, Francis Howell, Fox,
// Hazelwood, Chaminade, Vianney, John Burroughs and more all publish their
// athletic calendars through it, and each school's page is backed by a plain
// public JSON endpoint the page itself calls:
//
//   /s/{slug}?handler=Events&startDate=…&endDate=…
//
// WHAT IT GIVES, AND WHAT IT DOES NOT
// Fixtures: opponent, date and time, sport, level, home/away, venue, and
// cancellations. It carries NO SCORES — none, in any field. So this adapter can
// never produce a published brief on its own, and that is fine: it is the
// fixture layer. It tells us a game existed, who hosted, and when, which is
// exactly the evidence that corroborates a score reported somewhere else and
// fills the "next up" rail honestly.
//
// Because it cannot report a result, every observation it produces is
// `scheduled`. The confidence engine already refuses to publish those.
//
// PERMISSION
// eventlink.com's robots.txt is `User-agent: * / Disallow:` — an empty
// disallow, which permits everything. websites.eventlink.com serves no
// robots.txt. We read the same public endpoint the page itself calls, at a
// polite rate, and take only factual fixture data.
// ─────────────────────────────────────────────────────────────────────────────

import type { FetchContext, SourceRunResult, SportsSourceAdapter } from "./types.ts";
import type { HomeAway, RawObservation, SourceMeta } from "../graph/types.ts";

export interface EventLinkSchool {
  /** Canonical school id. */
  schoolId: string;
  /** The name this school publishes under, used as the reporting school. */
  schoolName: string;
  /** The slug in websites.eventlink.com/s/{slug}. */
  slug: string;
}

export const EVENTLINK_SOURCE_META: SourceMeta = {
  id: "eventlink",
  name: "EventLink school athletics calendars",
  type: "school-site",
  metros: ["st-louis"],
  sports: [],
  permission:
    "Public JSON calendar endpoint that each school's own EventLink page calls. eventlink.com robots.txt permits all agents; only factual fixture data is read. Carries no scores.",
  crawlDelaySeconds: 3,
  // Authoritative for fixtures — this is the calendar the athletic director
  // maintains — but it never carries a result, so it can never settle a score.
  reliability: "high",
  homepage: "https://www.eventlink.com/",
};

const BASE = "https://websites.eventlink.com/s";

export function eventsUrl(slug: string, since: string, until: string): string {
  const start = `${since}T00:00:00.000Z`;
  // The endpoint's window is exclusive at the far end in practice, so the
  // requested until date is pushed a day out to make sure it is included.
  const end = `${until}T23:59:59.999Z`;
  return `${BASE}/${encodeURIComponent(slug)}?handler=Events&startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`;
}

/** The shape we actually rely on. Everything else in the payload is ignored. */
interface EventLinkEvent {
  title?: string;
  location?: string;
  primaryCalendarTitle?: string;
  isHome?: boolean;
  isGame?: boolean;
  isAllDay?: boolean;
  cancelDateTime?: string | null;
  startDateTime?: {
    localDateTime?: { year?: number; month?: number; day?: number; hour?: number; minute?: number };
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "Tennis (Girls V)" → sport "Tennis Girls", level "V". */
export function splitCalendarTitle(raw: string): { sportLabel: string; levelLabel?: string } {
  const clean = raw.replace(/\s+/g, " ").trim();
  const m = clean.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  if (!m) return { sportLabel: clean, levelLabel: clean || undefined };

  const sport = m[1].trim();
  const inside = m[2].trim();
  // The parenthetical mixes gender and level: "Girls V", "Boys JV", "V", "9th".
  // Gender belongs with the sport so the sport resolver can see it; whatever is
  // left is the level.
  const gender = inside.match(/\b(girls?|boys?|women'?s?|men'?s?|coed)\b/i)?.[0] ?? "";
  const level = inside.replace(/\b(girls?|boys?|women'?s?|men'?s?|coed)\b/i, "").trim();
  return {
    sportLabel: `${gender} ${sport}`.trim(),
    // A bare level with no qualifier is varsity on these calendars, but we pass
    // through exactly what was written and let isVarsity decide.
    levelLabel: level || undefined,
  };
}

/**
 * EventLink writes levels as single letters and short codes. Expanded here so
 * the shared varsity filter — which knows words, not codes — can do its job.
 * Anything unrecognised is passed through untouched rather than assumed.
 */
export function expandLevel(level: string | undefined): string | undefined {
  if (!level) return undefined;
  const t = level.trim().toLowerCase();
  const map: Record<string, string> = {
    v: "Varsity",
    var: "Varsity",
    jv: "Junior Varsity",
    "jv2": "Junior Varsity",
    f: "Freshman",
    fr: "Freshman",
    "9": "Freshman",
    "9th": "Freshman",
    "10": "Sophomore",
    "10th": "Sophomore",
    so: "Sophomore",
    soph: "Sophomore",
    b: "B Team",
    c: "C Team",
    ms: "Middle School",
  };
  return map[t] ?? level;
}

export interface ParseEventLinkOptions {
  school: EventLinkSchool;
  fetchedAt: string;
  since: string;
  until: string;
  note?: (message: string) => void;
}

export function parseEventLinkEvents(json: string, options: ParseEventLinkOptions): RawObservation[] {
  const { school, fetchedAt, since, until, note } = options;
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("EventLink returned something that is not JSON");
  }
  if (!Array.isArray(parsed)) throw new Error("EventLink returned an unexpected payload shape");

  const out: RawObservation[] = [];
  for (const raw of parsed as EventLinkEvent[]) {
    // Practices, meetings and fundraisers share this calendar. Only games are
    // events in our sense.
    if (raw.isGame !== true) continue;

    // A cancelled game did not happen. Publishing it as a fixture would put a
    // game on the feed that nobody played.
    if (raw.cancelDateTime) continue;

    const local = raw.startDateTime?.localDateTime;
    if (!local?.year || !local.month || !local.day) {
      note?.(`${school.slug}: an event had no readable date and was skipped`);
      continue;
    }
    const date = `${local.year}-${pad(local.month)}-${pad(local.day)}`;
    if (date < since || date > until) continue;

    const opponent = (raw.title ?? "").replace(/\s+/g, " ").trim();
    if (!opponent) continue;

    const calendar = (raw.primaryCalendarTitle ?? "").trim();
    if (!calendar) {
      note?.(`${school.slug}: an event against ${opponent} named no sport and was skipped`);
      continue;
    }
    const { sportLabel, levelLabel } = splitCalendarTitle(calendar);

    const homeAway: HomeAway = raw.isHome === true ? "home" : raw.isHome === false ? "away" : "unknown";

    out.push({
      sourceId: `${EVENTLINK_SOURCE_META.id}:${school.slug}`,
      sourceUrl: `${BASE}/${school.slug}`,
      fetchedAt,
      reportingSchool: school.schoolName,
      opponent,
      date,
      startsAt:
        local.hour !== undefined && local.minute !== undefined && !raw.isAllDay
          ? `${date}T${pad(local.hour)}:${pad(local.minute)}:00`
          : undefined,
      sportLabel,
      levelLabel: expandLevel(levelLabel),
      homeAway,
      // No result, no score. EventLink does not carry them, and inventing a
      // status here would let an unplayed game reach the feed.
      location: raw.location?.trim() || undefined,
    });
  }
  return out;
}

export function eventLinkAdapter(schools: EventLinkSchool[]): SportsSourceAdapter {
  return {
    meta: EVENTLINK_SOURCE_META,
    enabled: () => schools.length > 0,
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

      // Every school is one request against one host, so the fetcher's per-host
      // queue keeps this to a single polite conversation with EventLink.
      const results = await Promise.all(
        schools.map(async (school) => {
          const url = eventsUrl(school.slug, ctx.since, ctx.until);
          try {
            return { school, url, json: await ctx.get(url) };
          } catch (error) {
            return { school, url, error: error instanceof Error ? error.message : String(error) };
          }
        }),
      );

      for (const r of results) {
        if ("error" in r && r.error) {
          failures.push({ url: r.url, reason: r.error });
          continue;
        }
        succeeded += 1;
        try {
          observations.push(
            ...parseEventLinkEvents(r.json!, {
              school: r.school,
              fetchedAt,
              since: ctx.since,
              until: ctx.until,
              note,
            }),
          );
        } catch (error) {
          failures.push({ url: r.url, reason: `parse failed: ${error instanceof Error ? error.message : error}` });
        }
      }

      return {
        sourceId: EVENTLINK_SOURCE_META.id,
        observations,
        attempted: schools.length,
        succeeded,
        failures,
        notes,
      };
    },
  };
}

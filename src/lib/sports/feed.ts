// ─────────────────────────────────────────────────────────────────────────────
// Assembling the city feed.
//
// The reader's question is "what happened in St. Louis high school sports?", so
// the feed answers it in that order: last night first, biggest first, and only
// the things we can actually stand behind.
//
// Sections appear only when the data earns them. A "Closest games" rail built
// from two games is filler, and filler is how a local sports page stops being
// worth opening.
// ─────────────────────────────────────────────────────────────────────────────

import { buildBrief, type Brief } from "./brief.ts";
import { eventStore } from "./graph/eventStore.ts";
import { sportLabel } from "./graph/sports.ts";
import { findMetroStories } from "./metroStories.ts";
import { ST_LOUIS } from "./metros/stLouis.ts";
import { hasScore, type CanonicalEvent, type School, type SportId } from "./graph/types.ts";

export interface FeedStory {
  event: CanonicalEvent;
  brief: Brief;
  /** Hosts that reported it, for the credit line. */
  sources: Array<{ label: string; url: string }>;
}

export interface FeedDay {
  date: string;
  stories: FeedStory[];
}

export interface CityFeed {
  metroName: string;
  /** Newest first. */
  days: FeedDay[];
  /** Only sports that actually appear. Never a menu of empty promises. */
  sports: Array<{ id: SportId; label: string; count: number }>;
  upcoming: Array<{ event: CanonicalEvent; label: string }>;
  closest: FeedStory[];
  schools: Map<string, School>;
  totals: { events: number; schools: number };
  /** Events held back: conflicted, unresolved or still unscored. */
  withheld: { conflicted: number; unresolved: number };
  /** Newest fetch time across everything shown. */
  lastUpdated?: string;
}

/** The publisher host, shown as the credit. */
function sourceLinks(event: CanonicalEvent): FeedStory["sources"] {
  const seen = new Map<string, string>();
  for (const o of event.observations) {
    const host = new URL(o.sourceUrl).host.replace(/^www\./, "");
    if (!seen.has(host)) seen.set(host, o.sourceUrl);
  }
  return [...seen.entries()].map(([label, url]) => ({ label, url }));
}

export interface BuildFeedOptions {
  /** Restrict to one sport. Undefined shows everything. */
  sport?: SportId;
  /** How many days of results to show. */
  days?: number;
  today?: string;
  events?: CanonicalEvent[];
}

export function buildCityFeed(options: BuildFeedOptions = {}): CityFeed {
  const metro = ST_LOUIS;
  const schools = new Map<string, School>(metro.schools.map((s) => [s.id, s]));
  const all = options.events ?? eventStore.list();
  const today = options.today ?? new Date().toISOString().slice(0, 10);
  const days = options.days ?? 14;
  const earliest = new Date(Date.parse(`${today}T00:00:00Z`) - days * 86_400_000).toISOString().slice(0, 10);

  const published = all.filter((e) => e.publishable && e.status === "final" && hasScore(e));

  // The sport filter is built from everything published, not from the current
  // filter, so switching sports never hides the way back.
  const sportCounts = new Map<SportId, number>();
  for (const e of published) sportCounts.set(e.sport, (sportCounts.get(e.sport) ?? 0) + 1);

  const inWindow = published.filter((e) => e.date >= earliest && e.date <= today);
  const shown = options.sport ? inWindow.filter((e) => e.sport === options.sport) : inWindow;

  const toStory = (event: CanonicalEvent): FeedStory => ({
    event,
    brief: buildBrief({
      event,
      schools,
      discoveries: findMetroStories({ event, archive: published, schools }),
      today,
    }),
    sources: sourceLinks(event),
  });

  const byDate = new Map<string, CanonicalEvent[]>();
  for (const e of shown) {
    const list = byDate.get(e.date) ?? [];
    list.push(e);
    byDate.set(e.date, list);
  }

  const feedDays: FeedDay[] = [...byDate.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, events]) => ({
      date,
      // Corroborated games lead: a result two schools agree on is the one we
      // are most sure of, and the reader should meet it first.
      stories: events
        .sort(
          (a, b) =>
            b.sourceIds.length - a.sourceIds.length ||
            marginOf(b) - marginOf(a) ||
            a.id.localeCompare(b.id),
        )
        .map(toStory),
    }));

  const upcoming = all
    .filter((e) => e.status === "scheduled" && e.date >= today && e.confidence !== "unresolved")
    .filter((e) => !options.sport || e.sport === options.sport)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .slice(0, 6)
    .map((event) => ({
      event,
      label: `${schools.get(event.sides[0].schoolId)?.shortName ?? event.sides[0].schoolId} vs. ${schools.get(event.sides[1].schoolId)?.shortName ?? event.sides[1].schoolId}`,
    }));

  // A "closest games" rail is only a story when there are enough games for
  // "closest" to mean anything. Below that bar it is just the same five games
  // again in a different order — and with a thin slate it will happily file a
  // 20-0 rout under "closest", which is worse than having no rail at all.
  // Draws belong here: nothing is closer than level.
  const CLOSEST_MIN_GAMES = 8;
  const closest =
    shown.length >= CLOSEST_MIN_GAMES
      ? shown
          .sort((a, b) => marginOf(a) - marginOf(b) || a.id.localeCompare(b.id))
          .slice(0, 3)
          .map(toStory)
      : [];

  const lastUpdated = all
    .flatMap((e) => e.observations.map((o) => o.fetchedAt))
    .sort()
    .slice(-1)[0];

  return {
    metroName: metro.displayName,
    days: feedDays,
    sports: [...sportCounts.entries()]
      .map(([id, count]) => ({ id, label: sportLabel(id), count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    upcoming,
    closest,
    schools,
    totals: {
      events: shown.length,
      schools: new Set(shown.flatMap((e) => e.sides.map((s) => s.schoolId))).size,
    },
    withheld: {
      conflicted: all.filter((e) => e.confidence === "conflicted").length,
      unresolved: all.filter((e) => e.confidence === "unresolved").length,
    },
    lastUpdated,
  };
}

function marginOf(event: CanonicalEvent): number {
  if (!hasScore(event)) return 0;
  return Math.abs(event.sides[0].score! - event.sides[1].score!);
}

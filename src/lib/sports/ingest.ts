// ─────────────────────────────────────────────────────────────────────────────
// The morning wire: one job, run unattended, no game ever typed by hand.
//
//   DISCOVER → FETCH → PARSE → NORMALIZE → RESOLVE → DEDUPE → CONFIDENCE
//            → ENRICH → STORY FINDER → BRIEF → FEED
//
// Everything above the writer is deterministic TypeScript, which is the point:
// if the model vendor is down, or unconfigured, or replaced next year, this job
// still produces a correct city feed. The model is one optional step near the
// end, and it is fact-guarded even when it works.
//
// The run report at the bottom is not decoration. A wire you cannot audit is a
// wire you cannot trust: it counts what was attempted, what agreed, what
// disagreed, what could not be identified, and what it cost.
// ─────────────────────────────────────────────────────────────────────────────

import { buildBrief, type Brief } from "./brief.ts";
import { reconcile } from "./graph/confidence.ts";
import { eventStore, type SportsEventStore } from "./graph/eventStore.ts";
import { normalizeObservations, type DropReason } from "./graph/normalize.ts";
import { buildSchoolIndex } from "./graph/resolve.ts";
import { findMetroStories } from "./metroStories.ts";
import { adaptersFor } from "./sources/registry.ts";
import { politeFetcher } from "./sources/http.ts";
import type { CanonicalEvent, RawObservation, School } from "./graph/types.ts";
import type { MetroConfig } from "./metros/types.ts";
import type { FetchContext } from "./sources/types.ts";

export interface IngestOptions {
  metro: MetroConfig;
  /** Earliest result date to consider. */
  since: string;
  until: string;
  now?: string;
  store?: SportsEventStore;
  /** Injected in tests so the whole pipeline runs with no network. */
  fetcher?: (url: string) => Promise<string>;
  /** Write results to the store. False makes the job a dry run. */
  persist?: boolean;
}

export interface SourceReport {
  sourceId: string;
  attempted: number;
  succeeded: number;
  failed: number;
  observations: number;
  failures: Array<{ url: string; reason: string }>;
}

export interface IngestReport {
  metro: string;
  startedAt: string;
  finishedAt: string;
  window: { since: string; until: string };
  sources: SourceReport[];
  rawObservations: number;
  normalizedObservations: number;
  droppedObservations: Array<{ reason: DropReason; count: number }>;
  /** Distinct platform families that produced at least one observation. */
  platformFamilies: string[];
  sourceHostsAttempted: number;
  varsityObservations: number;
  nonVarsityRejected: number;
  canonicalSchoolsObserved: number;
  /**
   * Unique schools appearing in at least one publishable event. Counted across
   * both sides, because a result names two schools.
   */
  schoolsWithPublishedEvents: number;
  /**
   * THE NUMBER THAT ACTUALLY MEASURES THE NETWORK: schools whose OWN permitted
   * source supplied at least one usable final result.
   *
   * This is deliberately reported apart from `schoolsWithPublishedEvents`,
   * because the two diverge wildly — five schools reporting their own scores
   * is what put twenty-five schools on the feed. The second number grows when
   * a reporter plays someone new; only the first grows when the network does.
   */
  directScoreReportingSchools: number;
  directScoreReporterIds: string[];
  /** Events that look played — final, both participants known — score or not. */
  completedEvents: number;
  /** publishableEvents / completedEvents, or undefined when nothing completed. */
  resultsCoverageRatio?: number;
  /** Why a completed-looking event did not publish. This is where coverage leaks. */
  coverageLeaks: Array<{ reason: string; count: number }>;
  canonicalEvents: number;
  /** Events whose SCORE was reported by two or more independent sources. */
  corroborated: number;
  /** Events where a second source confirms the fixture but reported no score. */
  fixtureCorroborated: number;
  publishableEvents: number;
  /** Observations that merged into an existing event rather than creating one. */
  duplicatesMerged: number;
  conflicts: number;
  unresolvedEvents: number;
  /** Stale "could not identify" records cleared because the name now resolves. */
  prunedStale: number;
  unresolvedNames: string[];
  briefsGenerated: number;
  sportsRepresented: string[];
  schoolsRepresented: number;
  modelCalls: number;
  /** Real dollars. The whole design target is that this stays 0. */
  estimatedCostUsd: number;
  notes: string[];
}

export interface IngestResult {
  report: IngestReport;
  events: CanonicalEvent[];
  briefs: Map<string, Brief>;
}

function countBy<T, K extends string>(items: T[], key: (t: T) => K): Array<{ reason: K; count: number }> {
  const counts = new Map<K, number>();
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  return [...counts.entries()].map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count);
}

export async function ingestMetro(options: IngestOptions): Promise<IngestResult> {
  const { metro, since, until } = options;
  const now = options.now ?? new Date().toISOString();
  const store = options.store ?? eventStore;
  const persist = options.persist ?? true;
  const startedAt = now;
  const notes: string[] = [];

  const index = buildSchoolIndex(metro.schools);
  const schools = new Map<string, School>(metro.schools.map((s) => [s.id, s]));

  // ── FETCH ─────────────────────────────────────────────────────────────────
  const adapters = adaptersFor(metro);
  const sourceReports: SourceReport[] = [];
  const raws: RawObservation[] = [];

  for (const adapter of adapters) {
    const get =
      options.fetcher ?? politeFetcher({ crawlDelaySeconds: adapter.meta.crawlDelaySeconds });
    const ctx: FetchContext = { since, until, get, note: (m) => notes.push(m) };
    const run = await adapter.fetch(ctx);
    raws.push(...run.observations);
    sourceReports.push({
      sourceId: run.sourceId,
      attempted: run.attempted,
      succeeded: run.succeeded,
      failed: run.failures.length,
      observations: run.observations.length,
      failures: run.failures,
    });
  }

  // ── NORMALIZE + RESOLVE ───────────────────────────────────────────────────
  const normalized = normalizeObservations(raws, index);

  // ── DEDUPE + CONFIDENCE ───────────────────────────────────────────────────
  const existing = new Map(store.list().map((e) => [e.id, e]));
  const events = reconcile(normalized.observations, { metro: metro.id, now, existing });

  // Every observation beyond the first on an event is a duplicate we merged
  // rather than a second story we published.
  const duplicatesMerged = events.reduce((sum, e) => sum + Math.max(0, e.observations.length - 1), 0);
  const corroborated = events.filter((e) => e.scoreSourceIds.length >= 2).length;
  // A calendar source confirming a game happened is real evidence, and worth
  // counting — but it is a different claim from two sources agreeing on a score.
  const fixtureCorroborated = events.filter(
    (e) => e.sourceIds.length >= 2 && e.scoreSourceIds.length < 2,
  ).length;
  const conflicts = events.filter((e) => e.confidence === "conflicted").length;
  const unresolvedEvents = events.filter((e) => e.confidence === "unresolved").length;

  // ── STORY FINDER + BRIEF ──────────────────────────────────────────────────
  // Stories are found against the whole archive, tonight's events included, so
  // a streak that ends tonight is counted correctly.
  const merged = new Map(existing);
  for (const e of events) merged.set(e.id, e);
  const archive = [...merged.values()];

  const briefs = new Map<string, Brief>();
  const today = now.slice(0, 10);
  for (const event of events) {
    if (!event.publishable) continue;
    const discoveries = findMetroStories({ event, archive, schools });
    briefs.set(event.id, buildBrief({ event, schools, discoveries, today }));
  }

  // Unresolved events go stale. Once a school name is added to the registry the
  // game resolves properly and gets a new id, but the old "we could not identify
  // this" record would sit in the review queue forever, asking for an alias that
  // already exists. So: anything in this window that we previously could not
  // resolve, and did not see again this run, is dropped. Published and
  // conflicted events are never pruned — those are our record, not a to-do.
  const seen = new Set(events.map((e) => e.id));
  const pruned: string[] = [];
  for (const old of existing.values()) {
    if (old.confidence !== "unresolved") continue;
    if (old.date < since || old.date > until) continue;
    if (seen.has(old.id)) continue;
    pruned.push(old.id);
  }

  if (persist) {
    store.saveAll(events);
    for (const id of pruned) store.remove(id);
  }

  const published = events.filter((e) => e.publishable);
  const sportsRepresented = [...new Set(published.map((e) => e.sport))].sort();
  const schoolsRepresented = new Set(published.flatMap((e) => e.sides.map((s) => s.schoolId))).size;

  // A school is a direct reporter only when ITS OWN source carried a score.
  // Appearing as somebody else's opponent does not count, which is the whole
  // point of tracking this separately.
  const directReporters = new Set<string>();
  for (const e of events) {
    for (const o of e.observations) {
      if (o.scoreFor !== undefined && o.scoreAgainst !== undefined) directReporters.add(o.reporter.schoolId);
    }
  }

  // Where coverage leaks: events that look like a game was played but did not
  // reach a reader, and the specific reason for each.
  const completed = events.filter(
    (e) => e.status === "final" || e.observations.some((o) => o.scoreFor !== undefined),
  );
  const leaks = new Map<string, number>();
  for (const e of completed) {
    if (e.publishable) continue;
    const reason =
      e.confidence === "unresolved"
        ? "unresolved opponent"
        : e.confidence === "conflicted"
          ? "sources conflict"
          : e.sides.some((s) => s.score === undefined)
            ? "no score reported"
            : e.status !== "final"
              ? "not marked final"
              : "other";
    leaks.set(reason, (leaks.get(reason) ?? 0) + 1);
  }

  const report: IngestReport = {
    metro: metro.id,
    startedAt,
    finishedAt: new Date().toISOString(),
    window: { since, until },
    sources: sourceReports,
    rawObservations: raws.length,
    normalizedObservations: normalized.observations.length,
    droppedObservations: countBy(normalized.dropped, (d) => d.reason),
    platformFamilies: [...new Set(sourceReports.filter((r) => r.observations > 0).map((r) => r.sourceId))].sort(),
    sourceHostsAttempted: sourceReports.reduce((n, r) => n + r.attempted, 0),
    varsityObservations: normalized.observations.length,
    nonVarsityRejected: normalized.dropped.filter((d) => d.reason === "not-varsity").length,
    canonicalSchoolsObserved: new Set(events.flatMap((e) => e.sides.map((s) => s.schoolId)).filter((id) => !id.startsWith("unresolved:"))).size,
    schoolsWithPublishedEvents: schoolsRepresented,
    directScoreReportingSchools: directReporters.size,
    directScoreReporterIds: [...directReporters].sort(),
    completedEvents: completed.length,
    resultsCoverageRatio: completed.length > 0 ? published.length / completed.length : undefined,
    coverageLeaks: [...leaks.entries()].map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count),
    canonicalEvents: events.length,
    corroborated,
    fixtureCorroborated,
    publishableEvents: published.length,
    duplicatesMerged,
    conflicts,
    unresolvedEvents,
    prunedStale: pruned.length,
    unresolvedNames: normalized.unresolvedNames,
    briefsGenerated: briefs.size,
    sportsRepresented,
    schoolsRepresented,
    // The wire runs on deterministic code. A model is optional and, when it is
    // not configured, is not called at all — which is why this is zero.
    modelCalls: 0,
    estimatedCostUsd: 0,
    notes,
  };

  return { report, events, briefs };
}

/** A human-readable run summary, for the CLI and the operator desk. */
export function formatReport(report: IngestReport): string {
  const lines: string[] = [];
  lines.push(`St. Louis wire — ${report.window.since} to ${report.window.until}`);
  for (const s of report.sources) {
    lines.push(`  source ${s.sourceId}: ${s.succeeded}/${s.attempted} pages, ${s.observations} observations, ${s.failed} failed`);
    for (const f of s.failures.slice(0, 5)) lines.push(`      ! ${f.url} — ${f.reason}`);
  }
  lines.push(`  observations: ${report.rawObservations} raw → ${report.varsityObservations} varsity (${report.nonVarsityRejected} non-varsity rejected)`);
  for (const d of report.droppedObservations) lines.push(`      dropped ${d.count} (${d.reason})`);
  lines.push(`  events: ${report.canonicalEvents} canonical, ${report.duplicatesMerged} duplicate observations merged`);
  lines.push(`  score corroborated by 2+ sources: ${report.corroborated}`);
  lines.push(`  fixture corroborated (2nd source, no score): ${report.fixtureCorroborated}`);
  lines.push(`  conflicts: ${report.conflicts}   unresolved: ${report.unresolvedEvents}   stale cleared: ${report.prunedStale}`);
  if (report.unresolvedNames.length > 0) {
    lines.push(`      names needing an alias: ${report.unresolvedNames.slice(0, 12).join(", ")}`);
  }
  lines.push(`  briefs: ${report.briefsGenerated}`);
  lines.push(`  sports: ${report.sportsRepresented.join(", ") || "none"}`);
  lines.push(`  schools observed: ${report.canonicalSchoolsObserved}`);
  lines.push(`  DIRECT SCORE-REPORTING SCHOOLS: ${report.directScoreReportingSchools}  (${report.directScoreReporterIds.join(", ")})`);
  lines.push(`  schools represented by results: ${report.schoolsWithPublishedEvents}`);
  lines.push(`  publishable events: ${report.publishableEvents} of ${report.completedEvents} completed` +
    (report.resultsCoverageRatio !== undefined ? ` (${Math.round(report.resultsCoverageRatio * 100)}%)` : ""));
  for (const leak of report.coverageLeaks) lines.push(`      leaked ${leak.count} — ${leak.reason}`);
  lines.push(`  model calls: ${report.modelCalls}   paid cost: $${report.estimatedCostUsd.toFixed(2)}`);
  return lines.join("\n");
}

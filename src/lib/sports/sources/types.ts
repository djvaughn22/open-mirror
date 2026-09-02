// ─────────────────────────────────────────────────────────────────────────────
// The source adapter contract.
//
// Every quirk of a source lives behind this interface: its HTML, its date
// format, its spelling of "Girls Volleyball", its rate limit. Nothing above
// this line knows or cares where a result came from — which is the point. The
// unit of growth for this product is "write an adapter", not "change the feed".
//
// An adapter returns RAW OBSERVATIONS. It does not resolve schools, does not
// decide what is true, and never writes prose. It reports what a page said.
// ─────────────────────────────────────────────────────────────────────────────

import type { RawObservation, SourceMeta } from "../graph/types.ts";

export interface FetchContext {
  /** Only look at results on or after this ISO date. */
  since: string;
  /** Only look at results on or before this ISO date. */
  until: string;
  /** Injected so tests can run the whole pipeline with no network at all. */
  get: (url: string) => Promise<string>;
  /** Called for anything the adapter noticed but could not use. */
  note: (message: string) => void;
}

export interface SourceRunResult {
  sourceId: string;
  observations: RawObservation[];
  /** Pages the adapter tried to read. */
  attempted: number;
  succeeded: number;
  failures: Array<{ url: string; reason: string }>;
  notes: string[];
}

export interface SportsSourceAdapter {
  meta: SourceMeta;
  /** True when the adapter has everything it needs to run (config, targets). */
  enabled(): boolean;
  fetch(ctx: FetchContext): Promise<SourceRunResult>;
}

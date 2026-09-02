// ─────────────────────────────────────────────────────────────────────────────
// The source registry.
//
// Adding a source is: write an adapter, register it here, list its targets in a
// metro file. Nothing downstream changes — the feed has never heard of any
// individual source and never should.
// ─────────────────────────────────────────────────────────────────────────────

import { eventLinkAdapter } from "./eventlink.ts";
import { finalsiteAthleticsAdapter } from "./finalsiteAthletics.ts";
import { mascotMediaAdapter } from "./mascotMedia.ts";
import type { SportsSourceAdapter } from "./types.ts";
import type { MetroConfig } from "../metros/types.ts";

export function adaptersFor(metro: MetroConfig): SportsSourceAdapter[] {
  return [
    finalsiteAthleticsAdapter(metro.sources.finalsiteTeamPages),
    mascotMediaAdapter(metro.sources.mascotMediaPages),
    eventLinkAdapter(metro.sources.eventLinkSchools),
  ].filter((a) => a.enabled());
}

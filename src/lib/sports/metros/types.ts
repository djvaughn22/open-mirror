// ─────────────────────────────────────────────────────────────────────────────
// A metro is configuration, not code.
//
// Everything St. Louis-specific — which schools exist, how they are spelled,
// which sites we are allowed to read — lives in a metro file. Kansas City is
// not being built now, but this seam is why it will be a data problem rather
// than a rewrite.
// ─────────────────────────────────────────────────────────────────────────────

import type { EventLinkSchool } from "../sources/eventlink.ts";
import type { FinalsiteTeamPage } from "../sources/finalsiteAthletics.ts";
import type { MascotMediaTeamPage } from "../sources/mascotMedia.ts";
import type { MetroId, School } from "../graph/types.ts";

export interface MetroConfig {
  id: MetroId;
  /** What readers see: "St. Louis". */
  name: string;
  /** The feed's masthead. */
  displayName: string;
  timezone: string;
  states: Array<"MO" | "IL">;
  schools: School[];
  sources: {
    finalsiteTeamPages: FinalsiteTeamPage[];
    eventLinkSchools: EventLinkSchool[];
    mascotMediaPages: MascotMediaTeamPage[];
  };
}

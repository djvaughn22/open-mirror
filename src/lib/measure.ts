// ─────────────────────────────────────────────────────────────────────────────
// Counts a few meaningful actions through the hub's existing Google Analytics
// tag (owner direction, Nov 27-28 2026: measure searches, results chosen,
// paths started and steps completed, so we can see where the experience
// fails). Only fixed event names and ids from our own lists are sent: never
// anything a person typed, never a family detail, nothing personal. Browsers
// that send Do Not Track or Global Privacy Control send nothing.
//
// OFF until the owner approves it (Nov 28 2026: "Keep the new instrumentation
// disabled pending approval"). The calls stay in place so turning it on is
// one line: MEASURE_ENABLED. The homepage's older site-card count
// (DoorMeasure, site_card_click) is separate and unchanged.
// ─────────────────────────────────────────────────────────────────────────────

/** The owner's switch. False: nothing below is ever sent. */
export const MEASURE_ENABLED = false;

export type MeasureEvents = {
  /** A question or search was answered. Only whether anything matched. */
  om_search: { where: "home" | "learn"; found: "yes" | "no" };
  /** A result was opened: what kind and which of our ids. */
  om_result: { where: "home" | "learn"; kind: "path" | "subject" | "place" | "work" | "market"; id: string };
  path_start: { path: string };
  path_step: { path: string; step: string; done: "yes" | "no" };
  path_finish: { path: string };
  subject_save: { subject: string; saved: "yes" | "no" };
};

const SAFE = /^[a-z0-9-]{1,48}$/;

export function measure<K extends keyof MeasureEvents>(name: K, params: MeasureEvents[K]): void {
  if (!MEASURE_ENABLED) return;
  send(name, params);
}

/** The sending itself, with every safeguard. Exported for tests; pages call measure(). */
export function send<K extends keyof MeasureEvents>(name: K, params: MeasureEvents[K]): void {
  if (typeof window === "undefined") return;
  const nav = window.navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true) return;
  for (const v of Object.values(params)) if (typeof v !== "string" || !SAFE.test(v)) return;
  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}

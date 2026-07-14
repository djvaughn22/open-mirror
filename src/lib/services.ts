// ─────────────────────────────────────────────────────────────────────────────
// Talk-with-the-Owner service registry — single source of truth for
// /talk-with-the-owner.
//
// Three tiers with public prices. Larger work is scoped per project, after
// the intake. Payment links, when ready, get added here — not sprinkled
// through the page.
// ─────────────────────────────────────────────────────────────────────────────

import { STUDIO } from "./products";

export const SERVICE_EMAIL = STUDIO.email;

/** The engagement, in one line — used by the page, metadata, and OG tags. */
export const ENGAGEMENT =
  "Direct help from the owner of Open Mirror LLC: a clear production path from your idea or prototype to the real thing.";

/** What the owner helps you decide, shown as the qualifying list. */
export const DECIDE_LIST = [
  "What to build first",
  "What to leave out",
  "What tools you need",
  "What could go wrong",
  "The next real step",
];

/** The three kinds of help. Price is null when work is scoped per project. */
export const TIERS: { name: string; price: string | null; how: string }[] = [
  {
    name: "Production Scope",
    price: "$500",
    how: "A clear, written path from your idea or prototype toward production. A scope and plan — not a full application build.",
  },
  {
    name: "One-on-One Help",
    price: "$250 an hour",
    how: "Send the project and questions first. Use the hour to make decisions and solve problems.",
  },
  {
    name: "Larger Builds",
    price: null,
    how: "Some ideas need more. Larger work starts with a clear paid scope.",
  },
];

/** The one line under the tiers. */
export const NO_MYSTERY =
  "No fake promises. No mystery pricing before the idea is understood.";

/** Availability, honestly. */
export const AVAILABILITY =
  "Open Mirror runs on evenings and weekends, alongside a full-time job. Availability is limited. Every accepted project gets direct owner involvement.";

/** Intake select options. */
export const HELP_TYPES = [
  "Production Scope",
  "One-on-One Help",
  "Larger Build",
  "Not sure yet",
] as const;

export const BUDGET_RANGES = [
  "Under $500",
  "$500 – $2,500",
  "$2,500 – $10,000",
  "$10,000+",
  "Not sure yet",
] as const;

/**
 * Portfolio proof — one-line product statements.
 * `product` must match a `name` in src/lib/products.ts; the page joins them
 * so links, accents, emoji, and statuses stay in sync with the registry.
 */
export const PROOF: { product: string; proves: string }[] = [
  {
    product: "StepInTheRing",
    proves: "An idea goes in. A buildable plan comes out.",
  },
  {
    product: "WatchedNotWatched",
    proves:
      "Everything you've ever watched, on one board that learns what to hand you next.",
  },
  {
    product: "OpenDoku",
    proves: "One puzzle engine. Every new game ships faster than the last.",
  },
  {
    product: "iDontCry",
    proves: "Where kids dream something up and start making it.",
  },
  {
    product: "DontCloneMeTom",
    proves: "A joke about a cloned dog that gets real dogs adopted.",
  },
  {
    product: "TheDJCares",
    proves: "Music, sermons, and encouragement, picked by hand.",
  },
  {
    product: "CrossHeartPray",
    proves: "A complete daily faith routine in one place.",
  },
  {
    product: "WhatAmIAI",
    proves: "Your own prompts, played back — how you actually use AI.",
  },
  {
    product: "Fambookagram",
    proves: "A private feed for your family. No ads, no strangers.",
  },
  {
    product: "Friendbookagram",
    proves: "A private, invite-only feed for your friends.",
  },
  {
    product: "PleaseBeReady",
    proves:
      "Calm emergency prep, one step at a time. Every checklist lists the exact gear to get.",
  },
];

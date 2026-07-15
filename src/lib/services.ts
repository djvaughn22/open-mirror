// ─────────────────────────────────────────────────────────────────────────────
// Talk-with-the-Owner service registry — single source of truth for
// /talk-with-the-owner.
//
// Three kinds of help, no public prices. Scope and terms are settled in the
// conversation, after the idea is understood. If payment links ever get
// added, they get added here — not sprinkled through the page.
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

/** The three kinds of help — plain names, plain explanations, no prices. */
export const TIERS: { name: string; how: string }[] = [
  {
    name: "An hour of direction",
    how: "Send the project and your questions first. Use the hour to make decisions and get unstuck.",
  },
  {
    name: "A written plan",
    how: "A clear, written path from your idea or prototype toward production — what to build, in what order.",
  },
  {
    name: "A full build",
    how: "Some ideas need more. Bigger work starts with a conversation and a clear scope.",
  },
];

/** The one line under the tiers. */
export const SCOPE_LINE =
  "Every project starts with a conversation. Reaching out costs nothing.";

/** Availability, honestly. */
export const AVAILABILITY =
  "Open Mirror runs on evenings and weekends, alongside a full-time job. Availability is limited. Every accepted project gets direct owner involvement.";

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

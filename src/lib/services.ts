// ─────────────────────────────────────────────────────────────────────────────
// Contact registry — single source of truth for /contact.
//
// One quiet page: a plain invitation, a form, and a privacy note. No prices,
// no tiers, no menu to pick from. If a payment link is ever added, it gets
// added here — not sprinkled through the page.
// ─────────────────────────────────────────────────────────────────────────────

import { STUDIO } from "./products";

export const SERVICE_EMAIL = STUDIO.email;

export const PAGE_TITLE = "Contact Open Mirror";

/** One-line description for metadata, OG tags, and structured data. */
export const META_DESCRIPTION =
  "Have an idea you want to bring to life? Open Mirror takes on one focused project at a time. Share what you're making and where you're stuck.";

/** The core message — the full version. */
export const CORE_MESSAGE =
  "Open Mirror takes on one focused project at a time. Work is handled directly, mostly during evenings and weekends. Share what you are trying to create, what you have already done, and where you need help. If the project feels like a good fit, Open Mirror will respond.";

/** Shorter version — same honesty, fewer words, used on small screens. */
export const CORE_MESSAGE_SHORT =
  "Open Mirror takes on one focused project at a time, worked on directly, mostly evenings and weekends. Share what you're making, what you've already done, and where you're stuck. If it's a good fit, you'll hear back.";

/** Shown near the form. Sets expectations honestly, without apology. */
export const PRIVACY_NOTE =
  "What you share here is only used to respond to your message. It isn't shared, sold, or added to a mailing list.";

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

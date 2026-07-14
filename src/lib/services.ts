// ─────────────────────────────────────────────────────────────────────────────
// Talk-with-the-Owner service registry — single source of truth for
// /talk-with-the-owner.
//
// Three tiers, no prices. Scope and terms are set per project, after the
// intake. When pricing or payment links are ready to go public, they get
// added here — not sprinkled through the page.
// ─────────────────────────────────────────────────────────────────────────────

import { STUDIO } from "./products";

export const SERVICE_EMAIL = STUDIO.email;

/** The engagement, in one line — used by the page, metadata, and OG tags. */
export const ENGAGEMENT =
  "Consulting and digital product creation, directly with the owner of Open Mirror LLC — one engagement at a time. Scope and terms are set per project, before anything starts.";

/** The three ways to work. No prices — terms are set per project. */
export const TIERS = [
  {
    name: "An hour of direction",
    how: "One conversation. A straight answer and a clear next step.",
  },
  {
    name: "A written plan",
    how: "What to build, what to skip, and in what order.",
  },
  {
    name: "A full build",
    how: "Designed, built, and put live. End to end.",
  },
];

/** The one boundary line shown under the tiers. */
export const SCOPE_LINE =
  "Scope and terms are set per project, in writing, before anything starts.";

/**
 * Portfolio proof — a selective set, not the whole registry.
 * `product` must match a `name` in src/lib/products.ts; the page joins them
 * so links, accents, and emoji stay in sync with the registry.
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
      "Calm emergency prep, one step at a time. A shop of the exact gear is on the way.",
  },
];

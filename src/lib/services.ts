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
    how: "One conversation about the idea or the obstacle. You get a straight answer and a clear next step.",
  },
  {
    name: "A written plan",
    how: "The idea worked into a short, buildable plan — what to build, what to skip, and in what order.",
  },
  {
    name: "A full build",
    how: "The product designed, built, and put live, end to end.",
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
    product: "CrossHeartPray",
    proves:
      "Mission-driven product thinking — a daily faith routine built as one coherent product, not a pile of features.",
  },
  {
    product: "WatchedNotWatched",
    proves:
      "Consumer product design — a full watch-tracking product with ranking boards and personal picks, no account required.",
  },
  {
    product: "OpenDoku",
    proves:
      "Reusable engines — one puzzle engine shipping multiple games (SlopeDoku, SurfDoku, MineDoku) instead of one-off builds.",
  },
  {
    product: "StepInTheRing",
    proves:
      "Idea to first build — the exact process of turning a raw idea into a scoped, buildable plan, as a working product.",
  },
  {
    product: "DontCloneMeTom",
    proves:
      "Creative concept development — a rescue-dog campaign with real adoptable dogs on the page, from a single odd idea.",
  },
  {
    product: "TheDJCares",
    proves:
      "Curation as a product — hand-picked music, sermons, and encouragement, organized so people actually use it.",
  },
];

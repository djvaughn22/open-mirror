// ─────────────────────────────────────────────────────────────────────────────
// Work-with-the-Founder service registry — single source of truth for
// /work-with-the-founder.
//
// One engagement, no menu, no prices. Scope and terms are set per project,
// after the intake. When pricing or payment links are ready to go public,
// they get added here — not sprinkled through the page.
// ─────────────────────────────────────────────────────────────────────────────

import { STUDIO } from "./products";

export const SERVICE_EMAIL = STUDIO.email;

/** The engagement, in one line — used by the page, metadata, and OG tags. */
export const ENGAGEMENT =
  "Consulting and digital product creation with the founder of Open Mirror. One engagement, shaped to your project — scope and terms depend on what you're making.";

/** Intake current-stage choices — shared by the form and the email body. */
export const INTAKE_STAGES = [
  "Just an idea",
  "Started, but stuck",
  "Live, but unclear",
  "Live and growing — needs direction",
] as const;

/** Who this page is for — the qualifying list under the hero. */
export const FOR_LIST = [
  "An idea you keep describing but haven't started",
  "A half-built project that stalled",
  "A business, ministry, or product that works but feels unclear",
  "A website that doesn't say what it should",
  "A creative concept you want to see as a real first version",
];

/** How it works, in order. Three steps — no discovery calls, no decks. */
export const PROCESS = [
  {
    title: "Tell the studio what you're making",
    text: "The short form below is all it takes.",
  },
  {
    title: "Get a straight answer",
    text: "A direct reply by email: whether it's a fit and what the right engagement looks like — including \"this isn't a fit\" if that's the honest answer.",
  },
  {
    title: "Scope, then work",
    text: "Every engagement starts with a short written scope, sized to the project — an hour of direction or a product built end to end. Then the work starts.",
  },
];

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

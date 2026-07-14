// ─────────────────────────────────────────────────────────────────────────────
// Talk-with-the-Owner service registry — single source of truth for
// /talk-with-the-owner.
//
// One engagement, no menu, no prices. Scope and terms are set per project,
// after the intake. When pricing or payment links are ready to go public,
// they get added here — not sprinkled through the page.
// ─────────────────────────────────────────────────────────────────────────────

import { STUDIO } from "./products";

export const SERVICE_EMAIL = STUDIO.email;

/** The engagement, in one line — used by the page, metadata, and OG tags. */
export const ENGAGEMENT =
  "Consulting and digital product creation, directly with the owner of Open Mirror LLC — one engagement at a time. Scope and terms are set per project, before anything starts.";

/** The quiet stat line under the hero. Every claim is verifiable on this site. */
export const STATS = ["One owner", "Built in 40 days", "All of it live"];

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
    title: "Send the brief",
    text: "The short form below is all it takes. No discovery call, no deck.",
  },
  {
    title: "Get a straight answer",
    text: "A direct reply: whether it's a fit and what the right engagement looks like. If it isn't, you'll hear that plainly.",
  },
  {
    title: "Scope, then work",
    text: "A short written scope — sized anywhere from an hour of direction to a product built end to end. Then the work starts.",
  },
];

/** Quiet boundaries — three lines, no prices, no legal wall. */
export const BOUNDARIES = [
  "Every engagement starts with a written scope.",
  "Work outside an agreed scope gets a new proposal.",
  "Sending the intake starts a conversation — not a client relationship.",
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

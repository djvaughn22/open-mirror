// ─────────────────────────────────────────────────────────────────────────────
// Homepage orientation — what a visitor can DO, not which domain owns it.
//
// The homepage used to group products by their internal development stage
// (Foundation / Live / Building). That answers a question only the studio
// has: it tells a first-time visitor which things are finished, not which
// thing to try. This file adds the two layers that answer the visitor's
// actual questions — "what should I try first?" and "where do I look for
// the kind of thing I want?" — without touching the product registry that
// every other page already reads.
//
// Two rules keep this honest:
//   1. Every destination here must ALSO exist in products.ts (as a product
//      href or one of its verified `links`). assertOrientationRoutes()
//      proves it, so this file can never invent a route.
//   2. The list stays short. Five things to try, six shelves. A curated
//      page is the whole point — a complete directory is what we replaced.
// ─────────────────────────────────────────────────────────────────────────────

import { products, type Product } from "./products.ts";

/** One thing a visitor can do right now. The experience is the headline;
    the product that owns it is a small label underneath. */
export type StartHere = {
  /** The experience, in the visitor's words — never a domain name. */
  title: string;
  /** What happens when they tap. One line, no pitch. */
  doing: string;
  href: string;
  emoji: string;
  /** The product this lives in — the small identity label. */
  product: string;
  accent: string;
};

/**
 * TRY THIS FIRST — five real experiences, each one a single tap from a
 * cold visit, each one something that works with no account, no payment,
 * and nothing to install. Deliberately five: this is an invitation, not a
 * directory.
 */
export const START_HERE: StartHere[] = [
  {
    title: "CircuitSwitchGame",
    doing: "Play the signal-routing arcade — five circuits, one tap between them.",
    href: "https://idontcry.com/games/circuit",
    emoji: "🔀",
    product: "iDontCry",
    accent: "#38BDF8",
  },
  {
    title: "Daily Hope",
    doing: "Start the day with one page of Scripture and encouragement.",
    href: "https://crossheartpray.com/daily-hope",
    emoji: "🌅",
    product: "CrossHeartPray",
    accent: "#C4B5FD",
  },
  {
    title: "Dog of the Day",
    doing: "Meet a real adoptable dog who is waiting for a home right now.",
    href: "https://dontclonemetom.com/today",
    emoji: "🐾",
    product: "DontCloneMeTom",
    accent: "#2DD4BF",
  },
  {
    title: "First Build Coach",
    doing: "Say an idea however it comes out, get back a plan for version one.",
    href: "https://stepinthering.com/build",
    emoji: "🧭",
    product: "StepInTheRing",
    accent: "#60A5FA",
  },
  {
    title: "Top 222",
    doing: "Sort the best movies and shows of any decade or genre.",
    href: "https://watchednotwatched.com/top",
    emoji: "🏆",
    product: "WatchedNotWatched",
    accent: "#22D3EE",
  },
];

/** The shelves a visitor browses by. Six, chosen because there is real
    work on each — never one shelf per database field. */
export type ShelfKey = "games" | "faith" | "build" | "music" | "dogs" | "tools";

export const SHELF_LABEL: Record<ShelfKey, string> = {
  games: "Games",
  faith: "Faith",
  build: "Build & Make",
  music: "Music",
  dogs: "Dogs & Good Causes",
  tools: "Tools",
};

/** Product name → shelf. Kept here rather than in the registry so the
    registry stays the studio's list and this stays the visitor's list. */
const SHELF_OF: Record<string, ShelfKey> = {
  iDontCry: "games",
  OpenDoku: "games",
  CrossHeartPray: "faith",
  TheDJCares: "music",
  DontCloneMeTom: "dogs",
  StepInTheRing: "build",
  "Old Computer to Build Machine": "build",
  WatchedNotWatched: "tools",
  PleaseBeReady: "tools",
  WhatAmIAI: "tools",
};

export const SHELF_ORDER: ShelfKey[] = ["games", "faith", "build", "music", "dogs", "tools"];

/** The products on a shelf, in registry order. Anything the registry hides
    from the portfolio stays hidden here too — one rule, not two. The
    featured product and the bottom-pinned resource keep their own sections
    on the page, exactly as before, so they are not shelved twice. */
export function shelfProducts(shelf: ShelfKey): Product[] {
  return products.filter(
    (p) =>
      p.showInPortfolio !== false &&
      p.featured !== true &&
      p.pinBottom !== true &&
      SHELF_OF[p.name] === shelf,
  );
}

/** Every shelf that actually has something on it. */
export function shelves(): { key: ShelfKey; label: string; items: Product[] }[] {
  return SHELF_ORDER
    .map((key) => ({ key, label: SHELF_LABEL[key], items: shelfProducts(key) }))
    .filter((s) => s.items.length > 0);
}

/** Every destination the registry vouches for: product hrefs and their
    verified sub-links. */
export function knownRoutes(): Set<string> {
  const out = new Set<string>();
  for (const p of products) {
    out.add(p.href);
    for (const l of p.links ?? []) out.add(l.href);
  }
  return out;
}

/**
 * Executable proof that orientation never invents a destination and never
 * loses a product. Returns problems; an empty array is the contract met.
 */
export function assertOrientationRoutes(): string[] {
  const problems: string[] = [];
  const known = knownRoutes();
  for (const s of START_HERE) {
    if (!known.has(s.href)) {
      problems.push(`Start Here "${s.title}" points at ${s.href}, which no product vouches for`);
    }
    if (!products.some((p) => p.name === s.product)) {
      problems.push(`Start Here "${s.title}" credits "${s.product}", which is not a product`);
    }
  }
  if (START_HERE.length < 3 || START_HERE.length > 5) {
    problems.push(`Start Here has ${START_HERE.length} items — it must stay between 3 and 5`);
  }
  // No public product may fall off the page entirely.
  const shelved = new Set(shelves().flatMap((s) => s.items.map((p) => p.name)));
  for (const p of products) {
    if (p.showInPortfolio === false) continue;
    // These two are placed by their own sections on the page.
    if (p.featured === true || p.pinBottom === true) {
      if (!SHELF_OF[p.name]) problems.push(`"${p.name}" still needs a shelf assignment`);
      continue;
    }
    if (!shelved.has(p.name)) problems.push(`"${p.name}" is public but sits on no shelf`);
  }
  return problems;
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature registry — "things you can actually try," not just websites.
//
// The homepage used to show a website card with tiny link pills underneath.
// This file promotes the useful individual experience (a game, a reading
// plan, a builder tool) to a first-class card. It NEVER invents a route: every
// href here must already exist on its product's `href` or `links` in
// products.ts, and that is enforced at import time below — a typo or a
// renamed route fails loudly instead of silently drifting.
//
// To add, reorder, or remove a feature card: edit ONLY the SEEDS array below.
// `order` is a per-category sort key (gaps of 10 on purpose, so a new card
// can slot in between two existing ones without renumbering everything).
//
// Descriptions are short and plain on purpose (owner rule, 2026-08-11): what
// the visitor actually does, 5-14 words, no marketing language.
// ─────────────────────────────────────────────────────────────────────────────

import { products, type Product } from "./products.ts";

export type FeatureCategory = "games" | "faith" | "build" | "listen" | "dogs" | "tools";

/** Render order for the "More to Try" sections — matches the owner's brief. */
export const CATEGORY_ORDER: FeatureCategory[] = [
  "games",
  "faith",
  "build",
  "listen",
  "dogs",
  "tools",
];

export const CATEGORY_LABEL: Record<FeatureCategory, string> = {
  games: "Games",
  faith: "Faith",
  build: "Build & Make",
  listen: "Listen & Enjoy",
  dogs: "Dogs & Good Causes",
  tools: "Tools",
};

export const CATEGORY_ICON: Record<FeatureCategory, string> = {
  games: "🎮",
  faith: "❤️",
  build: "🛠",
  listen: "🎵",
  dogs: "🐶",
  tools: "🧰",
};

/** The fixed, deterministic "what should I try first?" label per Start Here card. */
export const STARTHERE_LABEL: Record<string, string> = {
  games: "PLAY A GAME",
  faith: "GET ENCOURAGED",
  build: "MAKE SOMETHING",
  dogs: "MEET A DOG",
  listen: "LISTEN",
  tools: "USE A TOOL",
};

type FeatureSeed = {
  id: string;
  /** must match a Product.name in products.ts */
  product: string;
  /** must equal that product's href, or one of its links[].href */
  href: string;
  title: string;
  /** ~5-14 words, plain English, what the visitor actually does */
  description: string;
  cta: string;
  category: FeatureCategory;
  icon: string;
  /** a very small (3-5) curated set surfaced as "Try This First" */
  startHere?: boolean;
  /** sort key within its category, ascending, gaps of 10 */
  order: number;
};

export type Feature = FeatureSeed & { productAccent: string; productName: string };

/** True when a feature's href is one this product actually exposes. */
export function isValidFeatureHref(product: Product, href: string): boolean {
  return href === product.href || (product.links ?? []).some((l) => l.href === href);
}

function resolve(seed: FeatureSeed): Feature {
  const p = products.find((x) => x.name === seed.product);
  if (!p) {
    throw new Error(`features.ts: "${seed.id}" references unknown product "${seed.product}"`);
  }
  if (!isValidFeatureHref(p, seed.href)) {
    throw new Error(
      `features.ts: "${seed.id}" href ${seed.href} is not registered on ${seed.product} ` +
        `(products.ts href or links) — add it there first, never invent a route here.`
    );
  }
  return { ...seed, productAccent: p.accent, productName: p.name };
}

// ─────────────────────────────────────────────────────────────────────────────
// SEEDS — every card is a verified, live, public route (audited 2026-08-11
// from each product's own source, not guessed). Nothing here is an
// admin/owner/auth-gated page.
// ─────────────────────────────────────────────────────────────────────────────

const SEEDS: FeatureSeed[] = [
  // ── Games ──────────────────────────────────────────────────────────────
  {
    id: "minedoku",
    product: "OpenDoku",
    href: "https://opendoku.com/minedoku/",
    title: "MineDoku",
    description: "Minesweeper meets Sudoku. Clear the board without guessing.",
    cta: "Play",
    category: "games",
    icon: "⛏️",
    startHere: true,
    order: 10,
  },
  {
    id: "circuit-pulseshift",
    product: "iDontCry",
    href: "https://idontcry.com/games/circuit/classic",
    title: "Circuit",
    description: "Tap to switch rails before the pulse overloads.",
    cta: "Play",
    category: "games",
    icon: "🔘",
    order: 20,
  },
  {
    id: "circuit-ring",
    product: "iDontCry",
    href: "https://idontcry.com/games/circuit/classic/ring",
    title: "Circuit Ring",
    description: "One lap, one tap. The original ring game.",
    cta: "Play",
    category: "games",
    icon: "🔄",
    order: 30,
  },
  {
    id: "surge",
    product: "iDontCry",
    href: "https://idontcry.com/games/circuit/surge",
    title: "Surge",
    description: "Tap to leap gaps and spikes on a circuit board.",
    cta: "Play",
    category: "games",
    icon: "⚡",
    order: 40,
  },
  {
    id: "football",
    product: "iDontCry",
    href: "https://idontcry.com/games/circuit/football",
    title: "Football",
    description: "Call the play. Run both sides of the ball.",
    cta: "Play",
    category: "games",
    icon: "🏈",
    order: 50,
  },
  {
    id: "baseball",
    product: "iDontCry",
    href: "https://idontcry.com/games/circuit/baseball",
    title: "Baseball",
    description: "Bat and pitch — you play both teams.",
    cta: "Play",
    category: "games",
    icon: "⚾",
    order: 60,
  },
  {
    id: "skiing",
    product: "iDontCry",
    href: "https://idontcry.com/games/circuit/skiing",
    title: "Skiing",
    description: "Carve the gates down the mountain, dodge the trees.",
    cta: "Play",
    category: "games",
    icon: "🎿",
    order: 70,
  },
  {
    id: "pole-vault",
    product: "iDontCry",
    href: "https://idontcry.com/games/circuit/pole-vault",
    title: "Pole Vault",
    description: "Sprint, plant the pole, clear the rising bar.",
    cta: "Play",
    category: "games",
    icon: "🤸",
    order: 80,
  },
  {
    id: "piano-corner",
    product: "iDontCry",
    href: "https://idontcry.com/piano",
    title: "Piano Corner",
    description: "Real piano lessons, right on the screen.",
    cta: "Play",
    category: "games",
    icon: "🎹",
    order: 90,
  },
  {
    id: "slopedoku",
    product: "OpenDoku",
    href: "https://opendoku.com/slopedoku/",
    title: "SlopeDoku",
    description: "Winter sudoku — climb from bunny hill to double black.",
    cta: "Play",
    category: "games",
    icon: "🏔️",
    order: 100,
  },
  {
    id: "surfdoku",
    product: "OpenDoku",
    href: "https://opendoku.com/surfdoku/",
    title: "SurfDoku",
    description: "Beach sudoku — climb the tide, stage by stage.",
    cta: "Play",
    category: "games",
    icon: "🌞",
    order: 110,
  },

  // ── Faith ──────────────────────────────────────────────────────────────
  {
    id: "daily-hope",
    product: "CrossHeartPray",
    href: "https://crossheartpray.com/daily-hope",
    title: "Daily Hope",
    description: "A short Bible encouragement for today.",
    cta: "Read Today",
    category: "faith",
    icon: "🌅",
    startHere: true,
    order: 10,
  },
  {
    id: "bible-reading-plan",
    product: "CrossHeartPray",
    href: "https://crossheartpray.com/bible-reading-plan",
    title: "Bible Reading Plan",
    description: "Read the Bible in 1 or 2 years, your pace.",
    cta: "Choose a Plan",
    category: "faith",
    icon: "📖",
    order: 20,
  },
  {
    id: "life-essentials",
    product: "CrossHeartPray",
    href: "https://crossheartpray.com/life-essentials",
    title: "Life Essentials",
    description: "1,500 Bible principles from Dr. Gene Getz, with video.",
    cta: "Explore",
    category: "faith",
    icon: "📔",
    order: 30,
  },
  {
    id: "bible-bingo-7",
    product: "CrossHeartPray",
    href: "https://crossheartpray.com/explorebible",
    title: "Bible Bingo 7",
    description: "Deal 7 Bible cards, open one, and read it.",
    cta: "Deal Cards",
    category: "faith",
    icon: "🃏",
    order: 40,
  },

  // ── Build & Make ───────────────────────────────────────────────────────
  {
    id: "first-build-coach",
    product: "StepInTheRing",
    href: "https://stepinthering.com/build",
    title: "First Build Coach",
    description: "Bring an idea. Get a plan to build it.",
    cta: "Start Building",
    category: "build",
    icon: "🧭",
    startHere: true,
    order: 10,
  },
  {
    id: "how-it-works",
    product: "StepInTheRing",
    href: "https://stepinthering.com/how",
    title: "How It Works",
    description: "See the whole idea-to-live road, step by step.",
    cta: "See How",
    category: "build",
    icon: "❔",
    order: 20,
  },
  {
    id: "build-machine-assessment",
    product: "StepInTheRing",
    href: "https://stepinthering.com/build-machine",
    title: "Build Machine Assessment",
    description: "Check if an old computer can become a dev machine.",
    cta: "Check It",
    category: "build",
    icon: "💻",
    order: 30,
  },

  // ── Listen & Enjoy ─────────────────────────────────────────────────────
  {
    id: "digital-dj",
    product: "TheDJCares",
    href: "https://thedjcares.com/digital-dj",
    title: "Digital DJ",
    description: "Pick a mood, get a song, sermon, or podcast.",
    cta: "Get a Pick",
    category: "listen",
    icon: "🎧",
    order: 10,
  },

  // ── Dogs & Good Causes ─────────────────────────────────────────────────
  {
    id: "dog-of-the-day",
    product: "DontCloneMeTom",
    href: "https://dontclonemetom.com/today",
    title: "Dog of the Day",
    description: "One real adoptable dog, featured fresh today.",
    cta: "Meet Today's Dog",
    category: "dogs",
    icon: "🐾",
    startHere: true,
    order: 10,
  },
  {
    id: "make-a-dog-card",
    product: "DontCloneMeTom",
    href: "https://dontclonemetom.com/cards",
    title: "Make a Dog Card",
    description: "Make a free trading card for a real dog.",
    cta: "Make a Card",
    category: "dogs",
    icon: "🃏",
    order: 20,
  },

  // ── Tools ──────────────────────────────────────────────────────────────
  {
    id: "search-and-track",
    product: "WatchedNotWatched",
    href: "https://watchednotwatched.com/search",
    title: "Search & Track",
    description: "Search a movie or show, mark it watched.",
    cta: "Start Tracking",
    category: "tools",
    icon: "🔍",
    order: 10,
  },
  {
    id: "top-222",
    product: "WatchedNotWatched",
    href: "https://watchednotwatched.com/top",
    title: "Top 222",
    description: "Top-rated movies and shows, filter by decade or genre.",
    cta: "See the List",
    category: "tools",
    icon: "🏆",
    order: 20,
  },
  {
    id: "for-you",
    product: "WatchedNotWatched",
    href: "https://watchednotwatched.com/foryou",
    title: "For You",
    description: "Picks based on what you've already watched.",
    cta: "Get Picks",
    category: "tools",
    icon: "🎯",
    order: 30,
  },
  {
    id: "emergency-ready-checklist",
    product: "PleaseBeReady",
    href: "https://pleasebeready.com",
    title: "Emergency Ready Checklist",
    description: "Calm, practical prep steps for your family.",
    cta: "Get Ready",
    category: "tools",
    icon: "🎒",
    order: 40,
  },
  {
    id: "daily-readiness-check",
    product: "PleaseBeReady",
    href: "https://pleasebeready.com/today",
    title: "Daily Readiness Check",
    description: "One small preparedness task, every day.",
    cta: "Today's Task",
    category: "tools",
    icon: "✅",
    order: 50,
  },
];

/** Every feature, resolved and validated against products.ts. */
export const FEATURES: Feature[] = SEEDS.map(resolve);

/** The small, curated "Try This First" set — deterministic, owner-editable. */
export function startHereFeatures(): Feature[] {
  return FEATURES.filter((f) => f.startHere).sort((a, b) => a.order - b.order);
}

/** Every non-Start-Here feature in one category, in order. */
export function featuresByCategory(category: FeatureCategory): Feature[] {
  return FEATURES.filter((f) => f.category === category && !f.startHere).sort(
    (a, b) => a.order - b.order
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Open Mirror LLC product registry — the single source of truth.
//
// The homepage, About page, and nav menu all read from this file.
// To add, reorder, or restatus a product, edit ONLY this file.
//
// Descriptions are DJ's words. Do not rewrite them to sound polished.
// ─────────────────────────────────────────────────────────────────────────────

export type ProductStatus =
  | "foundation" // the product at the origin of Open Mirror
  | "live"       // public and functioning
  | "beta"       // public but still being tested or completed
  | "building"   // actively under development
  | "exploring"  // an early concept or experiment
  | "archived";  // preserved but not currently being developed

export const STATUS_LABEL: Record<ProductStatus, string> = {
  foundation: "Foundation",
  live: "Live",
  beta: "Beta",
  building: "Building",
  exploring: "Exploring",
  archived: "Archived",
};

export type Product = {
  name: string;
  emoji: string;
  /** short factual description — homepage card */
  description: string;
  /** longer description — About page (falls back to `description`) */
  aboutText?: string;
  /** site accent color (family rule: the colored ".com") */
  accent: string;
  /** full URL for standalone sites, or a hub route like "/reflect" */
  href: string;
  status: ProductStatus;
  category: "faith" | "family" | "creativity" | "play";
  /** direct sub-links shown as pills on the card (e.g. individual games) */
  links?: { label: string; href: string }[];
  /** hidden from the homepage portfolio when false */
  showInPortfolio?: boolean;
  /** hidden from the nav menu when false */
  showInNav?: boolean;
  /** pulled out of the status groups and pinned to the very bottom of the homepage and About page */
  pinBottom?: boolean;
};

export const STUDIO = {
  name: "Open Mirror LLC",
  label: "Independent Creative Studio",
  mission:
    "Open Mirror LLC is an independent creative studio building useful, original products across faith, family, creativity, and play — all made to help people create.",
  missionShort:
    "Creating useful, original products across faith, family, creativity, and play.",
  supportLine:
    "Each product has its own purpose and identity, supported by one shared studio.",
  /** The meaning of the name — stated once, on the About page. */
  whyTheName:
    "The name is the idea: take an honest look at yourself and ask, \"What do I want to create?\" Sometimes that's a business. Sometimes a website, a product, a game, or something that simply makes life better. Open Mirror is where those ideas get built.",
  /** Quiet founder note — plain, no selling, no name. */
  founderNote:
    "Open Mirror is built by one founder. Every product here comes from years of creating, experimenting, and refining — and from using these things in everyday life, family included.",
  url: "https://openmirrorllc.com",
  email: "ask@openmirrorllc.com",
};

// Array order is display order within each status group.
export const products: Product[] = [
  {
    name: "CrossHeartPray",
    emoji: "✝️",
    description:
      "Daily Hope, a Bible reading plan, Gene Getz's Life Essentials, and Bible Bingo 7 — your daily faith routine.",
    aboutText:
      "A daily faith routine — verses, prayer, Daily Hope, Bible Bingo, and source-backed Deep Dive. One project, fully its own thing.",
    accent: "#C4B5FD",
    href: "https://crossheartpray.com",
    status: "foundation",
    category: "faith",
  },
  {
    name: "TheDJCares",
    emoji: "🎵",
    description:
      "Hand-picked music, sermons, podcasts, and encouragement — Gospel first.",
    aboutText:
      "Hand-picked Christian music, sermons, podcasts, and encouragement — Gospel first, no algorithm.",
    accent: "#A78BFA",
    href: "https://thedjcares.com",
    status: "live",
    category: "faith",
  },
  {
    name: "DontCloneMeTom",
    emoji: "🐶",
    description:
      "Real adoptable dogs looking for homes — meet them right on the page. A kind rescue campaign.",
    aboutText:
      "A rescue-dog campaign with a wagging tail. Don't clone me, Tom — adopt an original.",
    accent: "#2DD4BF",
    href: "https://dontclonemetom.com",
    status: "live",
    category: "family",
  },
  {
    name: "iDontCry",
    emoji: "😂",
    description:
      "The family's playground — dad jokes, games, and a Dream Lab to dream up anything, free.",
    aboutText:
      "Obviously. The family's digital playground. Dad jokes, mini games, and the Dream Lab — dream up anything, free, then step in the ring and build it for real. Absolutely zero crying.",
    accent: "#38BDF8",
    href: "https://idontcry.com",
    status: "live",
    category: "play",
  },
  {
    name: "StepInTheRing",
    emoji: "🥊",
    description:
      "Take any idea — even one you dreamed up on iDontCry — and turn it into a real first build. Seven questions, one fight plan.",
    aboutText:
      "Turn any idea into a real first build — seven questions, one fight plan. Free to start.",
    accent: "#60A5FA",
    href: "https://stepinthering.com",
    status: "live",
    category: "creativity",
  },
  {
    name: "OpenDoku",
    emoji: "🧩",
    description:
      "Puzzle games that start easy and climb to two puzzles in every tile — same brain, different weather. Newest: MineDoku, dreamed up on iDontCry, built in StepInTheRing through the gate, and pushed and deployed with one prompt.",
    aboutText:
      "The puzzle-games family. SlopeDoku (winter) and SurfDoku (beach) climb from one easy rule to two full sudokus in every tile. MineDoku (underground number digs) is the newest — dreamed up on iDontCry, built in StepInTheRing through the gate, and pushed and deployed with one prompt. More dokus to come.",
    accent: "#7DD3FC",
    href: "https://opendoku.com",
    status: "live",
    category: "play",
    links: [
      { label: "🏔️ SlopeDoku", href: "https://opendoku.com/slopedoku/" },
      { label: "🌞 SurfDoku", href: "https://opendoku.com/surfdoku/" },
      { label: "⛏️ MineDoku", href: "https://opendoku.com/minedoku/" },
    ],
  },
  {
    name: "PleaseBeReady",
    emoji: "🧰",
    description:
      "Friendly emergency prep for everyone. Calm, practical, one step at a time.",
    aboutText:
      "Friendly emergency preparedness for everyone. Calm, practical, one small step at a time — no doomsday.",
    accent: "#34D399",
    href: "https://pleasebeready.com",
    status: "live",
    category: "family",
    pinBottom: true,
  },
  {
    // Hidden gem: the /reflect route stays live for people who know it,
    // but it is not promoted on the homepage, About page, or nav.
    name: "Reflect",
    emoji: "🪞",
    description:
      "A quiet minute — one honest prompt, then a few things to sit with.",
    aboutText:
      "The five-second version. One prompt, a few honest lines, a little clarity.",
    accent: "#93C5FD",
    href: "/reflect",
    status: "beta",
    category: "creativity",
    showInPortfolio: false,
    showInNav: false,
  },
  {
    name: "WatchedNotWatched",
    emoji: "🎬",
    description:
      "Remember what you watched. Thumb movies and shows 👍 or 👎, sort the Top 222 of any decade or genre, and get picks based on what you liked. No account — saved on your device.",
    aboutText:
      "A fast watch list for movies and TV. Search anything, mark it watched with a thumbs up or down, and work through the Top 222 of all time — or any decade or genre — on a drag-and-drop board. Your thumbs power For You picks. Free, no account, everything saved on your device and exportable anytime.",
    accent: "#22D3EE",
    href: "https://watchednotwatched.com",
    status: "live",
    category: "family",
  },
  {
    name: "WhatAmIAI",
    emoji: "🤖",
    description:
      "See what your own AI prompts say about how you use AI, think through one real situation, or look at your bigger patterns. No labels — you're not a category.",
    aboutText:
      "A three-part reflection tool — paste your own AI prompts and see how you actually use AI, work through one real situation, or take a wider look at your patterns. Runs on your device. No accounts, no labels. Still being polished.",
    accent: "#E879F9",
    href: "https://whatamiai.com",
    status: "building",
    category: "creativity",
  },
  {
    name: "Fambookagram",
    emoji: "👨‍👩‍👧‍👦",
    description:
      "Your family's private feed. Photos and moments — no ads, no algorithm, no strangers. Placeholder domain while we test the concept — if it proves valuable, expect a domain change.",
    accent: "#C084FC",
    href: "https://fambookagram.com",
    status: "exploring",
    category: "family",
    showInNav: false,
  },
  {
    name: "Friendbookagram",
    emoji: "🫂",
    description:
      "Where your friends actually stay in touch. Private, calm, invite-only. Placeholder domain while we test the concept — if it proves valuable, expect a domain change.",
    accent: "#818CF8",
    href: "https://friendbookagram.com",
    status: "exploring",
    category: "family",
    showInNav: false,
  },
];

/** Portfolio display order: Foundation → Live → Beta → Building → Exploring → Archived. */
export const STATUS_ORDER: ProductStatus[] = [
  "foundation",
  "live",
  "beta",
  "building",
  "exploring",
  "archived",
];

export function productsByStatus(status: ProductStatus): Product[] {
  return products.filter(
    (p) => p.status === status && p.showInPortfolio !== false && p.pinBottom !== true
  );
}

/** Bottom-of-page section shared by the homepage and About page. */
export const BOTTOM_PIN_LABEL = "Live resource for emergency planning";

export function bottomPinnedProducts(): Product[] {
  return products.filter(
    (p) => p.pinBottom === true && p.showInPortfolio !== false
  );
}

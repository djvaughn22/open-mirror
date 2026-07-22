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

// ─────────────────────────────────────────────────────────────────────────────
// Visitor-relationship labels — what an item IS to the visitor, not its
// internal development stage. One small, consistent vocabulary, used sparingly
// on the About story and the product-review page.
//   Foundation   — the personal first build everything grew from (CrossHeartPray)
//   Free         — free to explore and use, right now
//   Product      — a packaged product (paid, or being prepared to be)
//   Project Help — direct, limited one-project help
//   Exploring    — an early idea still being tested
// ─────────────────────────────────────────────────────────────────────────────
export type AccessLabel = "Foundation" | "Free" | "Product" | "Project Help" | "Exploring";

export const ACCESS_TONE: Record<AccessLabel, string> = {
  Foundation: "#C4B5FD",
  Free: "#34D399",
  Product: "#F59E0B",
  "Project Help": "#7DD3FC",
  Exploring: "#94A3B8",
};

export type Product = {
  name: string;
  emoji: string;
  /** short factual description — homepage card */
  description: string;
  /** one short sentence — the compact About entry. Falls back to `description`. */
  aboutLine?: string;
  /** what the visitor does next from the About entry */
  aboutAction?: string;
  /** what this IS to a visitor — never the internal `status` */
  access: AccessLabel;
  /** optional qualifier on the access chip, e.g. "First Build", "Preparing for Release" */
  accessNote?: string;
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
  /** hidden from the About family when false */
  showInAbout?: boolean;
  /** hidden from the nav menu when false */
  showInNav?: boolean;
  /** pulled out of the status groups and pinned to the very bottom of the homepage and About page */
  pinBottom?: boolean;
  /**
   * Visual priority. A featured product is lifted out of the status groups and
   * rendered as its own panel on About page. Set it here — never hard-code a
   * product name in a page component. Does NOT appear on the homepage.
   */
  featured?: boolean;
  /** larger launch image for the featured panel (must live under /public) */
  image?: string;
  /** alt text for `image` — required whenever `image` is set */
  imageAlt?: string;
};

export const STUDIO = {
  name: "Open Mirror LLC",
  label: "Independent Creative Studio",
  mission:
    "Open Mirror LLC is an independent creative studio building useful, original products across faith, family, creativity, and play — all made to help people create.",
  missionShort:
    "Creating useful, original products across\nfaith, family, creativity, and play.",
  supportLine:
    "Each product has its own purpose and identity, supported by one shared studio.",
  url: "https://openmirrorllc.com",
  email: "ask@openmirrorllc.com",
};

// Array order is display order within each status group.
export const products: Product[] = [
  {
    // PROTECTED — the Foundation and first build. Gospel-first identity, its
    // own thing. Never a funnel, a sales example, or a generic faith card.
    name: "CrossHeartPray",
    emoji: "✝️",
    description:
      "Daily Hope, a Bible reading plan, Gene Getz's Life Essentials, and Bible Bingo 7 — your daily faith routine.",
    aboutLine:
      "A daily faith routine — Daily Hope, a Bible reading plan, Life Essentials, and Bible Bingo. Gospel first.",
    aboutAction: "Open CrossHeartPray",
    access: "Foundation",
    accessNote: "First Build",
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
    aboutLine:
      "Hand-picked Christian music, sermons, podcasts, and encouragement — Gospel first, no algorithm.",
    aboutAction: "Listen",
    access: "Free",
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
    // Rescue-first, inspired by the cloned-dog headline. NOT "a dog named Tom" —
    // the name speaks for the rescue dog: "Don't clone me, Tom. I'm already here."
    aboutLine:
      "A rescue-first campaign inspired by a cloned-dog headline. Meet real adoptable dogs already waiting for homes.",
    aboutAction: "Meet the dogs",
    access: "Free",
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
    aboutLine:
      "The family's playground — dad jokes, games, and a Dream Lab to dream up anything.",
    aboutAction: "Play",
    access: "Free",
    accent: "#38BDF8",
    href: "https://idontcry.com",
    status: "live",
    category: "play",
  },
  {
    name: "StepInTheRing",
    emoji: "🥊",
    description:
      "Take any idea — even one you dreamed up on iDontCry — and turn it into a real first build. Say it however it comes out; get back a plan for version one and a builder prompt.",
    // Trimmed 2026-07-19 (owner copy rule): the About page never mentions
    // prompts or build tooling, so the About line ends at the plan.
    aboutLine:
      "A rough idea becomes a clear plan for version one.",
    aboutAction: "Start building",
    access: "Free",
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
    aboutLine: "One puzzle engine, a growing family of games.",
    aboutAction: "Play",
    access: "Free",
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
    aboutLine:
      "Friendly emergency preparedness — calm, practical, one small step at a time.",
    aboutAction: "Get ready",
    access: "Free",
    accent: "#34D399",
    href: "https://pleasebeready.com",
    status: "live",
    category: "family",
    pinBottom: true,
    // 2026-07-20: discovered through the homepage directory and the About-page
    // reminder card, not from every page's persistent menu.
    showInNav: false,
  },
  {
    // Hidden gem: the /reflect route stays live for people who know it,
    // but it is not promoted on the homepage, About page, or nav.
    name: "Reflect",
    emoji: "🪞",
    description:
      "A quiet minute — one honest prompt, then a few things to sit with.",
    aboutLine: "The five-second version. One prompt, a little clarity.",
    aboutAction: "Take a minute",
    access: "Free",
    accent: "#93C5FD",
    href: "/reflect",
    status: "beta",
    category: "creativity",
    showInPortfolio: false,
    showInAbout: false,
    showInNav: false,
  },
  {
    name: "WatchedNotWatched",
    emoji: "🎬",
    // No emoji inside the sentence — on phones without the glyphs it used to
    // read "Thumb movies and shows or , sort…".
    description:
      "Remember what you watched. Thumb movies and shows up or down, sort the Top 222 of any decade or genre, and get picks based on what you liked. No account — saved on your device.",
    aboutLine:
      "Thumb what you watch, then get picks based on what you liked. No account.",
    aboutAction: "Start a list",
    access: "Free",
    accent: "#22D3EE",
    href: "https://watchednotwatched.com",
    status: "live",
    category: "family",
  },
  {
    name: "WhatAmIAI",
    emoji: "🤖",
    description:
      "See the patterns in the questions you ask, think through one real situation, or look at how you approach tools and decisions. No labels — you're not a category.",
    aboutLine:
      "See your own patterns, one honest look at a time. Runs on your device, no labels.",
    aboutAction: "Take a look",
    // Free to use today, still being polished — the qualifier says so plainly.
    access: "Free",
    accessNote: "Building",
    accent: "#E879F9",
    href: "https://whatamiai.com",
    status: "building",
    category: "creativity",
  },
  {
    // PROTECTED copy — a real, visible example of an idea still being tested.
    // The placeholder-domain sentence is deliberate. Never hide, park, merge,
    // rename, or rewrite this as a failed product.
    name: "Fambookagram",
    emoji: "👨‍👩‍👧‍👦",
    description:
      "Your family's private feed. Photos and moments — no ads, no algorithm, no strangers. Placeholder domain while we test the concept — if it proves valuable, expect a domain change.",
    aboutLine: "A private family feed — an idea still being tested.",
    aboutAction: "Take a look",
    access: "Exploring",
    accent: "#C084FC",
    href: "https://fambookagram.com",
    status: "exploring",
    category: "family",
  },
  {
    // PROTECTED copy — see Fambookagram above. Same role, same rules.
    name: "Friendbookagram",
    emoji: "🫂",
    description:
      "Where your friends actually stay in touch. Private, calm, invite-only. Placeholder domain while we test the concept — if it proves valuable, expect a domain change.",
    aboutLine:
      "Where friends actually stay in touch — an idea still being tested.",
    aboutAction: "Take a look",
    access: "Exploring",
    accent: "#818CF8",
    href: "https://friendbookagram.com",
    status: "exploring",
    category: "family",
  },
  {
    // The first packaged Open Mirror product. Featured — it renders as its own
    // panel, not as one more card. No checkout exists yet, so the qualifier
    // stays "Preparing for Release" until delivery actually works. Broadened
    // 2026-07-19 from "Old Laptop" to cover desktops too; the route keeps the
    // original /products/old-laptop-to-build-machine URL.
    name: "Old Computer to Build Machine",
    emoji: "💻",
    description:
      "Turn an old laptop or desktop PC into a clean build machine — ready to turn an idea into a live website.",
    aboutLine:
      "Turn an old laptop or desktop PC into a real development machine, and put your first website online.",
    aboutAction: "View the product",
    access: "Product",
    accessNote: "Preparing for Release",
    accent: "#F59E0B",
    href: "/products/old-laptop-to-build-machine",
    status: "building",
    category: "creativity",
    featured: true,
    // 2026-07-20 (owner): low-key like PleaseBeReady — discovered through the
    // About featured panel and its own page, never a persistent menu row.
    showInNav: false,
    image: "/products/old-laptop-to-build-machine.png",
    imageAlt:
      "An unused laptop with a dark screen beside the same laptop running a Build Log website, above the words: same laptop, Linux, real developer tools, and your own website live on the internet.",
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
    (p) =>
      p.status === status &&
      p.showInPortfolio !== false &&
      p.pinBottom !== true &&
      p.featured !== true
  );
}

/** The one featured product, or undefined. Pages ask for it — they never name it. */
export function featuredProduct(): Product | undefined {
  return products.find((p) => p.featured === true);
}

/**
 * The public Open Mirror family, in registry order, for the About page.
 * Excludes the Foundation (shown on its own), the featured product (its own
 * panel), and anything intentionally kept off About.
 */
export function aboutFamilyProducts(): Product[] {
  return products.filter(
    (p) =>
      p.showInAbout !== false &&
      p.featured !== true &&
      p.status !== "foundation"
  );
}

/** The Foundation — CrossHeartPray. */
export function foundationProduct(): Product | undefined {
  return products.find((p) => p.status === "foundation");
}

/** Bottom-of-page section shared by the homepage and About page. */
export const BOTTOM_PIN_LABEL = "Live resource for emergency planning";

export function bottomPinnedProducts(): Product[] {
  return products.filter(
    (p) => p.pinBottom === true && p.showInPortfolio !== false
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared-navigation order — the one ordering rule every Open Mirror menu reads.
//
//   1. CrossHeartPray — the Foundation
//   2. Public projects, free to use
//   3. Building projects
//   4. Exploring ideas
//   5. PleaseBeReady and approved resources
//   6. Old Computer to Build Machine — last
//
// The Foundation opens the menu and the packaged product closes it, so nothing
// between them reads as a funnel toward a sale. Menus render these groups in
// array order — never hand-keep a second list of names in a component.
// ─────────────────────────────────────────────────────────────────────────────

export type NavGroupKey =
  | "foundation"
  | "free"
  | "inProgress"
  | "exploring"
  | "resources"
  | "product";

export type NavGroup = {
  key: NavGroupKey;
  /** small uppercase label above the group; omitted when the group needs none */
  heading?: string;
  /** qualifier shown alongside each row in the group */
  note?: string;
  items: Product[];
};

/** Groups that close the menu, after the About/Contact utility links. */
export const NAV_TAIL_KEYS: NavGroupKey[] = ["resources", "product"];

/** The shared menu, grouped and ordered. Empty groups are dropped. */
export function navGroups(): NavGroup[] {
  const pick = (match: (p: Product) => boolean): Product[] =>
    products.filter((p) => p.showInNav !== false && match(p));
  // Pinned resources and the packaged product are placed by their own groups.
  const ungrouped = (p: Product) => p.pinBottom !== true && p.featured !== true;

  const groups: NavGroup[] = [
    {
      key: "foundation",
      note: "Foundation",
      items: pick((p) => p.status === "foundation"),
    },
    {
      key: "free",
      heading: "Free to use",
      items: pick((p) => p.status === "live" && ungrouped(p)),
    },
    {
      key: "inProgress",
      heading: "In progress",
      items: pick((p) => (p.status === "building" || p.status === "beta") && ungrouped(p)),
    },
    {
      key: "exploring",
      heading: "Exploring ideas",
      items: pick((p) => p.status === "exploring" && ungrouped(p)),
    },
    {
      key: "resources",
      items: pick((p) => p.pinBottom === true && p.featured !== true),
    },
    {
      key: "product",
      heading: "First product · preparing for release",
      items: pick((p) => p.featured === true),
    },
  ];

  return groups.filter((g) => g.items.length > 0);
}

/** The flat shared-navigation order — what a visitor reads top to bottom. */
export function navProductOrder(): Product[] {
  return navGroups().flatMap((g) => g.items);
}

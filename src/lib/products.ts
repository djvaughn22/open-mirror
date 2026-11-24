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
  /** direct sub-links shown as a collapsible feature list on the card (e.g. individual games) */
  links?: { label: string; href: string }[];
  /**
   * Word used in the homepage card's expand control: "View {word} ↓" /
   * "Hide {word} ↑". Falls back to "features" — set this instead of
   * hard-coding a product name in the page component.
   */
  expandLabel?: string;
  /** hidden from the homepage portfolio when false */
  showInPortfolio?: boolean;
  /** hidden from the About family when false */
  showInAbout?: boolean;
  /** hidden from the nav menu when false */
  showInNav?: boolean;
  /**
   * A beta or an experiment (owner, 2026-10-08): public and usable, but not
   * yet one of the projects Open Mirror's purpose rests on. Shown under
   * "Betas and experiments" everywhere, with a Beta badge while it is live.
   */
  experiment?: boolean;
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

/**
 * A site's brand name as the hub shows it: its canonical ".com" name
 * (owner, 2026-10-08), split so the suffix can carry the site's accent.
 * Only for products that ARE a site (an https href); a hub route like
 * /reflect has no domain and gets none. The domain is the product's own
 * verified href host — never composed from a guess.
 */
export function siteName(p: Pick<Product, "name" | "href">): { base: string; dot: string } {
  if (!/^https:\/\//.test(p.href)) return { base: p.name, dot: "" };
  const base = p.name.endsWith(".com") ? p.name.slice(0, -4) : p.name;
  return { base, dot: ".com" };
}

export const STUDIO = {
  name: "Open Mirror LLC",
  label: "Independent Creative Studio",
  // The homepage's one welcoming line (and its meta description). Quiet on
  // purpose: the fuller purpose lives on About.
  // The owner's homepage line (2026-10-22); also the homepage description.
  // 2026-11-14 (owner brief): the homepage must say what Open Mirror is within
  // ten seconds. Plain words; no mission block.
  // 2026-11-19 (owner): "family history" added after WhatAmIAI's family
  // history pages went live; the list follows the homepage's group order.
  // 2026-11-24 (owner messaging direction): Open Mirror is an independent
  // studio and each site stands on its own. The studio's lines no longer list
  // product categories, and preparedness ("getting ready") belongs to
  // PleaseBeReady alone, never to Open Mirror's identity.
  welcome: "An independent studio that turns ideas into useful websites and apps. Each site has its own name and purpose.",
  /**
   * The homepage hero (owner direction 2026-11-20, night; replaces the Nov 19-20
   * "Useful websites for everyday life" hero, which was rejected in production):
   * the studio's name as the headline, one plain sentence saying what Open Mirror
   * makes, and one action into the directory. No website-starter or paid-work
   * link, no featured-product capture, no business copy on the homepage.
   */
  hero: {
    lede: "An independent studio that turns ideas into useful websites and apps.",
    primary: { label: "Explore the apps", href: "#projects" },
  },
  // The default description and share text for hub pages (2026-11-24: the
  // same plain identity as the homepage, no list of product categories).
  mission:
    "Open Mirror LLC is an independent studio that turns ideas into useful websites and apps. Each site has its own name and purpose.",
  /**
   * The About page's opening, in the owner's direction (2026-10-08, second
   * pass): plain, warm, direct. About only — never a homepage block, never on
   * a satellite site. PleaseBeReady is deliberately not named here.
   */
  purpose: [
    "Open Mirror LLC is an independent company behind a group of separate websites. Each project has its own name, audience, and purpose.",
    "Christian faith guides the work. The projects include resources for prayer and Christian media, family entertainment, turning ideas into real projects, and supporting dog rescue. Some projects are established; others are still being tested or developed.",
  ],
  missionShort:
    "Creating useful, original products across\nfaith, family, creativity, and play.",
  supportLine:
    "Each product has its own purpose and identity, supported by one shared studio.",
  url: "https://openmirrorllc.com",
  email: "ask@openmirrorllc.com",
};

// Array order is display order (owner's hierarchy, 2026-10-08): prayer and
// faithful media, the family and build doors, the rescue project, then the
// betas and experiments, then PleaseBeReady as a secondary resource.
export const products: Product[] = [
  {
    // PROTECTED — the Foundation and first build. Gospel-first identity, its
    // own thing. Never a funnel, a sales example, or a generic faith card.
    name: "CrossHeartPray",
    emoji: "✝️",
    description:
      "Daily Bible reading and prayer: Daily Hope, a Bible reading plan, Gene Getz's Life Essentials, and Bible Bingo 7.",
    aboutLine:
      "Daily Bible reading and prayer: Daily Hope, a Bible reading plan, Life Essentials, and Bible Bingo.",
    aboutAction: "Open CrossHeartPray",
    access: "Foundation",
    accessNote: "First Build",
    accent: "#C4B5FD",
    href: "https://crossheartpray.com",
    status: "foundation",
    category: "faith",
    links: [
      { label: "🌅 Daily Hope", href: "https://crossheartpray.com/daily-hope" },
      { label: "📖 Bible Reading Plan", href: "https://crossheartpray.com/bible-reading-plan" },
      { label: "📔 Life Essentials", href: "https://crossheartpray.com/life-essentials" },
      { label: "🃏 Bible Bingo 7", href: "https://crossheartpray.com/explorebible" },
    ],
  },
  {
    name: "TheDJCares",
    emoji: "🎵",
    description:
      "Hand-picked music, sermons, podcasts, and encouragement — Gospel first.",
    aboutLine:
      "Christian music, sermons, and podcasts, picked by hand.",
    aboutAction: "Listen",
    access: "Free",
    accent: "#A78BFA",
    href: "https://thedjcares.com",
    status: "live",
    category: "faith",
    // 2026-08-11: verified real, public route (server-gated by an access-mode
    // env var that defaults to open/preview — no sign-in required today).
    links: [
      { label: "🎧 Digital DJ", href: "https://thedjcares.com/digital-dj" },
    ],
  },
  {
    name: "iDontCry",
    emoji: "😂",
    // 2026-11-14: iDontCry leads with sports, then games and jokes (its own new tagline).
    description:
      "Local high school scores, college and pro teams, games you can play right in the browser, and jokes worth sending.",
    aboutLine:
      "Family entertainment: local high-school scores, dad jokes, and games.",
    aboutAction: "Play",
    access: "Free",
    accent: "#38BDF8",
    href: "https://idontcry.com",
    status: "live",
    category: "play",
    // 2026-08-16: canonical routes only. CircuitSwitchGame is ONE platform
    // of five circuits — PulseShift, Surge, Ring, Recall, Redirect — and you
    // switch between them inside the game, so listing each circuit here
    // would only rebuild the pile of prototypes the platform replaced. The
    // four sports are independent games at their own front doors.
    links: [
      { label: "🏟️ Sports Desk", href: "https://idontcry.com/sports" },
      { label: "🔀 CircuitSwitchGame", href: "https://idontcry.com/games/circuit" },
      { label: "🏈 Football", href: "https://idontcry.com/games/football" },
      { label: "⚾ Baseball", href: "https://idontcry.com/games/baseball" },
      { label: "🎿 Skiing", href: "https://idontcry.com/games/skiing" },
      { label: "🤸 Track & Field", href: "https://idontcry.com/games/track-and-field" },
      { label: "🎹 Piano Corner", href: "https://idontcry.com/piano" },
      { label: "🛍️ Dream Shop", href: "https://idontcry.com/dream-shop" },
      { label: "🛎️ Digital Front Desk (demo)", href: "https://idontcry.com/digital-front-desk" },
    ],
  },
  {
    name: "StepInTheRing",
    emoji: "🟦",
    // 2026-11-05 owner brief: its promise is working with AI, so it says so. The
    // site itself runs no AI (it writes the messages a person pastes into one),
    // and this is the one listing here that talks about AI.
    description:
      "A website builder for small businesses: start from an example for your kind of work, make it yours, and download files you own, with no coding. The Engine Room and tools for making other things are there too.",
    // The About page never mentions AI, prompts or build tooling (owner copy
    // rule, 2026-07-19), so this line says what you can do and stops there.
    // 2026-11-14: updated to the website starter the site now leads with.
    aboutLine:
      "A website starter for small businesses: start from an example, keep changing it until it's right, and download the files.",
    aboutAction: "Make something",
    access: "Free",
    accent: "#60A5FA",
    href: "https://stepinthering.com",
    status: "live",
    category: "creativity",
    // 2026-11-14: the site leads with the website starter, so the card does
    // too. The older workshop pages stay live and listed on SITR's own
    // Everything page; the Ready to Build kit is not on sale, so it is not
    // advertised here.
    links: [
      { label: "🧱 Website starter", href: "https://stepinthering.com/start" },
      { label: "🖼️ Examples", href: "https://stepinthering.com/examples" },
      { label: "🏗️ Made here", href: "https://stepinthering.com/builds" },
      { label: "🧰 Tools", href: "https://stepinthering.com/tools" },
      { label: "📋 What Works Today", href: "https://stepinthering.com/whats-built" },
    ],
  },
  {
    name: "DontCloneMeTom.com",
    emoji: "🐶",
    description:
      "Find real adoptable dogs near your ZIP code. Each one links to the rescue or shelter caring for it.",
    // Rescue-first, inspired by the cloned-dog headline. NOT "a dog named Tom" —
    // the name speaks for the rescue dog: "Don't clone me, Tom. I'm already here."
    aboutLine:
      "Shows real adoptable dogs that are waiting for homes.",
    aboutAction: "Meet the dogs",
    access: "Free",
    accent: "#2DD4BF",
    href: "https://dontclonemetom.com",
    status: "live",
    category: "family",
    // 2026-08-11: verified real, public, distinct routes — not the bare
    // homepage. The full grid is ZIP-search-gated on the homepage itself;
    // these two always show something without any input from the visitor.
    links: [
      { label: "🐾 Dog of the Day", href: "https://dontclonemetom.com/today" },
      { label: "🃏 Make a Dog Card", href: "https://dontclonemetom.com/cards" },
    ],
  },
  {
    name: "OpenDoku",
    emoji: "🧩",
    description:
      // 2026-10-17 (owner): the photo puzzles lead after OpenDoku's redesign;
      // the five original games follow in OpenDoku's own order.
      "Puzzles starring your people: add a photo and a name, then play Face Regions or Face Slide. The original puzzle games are there too: Picture Sudoku, Mega Slide, SlopeDoku, SurfDoku, and MineDoku.",
    aboutLine:
      "Photo puzzles made from your own pictures, Face Regions and Face Slide, plus the original puzzle games: Picture Sudoku, Mega Slide, SlopeDoku, SurfDoku, and MineDoku.",
    aboutAction: "Play",
    access: "Free",
    accent: "#7DD3FC",
    href: "https://opendoku.com",
    // 2026-10-08 (owner): a beta/experiment until it is ready.
    experiment: true,
    status: "live",
    category: "play",
    expandLabel: "games",
    links: [
      { label: "🎨 Face Regions", href: "https://opendoku.com/face-regions/" },
      { label: "🖼️ Face Slide", href: "https://opendoku.com/face-slide/" },
      { label: "🍓 Picture Sudoku", href: "https://opendoku.com/picture-sudoku/" },
      { label: "🌄 Mega Slide", href: "https://opendoku.com/mega-slide/" },
      { label: "🏔️ SlopeDoku", href: "https://opendoku.com/slopedoku/" },
      { label: "🌞 SurfDoku", href: "https://opendoku.com/surfdoku/" },
      { label: "⛏️ MineDoku", href: "https://opendoku.com/minedoku/" },
    ],
  },
  {
    name: "WatchedNotWatched",
    emoji: "🎬",
    // No emoji inside the sentence — on phones without the glyphs it used to
    // read "Thumb movies and shows or , sort…".
    description:
      "Mark the movies and shows you've seen, browse the Top 222 by decade or genre, and get picks based on what you liked. Your list is saved on your device.",
    aboutLine:
      "Keep track of the movies and shows you've watched and get picks based on what you liked. No account needed.",
    aboutAction: "Start a list",
    access: "Free",
    accent: "#22D3EE",
    href: "https://watchednotwatched.com",
    // 2026-10-08 (owner, later the same day): promoted to a regular project —
    // no Beta badge, out of "Betas and experiments" on Home and About.
    status: "live",
    category: "family",
    // 2026-08-11: verified real, public routes — no account/AI required for
    // any of these; /foryou is the deterministic, no-LLM recommendation path.
    links: [
      { label: "🔍 Search & Track", href: "https://watchednotwatched.com/search" },
      { label: "🏆 Top 222", href: "https://watchednotwatched.com/top" },
      { label: "🎯 For You", href: "https://watchednotwatched.com/foryou" },
    ],
  },
  {
    name: "WhatAmIAI",
    emoji: "🤖",
    // 2026-11-19: family history went live beside the reflection tools, as
    // two pages: Discover (one person, where their records are likely kept)
    // and My Family (a family tree that shows each fact's sources). Both
    // stay in the browser; family history pages carry no analytics.
    description:
      "Short tap-to-answer tools for a decision, your money or a habit. For family history, see where an ancestor's records are likely kept and build a tree that shows its sources. Everything is saved on your device.",
    aboutLine:
      "Short tools for thinking through decisions and habits. For family history, see where an ancestor's records are likely kept and build a tree that shows its sources.",
    aboutAction: "Take a look",
    // Free to use today, still being polished — the qualifier says so plainly.
    access: "Free",
    accessNote: "Building",
    accent: "#E879F9",
    href: "https://whatamiai.com",
    // 2026-10-08 (owner): a beta/experiment until it is ready.
    experiment: true,
    status: "building",
    category: "creativity",
    // The card's main link opens the reflection tools; these two open the
    // family history pages directly (both 200 live, 2026-11-19).
    expandLabel: "family history",
    links: [
      { label: "🔎 Discover: look up one person", href: "https://whatamiai.com/discover" },
      { label: "🌳 My Family: build your family tree", href: "https://whatamiai.com/family" },
    ],
  },
  {
    name: "PleaseBeReady",
    emoji: "🧰",
    // 2026-11-21 (owner): the directory card leads with the emergency plan, not the store.
    description:
      "Make a household emergency plan for outages, storms, and water shutoffs.",
    aboutLine:
      "Make a household emergency plan for outages, storms, and water shutoffs.",
    aboutAction: "Get ready",
    access: "Free",
    accent: "#34D399",
    href: "https://pleasebeready.com",
    status: "live",
    category: "family",
    pinBottom: true,
    // 2026-07-20 it left the menu; 2026-10-08 (owner): back in the family
    // menu as a priority household door. It renders in the "resources"
    // group at the menu's tail, so it never sits between products for sale.
    // 2026-08-11: verified real, public, distinct route beyond the checklist
    // homepage itself.
    links: [
      { label: "🧰 Kits", href: "https://pleasebeready.com/kits" },
      { label: "💧 Food & Water", href: "https://pleasebeready.com/food-water" },
      { label: "👟 Compare shoes and boots", href: "https://pleasebeready.com/footwear" },
      { label: "✅ Daily Readiness Check", href: "https://pleasebeready.com/today" },
    ],
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
  // Fambookagram + Friendbookagram retired as standalone products on
  // 2026-08-02 (owner decision). The concepts live on as playground pages:
  // idontcry.com/fambookagram and idontcry.com/friendbookagram.
];

// ─────────────────────────────────────────────────────────────────────────────
// The homepage (owner brief, 2026-11-14). It replaces the Oct 8 layout (two
// doors, status sections, PleaseBeReady pinned last): every public site sits
// in one of four groups named for what a visitor comes to do, CrossHeartPray
// first and on its own terms. About and the menu keep their own order.
// ─────────────────────────────────────────────────────────────────────────────

export type HomeSectionKey = "faith" | "play" | "everyday" | "build";

/** "DontCloneMeTom.com" → "dontclonemetom": the short key a homepage card click is counted under. */
export function siteKey(p: Pick<Product, "name">): string {
  return p.name.toLowerCase().replace(/\.com$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const HOME_SECTIONS: { key: HomeSectionKey; label: string; names: string[] }[] = [
  { key: "faith", label: "Faith and encouragement", names: ["CrossHeartPray", "TheDJCares"] },
  { key: "play", label: "Sports, games and entertainment", names: ["iDontCry", "OpenDoku", "WatchedNotWatched"] },
  { key: "everyday", label: "Everyday life", names: ["PleaseBeReady", "DontCloneMeTom.com", "WhatAmIAI"] },
  { key: "build", label: "Create and build", names: ["StepInTheRing"] },
];

/** Which homepage group a product belongs to, or undefined when it is kept off the homepage. */
export function homeSectionOf(p: Product): HomeSectionKey | undefined {
  if (p.showInPortfolio === false || p.featured) return undefined;
  return HOME_SECTIONS.find((s) => s.names.includes(p.name))?.key;
}

export function homeSections(): { key: HomeSectionKey; label: string; items: Product[] }[] {
  return HOME_SECTIONS.map(({ key, label, names }) => ({
    key,
    label,
    items: names
      .map((n) => products.find((p) => p.name === n))
      .filter((p): p is Product => Boolean(p) && homeSectionOf(p as Product) === key),
  })).filter((s) => s.items.length > 0);
}

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
// A secondary, useful resource — not part of the main purpose (owner, 2026-10-08).
export const BOTTOM_PIN_LABEL = "Be prepared";

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
//   3. Building projects, then betas and experiments
//   4. Exploring ideas
//   5. PleaseBeReady and approved resources
//   6. A packaged product, if one ever exists — last (none since 2026-10-17)
//
// The Foundation opens the menu and the packaged product closes it, so nothing
// between them reads as a funnel toward a sale. Menus render these groups in
// array order — never hand-keep a second list of names in a component.
// ─────────────────────────────────────────────────────────────────────────────

export type NavGroupKey =
  | "foundation"
  | "free"
  | "inProgress"
  | "experiments"
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
      heading: "Live now",
      items: pick((p) => p.status === "live" && !p.experiment && ungrouped(p)),
    },
    {
      key: "inProgress",
      heading: "In progress",
      items: pick((p) => (p.status === "building" || p.status === "beta") && !p.experiment && ungrouped(p)),
    },
    {
      key: "experiments",
      heading: "Betas and experiments",
      items: pick((p) => p.experiment === true && ungrouped(p)),
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

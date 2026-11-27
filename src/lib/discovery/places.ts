// ─────────────────────────────────────────────────────────────────────────────
// Places the homepage can send someone (owner direction, Nov 26-27 2026:
// "Let us help you. Connect users with relevant tools, resources, educational
// materials, existing products, businesses, communities or professional
// assistance. Use existing functionality wherever possible.")
//
// Every Open Mirror entry is a real, public page that works without an
// account. Each one says what you can do there, in that site's own terms:
// the hub is the directory, so naming a site here is a listing, not a plug.
// Terms are everyday words, base forms, lower case.
// ─────────────────────────────────────────────────────────────────────────────

export type PlaceKind = "ours" | "learn" | "market" | "help";

export type Place = {
  id: string;
  title: string;
  href: string;
  /** One plain line: what you can do there. */
  line: string;
  /** The site's name, shown small. */
  site: string;
  kind: PlaceKind;
  terms: string[];
};

export const PLACES: Place[] = [
  // Help first, always: shown above everything when the words call for it.
  { id: "988", title: "988 Suicide & Crisis Lifeline", href: "https://988lifeline.org/", line: "Call or text 988, any time, free and confidential (United States).", site: "988lifeline.org", kind: "help", terms: [] },

  // ── Open Mirror sites ──────────────────────────────────────────────────
  { id: "chp-daily-hope", title: "Daily Hope", href: "https://crossheartpray.com/daily-hope", line: "One Bible passage a day, with a prayer.", site: "CrossHeartPray", kind: "ours", terms: ["bible", "pray", "prayer", "god", "jesus", "faith", "scripture", "verse", "hope", "devotion", "church", "christian", "gospel"] },
  { id: "chp-plan", title: "Bible reading plan", href: "https://crossheartpray.com/bible-reading-plan", line: "Read through the Bible on a plan.", site: "CrossHeartPray", kind: "ours", terms: ["read the bible", "bible plan", "reading plan", "whole bible", "bible"] },
  { id: "tdjc", title: "TheDJCares", href: "https://thedjcares.com", line: "Christian music, sermons and podcasts, picked by hand.", site: "TheDJCares", kind: "ours", terms: ["worship", "christian music", "gospel music", "sermon", "podcast", "encouragement", "encourage", "hard time", "rough day", "lonely", "grief", "sad"] },
  { id: "idc-sports", title: "Sports Desk", href: "https://idontcry.com/sports", line: "Local high school scores, plus college and pro teams.", site: "iDontCry", kind: "ours", terms: ["score", "high school", "football", "baseball", "basketball", "soccer", "volleyball", "playoff", "game tonight", "sports"] },
  { id: "idc-games", title: "Games to play in the browser", href: "https://idontcry.com", line: "Football, baseball, skiing, track and more. No download.", site: "iDontCry", kind: "ours", terms: ["play", "game", "bored", "fun", "video game"] },
  { id: "idc-jokes", title: "Jokes", href: "https://idontcry.com", line: "Dad jokes worth sending.", site: "iDontCry", kind: "ours", terms: ["joke", "laugh", "funny", "dad joke"] },
  { id: "idc-piano", title: "Piano Corner", href: "https://idontcry.com/piano", line: "Play a piano in the browser.", site: "iDontCry", kind: "ours", terms: ["piano", "keyboard"] },
  { id: "sitr-start", title: "Make a website from an example", href: "https://stepinthering.com/start", line: "Pick an example for your kind of work, make it yours, download the files. No account, no coding.", site: "Step In The Ring", kind: "ours", terms: ["website", "web site", "web page", "site for my", "online presence", "landing page", "small business website"] },
  { id: "sitr-build-machine", title: "Put an old computer to work", href: "https://stepinthering.com/build-machine", line: "Check the computer you have, protect your files, set it up, and test it.", site: "Step In The Ring", kind: "ours", terms: ["old computer", "old laptop", "used computer", "used laptop", "slow computer", "slow laptop", "linux", "set up my computer", "computer", "laptop"] },
  { id: "sitr-engines", title: "Plan a launch, a price or an event", href: "https://stepinthering.com/engines", line: "Guided steps that end with something you can use.", site: "Step In The Ring", kind: "ours", terms: ["start a business", "side hustle", "launch", "price", "pricing", "customer", "more customers", "event", "fundraiser", "business plan", "business", "small business", "entrepreneur"] },
  { id: "sitr-make", title: "Turn an idea into a clear plan for your AI app", href: "https://stepinthering.com/make", line: "Say what you want to make; get a message to paste into the AI app you use.", site: "Step In The Ring", kind: "ours", terms: ["app idea", "make an app", "make a game", "build an app", "idea", "chatgpt", "ai app", "invent"] },
  { id: "sitr-ring", title: "Try a challenge: the Heisman", href: "https://stepinthering.com/ring", line: "One pose, both sides, two minutes. See how you improve.", site: "Step In The Ring", kind: "ours", terms: ["challenge", "balance", "try something"] },
  { id: "wai-discover", title: "Look up someone in your family's past", href: "https://whatamiai.com/discover", line: "Family history from records you can check.", site: "WhatAmIAI", kind: "ours", terms: ["family history", "genealogy", "ancestor", "family tree", "grandparent", "heritage", "where i come from", "roots"] },
  { id: "wai-family", title: "Build your family tree", href: "https://whatamiai.com/family", line: "Keep your family's names and stories in one place.", site: "WhatAmIAI", kind: "ours", terms: ["family tree", "my family", "relatives"] },
  { id: "pbr", title: "PleaseBeReady", href: "https://pleasebeready.com", line: "Plan supplies, food and water for your household.", site: "PleaseBeReady", kind: "ours", terms: ["emergency", "storm", "tornado", "hurricane", "power outage", "outage", "flood", "earthquake", "blizzard", "disaster", "supplies", "first aid kit", "water storage", "stock up", "prepare", "prepared", "preparedness", "be ready", "go bag", "bug out"] },
  { id: "wnw", title: "Find something to watch or read", href: "https://watchednotwatched.com", line: "Movies, shows and books: search, track and get picks.", site: "WatchedNotWatched", kind: "ours", terms: ["movie", "film to watch", "tv", "show to watch", "what to watch", "watch tonight", "series", "netflix", "book to read", "something to read"] },
  { id: "opendoku", title: "OpenDoku puzzles", href: "https://opendoku.com", line: "Sudoku and photo puzzles made from your own pictures.", site: "OpenDoku", kind: "ours", terms: ["puzzle", "sudoku", "brain game", "logic puzzle"] },
  { id: "dcmt", title: "Adoptable dogs near you", href: "https://dontclonemetom.com", line: "Real dogs waiting for homes, each linked to its rescue or shelter.", site: "DontCloneMeTom", kind: "ours", terms: ["dog", "puppy", "adopt", "adoption", "rescue dog", "animal shelter"] },
  { id: "reflect", title: "Reflect", href: "/reflect", line: "Think through a question or a decision, one step at a time.", site: "Open Mirror", kind: "ours", terms: ["reflect", "decision", "decide", "think through", "journal", "stuck"] },

  // ── Learning ───────────────────────────────────────────────────────────
  { id: "learn", title: "Open Mirror Learning", href: "/learn", line: "Free courses, books and videos from trusted sources, on almost any subject.", site: "Open Mirror", kind: "learn", terms: ["learn", "study", "class", "course", "lesson", "school", "skill", "teach me", "how to", "education", "homeschool"] },
  { id: "work", title: "Work that lasts", href: "/learn/work", line: "Jobs that meet lasting needs, with official pay and training information.", site: "Open Mirror", kind: "learn", terms: ["job", "career", "work", "hire", "hired", "employment", "apprenticeship", "apprentice", "trade", "future", "lasting", "ai proof", "laid off"] },

  // ── Marketplace (doors open when someone is buying, selling, hunting or restoring) ──
  { id: "market-buy", title: "Marketplace: Buy", href: "/marketplace#buy", line: "Exceptional items from participating merchants. None are listed yet.", site: "Open Mirror", kind: "market", terms: [] },
  { id: "market-sell", title: "Marketplace: Sell", href: "/marketplace#sell", line: "Tell us what you have. Email the owner for more details.", site: "Open Mirror", kind: "market", terms: [] },
  { id: "market-find", title: "Marketplace: Find", href: "/marketplace#find", line: "Describe something you're looking for.", site: "Open Mirror", kind: "market", terms: [] },
  { id: "market-restore", title: "Marketplace: Restore", href: "/marketplace#restore", line: "Find experienced craftspeople through their professional directories.", site: "Open Mirror", kind: "market", terms: [] },
];

export function placeById(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared discovery: what is this person after? (owner direction, Nov 26-27
// 2026: "build the underlying intelligence once").
//
// Plain, deterministic matching: everyday words map to subjects, Open Mirror
// sites, marketplace doors and reasons for learning. No model, no network,
// no cost, the same answer every time, and it runs in the visitor's browser:
// what someone types is never sent anywhere or put in a URL.
//
// The homepage ("What are you doing? / What do you want to do?") and Open
// Mirror Learning ("What do you want to learn?") both call interpret().
// A future directory (businesses, merchants, partners) adds its own entries
// to the same shape instead of building another engine.
// ─────────────────────────────────────────────────────────────────────────────

import { SUBJECTS } from "../learning/taxonomy.ts";
import type { PathwayId } from "../learning/resources.ts";
import { PATHS, type LearningPath } from "../learning/paths.ts";
import { PLACES, type Place } from "./places.ts";

export type MarketDoor = "buy" | "sell" | "find" | "restore";

const STOP = new Set(
  "i im i'm a an the and or to of for in on at my me we our us you your it its is are was be been am do doing does did want wanna would like love really just some something things thing stuff about more get got how what why who where when which can could should will this that these those with from into out up so very much lot lots also too new help need".split(" "),
);

/** Lower case, letters and digits only, single spaces. */
export function normalize(text: string): string {
  return ` ${text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim()} `;
}

/** A word and its likely base forms: "fixing" → fixing, fix; "baking" → baking, bak, bake; "cars" → car. */
export function forms(word: string): string[] {
  const out = new Set([word]);
  if (word.length > 4 && word.endsWith("ies")) out.add(word.slice(0, -3) + "y");
  else if (word.length > 4 && /(ches|shes|xes|sses)$/.test(word)) out.add(word.slice(0, -2));
  else if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) out.add(word.slice(0, -1));
  for (const end of ["ing", "ed", "er"]) {
    if (word.length > end.length + 2 && word.endsWith(end)) {
      const stem = word.slice(0, -end.length);
      out.add(stem);
      out.add(stem + "e");
      if (/(.)\1$/.test(stem)) out.add(stem.slice(0, -1)); // shopping → shop
    }
  }
  return [...out];
}

/** Every meaningful word form in a piece of text. */
export function wordSet(text: string): Set<string> {
  const set = new Set<string>();
  for (const w of normalize(text).trim().split(" ")) {
    if (!w || STOP.has(w)) continue;
    for (const f of forms(w)) set.add(f);
  }
  return set;
}

/** Does `term` (one word or a phrase) appear in the text? */
function hits(term: string, norm: string, words: Set<string>): boolean {
  return term.includes(" ") ? norm.includes(` ${term} `) : words.has(term);
}

// Broad interests: one everyday idea that opens several subjects at once,
// most likely first. "I like fixing things" is the owner's own example.
type Interest = { terms: string[]; subjects: string[]; paths?: PathwayId[]; learn?: string[] };

export const INTERESTS: Interest[] = [
  { terms: ["fix", "repair", "broken", "tinker", "take apart", "mend", "handy", "handyman"], subjects: ["automotive-repair", "electronics", "hvac", "electrical-work", "appliance-repair", "carpentry-woodworking", "mechanical-engineering", "computer-repair", "small-engine-repair", "home-repair"], paths: ["skill"], learn: ["car-repair", "small-engines", "home-maintenance", "restore-old-computer", "electricity"] },
  { terms: ["build", "make things", "maker", "hands", "work with my hands"], subjects: ["carpentry-woodworking", "welding", "electronics", "mechanical-engineering", "crafts", "home-repair"], paths: ["skill", "create"], learn: ["home-maintenance", "electricity"] },
  { terms: ["help people", "helps people", "helping people", "care for people", "serve", "make a difference", "volunteer"], subjects: ["nursing", "first-aid", "teaching", "psychology", "public-health", "early-childhood"], learn: ["find-work"] },
  { terms: ["outside", "outdoors", "nature"], subjects: ["outdoor-recreation", "ecology", "conservation", "gardening", "farming"], learn: ["grow-food"] },
  { terms: ["animal", "animals", "pet"], subjects: ["animal-care", "ecology", "farming"] },
  { terms: ["create", "creative", "art", "artist"], subjects: ["drawing", "painting", "graphic-design", "photography", "songwriting", "writing", "crafts"], paths: ["create"], learn: ["music-creation", "build-a-website"] },
  { terms: ["numbers", "math", "data"], subjects: ["arithmetic-algebra", "statistics", "accounting", "calculus"], learn: ["math-to-calculus"] },
  { terms: ["computer", "technology", "tech", "laptop", "desktop", "pc", "dell", "hp", "lenovo", "thinkpad", "macbook", "chromebook", "acer", "toshiba"], subjects: ["computer-basics", "computer-repair", "programming", "web-development", "linux", "artificial-intelligence"], learn: ["computer-hardware", "restore-old-computer", "programming", "linux", "ai-basics"] },
  { terms: ["food", "eat", "kitchen"], subjects: ["cooking", "baking", "nutrition", "food-safety", "gardening", "food-preservation"], learn: ["grow-food", "food-preservation"] },
  { terms: ["money", "earn", "income", "rich", "wealth"], subjects: ["personal-finance", "starting-a-business", "accounting", "investing-basics"], learn: ["start-small-business", "find-work"] },
  { terms: ["kid", "kids", "child", "children", "son", "daughter"], subjects: ["childcare-parenting", "early-childhood", "tutoring", "human-development"] },
  { terms: ["why", "meaning", "purpose", "big question"], subjects: ["philosophy", "bible-theology", "ethics", "psychology"] },
  { terms: ["story", "stories"], subjects: ["writing", "literature", "filmmaking", "theater"] },
  { terms: ["sport", "sports", "athlete", "team"], subjects: ["coaching", "fitness"] },
  { terms: ["last", "lasting", "future proof", "ai proof", "wont be replaced", "safe job", "stable job"], subjects: ["electrical-work", "plumbing", "hvac", "nursing", "teaching", "farming"], paths: ["job", "career-change"], learn: ["find-work", "electricity"] },
  { terms: ["restore", "restoration", "refinish", "antique", "vintage", "old things"], subjects: ["watch-clock-repair", "carpentry-woodworking", "computer-repair"], learn: ["watch-clock", "restore-old-computer"] },
];

const PATH_TERMS: { path: PathwayId; terms: string[] }[] = [
  { path: "college", terms: ["college", "university", "degree", "sat", "act", "fafsa", "freshman"] },
  // "work" only as a phrase: "how it works" and "stopped working" aren't job searches.
  { path: "job", terms: ["job", "jobs", "find work", "looking for work", "need work", "out of work", "back to work", "steady work", "work as", "become a", "become an", "train to be", "career", "hire", "hired", "employment", "pay", "salary", "resume"] },
  { path: "career-change", terms: ["change careers", "career change", "new career", "switch careers", "start over", "laid off"] },
  { path: "apprenticeship", terms: ["apprentice", "apprenticeship", "trade school", "trade", "trades", "union"] },
  { path: "start-business", terms: ["start a business", "own business", "side hustle", "entrepreneur", "startup", "self employed", "llc"] },
  { path: "improve-business", terms: ["my business", "my shop", "my store", "more customers", "grow my", "marketing"] },
  { path: "create", terms: ["make", "create", "project", "build"] },
  { path: "teach", terms: ["teach", "teaching", "homeschool", "my students", "tutor"] },
  { path: "community", terms: ["group", "club", "community", "together", "with others", "class"] },
  { path: "curious", terms: ["curious", "wonder", "interested", "fun", "hobby", "for fun"] },
];

const ITEM_TERMS = ["antique", "vintage", "collection", "collectible", "collector", "heirloom", "estate", "watch", "watches", "clock", "clocks", "pocket watch", "jewelry", "inventory", "furniture", "rare", "piece", "item", "items", "painting", "coins", "record player", "instrument"];

/** Marketplace doors: only when someone is buying, selling, hunting for or restoring a thing. */
export function marketDoors(text: string): MarketDoor[] {
  const norm = normalize(text);
  const words = wordSet(text);
  const item = ITEM_TERMS.some((t) => hits(t, norm, words));
  const doors: MarketDoor[] = [];
  const any = (terms: string[]) => terms.some((t) => hits(t, norm, words));
  if (any(["restore", "restoration", "refinish", "heirloom"]) || (item && any(["fix", "repair", "clean", "service", "broken"]))) doors.push("restore");
  if (item && any(["sell", "selling", "consign", "get rid of", "worth"])) doors.push("sell");
  if (item && any(["buy", "buying", "purchase", "shop for"])) doors.push("buy");
  if (item && any(["looking for", "find", "search for", "hunting for", "track down", "source", "hard to find"])) doors.push("find");
  return doors;
}

export type Scored<T> = { item: T; score: number; why: string[] };

export type Interpretation = {
  /** Learning paths (paths.ts): an ordered way in, best first. */
  learningPaths: Scored<LearningPath>[];
  subjects: Scored<(typeof SUBJECTS)[number]>[];
  places: Scored<Place>[];
  market: MarketDoor[];
  paths: PathwayId[];
  /** A safety signal: show crisis help first. */
  urgent: boolean;
  /** The person said money is tight: lead with the low-cost way in. */
  lowCost: boolean;
  empty: boolean;
};

const LOW_COST = ["no money", "little money", "not much money", "broke", "cheap", "cheaply", "cant afford", "on a budget", "tight budget", "low budget", "low income", "limited budget", "for free", "without money", "no budget"];

const URGENT = ["suicide", "suicidal", "kill myself", "end my life", "want to die", "self harm", "hurt myself", "cant go on", "dont want to live"];

// Ways people say a thing is broken. Read as "broken" (a repair need), so
// "my watch stopped working" isn't taken for a job search.
const BROKEN = ["stopped working", "not working", "isnt working", "doesnt work", "wont work", "quit working", "stopped running", "dont work", "died on me", "broke down"];

export function interpret(text: string): Interpretation {
  let cleaned = normalize(text);
  for (const b of BROKEN) cleaned = cleaned.split(` ${b} `).join(" broken ");
  // "Teach myself" is learning, not teaching others.
  cleaned = cleaned.split(" teach myself ").join(" learn ").split(" teaching myself ").join(" learning ");
  const norm = cleaned;
  const words = wordSet(cleaned);
  const empty = words.size === 0;

  // Subjects: their own everyday words, then broad interests.
  const subjectScore = new Map<string, Scored<(typeof SUBJECTS)[number]>>();
  const bump = (slug: string, by: number, why: string) => {
    const s = SUBJECTS.find((x) => x.slug === slug);
    if (!s) return;
    const cur = subjectScore.get(slug) ?? { item: s, score: 0, why: [] };
    cur.score += by;
    if (!cur.why.includes(why)) cur.why.push(why);
    subjectScore.set(slug, cur);
  };
  for (const s of SUBJECTS) {
    for (const w of s.words) if (hits(w, norm, words)) bump(s.slug, w.includes(" ") ? 3 : 2, w);
  }
  const paths = new Set<PathwayId>();
  const interestPaths = new Map<string, { score: number; why: string }>();
  for (const it of INTERESTS) {
    const t = it.terms.find((x) => hits(x, norm, words));
    if (!t) continue;
    it.subjects.forEach((slug, i) => bump(slug, 1.5 + (it.subjects.length - i) * 0.01, t));
    it.paths?.forEach((p) => paths.add(p));
    it.learn?.forEach((slug, i) => {
      const cur = interestPaths.get(slug);
      const add = 1.5 + (it.learn!.length - i) * 0.01;
      interestPaths.set(slug, { score: (cur?.score ?? 0) + add, why: cur?.why ?? t });
    });
  }
  for (const p of PATH_TERMS) if (p.terms.some((t) => hits(t, norm, words))) paths.add(p.path);

  const subjects = [...subjectScore.values()].sort((a, b) => b.score - a.score);

  // Learning paths: their own words first, then a broad interest that opens
  // them, then the subjects they teach. A path needs one of its own words, an
  // interest, or a strong match on its home subject.
  const learningPaths: Scored<LearningPath>[] = [];
  for (const p of PATHS) {
    const why = p.terms.filter((t) => hits(t, norm, words));
    let score = why.reduce((n, t) => n + (t.includes(" ") ? 3 : 2), 0);
    const interest = interestPaths.get(p.slug);
    if (interest) score += interest.score;
    // Matched only through a broad interest, its subjects' scores came from
    // that same interest: count them lightly so the interest's own order holds.
    const weight = !why.length && interest ? 0.1 : 1;
    const home = subjectScore.get(p.subjects[0]);
    if (home) score += home.score * 0.6 * weight;
    for (const slug of p.subjects.slice(1)) score += (subjectScore.get(slug)?.score ?? 0) * 0.2 * weight;
    if (why.length || interest || (home && home.score >= 3)) {
      learningPaths.push({ item: p, score, why: why.length ? why : interest ? [interest.why] : home ? home.why : [] });
    }
  }
  learningPaths.sort((a, b) => b.score - a.score);

  // When someone names a path in its own words ("build a website"), its
  // subjects lead the subject list too, ahead of broad matches ("build").
  const named = learningPaths.find((x) => x.item.terms.some((t) => hits(t, norm, words)));
  if (named) {
    named.item.subjects.forEach((slug, i) => bump(slug, i === 0 ? 3 : 1, named.why[0] ?? named.item.title.toLowerCase()));
    subjects.splice(0, subjects.length, ...[...subjectScore.values()].sort((a, b) => b.score - a.score));
  }

  // Places: Open Mirror sites and pages, Learning, the Marketplace doors.
  const places: Scored<Place>[] = [];
  for (const p of PLACES) {
    const why = p.terms.filter((t) => hits(t, norm, words));
    if (why.length) places.push({ item: p, score: why.reduce((n, t) => n + (t.includes(" ") ? 3 : 2), 0), why });
  }
  places.sort((a, b) => b.score - a.score);

  const urgent = URGENT.some((t) => norm.includes(` ${t} `));
  const lowCost = LOW_COST.some((t) => hits(t, norm, words));
  return { learningPaths, subjects, places, market: marketDoors(cleaned), paths: [...paths], urgent, lowCost, empty };
}

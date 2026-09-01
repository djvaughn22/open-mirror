// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — the fact guard. This is the hallucination boundary.
//
// AI CAN WRITE. AI CANNOT MAKE FACTS.
//
// Any prose that reaches a reader — ours or a model's — is checked against the
// approved fact set first. Every number and every name in the sentence has to
// trace back to something the operator verified or something our own code
// counted. "186 rushing yards" is publishable. "186 rushing yards on 24
// carries" is not, unless 24 carries were verified.
//
// The guard fails closed: unknown token, no publish.
// ─────────────────────────────────────────────────────────────────────────────

import type { Discovery, GameRecord } from "./types.ts";

export interface FactSet {
  numbers: Set<string>;
  names: Set<string>;
}

/** Words a sentence may legitimately begin with, or that are not names at all. */
const SAFE_WORDS = new Set([
  "a", "an", "and", "at", "after", "against", "ahead", "all", "also", "an", "another", "any", "are", "as",
  "back", "be", "beat", "before", "behind", "both", "but", "by",
  // Headline words. Headlines are set in capitals, so every token reads as a name.
  "rally", "rallies", "fall", "falls", "hold", "holds", "hold on", "tie", "top", "tops", "s",
  "came", "can", "caught", "clear", "cleared", "come", "current",
  "down", "drive", "each", "erased", "even", "every",
  "fell", "field", "first", "for", "friday", "from", "full",
  "game", "games", "goal", "goals", "had", "half", "has", "have", "he", "her", "his", "home",
  "in", "interception", "interceptions", "into", "is", "it", "its",
  "lead", "led", "loss", "lost", "made", "monday", "more", "most",
  "next", "night", "no", "not", "now", "of", "on", "one", "only", "or", "over",
  "pass", "passes", "passing", "pick", "picks", "play", "played", "plus", "point", "points",
  "quarter", "ran", "recorded", "record", "recovered", "receiving", "reception", "receptions", "rushing", "rushed",
  "sack", "sacks", "saturday", "scored", "scores", "scoring", "season", "second", "since", "so", "straight", "sunday",
  "tackle", "tackles", "than", "that", "the", "their", "them", "then", "there", "they", "third", "this",
  "threw", "through", "thursday", "to", "took", "touchdown", "touchdowns", "trailed", "tuesday", "turned",
  "up", "was", "wednesday", "week", "were", "when", "while", "who", "will", "win", "with", "won", "yard", "yards",
]);

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

function addNumber(set: Set<string>, n: number | undefined): void {
  if (n === undefined || !Number.isFinite(n)) return;
  set.add(String(n));
  if (Number.isInteger(n) && n >= 0 && n <= 10) set.add(NUMBER_WORDS[n]);
}

function addName(set: Set<string>, raw: string | undefined): void {
  if (!raw) return;
  for (const part of raw.split(/[\s\-'’.]+/)) {
    if (part.length > 0) set.add(part.toLowerCase());
  }
}

/**
 * The complete set of numbers and names a story is allowed to contain.
 *
 * Discoveries are included because they are written by our own deterministic
 * Story Finder from counted archive data — they are calculated facts, not
 * generated text.
 */
export function buildFactSet(game: GameRecord, discoveries: Discovery[] = [], mascot?: string): FactSet {
  const numbers = new Set<string>();
  const names = new Set<string>();

  addNumber(numbers, game.teamScore);
  addNumber(numbers, game.opponentScore);
  addName(names, game.team);
  addName(names, game.opponent);
  addName(names, mascot);

  if (game.recordAfter) {
    addNumber(numbers, game.recordAfter.wins);
    addNumber(numbers, game.recordAfter.losses);
    if (game.recordAfter.ties > 0) addNumber(numbers, game.recordAfter.ties);
  }

  for (const p of game.players) {
    addName(names, p.name);
    for (const v of Object.values(p.stats)) addNumber(numbers, v.amount);
  }

  for (const n of game.narrative) {
    if (n.deficit) {
      addNumber(numbers, n.deficit.us);
      addNumber(numbers, n.deficit.them);
      // The margin is arithmetic on two verified numbers, so it is publishable.
      addNumber(numbers, n.deficit.them - n.deficit.us);
    }
    for (const token of n.text.match(/\d+(?:\.\d+)?/g) ?? []) numbers.add(token);
  }

  if (game.next) {
    addName(names, game.next.opponent);
    addName(names, game.next.when);
  }

  // The season year and the game's own date are verified context.
  for (const token of game.date.split("-")) numbers.add(String(Number(token)));
  numbers.add(game.seasonId);

  for (const d of discoveries) {
    for (const token of d.text.match(/\d+(?:\.\d+)?/g) ?? []) numbers.add(token);
    for (const word of d.text.split(/[^A-Za-z'’]+/)) {
      if (word && /^[A-Z]/.test(word)) names.add(word.toLowerCase());
      if (NUMBER_WORDS.includes(word.toLowerCase())) numbers.add(word.toLowerCase());
    }
    if (d.subject) addName(names, d.subject);
  }

  return { numbers, names };
}

export interface GuardResult {
  ok: boolean;
  /** Tokens that could not be traced to a verified fact. */
  violations: string[];
}

/**
 * Check prose against the fact set. Fails on the first unverifiable number or
 * the first unknown proper name.
 */
export function guardProse(prose: string, facts: FactSet): GuardResult {
  const violations: string[] = [];

  for (const token of prose.match(/\d+(?:\.\d+)?/g) ?? []) {
    if (!facts.numbers.has(token)) violations.push(token);
  }

  // Sentence-initial capitals are ordinary words; anything else capitalized in
  // the middle of a sentence is being asserted as a name.
  const words = prose.split(/(?<=^|[.!?]\s|\n)/).flatMap((sentence) => {
    const parts = sentence.trim().split(/[^A-Za-z'’]+/).filter(Boolean);
    return parts.map((w, i) => ({ word: w, sentenceStart: i === 0 }));
  });

  for (const { word, sentenceStart } of words) {
    const lower = word.toLowerCase();
    if (NUMBER_WORDS.includes(lower)) {
      if (!facts.numbers.has(lower)) violations.push(word);
      continue;
    }
    if (!/^[A-Z]/.test(word)) continue;
    if (SAFE_WORDS.has(lower)) continue;
    if (facts.names.has(lower)) continue;
    if (sentenceStart && word === word[0] + word.slice(1).toLowerCase() && lower.length <= 3) continue;
    violations.push(word);
  }

  const unique = [...new Set(violations)];
  return { ok: unique.length === 0, violations: unique };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — deterministic extractor.
//
// Messy evidence in, CANDIDATE facts out. Candidates are never truth: every one
// carries the exact quote it was read from, a confidence, and — where we had to
// guess — a plain sentence telling the operator what we guessed and why.
//
// This runs with no model, no network, and no cost. A model may later be asked
// to propose EXTRA candidates (see ./modelExtract.ts), but it can never skip
// the verification screen, and nothing here depends on one existing.
// ─────────────────────────────────────────────────────────────────────────────

import { STAT_ALIASES, statDef } from "./football.ts";
import type {
  CandidateFact,
  CandidateValue,
  Confidence,
  EvidenceItem,
  HomeAway,
} from "./types.ts";

// ── Word lists ──────────────────────────────────────────────────────────────

const WIN_WORDS = /\b(won|win|wins|beat|beats|defeated|defeat|def\.?|topped|took down|knocked off)\b/i;
const LOSS_WORDS = /\b(lost|loss|lose|fell|falls|dropped|drops|beaten)\b/i;
const DEFICIT_WORDS = /\b(down|trailed|trailing|behind|deficit)\b/i;
const LEAD_WORDS = /\b(led|leading|up|ahead)\b/i;
const RECORD_WORDS = /\b(we(?:'|’)?re|record|improve[sd]?|fall[s]?|move[sd]?|drop[s]?|now)\b/i;

const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const MONTHS = ["january", "february", "march", "april", "may", "june", "july",
  "august", "september", "october", "november", "december",
  "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sept", "sep", "oct", "nov", "dec"];

/** Capitalized words that start sentences or otherwise are never player names. */
const NOT_A_NAME = new Set([
  "we", "our", "us", "they", "their", "them", "he", "she", "it", "its", "his", "her",
  "the", "a", "an", "this", "that", "these", "those", "there", "here",
  "and", "but", "so", "then", "after", "before", "when", "while", "also", "both",
  "won", "win", "lost", "loss", "beat", "final", "score", "game", "half", "quarter",
  "next", "up", "first", "second", "third", "fourth", "great", "big", "good", "tough",
  "team", "coach", "defense", "offense", "night", "home", "away", "week", "season",
  "no", "yes", "ok", "record", "played", "play", "plays", "had", "has",
  // Stat-export section labels and column headings.
  "rushing", "passing", "receiving", "defensive", "kicking", "special", "teams",
  "totals", "total", "stats", "scoring", "leaders", "final", "results",
  // Stat abbreviations, which are capitalized all over a pasted export.
  "td", "tds", "int", "ints", "fg", "fgs", "rec", "yds", "yard", "yards",
  "carries", "carry", "att", "atts", "attempts", "comp", "completions",
  "tackles", "sacks", "picks", "catches", "receptions", "touchdowns", "touchdown",
  ...WEEKDAYS, ...MONTHS,
]);

/** Counted stats are often written out in casual notes. */
const NUM_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};
const NUM_WORD_PATTERN = Object.keys(NUM_WORDS).join("|");
const numberFrom = (token: string): number =>
  NUM_WORDS[token.toLowerCase()] ?? Number(token);

/**
 * A pasted export groups lines under a heading. Inside "Rushing: …", a bare
 * "yards" means rushing yards — but only inside that block.
 */
type Section = "rushing" | "passing" | "receiving" | "defense" | undefined;

function sectionOf(line: string): Section {
  const label = line.match(/^\s*([A-Za-z ]{3,20})\s*:/);
  const word = (label?.[1] ?? "").trim().toLowerCase();
  if (/^rush/.test(word)) return "rushing";
  if (/^pass/.test(word)) return "passing";
  if (/^(rec|receiv)/.test(word)) return "receiving";
  if (/^(def|defense)/.test(word)) return "defense";
  return undefined;
}

const BARE_YARDS: Record<string, string> = { rushing: "rushingYards", passing: "passingYards", receiving: "receivingYards" };
const BARE_TD: Record<string, string> = { rushing: "rushingTd", passing: "passingTd", receiving: "receivingTd" };

// ── Small helpers ───────────────────────────────────────────────────────────

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48);
}

let seq = 0;
function nextId(prefix: string): string {
  seq += 1;
  return `${prefix}-${seq}`;
}
/** Test hook so candidate ids are stable per extraction run. */
function resetIds() { seq = 0; }

function titleCase(s: string): string {
  return s.replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

/** Split into sentence-ish chunks, keeping each chunk's own text for quoting. */
function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Split a sentence into clauses so two players in one sentence stay separate. */
function clauses(sentence: string): string[] {
  return sentence
    .split(/\s*[;,]\s*|\s+\band\b\s+(?=[A-Z])/)
    .map((c) => c.trim())
    .filter(Boolean);
}

// ── Detectors ───────────────────────────────────────────────────────────────

interface Ctx {
  teamName: string;
  teamAliases: string[];
  evidenceId: string;
  opponentHint?: string;
}

function isOurTeam(word: string, ctx: Ctx): boolean {
  const w = word.toLowerCase();
  return w === ctx.teamName.toLowerCase() || ctx.teamAliases.some((a) => a.toLowerCase() === w);
}

/** Proper-noun runs, minus our own team, weekdays, months, and sentence filler. */
function properNouns(sentence: string, ctx: Ctx): string[] {
  const found: string[] = [];
  const re = /\b([A-Z][A-Za-z'’.-]+(?:\s+[A-Z][A-Za-z'’.-]+)?)\b/g;
  // "We're" / "Mason's" reduce to "We" / "Mason" before the filler check.
  const bare = (w: string) => w.replace(/['’][A-Za-z]+$/, "").replace(/[.'’-]+$/, "");
  let m: RegExpExecArray | null;
  while ((m = re.exec(sentence))) {
    // "Beat Eureka" at the start of a sentence is one capitalized run, so
    // leading filler is trimmed off rather than discarding the whole phrase.
    let words = m[1].trim().split(/\s+/);
    while (words.length > 0 && NOT_A_NAME.has(bare(words[0]).toLowerCase())) words = words.slice(1);
    if (words.length === 0) continue;
    while (words.length > 1 && NOT_A_NAME.has(bare(words[words.length - 1]).toLowerCase())) words = words.slice(0, -1);
    const head = bare(words[0]);
    if (isOurTeam(head, ctx)) continue;
    if (/^\d/.test(head)) continue;
    found.push(words.join(" "));
  }
  return found;
}

interface Scan {
  candidates: CandidateFact[];
  opponent?: string;
}

/** Final score, deficit, and record all look like "N-N". Context decides which. */
function scanNumberPairs(sentence: string, ctx: Ctx, out: Scan): void {
  const re = /(\d{1,3})\s*[-–—]\s*(\d{1,3})(?:\s*[-–—]\s*(\d{1,2}))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sentence))) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    const c = m[3] === undefined ? undefined : Number(m[3]);
    const before = sentence.slice(Math.max(0, m.index - 40), m.index);
    const whole = sentence;

    // 1. A deficit or a lead the operator described ("we were down 21-7").
    if (DEFICIT_WORDS.test(before) || LEAD_WORDS.test(before)) {
      const trailing = DEFICIT_WORDS.test(before);
      // Convention: "down 21-7" names the leading side first.
      const them = trailing ? Math.max(a, b) : Math.min(a, b);
      const us = trailing ? Math.min(a, b) : Math.max(a, b);
      out.candidates.push({
        id: nextId("narr"),
        kind: "narrative",
        label: trailing ? "Trailed" : "Led",
        value: {
          type: "narrative",
          text: trailing ? `${ctx.teamName} trailed ${them}-${us}.` : `${ctx.teamName} led ${us}-${them}.`,
          deficit: trailing ? { us, them } : undefined,
        },
        confidence: "medium",
        quote: whole,
        evidenceId: ctx.evidenceId,
        uncertainty: `Read as ${trailing ? "trailing" : "leading"} ${trailing ? them : us}-${trailing ? us : them}. Flip it if the note meant the other way around.`,
      });
      continue;
    }

    // 2. A won-lost record: small numbers with record language nearby.
    if (a <= 30 && b <= 30 && RECORD_WORDS.test(before) && !WIN_WORDS.test(before) && !LOSS_WORDS.test(before)) {
      out.candidates.push({
        id: nextId("rec"),
        kind: "record",
        label: "Record after this game",
        value: { type: "record", wins: a, losses: b, ties: c ?? 0 },
        confidence: "high",
        quote: whole,
        evidenceId: ctx.evidenceId,
      });
      continue;
    }

    // 3. Otherwise: a final score, if the note says who won or lost. A bare
    //    "W" or "L" in front of the score is how most scorebooks write it.
    const marker = /(^|\s)(W|L)\b[^a-z]*$/.test(before) ? (before.trim().endsWith("L") ? "L" : "W") : undefined;
    const won = WIN_WORDS.test(whole) || marker === "W";
    const lost = LOSS_WORDS.test(whole) || marker === "L";
    if (!won && !lost) continue;

    const opponent = opponentFrom(sentence, ctx);
    const teamScore = won ? Math.max(a, b) : Math.min(a, b);
    const opponentScore = won ? Math.min(a, b) : Math.max(a, b);
    const homeAway: HomeAway = /\bat\b\s+[A-Z]/.test(sentence)
      ? "away"
      : /\b(hosted|at home|home game)\b/i.test(sentence)
        ? "home"
        : "unknown";

    out.opponent = out.opponent ?? opponent;
    out.candidates.push({
      id: nextId("score"),
      kind: "score",
      label: "Final score",
      value: {
        type: "score",
        team: ctx.teamName,
        teamScore,
        opponent: opponent ?? "",
        opponentScore,
        homeAway,
      },
      confidence: opponent ? "high" : "medium",
      quote: whole,
      evidenceId: ctx.evidenceId,
      uncertainty: opponent
        ? undefined
        : "No opponent name found in the note. Type who this game was against.",
    });
  }
}

function opponentFrom(sentence: string, ctx: Ctx): string | undefined {
  // "over Lafayette", "against Lafayette", "to Eureka", "vs. Lafayette", "at Lafayette"
  // The preposition may be capitalized at the start of a sentence, but the name
  // that follows must still be capitalized — so the case-insensitivity is spelled
  // out rather than applied with a flag.
  const prep = sentence.match(
    /\b(?:[Oo]ver|[Aa]gainst|[Vv]s\.?|[Vv]ersus|[Tt]o|[Pp]ast|[Aa]t|[Bb]eat|[Dd]efeated|[Dd]ef\.?|[Tt]opped|[Kk]nocked off)\s+((?:[A-Z][A-Za-z'’.-]+)(?:\s+[A-Z][A-Za-z'’.-]+)?)/,
  );
  if (prep) {
    // "at Kirkwood Friday" names one school and one night, not a two-word school.
    let words = prep[1].trim().replace(/[.,]$/, "").split(/\s+/);
    while (words.length > 1 && NOT_A_NAME.has(words[words.length - 1].toLowerCase())) words = words.slice(0, -1);
    const head = words[0];
    if (!isOurTeam(head, ctx) && !NOT_A_NAME.has(head.toLowerCase())) return words.join(" ");
  }
  const nouns = properNouns(sentence, ctx);
  return nouns[0];
}

function scanNextGame(sentence: string, ctx: Ctx, out: Scan): void {
  const when =
    sentence.match(new RegExp(`\\b(${WEEKDAYS.join("|")})\\b`, "i")) ??
    sentence.match(/\b(next week|tonight|tomorrow)\b/i);
  const looksAhead = /\b(next|upcoming|this (?:friday|saturday|week)|we (?:play|host|travel)|is (?:friday|saturday|sunday|monday|tuesday|wednesday|thursday))\b/i.test(
    sentence,
  );
  if (!looksAhead || !when) return;
  // Anything that already described a completed game is not a schedule note.
  if (WIN_WORDS.test(sentence) || LOSS_WORDS.test(sentence)) return;

  const nouns = properNouns(sentence, ctx).filter(
    (n) => !WEEKDAYS.includes(n.toLowerCase()) && !MONTHS.includes(n.toLowerCase()),
  );
  if (nouns.length === 0) return;

  out.candidates.push({
    id: nextId("next"),
    kind: "next-game",
    label: "Next game",
    value: { type: "next-game", opponent: nouns[0], when: titleCase(when[1]) },
    confidence: "medium",
    quote: sentence,
    evidenceId: ctx.evidenceId,
    uncertainty: "Schedule notes are easy to misread. Confirm the opponent and the day.",
  });
}

interface StatHit {
  statId: string;
  amount: number;
  bare: boolean;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Numbers attached to a stat word, inside one chunk of text. */
function statHits(text: string, section: Section): StatHit[] {
  const hits: StatHit[] = [];
  const taken: Array<[number, number]> = [];
  const overlaps = (s: number, e: number) => taken.some(([a, b]) => s < b && e > a);
  const claim = (m: RegExpExecArray, statId: string, amount: number, bare = false) => {
    if (overlaps(m.index, m.index + m[0].length)) return;
    if (!Number.isFinite(amount)) return;
    taken.push([m.index, m.index + m[0].length]);
    hits.push({ statId, amount, bare });
  };

  const NUM = `(\\d+(?:\\.\\d+)?|${NUM_WORD_PATTERN})`;

  // Longest aliases first, so "rushing touchdowns" wins over "rushing".
  for (const { alias, statId } of STAT_ALIASES) {
    const esc = escape(alias);
    for (const re of [
      new RegExp(`${NUM}\\s*${esc}\\b`, "gi"),          // "186 rushing yards"
      new RegExp(`\\b${esc}\\s*(?:of|:|=|-)?\\s*${NUM}\\b`, "gi"), // "rushing yards: 186"
    ]) {
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) claim(m, statId, numberFrom(m[1]));
    }
  }

  // How people actually write it: "threw for 168", "ran for 186".
  for (const [pattern, statId] of [
    [`\\b(?:threw|passed)\\s+for\\s+${NUM}`, "passingYards"],
    [`\\b(?:ran|rushed)\\s+for\\s+${NUM}`, "rushingYards"],
  ] as const) {
    const re = new RegExp(pattern, "gi");
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) claim(m, statId, numberFrom(m[1]));
  }

  // Inside a stat-export block, a bare "yards" or "TD" belongs to that block.
  if (section) {
    const yardsStat = BARE_YARDS[section];
    if (yardsStat) {
      const re = new RegExp(`${NUM}\\s*(?:yards|yds)\\b`, "gi");
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) claim(m, yardsStat, numberFrom(m[1]));
    }
    const tdStat = BARE_TD[section];
    if (tdStat) {
      const re = new RegExp(`${NUM}\\s*(?:tds?|touchdowns?)\\b`, "gi");
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) claim(m, tdStat, numberFrom(m[1]));
    }
  }

  // "had a pick", "recovered a fumble" — one, unnumbered.
  for (const { alias, statId } of STAT_ALIASES) {
    const def = statDef(statId);
    if (!def?.countNoun) continue;
    if (hits.some((h) => h.statId === statId)) continue;
    const re = new RegExp(`\\b(?:a|an|one)\\s+(?:\\w+\\s+){0,2}?${escape(alias)}\\b`, "i");
    const m = re.exec(text);
    if (m) claim(m, statId, 1, true);
  }

  return hits;
}

/**
 * Attribution. A stat-export line ("Rushing: Mason 24 carries, 186 yards") is
 * one player's line even though it has commas in it, so lines with exactly one
 * name are read whole. Prose sentences that mention two players are split into
 * clauses so each set of numbers reaches the right person.
 */
function scanPlayerStats(line: string, ctx: Ctx, out: Scan): void {
  const section = sectionOf(line);
  // Strip a leading "Rushing:" style label so it cannot be read as a name.
  const body = section || /^\s*[A-Za-z ]{3,20}\s*:/.test(line) ? line.replace(/^\s*[A-Za-z ]{3,20}\s*:/, "") : line;

  const namesInLine = properNouns(body, ctx).filter((n) => n !== out.opponent && n !== ctx.opponentHint);
  const chunks =
    namesInLine.length === 1 ? [body] : clauses(body).filter((c) => c.trim().length > 0);

  for (const chunk of chunks) {
    const hits = statHits(chunk, section);
    if (hits.length === 0) continue;

    const names =
      namesInLine.length === 1
        ? namesInLine
        : properNouns(chunk, ctx).filter((n) => n !== out.opponent && n !== ctx.opponentHint);
    if (names.length === 0) continue;
    const player = names[0].replace(/[.,]$/, "");

    // A bare "3 TD" next to rushing yardage almost always means rushing scores,
    // but that is our reading, not the operator's words. Say so on the screen.
    const hasRush = hits.some((h) => h.statId === "rushingYards" || h.statId === "rushingTd");
    const hasPassRec = hits.some((h) =>
      ["passingYards", "passingTd", "receivingYards", "receivingTd", "receptions"].includes(h.statId),
    );

    for (const hit of hits) {
      let statId = hit.statId;
      let confidence: Confidence = hit.bare ? "medium" : "high";
      let uncertainty: string | undefined = hit.bare
        ? "The note did not give a number, so this was recorded as one. Change it if there were more."
        : undefined;

      if (statId === "touchdowns" && hasRush && !hasPassRec) {
        statId = "rushingTd";
        confidence = "medium";
        uncertainty =
          "Read as rushing touchdowns because the same note credited rushing yards. Change it if they were receiving or passing scores.";
      }

      const value: CandidateValue = { type: "player-stat", player, stat: statId, amount: hit.amount };
      out.candidates.push({
        id: nextId(`stat-${slug(player)}`),
        kind: "player-stat",
        label: `${player} — ${statDef(statId)?.label ?? statId}`,
        value,
        confidence,
        quote: chunk.trim(),
        evidenceId: ctx.evidenceId,
        uncertainty,
      });
    }
  }
}

function scanDate(text: string, ctx: Ctx, out: Scan): void {
  const iso = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) {
    out.candidates.push({
      id: nextId("date"),
      kind: "game-date",
      label: "Game date",
      value: { type: "game-date", date: iso[0] },
      confidence: "high",
      quote: iso[0],
      evidenceId: ctx.evidenceId,
    });
    return;
  }
  const md = text.match(
    new RegExp(`\\b(${MONTHS.join("|")})\\.?\\s+(\\d{1,2})(?:,?\\s+(20\\d{2}))?\\b`, "i"),
  );
  if (!md) return;
  const monthIndex = MONTHS.findIndex((m) => m === md[1].toLowerCase()) % 12;
  const year = md[3] ? Number(md[3]) : new Date().getFullYear();
  const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(Number(md[2])).padStart(2, "0")}`;
  out.candidates.push({
    id: nextId("date"),
    kind: "game-date",
    label: "Game date",
    value: { type: "game-date", date },
    confidence: "medium",
    quote: md[0],
    evidenceId: ctx.evidenceId,
    uncertainty: "The year was not written down, so this year was assumed.",
  });
}

// ── Public API ──────────────────────────────────────────────────────────────

export interface ExtractionResult {
  candidates: CandidateFact[];
  /** True when nothing at all could be read — the UI must say so, never pretend. */
  empty: boolean;
  /** Plain notes about what could not be read. Never swallowed silently. */
  notes: string[];
}

export function extractCandidates(
  evidence: EvidenceItem[],
  team: { name: string; aliases?: string[] },
  /** Used only as the fallback game date when the notes carry none. */
  today = new Date().toISOString().slice(0, 10),
): ExtractionResult {
  resetIds();
  const notes: string[] = [];
  const all: CandidateFact[] = [];

  for (const item of evidence) {
    const text = item.text.trim();
    if (!text) continue;
    const ctx: Ctx = { teamName: team.name, teamAliases: team.aliases ?? [], evidenceId: item.id };
    const out: Scan = { candidates: [] };

    // Score first: it names the opponent, which keeps that name out of the
    // player list. Then everything else.
    const lines = sentences(text);
    for (const s of lines) scanNumberPairs(s, ctx, out);
    ctx.opponentHint = out.opponent;
    for (const s of lines) {
      scanNextGame(s, ctx, out);
      scanPlayerStats(s, ctx, out);
    }
    scanDate(text, ctx, out);

    if (out.candidates.length === 0) {
      notes.push(`Nothing could be read from "${item.label ?? "your notes"}". Add the score, or type the facts in below.`);
    }
    all.push(...out.candidates);
  }

  // Same player + same stat read twice: keep the higher-confidence read.
  const seen = new Map<string, CandidateFact>();
  const deduped: CandidateFact[] = [];
  const rank: Record<Confidence, number> = { high: 3, medium: 2, low: 1 };
  for (const c of all) {
    const key =
      c.value.type === "player-stat"
        ? `ps:${c.value.player.toLowerCase()}:${c.value.stat}`
        : `${c.kind}:${JSON.stringify(c.value)}`;
    const prev = seen.get(key);
    if (prev && rank[prev.confidence] >= rank[c.confidence]) continue;
    if (prev) deduped.splice(deduped.indexOf(prev), 1);
    seen.set(key, c);
    deduped.push(c);
  }

  if (!deduped.some((c) => c.kind === "score")) {
    notes.push("No final score was found. A game cannot be saved without one.");
  }

  // The date decides which games this one is compared against, so it is always
  // put in front of the operator rather than assumed quietly.
  if (!deduped.some((c) => c.kind === "game-date")) {
    deduped.push({
      id: nextId("date"),
      kind: "game-date",
      label: "Game date",
      value: { type: "game-date", date: today },
      confidence: "low",
      quote: "",
      evidenceId: evidence[0]?.id ?? "operator",
      uncertainty: "No date was in the notes, so today's date was used. Change it if the game was another night.",
    });
  }

  return { candidates: deduped, empty: deduped.length === 0, notes };
}

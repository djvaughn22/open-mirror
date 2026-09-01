// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk regression tests.
//
//   npm test
//
// Two things are locked here. First, the arithmetic: streaks, season highs, and
// records have to be right, because the whole product rests on them. Second,
// and more important, the hallucination boundary: no number and no name can
// reach a reader unless a person verified it or our own code counted it.
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import test from "node:test";

import { approveGame, type ApprovedCandidate } from "../src/lib/sports/approve.ts";
import { buildEdition } from "../src/lib/sports/edition.ts";
import { extractCandidates } from "../src/lib/sports/extract.ts";
import { buildFactSet, guardProse } from "../src/lib/sports/factGuard.ts";
import { computedRecord, consecutiveAtLeast, playerSeries, recordWhenPlayerAtLeast, resultStreak } from "../src/lib/sports/history.ts";
import { findStories } from "../src/lib/sports/storyFinder.ts";
import { store } from "../src/lib/sports/store.ts";
import { validateGame } from "../src/lib/sports/validate.ts";
import { describePerformance } from "../src/lib/sports/writer.ts";
import type { CandidateFact, GameRecord } from "../src/lib/sports/types.ts";

const TEAM = { name: "Wildwood", aliases: ["Wildcats"] };
const NOTE =
  "Won 42-35 over Lafayette. We were down 21-7. Mason had 186 rushing and 3 TD. Eli had a late pick. We're 5-2 now and Eureka is Friday.";

const read = (text: string): CandidateFact[] =>
  extractCandidates([{ id: "e1", kind: "pasted-text", text }], TEAM, "2026-10-09").candidates;

const stat = (cands: CandidateFact[], player: string, statId: string) =>
  cands.find((c) => c.value.type === "player-stat" && c.value.player === player && c.value.stat === statId);

// ── Extraction ──────────────────────────────────────────────────────────────

test("the messy note in the spec becomes the facts in the spec", () => {
  const c = read(NOTE);
  const score = c.find((x) => x.kind === "score");
  assert.ok(score && score.value.type === "score");
  assert.equal(score.value.teamScore, 42);
  assert.equal(score.value.opponentScore, 35);
  assert.equal(score.value.opponent, "Lafayette");

  const record = c.find((x) => x.kind === "record");
  assert.ok(record && record.value.type === "record");
  assert.equal(record.value.wins, 5);
  assert.equal(record.value.losses, 2);

  const rushing = stat(c, "Mason", "rushingYards");
  assert.ok(rushing && rushing.value.type === "player-stat");
  assert.equal(rushing.value.amount, 186);

  const tds = stat(c, "Mason", "rushingTd");
  assert.ok(tds && tds.value.type === "player-stat");
  assert.equal(tds.value.amount, 3);

  const pick = stat(c, "Eli", "interceptions");
  assert.ok(pick && pick.value.type === "player-stat");
  assert.equal(pick.value.amount, 1);

  const next = c.find((x) => x.kind === "next-game");
  assert.ok(next && next.value.type === "next-game");
  assert.equal(next.value.opponent, "Eureka");
  assert.equal(next.value.when, "Friday");

  const trailed = c.find((x) => x.kind === "narrative");
  assert.ok(trailed && trailed.value.type === "narrative");
  assert.deepEqual(trailed.value.deficit, { us: 7, them: 21 });
});

test("nothing the note did not say is invented — carries especially", () => {
  const c = read(NOTE);
  assert.equal(stat(c, "Mason", "rushingAttempts"), undefined, "carries were never mentioned");
  assert.equal(stat(c, "Mason", "receivingYards"), undefined);
  assert.equal(stat(c, "Eli", "tackles"), undefined);
});

test("a guessed reading is always marked as a guess", () => {
  const c = read(NOTE);
  assert.ok(stat(c, "Mason", "rushingTd")?.uncertainty, "a bare TD count is an inference, not a fact");
  assert.ok(stat(c, "Eli", "interceptions")?.uncertainty, "an unnumbered pick is an inference");
  assert.equal(stat(c, "Mason", "rushingYards")?.uncertainty, undefined, "an explicit number is not a guess");
});

test("a deficit and a won-lost record are never mistaken for a final score", () => {
  const c = read(NOTE);
  assert.equal(c.filter((x) => x.kind === "score").length, 1, "21-7 and 5-2 must not become extra final scores");
});

test("the opponent's name never becomes a player", () => {
  const c = read(NOTE);
  assert.ok(!c.some((x) => x.value.type === "player-stat" && x.value.player === "Lafayette"));
});

test("a pasted stat export attributes every line to the right player", () => {
  const c = read(
    "Rushing: Mason 24 carries, 186 yards, 3 TD\n" +
      "Passing: Cole 12 completions, 201 passing yards, 2 passing TD\n" +
      "Defense: Eli 9 tackles, 1 interception, 2 sacks",
  );
  assert.equal((stat(c, "Mason", "rushingYards")?.value as { amount: number }).amount, 186);
  assert.equal((stat(c, "Mason", "rushingAttempts")?.value as { amount: number }).amount, 24);
  assert.equal((stat(c, "Mason", "rushingTd")?.value as { amount: number }).amount, 3);
  assert.equal((stat(c, "Cole", "passingYards")?.value as { amount: number }).amount, 201);
  assert.equal((stat(c, "Cole", "passingTd")?.value as { amount: number }).amount, 2);
  assert.equal((stat(c, "Eli", "tackles")?.value as { amount: number }).amount, 9);
  assert.equal((stat(c, "Eli", "sacks")?.value as { amount: number }).amount, 2);
  assert.equal((stat(c, "Eli", "interceptions")?.value as { amount: number }).amount, 1);

  // Section labels and stat abbreviations are not people.
  for (const notAPlayer of ["Rushing", "Passing", "Defense", "TD", "Yards"]) {
    assert.ok(!c.some((x) => x.value.type === "player-stat" && x.value.player === notAPlayer), `${notAPlayer} is not a player`);
  }
});

test("scorebook shorthand and casual phrasing both read", () => {
  const terse = read("W 21-14 vs Eureka");
  const score = terse.find((x) => x.kind === "score");
  assert.ok(score && score.value.type === "score");
  assert.equal(score.value.teamScore, 21);
  assert.equal(score.value.opponent, "Eureka");

  const chatty = read("We beat Ladue 35-21 at home. Mason went off - 131 rushing yards and two rushing touchdowns. Cole threw for 168.");
  assert.equal((stat(chatty, "Mason", "rushingTd")?.value as { amount: number }).amount, 2, "'two' is a number");
  assert.equal((stat(chatty, "Cole", "passingYards")?.value as { amount: number }).amount, 168, "'threw for 168' is passing yards");
});

test("a weekday in the sentence never becomes part of the opponent's name", () => {
  const c = read("Lost 7-28 at Kirkwood Friday. Eli had 11 tackles.");
  const score = c.find((x) => x.kind === "score");
  assert.ok(score && score.value.type === "score");
  assert.equal(score.value.opponent, "Kirkwood");
});

test("evidence with no score is refused out loud, not saved quietly", () => {
  const result = extractCandidates([{ id: "e1", kind: "pasted-text", text: "Great crowd tonight." }], TEAM, "2026-10-09");
  assert.ok(result.notes.some((n) => n.includes("No final score")));
  const approval = approveGame({
    candidates: result.candidates.map((c) => ({ ...c, kept: true })),
    evidence: [],
    team: { name: "Wildwood" },
    seasonId: "2026",
    today: "2026-10-09",
  });
  assert.equal(approval.ok, false);
});

// ── Approval ────────────────────────────────────────────────────────────────

function approveNote(note = NOTE, edit?: (c: ApprovedCandidate[]) => ApprovedCandidate[]): GameRecord {
  const raw = read(note).map((c) => ({ ...c, kept: true }));
  const candidates = edit ? edit(raw) : raw;
  const result = approveGame({
    candidates,
    evidence: [{ id: "e1", kind: "pasted-text", text: note }],
    team: { name: "Wildwood" },
    seasonId: "2026",
    today: "2026-10-09",
  });
  assert.ok(result.ok, result.ok ? "" : result.errors.join("; "));
  return result.value;
}

test("a fact the operator removed never reaches the archive", () => {
  const game = approveNote(NOTE, (c) =>
    c.map((x) => (x.value.type === "player-stat" && x.value.player === "Eli" ? { ...x, kept: false } : x)),
  );
  assert.ok(!game.players.some((p) => p.name === "Eli"), "a removed performance must not be stored");
  assert.ok(game.players.some((p) => p.name === "Mason"));
});

test("every stored stat carries provenance", () => {
  const game = approveNote();
  for (const p of game.players) {
    for (const [id, v] of Object.entries(p.stats)) {
      assert.ok(v.provenance, `${p.name}.${id} has no provenance`);
      assert.ok(
        v.provenance.kind === "evidence" ? v.provenance.approvedByOperator : true,
        `${p.name}.${id} was not operator-approved`,
      );
    }
  }
  assert.ok(game.scoreProvenance);
});

test("an edited value is stored as the operator's word, not as the note's", () => {
  const game = approveNote(NOTE, (c) =>
    c.map((x) =>
      x.value.type === "player-stat" && x.value.stat === "rushingYards"
        ? { ...x, edited: true, value: { ...x.value, amount: 190 } }
        : x,
    ),
  );
  const mason = game.players.find((p) => p.name === "Mason")!;
  assert.equal(mason.stats.rushingYards.amount, 190);
  assert.equal(mason.stats.rushingYards.provenance.kind, "operator");
});

test("validation refuses a stat this desk does not record and a game with no opponent", () => {
  const base = approveNote();
  const bogusStat = validateGame({
    ...base,
    players: [{ name: "Mason", stats: { fortyTime: { amount: 4.5, provenance: { kind: "operator", approvedByOperator: true } } } }],
  });
  assert.equal(bogusStat.ok, false);

  const noOpponent = validateGame({ ...base, opponent: "" });
  assert.equal(noOpponent.ok, false);

  const noProvenance = validateGame({
    ...base,
    players: [{ name: "Mason", stats: { rushingYards: { amount: 186 } } }],
  });
  assert.equal(noProvenance.ok, false, "a stat with no provenance must never validate");
});

// ── History arithmetic ──────────────────────────────────────────────────────

/** The sequence the spec asks for: 84 → 112 → 131 → 186. */
function rushingSeason(amounts: number[], results: Array<"W" | "L"> = []): GameRecord[] {
  return amounts.map((yards, i) => {
    const day = String(i + 1).padStart(2, "0");
    const won = (results[i] ?? "W") === "W";
    const built = validateGame({
      id: `2026-09-${day}-opp${i}`,
      version: 1,
      sport: "football",
      seasonId: "2026",
      date: `2026-09-${day}`,
      team: "Wildwood",
      opponent: `Opp${i}`,
      homeAway: "home",
      teamScore: won ? 21 : 7,
      opponentScore: won ? 14 : 28,
      players: [{ name: "Mason", stats: { rushingYards: { amount: yards, provenance: { kind: "operator", approvedByOperator: true } } } }],
      narrative: [],
      scoreProvenance: { kind: "operator", approvedByOperator: true },
      evidence: [],
      createdAt: "2026-09-01T00:00:00.000Z",
    });
    assert.ok(built.ok, built.ok ? "" : built.errors.join("; "));
    return built.value;
  });
}

test("a season high is counted, not guessed", () => {
  const games = rushingSeason([84, 112, 131, 186]);
  const series = playerSeries(games, "Mason", "rushingYards");
  assert.deepEqual(series.map((p) => p.amount), [84, 112, 131, 186]);

  const discoveries = findStories(games[3], games);
  const high = discoveries.find((d) => d.id === "season-high-Mason-rushingYards");
  assert.ok(high, "186 after 84/112/131 is a season high");
  assert.match(high.text, /186 rushing yards are a season high/);
  assert.match(high.text, /131/, "it must say what was beaten");
  assert.equal(high.tier, "calculated");
});

test("a consecutive-games streak counts back and stops where it really stops", () => {
  const games = rushingSeason([84, 112, 131, 186]);
  assert.equal(consecutiveAtLeast(games, "Mason", "rushingYards", 100).length, 3, "84 breaks the run");

  const broken = rushingSeason([112, 96, 131, 186]);
  assert.equal(consecutiveAtLeast(broken, "Mason", "rushingYards", 100).length, 2, "96 breaks the run");

  const discoveries = findStories(games[3], games);
  const streak = discoveries.find((d) => d.kind === "player-streak");
  assert.ok(streak);
  assert.match(streak.text, /three straight games with at least 100 rushing yards/);
});

test("no season-high claim is made when there is nothing to compare against", () => {
  const games = rushingSeason([186]);
  const discoveries = findStories(games[0], games);
  assert.ok(!discoveries.some((d) => d.kind === "player-season-high"), "one game is not a season");
  assert.ok(!discoveries.some((d) => d.kind === "player-streak"), "one game is not a streak");
});

test("win/loss streaks and records are arithmetic", () => {
  const games = rushingSeason([84, 112, 131, 186], ["W", "L", "W", "W"]);
  assert.deepEqual(computedRecord(games), { wins: 3, losses: 1, ties: 0 });
  assert.equal(resultStreak(games)?.games.length, 2, "the loss ends the run");

  const when = recordWhenPlayerAtLeast(games, "Mason", "rushingYards", 100);
  assert.deepEqual(when.record, { wins: 2, losses: 1, ties: 0 });
});

// ── The hallucination boundary ──────────────────────────────────────────────

test("the writer names carries only when carries were verified", () => {
  const withoutCarries = describePerformance({
    name: "Mason",
    stats: { rushingYards: { amount: 186, provenance: { kind: "operator", approvedByOperator: true } } },
  });
  assert.equal(withoutCarries, "Mason ran for 186 yards.");
  assert.ok(!/carr/i.test(withoutCarries), "carries must not appear from nowhere");

  const withCarries = describePerformance({
    name: "Mason",
    stats: {
      rushingYards: { amount: 186, provenance: { kind: "operator", approvedByOperator: true } },
      rushingAttempts: { amount: 24, provenance: { kind: "operator", approvedByOperator: true } },
    },
  });
  assert.equal(withCarries, "Mason ran 24 times for 186 yards.");
});

test("the fact guard rejects the exact sentence the spec forbids", () => {
  const game = approveNote();
  const discoveries = findStories(game, [game]);
  const facts = buildFactSet(game, discoveries, "Wildcats");

  assert.equal(guardProse("Mason ran for 186 yards.", facts).ok, true);

  const invented = guardProse("Mason ran for 186 yards on 24 carries.", facts);
  assert.equal(invented.ok, false, "24 carries were never verified");
  assert.ok(invented.violations.includes("24"));
});

test("the fact guard rejects invented people, opponents, and scores", () => {
  const game = approveNote();
  const facts = buildFactSet(game, findStories(game, [game]), "Wildcats");

  assert.equal(guardProse("Jaylen caught two touchdown passes.", facts).ok, false);
  assert.equal(guardProse("Wildwood beat Eureka 42-35.", facts).ok, true, "Eureka is a verified next opponent");
  assert.equal(guardProse("Wildwood beat Rockwood 42-35.", facts).ok, false, "Rockwood was not in this game");
  assert.equal(guardProse("Wildwood won 49-35.", facts).ok, false, "49 was never a verified score");
  assert.equal(guardProse("Mason scored four rushing touchdowns.", facts).ok, false, "four was never verified");
});

test("the desk's own edition passes its own guard", () => {
  const game = approveNote();
  const archive = [...store.list(), game];
  const edition = buildEdition({ game, archive, mascot: "Wildcats" });
  assert.equal(edition.writtenBy, "engine");
  assert.equal(edition.guardNote, undefined, edition.guardNote ?? "");
  assert.ok(edition.headline.length > 0);
  assert.ok(edition.story.length >= 2);
});

test("a model rewrite that adds a fact is rejected and the desk's writing is published instead", () => {
  const game = approveNote();
  const archive = [...store.list(), game];
  const honest = buildEdition({ game, archive, mascot: "Wildcats" });

  const edition = buildEdition({
    game,
    archive,
    mascot: "Wildcats",
    modelStory: ["Mason ran for 186 yards on 24 carries and added a 63-yard touchdown in front of a packed house."],
  });
  assert.equal(edition.writtenBy, "engine", "the rejected rewrite must not be published");
  assert.deepEqual(edition.story, honest.story);
  assert.ok(edition.guardNote, "a rejected rewrite is reported, never swallowed");
  assert.match(edition.guardNote!, /24|63/);
});

test("a model rewrite that stays inside the facts is allowed", () => {
  const game = approveNote();
  const archive = [...store.list(), game];
  const edition = buildEdition({
    game,
    archive,
    mascot: "Wildcats",
    modelStory: ["Wildwood trailed 21-7 and beat Lafayette 42-35.", "Mason ran for 186 yards."],
  });
  assert.equal(edition.writtenBy, "model");
});

// ── Sparse evidence, and the archive itself ─────────────────────────────────

test("thin evidence produces a short story, never a padded one", () => {
  const game = approveNote("Beat Eureka 14-7.");
  const edition = buildEdition({ game, archive: [game], mascot: "Wildcats" });
  assert.ok(edition.story.length <= 2, "there is nothing to write a third paragraph about");
  assert.ok(!/thrilling|resilience|determination|too much to handle/i.test(edition.story.join(" ")));
  assert.ok(!/undefined|NaN/.test(edition.summary));
});

test("no generated writing reaches for stock sports filler", () => {
  const game = approveNote();
  const edition = buildEdition({ game, archive: [...store.list(), game], mascot: "Wildcats" });
  const prose = [edition.headline, edition.summary, ...edition.story].join(" ");
  for (const phrase of ["thrilling", "resilience", "determination", "too much to handle", "showcased", "statement win"]) {
    assert.ok(!prose.toLowerCase().includes(phrase), `"${phrase}" is filler, not reporting`);
  }
});

test("every game already in the archive validates and stores only sports facts", () => {
  const allowed = new Set([
    "id", "version", "sport", "seasonId", "date", "team", "opponent", "homeAway", "teamScore",
    "opponentScore", "result", "recordAfter", "players", "narrative", "next", "scoreProvenance",
    "evidence", "demo", "createdAt", "updatedAt",
  ]);
  const games = store.list();
  assert.ok(games.length > 0, "the desk ships with an archive to compare against");
  for (const g of games) {
    assert.equal(validateGame(g).ok, true, `${g.id} does not validate`);
    for (const key of Object.keys(g)) {
      assert.ok(allowed.has(key), `${g.id} stores "${key}", which is not a sports fact`);
    }
  }
});

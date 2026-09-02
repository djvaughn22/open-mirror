// ─────────────────────────────────────────────────────────────────────────────
// First-party results network — the trust tests.
//
// This is a write endpoint on the public internet feeding a publication that
// covers teenagers. The rules below are the ones that must never quietly erode:
//
//   1. a PUBLIC report never publishes on its own, however plausible it looks
//   2. an AUTHORIZED report publishes, but never overrides a contradiction
//   3. a credential is scoped to one school and cannot report another's game
//   4. a revoked credential is dead on the next request
//   5. "we won 28-21" keeps the winner on the right side of the scoreline
//   6. the same report twice is one report
//
// Everything runs against an in-memory repository. No network, no database.
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import test from "node:test";

import { reconcile } from "../src/lib/sports/graph/confidence.ts";
import { normalizeObservations } from "../src/lib/sports/graph/normalize.ts";
import { buildSchoolIndex } from "../src/lib/sports/graph/resolve.ts";
import { ST_LOUIS_SCHOOLS } from "../src/lib/sports/metros/stLouisSchools.ts";
import { buildSchoolPage, creditsFor } from "../src/lib/sports/schoolPage.ts";
import {
  hashToken,
  issueCredential,
  reportingLink,
  verifyToken,
} from "../src/lib/sports/submit/credentials.ts";
import { fingerprintOf, submitResult, validateSubmission } from "../src/lib/sports/submit/submit.ts";
import type { SportsRepository } from "../src/lib/sports/repo/types.ts";
import type { CanonicalEvent, RawObservation, School } from "../src/lib/sports/graph/types.ts";
import type { StoredCredential, SubmissionInput, SubmissionRecord } from "../src/lib/sports/submit/types.ts";

const INDEX = buildSchoolIndex(ST_LOUIS_SCHOOLS);
const SCHOOLS = new Map<string, School>(ST_LOUIS_SCHOOLS.map((s) => [s.id, s]));
const NOW = "2026-09-02T12:00:00.000Z";
const TODAY = "2026-09-02";

/** An in-memory SportsRepository, so every path runs with no I/O at all. */
function memoryRepo(seedEvents: CanonicalEvent[] = []): SportsRepository {
  const events = new Map(seedEvents.map((e) => [e.id, e]));
  const submissions: SubmissionRecord[] = [];
  const credentials: StoredCredential[] = [];
  return {
    async listEvents() {
      return [...events.values()].sort((a, b) => a.date.localeCompare(b.date));
    },
    async getEvent(id) {
      return events.get(id);
    },
    async saveEvent(event) {
      events.set(event.id, event);
    },
    async listSubmissions(options) {
      let all = [...submissions];
      if (options?.status) all = all.filter((s) => s.status === options.status);
      return all;
    },
    async saveSubmission(record) {
      const i = submissions.findIndex((s) => s.id === record.id);
      if (i >= 0) submissions[i] = record;
      else submissions.push(record);
    },
    async findSubmissionByFingerprint(fingerprint) {
      return submissions.find((s) => s.fingerprint === fingerprint);
    },
    async findCredentialByHash(tokenHash) {
      return credentials.find((c) => c.tokenHash === tokenHash);
    },
    async listCredentials() {
      return [...credentials];
    },
    async saveCredential(credential) {
      const i = credentials.findIndex((c) => c.id === credential.id);
      if (i >= 0) credentials[i] = credential;
      else credentials.push(credential);
    },
    async revokeCredential(id, at) {
      const found = credentials.find((c) => c.id === id);
      if (!found || found.revokedAt) return false;
      found.revokedAt = at;
      return true;
    },
    async writable() {
      return true;
    },
    describe: () => "memory",
  };
}

const report = (over: Partial<SubmissionInput> = {}): SubmissionInput => ({
  schoolId: "micds",
  sport: "football",
  opponentName: "Ladue Horton Watkins High School",
  ourScore: 24,
  theirScore: 38,
  date: "2026-09-01",
  homeAway: "away",
  ...over,
});

// ── 1. Credentials ──────────────────────────────────────────────────────────

test("a token is stored only as a hash, and verifies", async () => {
  const repo = memoryRepo();
  const { credential, token } = await issueCredential(repo, { schoolId: "micds", label: "MICDS athletics" });

  assert.ok(token.length >= 40, "the token is long enough not to be guessed");
  assert.equal(credential.tokenHash, hashToken(token));
  assert.ok(!JSON.stringify(await repo.listCredentials()).includes(token), "the raw token is never stored");

  const check = await verifyToken(repo, token);
  assert.equal(check.ok, true);
  assert.equal(check.ok && check.credential.schoolId, "micds");

  assert.match(reportingLink("https://example.test/", token), /^https:\/\/example\.test\/sports\/report\//);
});

test("an unknown, malformed or revoked token is refused", async () => {
  const repo = memoryRepo();
  const { credential, token } = await issueCredential(repo, { schoolId: "micds", label: "MICDS" });

  assert.equal((await verifyToken(repo, "not-a-real-token-but-long-enough-xx")).ok, false);
  assert.equal((await verifyToken(repo, "short")).ok, false);
  assert.equal((await verifyToken(repo, "has spaces and $ymbols !!!!!!!!!!!")).ok, false);

  await repo.revokeCredential(credential.id, NOW);
  const after = await verifyToken(repo, token);
  assert.equal(after.ok, false, "a revoked link is dead on the very next request");
  assert.equal(after.ok === false && after.reason, "revoked");
});

// ── 2. Authorized submissions publish; orientation stays correct ────────────

test("an authorized final publishes with no human involved, winner on the right side", async () => {
  const repo = memoryRepo();
  const outcome = await submitResult({
    repo,
    input: report({ ourScore: 24, theirScore: 38 }),
    origin: "authorized",
    credentialId: "cred-1",
    now: NOW,
    today: TODAY,
  });

  assert.equal(outcome.status, "published");
  assert.ok(outcome.event);
  const event = outcome.event!;
  assert.equal(event.publishable, true);

  // MICDS reported "we 24, they 38". Ladue must be the winner.
  const micds = event.sides.find((s) => s.schoolId === "micds");
  const ladue = event.sides.find((s) => s.schoolId === "ladue");
  assert.equal(micds?.score, 24);
  assert.equal(ladue?.score, 38);

  // And the reverse orientation must work identically.
  const repo2 = memoryRepo();
  const win = await submitResult({
    repo: repo2,
    input: report({ ourScore: 38, theirScore: 24 }),
    origin: "authorized",
    now: NOW,
    today: TODAY,
  });
  assert.equal(win.event!.sides.find((s) => s.schoolId === "micds")?.score, 38);
  assert.equal(win.event!.sides.find((s) => s.schoolId === "ladue")?.score, 24);
});

test("the published event credits the school, never a token or an id", async () => {
  const repo = memoryRepo();
  const outcome = await submitResult({
    repo,
    input: report(),
    origin: "authorized",
    credentialId: "cred-secret-id",
    now: NOW,
    today: TODAY,
  });
  const credits = creditsFor(outcome.event!, SCHOOLS);
  assert.deepEqual(credits, ["MICDS Athletics"]);

  const serialized = JSON.stringify(outcome.event);
  assert.ok(!serialized.includes("cred-secret-id"), "a credential id never reaches a published event");
});

// ── 3. Public submissions fail closed ──────────────────────────────────────

test("a public report never publishes on its own", async () => {
  const repo = memoryRepo();
  const outcome = await submitResult({ repo, input: report(), origin: "public", now: NOW, today: TODAY });

  assert.equal(outcome.status, "review");
  assert.equal(outcome.event?.publishable, false, "a stranger's score is evidence, not publication");
  assert.match(outcome.message, /desk|confirm/i);

  // It is retained, so it can corroborate later.
  const held = await repo.listSubmissions({ status: "review" });
  assert.equal(held.length, 1);
});

test("a public report that matches an authorized one does not weaken it", async () => {
  const repo = memoryRepo();
  await submitResult({ repo, input: report(), origin: "authorized", now: NOW, today: TODAY });
  const second = await submitResult({ repo, input: report(), origin: "public", now: NOW, today: TODAY });

  assert.equal(second.event?.publishable, true, "the authorized account still carries it");
  assert.equal(second.status, "published");
});

// ── 4. Validation ──────────────────────────────────────────────────────────

test("reports that cannot be true are refused before becoming evidence", async () => {
  const cases: Array<[string, Partial<SubmissionInput>, string]> = [
    ["a future game", { date: "2026-09-30" }, "future-date"],
    ["a game too far back for the quick form", { date: "2026-01-01" }, "too-old"],
    ["a negative score", { ourScore: -1 }, "bad-score"],
    ["a non-integer score", { ourScore: 3.5 }, "bad-score"],
    ["an absurd score", { ourScore: 5000 }, "bad-score"],
    ["a school we do not know", { opponentName: "Hogwarts" }, "unknown-opponent"],
    ["a team playing itself", { opponentName: "Mary Institute and St. Louis Country Day" }, "same-school"],
    ["a malformed date", { date: "last friday" }, "bad-date"],
  ];

  for (const [label, over, expected] of cases) {
    const result = validateSubmission(report(over), { today: TODAY, origin: "authorized", now: NOW });
    assert.equal(result.ok, false, `${label} must be refused`);
    assert.ok(result.errors.includes(expected as never), `${label} → ${expected}, got ${result.errors.join(",")}`);
  }
});

test("a sport that cannot end level refuses a tie", () => {
  // Volleyball is decided by sets; 2-2 could not have happened.
  const tie = validateSubmission(report({ sport: "girls-volleyball", ourScore: 2, theirScore: 2 }), {
    today: TODAY,
    origin: "authorized",
    now: NOW,
  });
  assert.equal(tie.ok, false);
  assert.ok(tie.errors.includes("tie-not-allowed"));

  // Soccer can, and must be accepted.
  const draw = validateSubmission(report({ sport: "boys-soccer", ourScore: 2, theirScore: 2 }), {
    today: TODAY,
    origin: "authorized",
    now: NOW,
  });
  assert.equal(draw.ok, true);
});

test("a rejected report is recorded and never becomes an event", async () => {
  const repo = memoryRepo();
  const outcome = await submitResult({
    repo,
    input: report({ opponentName: "Nowhere High" }),
    origin: "authorized",
    now: NOW,
    today: TODAY,
  });
  assert.equal(outcome.status, "rejected");
  assert.equal(outcome.event, undefined);
  assert.equal((await repo.listEvents()).length, 0);
});

// ── 5. Idempotency ─────────────────────────────────────────────────────────

test("the same report twice is one submission and one event", async () => {
  const repo = memoryRepo();
  const first = await submitResult({ repo, input: report(), origin: "authorized", now: NOW, today: TODAY });
  const second = await submitResult({ repo, input: report(), origin: "authorized", now: NOW, today: TODAY });

  assert.equal(second.duplicate, true);
  assert.equal(second.record.id, first.record.id);
  assert.equal((await repo.listEvents()).length, 1);
  assert.equal((await repo.listSubmissions()).length, 1);

  // A different score is a different report, not a duplicate.
  assert.notEqual(fingerprintOf(report(), "authorized"), fingerprintOf(report({ ourScore: 25 }), "authorized"));
  // And the same numbers from a different origin is also distinct.
  assert.notEqual(fingerprintOf(report(), "authorized"), fingerprintOf(report(), "public"));
});

// ── 6. Meeting the crawler ─────────────────────────────────────────────────

/** A crawled observation of the same game, as the Finalsite adapter would make it. */
function crawledEvent(ourScore: number, theirScore: number): CanonicalEvent {
  const raw: RawObservation = {
    sourceId: "school-site-finalsite:micdsathletics.com",
    sourceUrl: "https://www.micdsathletics.com/sport/football/boys/?tab=schedule",
    fetchedAt: NOW,
    reportingSchool: "MICDS",
    opponent: "Ladue Horton Watkins High School",
    date: "2026-09-01",
    sportLabel: "boys football",
    levelLabel: "Varsity",
    homeAway: "away",
    result: ourScore > theirScore ? "W" : "L",
    scoreFor: ourScore,
    scoreAgainst: theirScore,
  };
  const { observations } = normalizeObservations([raw], INDEX);
  return reconcile(observations, { metro: "st-louis", now: NOW })[0];
}

test("a school report and a matching crawl become ONE event with two score sources", async () => {
  const existing = crawledEvent(24, 38);
  const repo = memoryRepo([existing]);

  const outcome = await submitResult({ repo, input: report(), origin: "authorized", now: NOW, today: TODAY });

  const all = await repo.listEvents();
  assert.equal(all.length, 1, "one game, not two");
  const event = outcome.event!;
  assert.equal(event.id, existing.id);
  assert.equal(event.observations.length, 2, "both accounts are kept");
  assert.equal(event.scoreSourceIds.length, 2, "this is real score corroboration");
  assert.equal(event.confidence, "confirmed");
  assert.equal(event.publishable, true);

  // Credited to both, in words, with no vendor host.
  const credits = creditsFor(event, SCHOOLS).join(", ");
  assert.match(credits, /MICDS Athletics/);
  assert.ok(!credits.includes("micdsathletics.com"));
});

test("a school report that contradicts a crawl fails closed", async () => {
  // The crawler read 24-38. The school says it won 38-24. One of them is wrong.
  const repo = memoryRepo([crawledEvent(24, 38)]);
  const outcome = await submitResult({
    repo,
    input: report({ ourScore: 38, theirScore: 24 }),
    origin: "authorized",
    now: NOW,
    today: TODAY,
  });

  assert.equal(outcome.status, "review");
  const event = outcome.event!;
  assert.equal(event.confidence, "conflicted");
  assert.equal(event.publishable, false, "authorized never overrides a contradiction");
  assert.ok(
    event.sides.every((s) => s.score === undefined),
    "the score is withheld rather than one account being believed",
  );
  assert.equal(event.observations.length, 2, "both accounts survive for a human to settle");
});

test("a public report that contradicts a published crawl cannot unpublish it", async () => {
  const repo = memoryRepo([crawledEvent(24, 38)]);
  const outcome = await submitResult({
    repo,
    input: report({ ourScore: 99, theirScore: 0 }),
    origin: "public",
    now: NOW,
    today: TODAY,
  });
  assert.equal(outcome.status, "review");
  assert.equal(outcome.event?.confidence, "conflicted");
  // It does go to review — a stranger CAN flag a disagreement, which is useful,
  // but they cannot assert the replacement score.
  assert.ok(outcome.event!.sides.every((s) => s.score === undefined));
});

// ── 7. The school page ─────────────────────────────────────────────────────

test("a submitted result reaches the school's own page", async () => {
  const repo = memoryRepo();
  await submitResult({ repo, input: report({ ourScore: 38, theirScore: 24 }), origin: "authorized", now: NOW, today: TODAY });

  const page = buildSchoolPage("micds", await repo.listEvents(), TODAY);
  assert.ok(page);
  assert.equal(page.results.length, 1);
  assert.equal(page.results[0].outcome, "W");
  assert.equal(page.results[0].opponentName, "Ladue");
  assert.match(page.results[0].brief.body, /MICDS beat Ladue 38-24/);
  assert.deepEqual(page.results[0].credits, ["MICDS Athletics"]);

  // The opponent gets the same game from their side, as a loss.
  const opponentPage = buildSchoolPage("ladue", await repo.listEvents(), TODAY);
  assert.equal(opponentPage!.results[0].outcome, "L");

  // Records are scoped to what we tracked, and the page says so elsewhere.
  assert.equal(page.sports[0].wins, 1);
  assert.equal(page.totalTracked, 1);
});

test("a public report never appears on a school page", async () => {
  const repo = memoryRepo();
  await submitResult({ repo, input: report(), origin: "public", now: NOW, today: TODAY });
  const page = buildSchoolPage("micds", await repo.listEvents(), TODAY);
  assert.equal(page!.results.length, 0);
});

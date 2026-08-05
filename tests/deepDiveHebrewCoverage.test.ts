// ─────────────────────────────────────────────────────────────────────────────
// Deep Dive Hebrew coverage guard.
//
// Regression: parseStepHebrewRef() in
// scripts/generate-original-language-word-studies.mjs required a literal "#"
// immediately after the verse number. Psalms (and Song of Songs, Zechariah)
// carry a superscription that shifts Masoretic verse numbering, so STEPBible's
// TAHOT source marks those lines with a second, parenthesized reference —
// e.g. "Psa.3.1(3.2)#01=L" — that the regex didn't tolerate. Every line for
// those chapters silently failed to parse, so the ENTIRE chapter was missing
// from data/deep-dive/PSA.json (62 of 150 Psalms chapters, confirmed
// 2026-08-05: Psalms 3 returned zero word studies in production despite
// Psalms 1 and Psalms 23 working).
//
// This locks: every Psalms chapter has data, and Psalms 3:1 specifically
// resolves the divine name (Strong's H3068) — the exact owner acceptance
// case (ASV "Jehovah" / BSB "LORD" in the reader).
//
//   npm test
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const repoRoot = join(import.meta.dirname, "..");
const readBook = (code: string) =>
  JSON.parse(readFileSync(join(repoRoot, "data/deep-dive", `${code}.json`), "utf8"));

test("every Psalms chapter (1-150) has at least one verified word study", () => {
  const psalms = readBook("PSA");
  const chaptersWithData = new Set(
    Object.keys(psalms).map((verseRef) => Number(verseRef.split(":")[0])),
  );

  const missing = [];
  for (let chapter = 1; chapter <= 150; chapter += 1) {
    if (!chaptersWithData.has(chapter)) missing.push(chapter);
  }

  assert.deepEqual(missing, [], `Psalms chapters missing all word-study data: ${missing.join(", ")}`);
});

test("Psalms 3:1 resolves the divine name (Strong's H3068) — the ASV/BSB owner case", () => {
  const psalms = readBook("PSA");
  const verse1 = psalms["3:1"] ?? [];

  const divineNameRecord = verse1.find(
    (study: { strongs: string }) => study.strongs === "H3068",
  );

  assert.ok(divineNameRecord, "Psalms 3:1 should carry a Strong's H3068 (Yahweh) record");
  assert.equal(divineNameRecord.englishWord, "yahweh");
  assert.equal(divineNameRecord.lexiconMeaning, "LORD");
});

test("Song of Songs and Zechariah — the other superscription-numbered books — are fully covered", () => {
  const bookMaxChapters: Record<string, number> = { SNG: 8, ZEC: 14 };

  for (const [code, maxChapter] of Object.entries(bookMaxChapters)) {
    const book = readBook(code);
    const chaptersWithData = new Set(
      Object.keys(book).map((verseRef) => Number(verseRef.split(":")[0])),
    );

    const missing = [];
    for (let chapter = 1; chapter <= maxChapter; chapter += 1) {
      if (!chaptersWithData.has(chapter)) missing.push(chapter);
    }

    assert.deepEqual(missing, [], `${code} chapters missing all word-study data: ${missing.join(", ")}`);
  }
});

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const localBiblePath = path.join(root, "src/lib/localBibleVerses.ts");
const greekPath = path.join(root, ".source-data/macula-greek/SBLGNT/tsv/macula-greek-SBLGNT.tsv");
const hebrewGlossPath = path.join(root, ".source-data/macula-hebrew/sources/Cherith/glosses/wlc-gloss.tsv");
const outDir = path.join(root, "data/deep-dive");

const HEBREW_BOOKS = {
  1: "GEN", 2: "EXO", 3: "LEV", 4: "NUM", 5: "DEU", 6: "JOS", 7: "JDG", 8: "RUT",
  9: "1SA", 10: "2SA", 11: "1KI", 12: "2KI", 13: "1CH", 14: "2CH", 15: "EZR",
  16: "NEH", 17: "EST", 18: "JOB", 19: "PSA", 20: "PRO", 21: "ECC", 22: "SNG",
  23: "ISA", 24: "JER", 25: "LAM", 26: "EZK", 27: "DAN", 28: "HOS", 29: "JOL",
  30: "AMO", 31: "OBA", 32: "JON", 33: "MIC", 34: "NAM", 35: "HAB", 36: "ZEP",
  37: "HAG", 38: "ZEC", 39: "MAL",
};

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "of", "to", "in", "on", "at", "by",
  "is", "are", "was", "be", "been", "being", "that", "this", "these", "those",
]);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }

  return fs.readFileSync(filePath, "utf8");
}

function normalizeWord(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function verseKey(code, chapter, verse) {
  return `${code}|${Number(chapter)}|${Number(verse)}`;
}

function parseLocalBible() {
  const source = read(localBiblePath);
  const marker = "export const LOCAL_BIBLE_VERSES";
  const markerIndex = source.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error("Could not find export const LOCAL_BIBLE_VERSES.");
  }

  const equalsIndex = source.indexOf("=", markerIndex);
  const arrayStart = source.indexOf("[", equalsIndex);

  if (equalsIndex === -1 || arrayStart === -1) {
    throw new Error("Could not find LOCAL_BIBLE_VERSES array.");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = arrayStart; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;

      if (depth === 0) {
        return JSON.parse(source.slice(arrayStart, index + 1));
      }
    }
  }

  throw new Error("Could not parse LOCAL_BIBLE_VERSES array end.");
}

function parseTsv(filePath) {
  const lines = read(filePath).split(/\r?\n/).filter(Boolean);
  const headers = lines.shift().split("\t");

  return lines.map((line) => {
    const values = line.split("\t");
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

function wordsInDisplayedVerse(text) {
  const words = new Set();

  for (const word of String(text).match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g) ?? []) {
    const normalized = normalizeWord(word);

    if (normalized && !STOP_WORDS.has(normalized)) {
      words.add(normalized);
    }
  }

  return words;
}

function glossTokens(gloss) {
  return String(gloss)
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[;,:/|]/g, " ")
    .split(/\s+/)
    .map(normalizeWord)
    .filter((word) => word && !STOP_WORDS.has(word));
}

function parseGreekRef(ref) {
  const match = String(ref).match(/^([1-3]?[A-Z]{2,3})\s+(\d+):(\d+)/);

  if (!match) {
    return null;
  }

  return {
    code: match[1],
    chapter: match[2],
    verse: match[3],
  };
}

function parseHebrewId(rawId) {
  const digits = String(rawId).replace(/\D/g, "");

  if (digits.length < 8) {
    return null;
  }

  const code = HEBREW_BOOKS[Number(digits.slice(0, 2))];

  if (!code) {
    return null;
  }

  return {
    code,
    chapter: String(Number(digits.slice(2, 5))),
    verse: String(Number(digits.slice(5, 8))),
  };
}

function sourceRecordKey(item) {
  return [
    item.originalWord,
    item.strongs,
    item.lemma,
    item.morphology,
    item.shortMeaning,
  ].join("|");
}

function addCandidate(candidates, localVerse, englishWord, data) {
  candidates.push({
    reference: localVerse.label,
    code: localVerse.code,
    chapter: localVerse.chapter,
    verse: localVerse.verse,
    englishWord,
    ...data,
  });
}

const localBible = parseLocalBible();
console.log(`Loaded ${localBible.length.toLocaleString()} local Bible verses.`);

if (localBible.length !== 31103) {
  throw new Error(`Expected 31,103 local verses, got ${localBible.length}.`);
}

const localByKey = new Map();
const verseWordsByKey = new Map();

for (const verse of localBible) {
  const key = verseKey(verse.code, verse.chapter, verse.verse);
  localByKey.set(key, verse);
  verseWordsByKey.set(key, wordsInDisplayedVerse(verse.text));
}

const candidates = [];

for (const row of parseTsv(greekPath)) {
  const ref = parseGreekRef(row.ref);

  if (!ref) {
    continue;
  }

  const key = verseKey(ref.code, ref.chapter, ref.verse);
  const localVerse = localByKey.get(key);
  const verseWords = verseWordsByKey.get(key);

  if (!localVerse || !verseWords) {
    continue;
  }

  const glossSource = row.english || row.gloss;

  for (const englishWord of glossTokens(glossSource)) {
    if (!verseWords.has(englishWord)) {
      continue;
    }

    addCandidate(candidates, localVerse, englishWord, {
      language: "greek",
      originalWord: row.text,
      transliteration: "",
      strongs: row.strong ? `G${row.strong}` : "",
      lemma: row.lemma,
      morphology: row.morph,
      shortMeaning: row.english || row.gloss || englishWord,
      sourceName: "MACULA Greek SBLGNT TSV exact English match",
      sourceUrl: "https://github.com/Clear-Bible/macula-greek",
    });
  }
}

for (const line of read(hebrewGlossPath).split(/\r?\n/).filter(Boolean)) {
  const [rawId, originalWord, gloss] = line.split("\t");
  const ref = parseHebrewId(rawId);

  if (!ref) {
    continue;
  }

  const key = verseKey(ref.code, ref.chapter, ref.verse);
  const localVerse = localByKey.get(key);
  const verseWords = verseWordsByKey.get(key);

  if (!localVerse || !verseWords) {
    continue;
  }

  for (const englishWord of glossTokens(gloss)) {
    if (!verseWords.has(englishWord)) {
      continue;
    }

    addCandidate(candidates, localVerse, englishWord, {
      language: "hebrew",
      originalWord,
      transliteration: "",
      strongs: "",
      lemma: "",
      morphology: "",
      shortMeaning: gloss || englishWord,
      sourceName: "MACULA Hebrew WLC Cherith gloss exact English match",
      sourceUrl: "https://github.com/Clear-Bible/macula-hebrew",
    });
  }
}

const grouped = new Map();

for (const item of candidates) {
  const key = `${item.code}|${item.chapter}|${item.verse}|${item.englishWord}`;
  const group = grouped.get(key) ?? [];
  group.push(item);
  grouped.set(key, group);
}

const matches = [];

for (const group of grouped.values()) {
  const unique = new Set(group.map(sourceRecordKey));

  if (unique.size === 1) {
    matches.push(group[0]);
  }
}

if (matches.length < 1000) {
  throw new Error(`Generated too few matches: ${matches.length}.`);
}

const byBook = new Map();

for (const match of matches) {
  const bookMap = byBook.get(match.code) ?? {};
  const verseRef = `${match.chapter}:${match.verse}`;
  bookMap[verseRef] = bookMap[verseRef] ?? [];
  bookMap[verseRef].push(match);
  byBook.set(match.code, bookMap);
}

fs.mkdirSync(outDir, { recursive: true });

for (const file of fs.readdirSync(outDir)) {
  if (file.endsWith(".json")) {
    fs.rmSync(path.join(outDir, file));
  }
}

for (const [code, bookMap] of [...byBook.entries()].sort()) {
  fs.writeFileSync(path.join(outDir, `${code}.json`), JSON.stringify(bookMap));
}

const manifest = {
  generatedAt: new Date().toISOString(),
  wordLinks: matches.length,
  coveredVerses: new Set(matches.map((match) => match.reference)).size,
  books: [...byBook.keys()].sort(),
};

fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);

console.log(`Generated ${matches.length.toLocaleString()} verified word links.`);
console.log(`Covered ${manifest.coveredVerses.toLocaleString()} verses.`);
console.log(`Wrote ${byBook.size} book files to data/deep-dive/.`);

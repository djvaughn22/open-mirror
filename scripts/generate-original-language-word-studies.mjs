import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const localBiblePath = path.join(root, "src/lib/localBibleVerses.ts");
const greekPath = path.join(root, ".source-data/macula-greek/SBLGNT/tsv/macula-greek-SBLGNT.tsv");
const hebrewGlossPath = path.join(root, ".source-data/macula-hebrew/sources/Cherith/glosses/wlc-gloss.tsv");
const greekLexiconPath = path.join(root, ".source-data/STEPBible-Data/Lexicons/TBESG - Translators Brief lexicon of Extended Strongs for Greek - STEPBible.org CC BY.txt");
const hebrewLexiconPath = path.join(root, ".source-data/STEPBible-Data/Lexicons/TBESH - Translators Brief lexicon of Extended Strongs for Hebrew - STEPBible.org CC BY.txt");
const hebrewTahotPaths = [
  path.join(root, ".source-data/STEPBible-Data/Translators Amalgamated OT+NT/TAHOT Gen-Deu - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt"),
  path.join(root, ".source-data/STEPBible-Data/Translators Amalgamated OT+NT/TAHOT Jos-Est - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt"),
  path.join(root, ".source-data/STEPBible-Data/Translators Amalgamated OT+NT/TAHOT Job-Sng - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt"),
  path.join(root, ".source-data/STEPBible-Data/Translators Amalgamated OT+NT/TAHOT Isa-Mal - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt"),
];
const outDir = path.join(root, "data/deep-dive");

const HEBREW_BOOKS = {
  1: "GEN", 2: "EXO", 3: "LEV", 4: "NUM", 5: "DEU", 6: "JOS", 7: "JDG", 8: "RUT",
  9: "1SA", 10: "2SA", 11: "1KI", 12: "2KI", 13: "1CH", 14: "2CH", 15: "EZR",
  16: "NEH", 17: "EST", 18: "JOB", 19: "PSA", 20: "PRO", 21: "ECC", 22: "SNG",
  23: "ISA", 24: "JER", 25: "LAM", 26: "EZK", 27: "DAN", 28: "HOS", 29: "JOL",
  30: "AMO", 31: "OBA", 32: "JON", 33: "MIC", 34: "NAM", 35: "HAB", 36: "ZEP",
  37: "HAG", 38: "ZEC", 39: "MAL",
};

const STEP_HEBREW_BOOK_CODES = {
  Gen: "GEN", Exo: "EXO", Lev: "LEV", Num: "NUM", Deu: "DEU", Jos: "JOS",
  Jdg: "JDG", Rut: "RUT", "1Sa": "1SA", "2Sa": "2SA", "1Ki": "1KI",
  "2Ki": "2KI", "1Ch": "1CH", "2Ch": "2CH", Ezr: "EZR", Neh: "NEH",
  Est: "EST", Job: "JOB", Psa: "PSA", Pro: "PRO", Ecc: "ECC", Sng: "SNG",
  Isa: "ISA", Jer: "JER", Lam: "LAM", Ezk: "EZK", Dan: "DAN", Hos: "HOS",
  Jol: "JOL", Amo: "AMO", Oba: "OBA", Jon: "JON", Mic: "MIC", Nam: "NAM",
  Hab: "HAB", Zep: "ZEP", Hag: "HAG", Zec: "ZEC", Mal: "MAL",
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

function normalizeStrongNumber(value) {
  const match = String(value ?? "").match(/([GH])0*([0-9]+)/i);

  if (!match) {
    return "";
  }

  return `${match[1].toUpperCase()}${Number(match[2])}`;
}

function cleanLexiconMeaning(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[-–—:;,\s]+/, "")
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

function parseStepBriefLexicon(filePath, prefix) {
  const entries = new Map();

  for (const line of read(filePath).split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("=")) {
      continue;
    }

    const cells = trimmed.split("\t").map((cell) => cell.trim());
    const baseStrong = normalizeStrongNumber(cells[0] ?? "");

    if (!baseStrong || !baseStrong.startsWith(prefix)) {
      continue;
    }

    const briefMeaning = cleanLexiconMeaning(cells[6] ?? "");
    const fullMeaning = cleanLexiconMeaning(cells[7] ?? "");
    const meaning = briefMeaning || fullMeaning;

    if (!meaning) {
      continue;
    }

    if (!entries.has(baseStrong)) {
      entries.set(baseStrong, meaning);
    }
  }

  return entries;
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


function parseStepHebrewRef(ref) {
  // Psalms (and a few other books) with a superscription carry a second,
  // parenthesized Hebrew-inclusive verse number — e.g. "Psa.3.1(3.2)#01=L" —
  // where the Masoretic count treats the title as its own verse. That
  // parenthetical does NOT match this app's English versification; the
  // leading chapter.verse (title = verse 0, dropped downstream since no
  // local verse 0 exists) is what lines up with the displayed English text.
  const match = String(ref).match(/^([1-3]?[A-Za-z]{2,3})\.(\d+)\.(\d+)(?:\(\d+\.\d+\))?#/);
  if (!match) return null;

  const code = STEP_HEBREW_BOOK_CODES[match[1]];
  if (!code) return null;

  return { code, chapter: match[2], verse: match[3] };
}


function transliterateGreek(value) {
  const map = {
    "α": "a", "β": "b", "γ": "g", "δ": "d", "ε": "e", "ζ": "z", "η": "e",
    "θ": "th", "ι": "i", "κ": "k", "λ": "l", "μ": "m", "ν": "n", "ξ": "x",
    "ο": "o", "π": "p", "ρ": "r", "σ": "s", "ς": "s", "τ": "t", "υ": "u",
    "φ": "ph", "χ": "ch", "ψ": "ps", "ω": "o",
  };

  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? "")
    .join("")
    .replace(/\\s+/g, " ")
    .trim();
}

function primaryHebrewStrong(value) {
  const strongs = [...String(value ?? "").matchAll(/\bH0*([0-9]+)[A-Z]?\b/g)]
    .map((match) => `H${Number(match[1])}`)
    .filter((strongs) => !/^H9\d{3,}$/.test(strongs));

  return strongs[0] ?? "";
}

function extendedHebrewStrong(value) {
  const match = String(value ?? "").match(/\bH0*([0-9]+)[A-Z]?\b/);
  return match?.[0] ?? "";
}

function extractHebrewLemma(strongsDetail, fallbackOriginalWord) {
  const extended = extendedHebrewStrong(strongsDetail);
  if (!extended) return fallbackOriginalWord;

  const escaped = extended.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(strongsDetail).match(new RegExp(`${escaped}=([^=}{/\\\\]+)=`));

  return match?.[1]?.trim() || fallbackOriginalWord;
}

function cleanHebrewOriginalWord(value) {
  return String(value ?? "")
    .replace(/[\\/׃־|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sourceRecordKey(item) {
  return [
    item.originalWord,
    item.strongs,
    item.lemma,
    item.morphology,
    item.sourceGloss,
    item.lexiconMeaning,
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

const greekLexicon = parseStepBriefLexicon(greekLexiconPath, "G");
const hebrewLexicon = parseStepBriefLexicon(hebrewLexiconPath, "H");

console.log(`Loaded ${greekLexicon.size.toLocaleString()} Greek lexicon meanings.`);
console.log(`Loaded ${hebrewLexicon.size.toLocaleString()} Hebrew lexicon meanings.`);

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
  const strongs = normalizeStrongNumber(row.strong ? `G${row.strong}` : "");
  const lexiconMeaning = greekLexicon.get(strongs) ?? "";

  for (const englishWord of glossTokens(glossSource)) {
    if (!verseWords.has(englishWord)) {
      continue;
    }

    addCandidate(candidates, localVerse, englishWord, {
      language: "greek",
      originalWord: row.text,
      transliteration: transliterateGreek(row.lemma || row.text),
      strongs,
      lemma: row.lemma,
      morphology: row.morph,
      sourceGloss: row.english || row.gloss || englishWord,
      lexiconMeaning,
      sourceName: "MACULA Greek SBLGNT alignment + STEPBible TBESG Strong's meaning",
      sourceUrl: "https://github.com/Clear-Bible/macula-greek",
      lexiconSourceName: "STEPBible TBESG Greek brief lexicon",
    });
  }
}

for (const tahotPath of hebrewTahotPaths) {
  for (const line of read(tahotPath).split(/\r?\n/).filter(Boolean)) {
    if (line.startsWith("#")) continue;

    const columns = line.split("	");
    const ref = parseStepHebrewRef(columns[0]);
    if (!ref) continue;

    const originalWord = cleanHebrewOriginalWord(columns[1] ?? "");
    const transliteration = columns[2] ?? "";
    const sourceGloss = columns[3] ?? "";
    const strongsDetail = columns[4] ?? "";
    const morphology = columns[5] ?? "";
    const fallbackStrong = columns.find((column) => /H0*[0-9]+[A-Z]?/.test(column)) ?? "";
    const strongs = primaryHebrewStrong(strongsDetail) || primaryHebrewStrong(fallbackStrong);
    if (!strongs) continue;

    const lexiconMeaning = hebrewLexicon.get(strongs) ?? "";
    const key = verseKey(ref.code, ref.chapter, ref.verse);
    const localVerse = localByKey.get(key);
    const verseWords = verseWordsByKey.get(key);
    if (!localVerse || !verseWords) continue;

    for (const englishWord of glossTokens(sourceGloss)) {
      if (!verseWords.has(englishWord)) continue;

      addCandidate(candidates, localVerse, englishWord, {
        language: "hebrew",
        originalWord,
        transliteration,
        strongs,
        lemma: extractHebrewLemma(strongsDetail, originalWord),
        morphology,
        sourceGloss: sourceGloss || englishWord,
        lexiconMeaning,
        sourceName: "STEPBible TAHOT Hebrew alignment + TBESH Strong's meaning",
        sourceUrl: "https://github.com/STEPBible/STEPBible-Data",
        lexiconSourceName: "STEPBible TBESH Hebrew brief lexicon",
      });
    }
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
  lexiconMeaningCoverage: {
    greek: matches.filter((match) => match.language === "greek" && match.lexiconMeaning).length,
    hebrew: matches.filter((match) => match.language === "hebrew" && match.lexiconMeaning).length,
  },
};

fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);

console.log(`Generated ${matches.length.toLocaleString()} verified word links.`);
console.log(`Covered ${manifest.coveredVerses.toLocaleString()} verses.`);
console.log(`Greek links with lexicon meaning: ${manifest.lexiconMeaningCoverage.greek.toLocaleString()}.`);
console.log(`Hebrew links with lexicon meaning: ${manifest.lexiconMeaningCoverage.hebrew.toLocaleString()}.`);
console.log(`Wrote ${byBook.size} book files to data/deep-dive/.`);

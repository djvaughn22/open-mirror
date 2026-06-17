export type OriginalLanguage = "hebrew" | "greek";

export type WordStudyPassage = {
  label: string;
  code: string;
  chapter: string;
  verse: string;
  text: string;
};

export type VerifiedWordStudy = {
  reference: string;
  code: string;
  chapter: string;
  verse: string;
  englishWord: string;
  language: OriginalLanguage;
  originalWord: string;
  transliteration: string;
  strongs: string;
  lemma: string;
  morphology: string;
  sourceGloss: string;
  lexiconMeaning: string;
  sourceName: string;
  lexiconSourceName: string;
  sourceUrl: string;
};

export function normalizeStudyWord(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export function wordStudyLookupKey(passage: WordStudyPassage) {
  return `${passage.code.toUpperCase()}|${Number(passage.chapter)}|${Number(
    passage.verse,
  )}`;
}

export function buildDeepDiveWordStudiesUrl(passage: WordStudyPassage) {
  const params = new URLSearchParams({
    code: passage.code.toUpperCase(),
    chapter: String(Number(passage.chapter)),
    verse: String(Number(passage.verse)),
  });

  return `/api/deep-dive-word-studies?${params.toString()}`;
}

const lowValueEnglishWords = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "for",
  "nor",
  "so",
  "yet",
  "to",
  "of",
  "in",
  "on",
  "at",
  "by",
  "from",
  "with",
  "as",
  "into",
  "about",
  "over",
  "under",
  "through",
  "before",
  "after",
  "between",
  "among",
  "around",
  "against",
  "upon",
  "within",
  "without",
  "is",
  "are",
  "was",
  "were",
  "be",
  "being",
  "been",
  "am",
  "has",
  "have",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "shall",
  "should",
  "may",
  "might",
  "can",
  "could",
  "must",
  "i",
  "me",
  "my",
  "mine",
  "we",
  "us",
  "our",
  "ours",
  "you",
  "your",
  "yours",
  "he",
  "him",
  "his",
  "she",
  "her",
  "hers",
  "they",
  "them",
  "their",
  "theirs",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "there",
  "here",
  "then",
  "when",
  "where",
  "who",
  "whom",
  "whose",
  "which",
  "what",
  "why",
  "how",
  "now",
  "not",
  "no",
  "yes",
  "if",
  "because",
  "than",
  "also",
  "only",
]);

function isUsefulGrammar(morphology: string) {
  const grammar = morphology.trim().toUpperCase();

  if (!grammar) return false;

  // Greek data often uses readable tags like ADV, CONJ, PREP, T-..., P-...
  if (
    grammar === "ADV" ||
    grammar === "CONJ" ||
    grammar === "PREP" ||
    grammar.startsWith("T-") ||
    grammar.startsWith("P-")
  ) {
    return false;
  }

  // Keep normal Bible-study content words: nouns, verbs, adjectives.
  // Hebrew morphology commonly contains N/V/A inside compact codes like HNcmpa or HVqp3ms.
  return /(^|[^A-Z])[NVA]/.test(grammar) || /^[NVA]/.test(grammar);
}

export function isUsefulVerifiedWordStudy(wordStudy: VerifiedWordStudy) {
  const englishWord = normalizeStudyWord(wordStudy.englishWord);
  const lexiconMeaning = normalizeStudyWord(wordStudy.lexiconMeaning);
  const sourceGloss = normalizeStudyWord(wordStudy.sourceGloss);

  if (!englishWord) return false;
  if (lowValueEnglishWords.has(englishWord)) return false;

  if (!wordStudy.originalWord || !wordStudy.strongs || !wordStudy.lexiconMeaning) {
    return false;
  }

  if (!isUsefulGrammar(wordStudy.morphology)) {
    return false;
  }

  // Avoid underlining words where the displayed meaning adds no study value.
  // Example: English "now" -> Greek meaning "now".
  if (lexiconMeaning === englishWord && sourceGloss === englishWord) {
    return false;
  }

  return true;
}

export function hasVerifiedWordStudies(wordStudies: VerifiedWordStudy[]) {
  return wordStudies.some(isUsefulVerifiedWordStudy);
}

export function getDefaultWordStudy(wordStudies: VerifiedWordStudy[]) {
  return wordStudies.find(isUsefulVerifiedWordStudy) ?? null;
}

export function getVerifiedWordStudyForWord(
  wordStudies: VerifiedWordStudy[],
  englishWord: string,
) {
  const normalizedWord = normalizeStudyWord(englishWord);

  return (
    wordStudies.find(
      (wordStudy) =>
        isUsefulVerifiedWordStudy(wordStudy) &&
        normalizeStudyWord(wordStudy.englishWord) === normalizedWord,
    ) ?? null
  );
}

export function originalLanguageName(language: OriginalLanguage) {
  return language === "hebrew" ? "Hebrew" : "Greek";
}

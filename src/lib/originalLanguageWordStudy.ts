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
  shortMeaning: string;
  sourceName: string;
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

export function hasVerifiedWordStudies(wordStudies: VerifiedWordStudy[]) {
  return wordStudies.length > 0;
}

export function getDefaultWordStudy(wordStudies: VerifiedWordStudy[]) {
  return wordStudies[0] ?? null;
}

export function getVerifiedWordStudyForWord(
  wordStudies: VerifiedWordStudy[],
  englishWord: string,
) {
  const normalizedWord = normalizeStudyWord(englishWord);

  return (
    wordStudies.find(
      (wordStudy) => normalizeStudyWord(wordStudy.englishWord) === normalizedWord,
    ) ?? null
  );
}

export function originalLanguageName(language: OriginalLanguage) {
  return language === "hebrew" ? "Hebrew" : "Greek";
}

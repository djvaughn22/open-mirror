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

export const VERIFIED_WORD_STUDIES: VerifiedWordStudy[] = [
  {
    reference: "Genesis 1:1",
    code: "GEN",
    chapter: "1",
    verse: "1",
    englishWord: "beginning",
    language: "hebrew",
    originalWord: "בְּרֵאשִׁ֖ית",
    transliteration: "bə·rê·šîṯ",
    strongs: "H7225",
    lemma: "רֵאשִׁית",
    morphology: "Prep-b | N-fs",
    shortMeaning: "beginning, first, first part",
    sourceName: "Bible Hub Genesis 1:1 Hebrew text / Strong's H7225",
    sourceUrl: "https://biblehub.com/text/genesis/1-1.htm",
  },
  {
    reference: "John 3:16",
    code: "JHN",
    chapter: "3",
    verse: "16",
    englishWord: "loved",
    language: "greek",
    originalWord: "ἠγάπησεν",
    transliteration: "ēgapēsen",
    strongs: "G25",
    lemma: "ἀγαπάω",
    morphology: "V-AIA-3S",
    shortMeaning: "loved; to love",
    sourceName: "Bible Hub John 3:16 Greek text / Strong's G25",
    sourceUrl: "https://biblehub.com/text/john/3-16.htm",
  },
];

function normalizeReference(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeWord(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function passageMatches(passage: WordStudyPassage, wordStudy: VerifiedWordStudy) {
  const referenceMatches =
    normalizeReference(passage.label) === normalizeReference(wordStudy.reference);

  const codeMatches =
    passage.code.toUpperCase() === wordStudy.code.toUpperCase() &&
    passage.chapter === wordStudy.chapter &&
    passage.verse === wordStudy.verse;

  return referenceMatches || codeMatches;
}

export function getVerifiedWordStudiesForPassage(passage: WordStudyPassage) {
  return VERIFIED_WORD_STUDIES.filter((wordStudy) =>
    passageMatches(passage, wordStudy),
  );
}

export function hasVerifiedWordStudies(passage: WordStudyPassage) {
  return getVerifiedWordStudiesForPassage(passage).length > 0;
}

export function getDefaultWordStudy(passage: WordStudyPassage) {
  return getVerifiedWordStudiesForPassage(passage)[0] ?? null;
}

export function getVerifiedWordStudyForWord(
  passage: WordStudyPassage,
  englishWord: string,
) {
  return (
    getVerifiedWordStudiesForPassage(passage).find(
      (wordStudy) =>
        normalizeWord(wordStudy.englishWord) === normalizeWord(englishWord),
    ) ?? null
  );
}

export function originalLanguageName(language: OriginalLanguage) {
  return language === "hebrew" ? "Hebrew" : "Greek";
}

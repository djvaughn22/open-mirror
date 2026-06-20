import { LOCAL_BIBLE_VERSES, type LocalBibleVerse } from "./localBibleVerses";

export type BibleBingoPassage = {
  label: string;
  code: string;
  chapter: string;
  verse: string;
  text: string;
};

const BOARD_REFERENCE_SEPARATOR = "~";
const BOARD_REFERENCE_PART_SEPARATOR = ".";

const versesByBook = new Map<string, LocalBibleVerse[]>();
const versesByBoardReference = new Map<string, LocalBibleVerse>();

function boardReferenceKey(code: string, chapter: string, verse: string) {
  return [
    code.trim().toUpperCase(),
    String(Number(chapter)),
    String(Number(verse)),
  ].join(BOARD_REFERENCE_PART_SEPARATOR);
}

for (const verse of LOCAL_BIBLE_VERSES) {
  const current = versesByBook.get(verse.book) ?? [];
  current.push(verse);
  versesByBook.set(verse.book, current);

  versesByBoardReference.set(
    boardReferenceKey(verse.code, verse.chapter, verse.verse),
    verse,
  );
}

const gospelVerses = LOCAL_BIBLE_VERSES.filter((verse) => verse.group === "Gospel");

const epistleVerses = LOCAL_BIBLE_VERSES.filter((verse) => verse.group === "Epistles");

const oldTestamentVerses = LOCAL_BIBLE_VERSES.filter(
  (verse) =>
    verse.group === "Old Testament" &&
    verse.book !== "Genesis" &&
    verse.book !== "Psalms" &&
    verse.book !== "Proverbs",
);

function versesForBook(book: string) {
  return versesByBook.get(book) ?? [];
}

function candidatesForSection(sectionTitle: string) {
  if (sectionTitle === "Genesis") {
    return versesForBook("Genesis");
  }

  if (sectionTitle === "Revelation") {
    return versesForBook("Revelation");
  }

  if (sectionTitle === "Psalms") {
    return versesForBook("Psalms");
  }

  if (sectionTitle === "Proverbs") {
    return versesForBook("Proverbs");
  }

  if (sectionTitle === "Gospel") {
    return gospelVerses;
  }

  if (sectionTitle === "Epistles") {
    return epistleVerses;
  }

  if (sectionTitle === "Old Testament") {
    return oldTestamentVerses;
  }

  return LOCAL_BIBLE_VERSES;
}

function toPassage(verse: LocalBibleVerse): BibleBingoPassage {
  return {
    label: verse.label,
    code: verse.code,
    chapter: verse.chapter,
    verse: verse.verse,
    text: verse.text,
  };
}

export function bibleBingoBoardIdFromPassages(passages: BibleBingoPassage[]) {
  return passages
    .map((passage) =>
      boardReferenceKey(passage.code, passage.chapter, passage.verse),
    )
    .join(BOARD_REFERENCE_SEPARATOR);
}

export function passagesForBibleBingoBoardId(boardId: string) {
  const parts = decodeURIComponent(boardId)
    .trim()
    .split(BOARD_REFERENCE_SEPARATOR)
    .filter(Boolean);

  if (parts.length !== 7) {
    return null;
  }

  const passages: BibleBingoPassage[] = [];

  for (const part of parts) {
    const referenceParts = part.split(BOARD_REFERENCE_PART_SEPARATOR);

    if (referenceParts.length !== 3) {
      return null;
    }

    const [code, chapter, verse] = referenceParts;
    const chapterNumber = Number(chapter);
    const verseNumber = Number(verse);

    if (!code || !Number.isFinite(chapterNumber) || !Number.isFinite(verseNumber)) {
      return null;
    }

    const match = versesByBoardReference.get(
      boardReferenceKey(code, String(chapterNumber), String(verseNumber)),
    );

    if (!match) {
      return null;
    }

    passages.push(toPassage(match));
  }

  return passages;
}

export function randomReferenceForSection(sectionTitle: string, avoidLabel?: string) {
  const candidates = candidatesForSection(sectionTitle);
  const usableCandidates =
    avoidLabel && candidates.length > 1
      ? candidates.filter((verse) => verse.label !== avoidLabel)
      : candidates;

  const pool = usableCandidates.length ? usableCandidates : LOCAL_BIBLE_VERSES;
  const index = Math.floor(Math.random() * pool.length);

  return toPassage(pool[index]);
}


function hashSeed(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function seededReferenceForSection(sectionTitle: string, seed: string) {
  const candidates = candidatesForSection(sectionTitle);
  const pool = candidates.length ? candidates : LOCAL_BIBLE_VERSES;
  const index = hashSeed(`${seed}|${sectionTitle}`) % pool.length;

  return toPassage(pool[index]);
}

import { LOCAL_BIBLE_VERSES, type LocalBibleVerse } from "./localBibleVerses";

type BibleBingoPassage = {
  label: string;
  code: string;
  chapter: string;
  verse: string;
  text: string;
};

const versesByBook = new Map<string, LocalBibleVerse[]>();

for (const verse of LOCAL_BIBLE_VERSES) {
  const current = versesByBook.get(verse.book) ?? [];
  current.push(verse);
  versesByBook.set(verse.book, current);
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

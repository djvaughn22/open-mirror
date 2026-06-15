import { LOCAL_BIBLE_VERSES, type LocalBibleVerse } from "./localBibleVerses";

type BibleBingoPassage = {
  label: string;
  code: string;
  chapter: string;
  verse: string;
  text: string;
};

function candidatesForSection(sectionTitle: string) {
  if (sectionTitle === "Genesis") {
    return LOCAL_BIBLE_VERSES.filter((verse) => verse.book === "Genesis");
  }

  if (sectionTitle === "Revelation") {
    return LOCAL_BIBLE_VERSES.filter((verse) => verse.book === "Revelation");
  }

  if (sectionTitle === "Psalms") {
    return LOCAL_BIBLE_VERSES.filter((verse) => verse.book === "Psalms");
  }

  if (sectionTitle === "Proverbs") {
    return LOCAL_BIBLE_VERSES.filter((verse) => verse.book === "Proverbs");
  }

  if (sectionTitle === "Gospel") {
    return LOCAL_BIBLE_VERSES.filter((verse) => verse.group === "Gospel");
  }

  if (sectionTitle === "Epistles") {
    return LOCAL_BIBLE_VERSES.filter((verse) => verse.group === "Epistles");
  }

  if (sectionTitle === "Old Testament") {
    return LOCAL_BIBLE_VERSES.filter(
      (verse) =>
        verse.group === "Old Testament" &&
        verse.book !== "Genesis" &&
        verse.book !== "Psalms" &&
        verse.book !== "Proverbs",
    );
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

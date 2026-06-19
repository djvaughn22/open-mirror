import { NextResponse } from "next/server";
import {
  LOCAL_BIBLE_VERSES,
  type LocalBibleVerse,
} from "../../../lib/localBibleVerses";

type VersePayload = {
  label: string;
  book: string;
  code: string;
  chapter: string;
  verse: string;
  text: string;
  group: string;
};

const versesByLabel = new Map<string, LocalBibleVerse>();
const versesByKey = new Map<string, LocalBibleVerse>();
const booksByAlias = new Map<string, string>();

const gospelBooks = new Set(["Matthew", "Mark", "Luke", "John"]);
const gospelVerses = LOCAL_BIBLE_VERSES.filter((verse) => gospelBooks.has(verse.book));
const proverbsVerses = LOCAL_BIBLE_VERSES.filter((verse) => verse.book === "Proverbs");

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeReference(value: string) {
  return normalizeText(value).replace(/^psalm\b/, "psalms");
}

function verseKey(book: string, chapter: string, verse: string) {
  return `${book}|${chapter}|${verse}`;
}

function toPayload(verse: LocalBibleVerse): VersePayload {
  return {
    label: verse.label,
    book: verse.book,
    code: verse.code,
    chapter: verse.chapter,
    verse: verse.verse,
    text: verse.text,
    group: verse.group,
  };
}

for (const verse of LOCAL_BIBLE_VERSES) {
  versesByLabel.set(normalizeReference(verse.label), verse);
  versesByKey.set(verseKey(verse.book, verse.chapter, verse.verse), verse);

  booksByAlias.set(normalizeText(verse.book), verse.book);
  booksByAlias.set(normalizeText(verse.code), verse.book);
}

booksByAlias.set("psalm", "Psalms");
booksByAlias.set("psalms", "Psalms");
booksByAlias.set("ps", "Psalms");
booksByAlias.set("psa", "Psalms");
booksByAlias.set("jn", "John");
booksByAlias.set("jhn", "John");
booksByAlias.set("prov", "Proverbs");
booksByAlias.set("pr", "Proverbs");
booksByAlias.set("rev", "Revelation");
booksByAlias.set("re", "Revelation");

function findLocalVerse(rawQuery: string) {
  const query = rawQuery.trim();

  if (!query) {
    return null;
  }

  const exactMatch = versesByLabel.get(normalizeReference(query));

  if (exactMatch) {
    return {
      verse: exactMatch,
      note: "",
    };
  }

  const referenceMatch = query.match(/^(.+?)\s+(\d{1,3})(?::(\d{1,3}))?$/);

  if (!referenceMatch) {
    return null;
  }

  const [, rawBook, rawChapter, rawVerse] = referenceMatch;
  const book = booksByAlias.get(normalizeText(rawBook));

  if (!book) {
    return null;
  }

  const chapter = String(Number(rawChapter));
  const verseNumber = rawVerse ? String(Number(rawVerse)) : "1";
  const verse = versesByKey.get(verseKey(book, chapter, verseNumber));

  if (!verse) {
    return null;
  }

  return {
    verse,
    note: rawVerse
      ? ""
      : `Showing ${verse.label}. Go to Verse opens this exact verse. Go to Chapter opens the full chapter.`,
  };
}

function getRandomVerse(mode: string) {
  const source =
    mode === "proverbs"
      ? proverbsVerses
      : mode === "gospel"
        ? gospelVerses
        : LOCAL_BIBLE_VERSES;

  if (source.length === 0) {
    return null;
  }

  return source[Math.floor(Math.random() * source.length)];
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const random = (searchParams.get("random") ?? "").toLowerCase();

  if (random === "all" || random === "gospel" || random === "proverbs") {
    const verse = getRandomVerse(random);

    if (!verse) {
      return NextResponse.json(
        { error: `No ${random} verses are available in the local Bible library.` },
        { status: 404 },
      );
    }

    return NextResponse.json({
      passage: toPayload(verse),
      note:
        random === "proverbs"
          ? "Random Proverbs verse."
          : random === "gospel"
            ? "Random Gospel verse from Matthew, Mark, Luke, or John."
            : "Random Bible verse.",
    });
  }

  const query = searchParams.get("q") ?? "";
  const result = findLocalVerse(query);

  if (!result) {
    return NextResponse.json(
      {
        error:
          "No local verse match found. Try Romans 15:7, John 3:16, Psalm 23:1, Romans 8:28, Genesis 1:1, Proverbs 17:22, or 2 Corinthians 3:17.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    passage: toPayload(result.verse),
    note: result.note,
  });
}

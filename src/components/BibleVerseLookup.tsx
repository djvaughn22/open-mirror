"use client";

import { FormEvent, useEffect, useState } from "react";
import OriginalWordStudyModal from "./OriginalWordStudyModal";
import VerifiedVerseText from "./VerifiedVerseText";
import {
  buildDeepDiveWordStudiesUrl,
  getDefaultWordStudy,
  hasVerifiedWordStudies,
  type VerifiedWordStudy,
} from "../lib/originalLanguageWordStudy";

type BibleVerseLookupProps = {
  className?: string;
};

type LookupPassage = {
  label: string;
  book: string;
  code: string;
  chapter: string;
  verse: string;
  text: string;
  group: string;
};

type ActiveLookupWordStudy = {
  passage: LookupPassage;
  wordStudy: VerifiedWordStudy;
};

function verseUrl(passage: LookupPassage) {
  return `https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.${passage.verse}.WEBUS`;
}

function chapterUrl(passage: LookupPassage) {
  return `https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.WEBUS`;
}

function hasVerifiedWordLinks(wordStudies: VerifiedWordStudy[]) {
  return hasVerifiedWordStudies(wordStudies);
}

export default function BibleVerseLookup({
  className = "mt-12",
}: BibleVerseLookupProps) {
  const [query, setQuery] = useState("");
  const [passage, setPassage] = useState<LookupPassage | null>(null);
  const [wordStudies, setWordStudies] = useState<VerifiedWordStudy[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingWordStudies, setIsLoadingWordStudies] = useState(false);
  const [activeWordStudy, setActiveWordStudy] = useState<ActiveLookupWordStudy | null>(null);

  useEffect(() => {
    if (!passage) {
      setWordStudies([]);
      setIsLoadingWordStudies(false);
      return;
    }

    const selectedPassage = passage;
    let cancelled = false;

    async function loadWordStudies() {
      setIsLoadingWordStudies(true);
      setWordStudies([]);

      try {
        const response = await fetch(buildDeepDiveWordStudiesUrl(selectedPassage));

        if (!response.ok) {
          if (!cancelled) {
            setWordStudies([]);
          }

          return;
        }

        const data = await response.json();

        if (!cancelled) {
          setWordStudies(Array.isArray(data.wordStudies) ? data.wordStudies : []);
        }
      } catch {
        if (!cancelled) {
          setWordStudies([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingWordStudies(false);
        }
      }
    }

    loadWordStudies();

    return () => {
      cancelled = true;
    };
  }, [passage]);

  async function lookupVerse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError("Type a Bible reference first.");
      setPassage(null);
      setNote("");
      return;
    }

    setIsSearching(true);
    setError("");
    setNote("");

    try {
      const response = await fetch(
        `/api/local-verse-lookup?q=${encodeURIComponent(trimmedQuery)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        setPassage(null);
        setError(data.error ?? "No local verse match found.");
        return;
      }

      setPassage(data.passage);
      setNote(data.note ?? "");
    } catch {
      setPassage(null);
      setError("Unable to search the local Bible library right now.");
    } finally {
      setIsSearching(false);
    }
  }

  function openWordStudy(
    selectedPassage: LookupPassage,
    selectedWordStudy?: VerifiedWordStudy,
  ) {
    const wordStudy = selectedWordStudy ?? getDefaultWordStudy(wordStudies);

    if (!wordStudy) {
      return;
    }

    setActiveWordStudy({
      passage: selectedPassage,
      wordStudy,
    });
  }

  const deepDiveReady = hasVerifiedWordLinks(wordStudies);

  return (
    <section className={`${className} text-center text-slate-100`}>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">
        Bible Verse Lookup
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-100">
        Search Bible Verse
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-200">
        Type a verse like John 3:16, Psalm 23:1, Romans 8:28, or Genesis 1:1.
      </p>

      <form
        onSubmit={lookupVerse}
        className="mx-auto mt-5 flex max-w-xl flex-col gap-3 sm:flex-row"
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="text"
          inputMode="text"
          placeholder="John 3:16"
          aria-label="Bible verse to search"
          className="min-h-12 flex-1 rounded-2xl border border-white/15 bg-black/20 px-4 text-base text-white placeholder:text-white/40 outline-none ring-0 focus:border-emerald-200/50"
        />

        <button
          type="submit"
          disabled={isSearching}
          className="min-h-12 rounded-2xl border border-white/15 bg-white/10 px-5 font-semibold text-slate-100 transition hover:bg-white/15 disabled:cursor-wait disabled:opacity-60"
        >
          {isSearching ? "Searching..." : "Search Bible Verse"}
        </button>
      </form>

      <p className="mt-3 text-xs text-slate-300">
        Searches the local complete Bible library first. After the verse appears,
        use the Bible app buttons below: Verse opens this exact verse. Chapter opens the full chapter.
      </p>

      {error && (
        <p className="mx-auto mt-5 max-w-xl rounded-2xl border border-red-200/20 bg-red-300/10 px-5 py-3 text-sm font-semibold text-red-100">
          {error}
        </p>
      )}

      {passage && (
        <article className="mx-auto mt-6 max-w-2xl rounded-[2rem] border border-emerald-200/15 bg-emerald-300/10 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
            Local Bible Library Match
          </p>

          <h3 className="mt-3 text-2xl font-bold text-white">{passage.label}</h3>

          <p className="mt-4 text-sm leading-7 text-slate-200">
            <VerifiedVerseText
              passage={passage}
              wordStudies={wordStudies}
              onWordClick={(wordStudy) => openWordStudy(passage, wordStudy)}
            />
          </p>

          {note && (
            <p className="mt-4 text-xs font-semibold text-slate-300">{note}</p>
          )}

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={verseUrl(passage)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center justify-center items-center inline-flex rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/30"
            >Verse</a>

            <a
              href={chapterUrl(passage)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center justify-center items-center inline-flex rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/30"
            >Chapter</a>

            <button
              type="button"
              onClick={() => passage && openWordStudy(passage)}
              disabled={!deepDiveReady}
              title={
                isLoadingWordStudies
                  ? "Checking for verified original-language word links."
                  : deepDiveReady
                    ? "Open verified original-language word study"
                    : "Deep Dive opens when this verse has verified underlined word links."
              }
              className="text-center justify-center items-center inline-flex rounded-full border border-emerald-200/20 bg-emerald-300/10 px-5 py-2 text-sm font-semibold text-emerald-100 shadow-sm transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:border-zinc-700/70 disabled:bg-zinc-800/70 disabled:text-zinc-500 disabled:shadow-none disabled:hover:bg-zinc-800/70"
            >
              Deep Dive
            </button>
          </div>
        </article>
      )}

      {activeWordStudy && (
        <OriginalWordStudyModal
          passage={activeWordStudy.passage}
          wordStudy={activeWordStudy.wordStudy}
          wordStudies={wordStudies}
          verseUrl={verseUrl(activeWordStudy.passage)}
          onClose={() => setActiveWordStudy(null)}
        />
      )}
    </section>
  );
}

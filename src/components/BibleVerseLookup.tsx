"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import BibleBingoVerseCard, {
  type BibleBingoCardPassage,
} from "./BibleBingoVerseCard";
import OriginalWordStudyModal from "./OriginalWordStudyModal";
import {
  buildDeepDiveWordStudiesUrl,
  getDefaultWordStudy,
  type VerifiedWordStudy,
} from "../lib/originalLanguageWordStudy";

type BibleVerseLookupProps = {
  className?: string;
};

type ActiveLookupWordStudy = {
  passage: BibleBingoCardPassage;
  wordStudy: VerifiedWordStudy;
};

const SIGNATURE_REFERENCE = "2 Corinthians 3:17";

function verseUrl(passage: BibleBingoCardPassage) {
  return `https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.${passage.verse}.WEBUS`;
}

export default function BibleVerseLookup({
  className = "mt-12",
}: BibleVerseLookupProps) {
  const [query, setQuery] = useState("");
  const [passage, setPassage] = useState<BibleBingoCardPassage | null>(null);
  const [wordStudies, setWordStudies] = useState<VerifiedWordStudy[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isOpeningSignature, setIsOpeningSignature] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoadingWordStudies, setIsLoadingWordStudies] = useState(false);
  const [activeWordStudy, setActiveWordStudy] = useState<ActiveLookupWordStudy | null>(null);

  const loadPassageByReference = useCallback(async (reference: string) => {
    const response = await fetch(
      `/api/local-verse-lookup?q=${encodeURIComponent(reference)}`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "No local verse match found.");
    }

    setPassage(data.passage);
    setNote(data.note ?? "");
    setError("");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function openSignatureVerse() {
      setIsOpeningSignature(true);

      try {
        const response = await fetch(
          `/api/local-verse-lookup?q=${encodeURIComponent(SIGNATURE_REFERENCE)}`,
        );

        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to open signature verse.");
        }

        setPassage(data.passage);
        setNote("");
        setError("");
      } catch {
        if (!cancelled) {
          setError("Unable to open 2 Corinthians 3:17 right now.");
        }
      } finally {
        if (!cancelled) {
          setIsOpeningSignature(false);
        }
      }
    }

    openSignatureVerse();

    return () => {
      cancelled = true;
    };
  }, []);

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
      return;
    }

    setIsSearching(true);
    setError("");
    setNote("");

    try {
      await loadPassageByReference(trimmedQuery);
    } catch (caught) {
      setPassage(null);
      setError(caught instanceof Error ? caught.message : "No local verse match found.");
    } finally {
      setIsSearching(false);
    }
  }

  async function spinGospelVerse() {
    setIsSpinning(true);
    setError("");
    setNote("");

    try {
      const response = await fetch("/api/local-verse-lookup?random=gospel", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to spin a Gospel verse.");
      }

      setPassage(data.passage);
      setNote(data.note ?? "");
      setQuery("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to spin a Gospel verse right now.");
    } finally {
      setIsSpinning(false);
    }
  }

  function openWordStudy(selectedWordStudy?: VerifiedWordStudy) {
    if (!passage) {
      return;
    }

    const wordStudy = selectedWordStudy ?? getDefaultWordStudy(wordStudies);

    if (!wordStudy) {
      return;
    }

    setActiveWordStudy({
      passage,
      wordStudy,
    });
  }

  return (
    <section className={`${className} mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.055] px-5 py-8 text-center text-slate-100 shadow-2xl shadow-black/25 sm:px-8 sm:py-10`}>
      <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-400">
        Bible Bingo 7
      </p>

      <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
        Search a Verse. Share a Card.
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-zinc-300 sm:text-base">
        Open with 2 Corinthians 3:17, search any verse, or spin a Gospel verse from Matthew, Mark, Luke, or John.
      </p>

      <form
        onSubmit={lookupVerse}
        className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row"
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="text"
          inputMode="text"
          placeholder="Romans 8:8"
          aria-label="Bible verse to search"
          className="min-h-14 flex-1 rounded-2xl border border-white/15 bg-black/25 px-5 text-lg font-semibold text-white placeholder:text-white/35 outline-none ring-0 focus:border-white/40"
        />

        <button
          type="submit"
          disabled={isSearching}
          className="min-h-14 rounded-2xl border border-white/20 bg-white/10 px-6 text-base font-black text-white shadow-lg shadow-black/20 transition hover:bg-white/15 disabled:cursor-wait disabled:opacity-60"
        >
          {isSearching ? "Searching..." : "Search Verse"}
        </button>
      </form>

      <p className="mt-4 text-xs font-semibold text-zinc-400">
        Try John 3:16, Psalm 23:1, Romans 8:28, Genesis 1:1, or 2 Corinthians 3:17.
      </p>

      {isOpeningSignature && !passage && (
        <article className="mx-auto mt-7 max-w-3xl rounded-[1.75rem] border border-white/10 bg-black/20 p-6 text-center shadow-xl shadow-black/20 sm:p-8">
          <p className="text-sm font-bold text-slate-200">Opening 2 Corinthians 3:17...</p>
        </article>
      )}

      {passage && (
        <BibleBingoVerseCard
          passage={passage}
          wordStudies={wordStudies}
          isLoadingWordStudies={isLoadingWordStudies}
          isSpinning={isSpinning}
          note={note}
          onSpinGospelVerse={spinGospelVerse}
          onOpenDeepDive={() => openWordStudy()}
          onWordClick={(wordStudy) => openWordStudy(wordStudy)}
        />
      )}

      {error && (
        <p className="mx-auto mt-5 max-w-xl rounded-2xl border border-red-200/20 bg-red-300/10 px-5 py-3 text-sm font-semibold text-red-100">
          {error}
        </p>
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

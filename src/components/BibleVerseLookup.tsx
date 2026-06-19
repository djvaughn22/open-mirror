"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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

const SIGNATURE_REFERENCE = "2 Corinthians 3:17";

function verseUrl(passage: LookupPassage) {
  return `https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.${passage.verse}.WEBUS`;
}

function chapterUrl(passage: LookupPassage) {
  return `https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.WEBUS`;
}

function hasVerifiedWordLinks(wordStudies: VerifiedWordStudy[]) {
  return hasVerifiedWordStudies(wordStudies);
}

function shareTextFor(passage: LookupPassage) {
  return `${passage.label}\n\n${passage.text}\n\n${verseUrl(passage)}`;
}

function smsUrlFor(passage: LookupPassage) {
  return `sms:?&body=${encodeURIComponent(shareTextFor(passage))}`;
}

function emailUrlFor(passage: LookupPassage) {
  return `mailto:?subject=${encodeURIComponent(`Bible Bingo 7 - ${passage.label}`)}&body=${encodeURIComponent(shareTextFor(passage))}`;
}

export default function BibleVerseLookup({
  className = "mt-12",
}: BibleVerseLookupProps) {
  const [query, setQuery] = useState("");
  const [passage, setPassage] = useState<LookupPassage | null>(null);
  const [wordStudies, setWordStudies] = useState<VerifiedWordStudy[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isOpeningSignature, setIsOpeningSignature] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoadingWordStudies, setIsLoadingWordStudies] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
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
    setShareOpen(false);
    setShareStatus("");
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
      setError(caught instanceof Error ? caught.message : "No local verse match found.");
    } finally {
      setIsSearching(false);
    }
  }

  async function spinGospelVerse() {
    setIsSpinning(true);
    setError("");
    setNote("");
    setShareOpen(false);
    setShareStatus("");

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

  async function copyCurrentVerse() {
    if (!passage) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareTextFor(passage));
      setShareStatus("Copied verse.");
    } catch {
      setShareStatus("Copy failed.");
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

  const shareLinks = useMemo(() => {
    if (!passage) {
      return null;
    }

    return {
      sms: smsUrlFor(passage),
      email: emailUrlFor(passage),
      verse: verseUrl(passage),
      chapter: chapterUrl(passage),
    };
  }, [passage]);

  return (
    <section className={`${className} mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.055] px-5 py-8 text-center text-slate-100 shadow-2xl shadow-black/25 sm:px-8 sm:py-10`}>
      <div className="flex justify-center gap-4 text-3xl" aria-hidden="true">
        <span>✝️</span>
        <span>❤️</span>
        <span>🙏</span>
      </div>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.28em] text-zinc-400">
        Bible Bingo 7
      </p>

      <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
        Verse Card
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-zinc-300 sm:text-base">
        Always opens with 2 Corinthians 3:17. Spin a random Gospel verse from Matthew, Mark, Luke, or John.
      </p>

      {isOpeningSignature && !passage && (
        <article className="mx-auto mt-7 max-w-3xl rounded-[1.75rem] border border-white/10 bg-black/20 p-6 text-center shadow-xl shadow-black/20 sm:p-8">
          <p className="text-sm font-bold text-slate-200">Opening 2 Corinthians 3:17...</p>
        </article>
      )}

      {passage && (
        <article className="relative mx-auto mt-7 max-w-3xl overflow-visible rounded-[1.9rem] border border-white/10 bg-gradient-to-br from-emerald-950/55 via-slate-950/85 to-rose-950/45 p-6 text-center shadow-2xl shadow-black/30 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
            Bible Bingo Verse
          </p>

          <h3 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {passage.label}
          </h3>

          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-5 text-lg font-bold leading-8 text-slate-100 sm:text-xl sm:leading-9">
            <VerifiedVerseText
              passage={passage}
              wordStudies={wordStudies}
              onWordClick={(wordStudy) => openWordStudy(passage, wordStudy)}
            />
          </div>

          {note && (
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-300">
              {note}
            </p>
          )}

          {shareStatus && (
            <p className="mt-4 text-xs font-bold text-emerald-100">
              {shareStatus}
            </p>
          )}

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={spinGospelVerse}
              disabled={isSpinning}
              className="inline-flex items-center justify-center rounded-full border border-yellow-200/30 bg-yellow-200/15 px-5 py-2 text-sm font-black text-yellow-50 shadow-sm transition hover:bg-yellow-200/25 disabled:cursor-wait disabled:opacity-60"
            >
              {isSpinning ? "Spinning..." : "Spin Gospel Verse"}
            </button>

            <a
              href={verseUrl(passage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-white/30"
            >
              Open Bible.com
            </a>

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
              className="inline-flex items-center justify-center rounded-full border border-emerald-200/20 bg-emerald-300/10 px-5 py-2 text-sm font-black text-emerald-100 shadow-sm transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:border-zinc-700/70 disabled:bg-zinc-800/70 disabled:text-zinc-500 disabled:shadow-none disabled:hover:bg-zinc-800/70"
            >
              Deep Dive
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShareOpen((current) => !current)}
                aria-expanded={shareOpen}
                className="inline-flex w-full items-center justify-center rounded-full border border-sky-200/25 bg-sky-300/10 px-5 py-2 text-sm font-black text-sky-50 shadow-sm transition hover:bg-sky-300/20 sm:w-auto"
              >
                Share
              </button>

              {shareOpen && shareLinks && (
                <div className="absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-white/15 bg-slate-950/95 p-2 text-left shadow-2xl shadow-black/40 backdrop-blur">
                  <button
                    type="button"
                    onClick={copyCurrentVerse}
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Copy verse
                  </button>

                  <a
                    href={shareLinks.sms}
                    className="block rounded-xl px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Text verse
                  </a>

                  <a
                    href={shareLinks.email}
                    className="block rounded-xl px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Email verse
                  </a>

                  <a
                    href={shareLinks.chapter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Read chapter
                  </a>
                </div>
              )}
            </div>
          </div>
        </article>
      )}

      <form
        onSubmit={lookupVerse}
        className="mx-auto mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row"
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="text"
          inputMode="text"
          placeholder="Search any verse, like John 3:16"
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
        Try John 3:16, Psalm 23:1, Romans 8:28, or Genesis 1:1.
      </p>

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

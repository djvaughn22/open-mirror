"use client";

import { useMemo, useState } from "react";
import VerifiedVerseText from "./VerifiedVerseText";
import {
  hasVerifiedWordStudies,
  type VerifiedWordStudy,
} from "../lib/originalLanguageWordStudy";

export type BibleBingoCardPassage = {
  label: string;
  book: string;
  code: string;
  chapter: string;
  verse: string;
  text: string;
  group: string;
};

type BibleBingoVerseCardProps = {
  passage: BibleBingoCardPassage;
  wordStudies: VerifiedWordStudy[];
  isLoadingWordStudies: boolean;
  isSpinning: boolean;
  spinLabel: string;
  note?: string;
  onSpinVerse: () => void;
  onOpenDeepDive: () => void;
  onWordClick: (wordStudy: VerifiedWordStudy) => void;
};

function verseUrl(passage: BibleBingoCardPassage) {
  return `https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.${passage.verse}.WEBUS`;
}

function chapterUrl(passage: BibleBingoCardPassage) {
  return `https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.WEBUS`;
}

function shareTextFor(passage: BibleBingoCardPassage) {
  return `${passage.label}\n\n${passage.text}\n\n${verseUrl(passage)}`;
}

function smsUrlFor(passage: BibleBingoCardPassage) {
  return `sms:?&body=${encodeURIComponent(shareTextFor(passage))}`;
}

function emailUrlFor(passage: BibleBingoCardPassage) {
  return `mailto:?subject=${encodeURIComponent(`Bible Bingo 7 - ${passage.label}`)}&body=${encodeURIComponent(shareTextFor(passage))}`;
}

export default function BibleBingoVerseCard({
  passage,
  wordStudies,
  isLoadingWordStudies,
  isSpinning,
  spinLabel,
  note = "",
  onSpinVerse,
  onOpenDeepDive,
  onWordClick,
}: BibleBingoVerseCardProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

  const deepDiveReady = hasVerifiedWordStudies(wordStudies);

  const shareLinks = useMemo(() => {
    return {
      sms: smsUrlFor(passage),
      email: emailUrlFor(passage),
      verse: verseUrl(passage),
      chapter: chapterUrl(passage),
    };
  }, [passage]);

  async function copyCard() {
    try {
      await navigator.clipboard.writeText(shareTextFor(passage));
      setShareStatus("Card copied.");
    } catch {
      setShareStatus("Copy failed.");
    }
  }

  return (
    <article className="relative mx-auto mt-7 max-w-3xl overflow-visible rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-950/60 via-slate-950/90 to-rose-950/45 p-6 text-center shadow-2xl shadow-black/30 sm:p-8">
      <div className="flex justify-center gap-4 text-2xl" aria-hidden="true">
        <span>✝️</span>
        <span>❤️</span>
        <span>🙏</span>
      </div>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.24em] text-emerald-100">
        Bible Bingo Card
      </p>

      <h3 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
        {passage.label}
      </h3>

      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/25 px-5 py-5 text-lg font-bold leading-8 text-slate-100 sm:text-xl sm:leading-9">
        <VerifiedVerseText
          passage={passage}
          wordStudies={wordStudies}
          onWordClick={onWordClick}
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
          onClick={onSpinVerse}
          disabled={isSpinning}
          className="inline-flex items-center justify-center rounded-full border border-yellow-200/30 bg-yellow-200/15 px-5 py-2 text-sm font-black text-yellow-50 shadow-sm transition hover:bg-yellow-200/25 disabled:cursor-wait disabled:opacity-60"
        >
          {isSpinning ? "Spinning..." : spinLabel}
        </button>

        <a
          href={shareLinks.verse}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-white/30"
        >
          Go to Verse
        </a>

        <a
          href={shareLinks.chapter}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-white/30"
        >
          Go to Chapter
        </a>

        <button
          type="button"
          onClick={onOpenDeepDive}
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
            Share Card
          </button>

          {shareOpen && (
            <div className="absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-white/15 bg-slate-950/95 p-2 text-left shadow-2xl shadow-black/40 backdrop-blur">
              <button
                type="button"
                onClick={copyCard}
                className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-white transition hover:bg-white/10"
              >
                Copy card
              </button>

              <a
                href={shareLinks.sms}
                className="block rounded-xl px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Text card
              </a>

              <a
                href={shareLinks.email}
                className="block rounded-xl px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Email card
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

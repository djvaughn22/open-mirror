"use client";

import {
  originalLanguageName,
  type VerifiedWordStudy,
  type WordStudyPassage,
} from "../lib/originalLanguageWordStudy";

type OriginalWordStudyModalProps = {
  passage: WordStudyPassage;
  wordStudy: VerifiedWordStudy;
  verseUrl: string;
  onClose: () => void;
};

export default function OriginalWordStudyModal({
  passage,
  wordStudy,
  verseUrl,
  onClose,
}: OriginalWordStudyModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-study-title"
    >
      <div className="w-full max-w-2xl rounded-[2rem] border border-emerald-200/20 bg-slate-950 p-6 text-left text-slate-100 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Deep Dive
            </p>

            <h2 id="word-study-title" className="mt-3 text-2xl font-bold">
              Behind the Verse
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold text-slate-300">
            Verse reference
          </p>
          <p className="mt-1 text-lg font-bold text-white">{passage.label}</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">{passage.text}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-200/15 bg-emerald-300/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
            {originalLanguageName(wordStudy.language)} word link verified
          </p>

          <h3 className="mt-4 text-3xl font-bold text-white">
            {wordStudy.englishWord}
          </h3>

          <dl className="mt-5 grid gap-4 text-sm leading-6 text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <dt className="font-bold text-slate-100">Original word</dt>
              <dd className="mt-2 text-2xl text-white">{wordStudy.originalWord}</dd>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <dt className="font-bold text-slate-100">Transliteration</dt>
              <dd className="mt-2">{wordStudy.transliteration}</dd>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <dt className="font-bold text-slate-100">Strong&apos;s</dt>
              <dd className="mt-2">{wordStudy.strongs}</dd>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <dt className="font-bold text-slate-100">Lemma</dt>
              <dd className="mt-2">{wordStudy.lemma}</dd>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <dt className="font-bold text-slate-100">Morphology</dt>
              <dd className="mt-2">{wordStudy.morphology}</dd>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <dt className="font-bold text-slate-100">Simple meaning</dt>
              <dd className="mt-2">{wordStudy.shortMeaning}</dd>
            </div>
          </dl>

          <p className="mt-5 text-xs leading-6 text-slate-400">
            Source receipt:{" "}
            <a
              href={wordStudy.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-100 underline decoration-emerald-200/50 underline-offset-4 hover:text-white"
            >
              {wordStudy.sourceName}
            </a>
          </p>
        </div>

        <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300">
          CrossHeartPray only underlines a word when a trusted source can connect
          that exact English word in that exact verse to original-language data.
          No guessing.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={verseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/25 bg-white/20 px-5 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-white/30"
          >
            View Verse in Bible App
          </a>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

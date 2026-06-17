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
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 px-4 py-5 sm:items-center sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-study-title"
    >
      <div className="w-full max-w-xl rounded-[1.75rem] border border-emerald-200/20 bg-slate-950 p-5 text-left text-slate-100 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">
              Deep Dive
            </p>

            <h2 id="word-study-title" className="mt-2 text-2xl font-bold">
              Behind the Verse
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-300">
              {passage.label}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm leading-7 text-slate-300">{passage.text}</p>
        </div>

        <section className="mt-5 rounded-2xl border border-emerald-200/15 bg-emerald-300/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
            {originalLanguageName(wordStudy.language)} word link verified
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-sm font-semibold text-slate-300">
                English word
              </p>
              <h3 className="mt-1 text-3xl font-bold text-white">
                {wordStudy.englishWord}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 sm:text-right">
              <p className="text-sm font-semibold text-slate-300">
                {originalLanguageName(wordStudy.language)} meaning
              </p>
              <p className="mt-1 text-base font-bold text-white">
                {wordStudy.lexiconMeaning || "Meaning not available yet"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-slate-300">
              Original word
            </p>
            <p className="mt-2 text-3xl font-bold leading-tight text-white">
              {wordStudy.originalWord}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {wordStudy.transliteration}
            </p>
          </div>

          <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
              <p className="font-bold text-slate-100">Strong&apos;s</p>
              <p className="mt-1">{wordStudy.strongs}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
              <p className="font-bold text-slate-100">Lemma</p>
              <p className="mt-1 break-words">{wordStudy.lemma}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
              <p className="font-bold text-slate-100">Grammar</p>
              <p className="mt-1">{wordStudy.morphology}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-3 text-sm leading-6 text-slate-300">
            <p className="font-bold text-slate-100">Source gloss</p>
            <p className="mt-1">{wordStudy.sourceGloss}</p>
          </div>

          <p className="mt-4 text-xs leading-6 text-slate-400">
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
        </section>

        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-6 text-slate-400">
          Underlined words are verified for this exact verse. Greek and Hebrew
          meaning comes from Strong&apos;s / lexicon data when available. Source
          gloss is shown separately as the alignment helper.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
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

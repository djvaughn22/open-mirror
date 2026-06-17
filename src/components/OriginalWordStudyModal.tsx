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

function buildBibleHubStrongsUrl(strongs: string) {
  const clean = strongs.trim().toUpperCase();
  const match = clean.match(/^([HG])(\d+)$/);

  if (!match) return "";

  const [, language, number] = match;
  const paddedNumber = number.padStart(4, "0");

  if (language === "H") {
    return `https://biblehub.com/hebrew/${paddedNumber}.htm`;
  }

  return `https://biblehub.com/greek/${paddedNumber}.htm`;
}

export default function OriginalWordStudyModal({
  passage,
  wordStudy,
  verseUrl,
  onClose,
}: OriginalWordStudyModalProps) {
  const languageName = originalLanguageName(wordStudy.language);
  const strongsUrl = buildBibleHubStrongsUrl(wordStudy.strongs);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-[1.5rem] border border-emerald-200/20 bg-slate-950 shadow-2xl sm:max-h-[560px]">
        <div className="shrink-0 border-b border-white/10 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                {languageName} Deep Dive
              </p>

              <h2 className="mt-2 truncate text-xl font-bold leading-tight text-white">
                {wordStudy.englishWord}
              </h2>

              <p className="mt-1 truncate text-xs text-slate-400">
                {passage.label}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg font-bold text-slate-200 hover:bg-white/10"
              aria-label="Close Deep Dive"
            >
              ×
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 text-left">
          <div className="rounded-2xl border border-emerald-200/15 bg-emerald-300/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
              Original word
            </p>

            <p className="mt-2 break-words text-2xl font-bold leading-snug text-white">
              {wordStudy.originalWord}
            </p>

            <p className="mt-2 break-words text-sm leading-6 text-emerald-50">
              {wordStudy.transliteration}
            </p>
          </div>

          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Strong&apos;s
              </p>
              <p className="mt-2 font-semibold text-white">{wordStudy.strongs}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Language
              </p>
              <p className="mt-2 font-semibold text-white">{languageName}</p>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Meaning from source
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-white">
              {wordStudy.lexiconMeaning}
            </p>
          </div>

          <div className="mt-3 rounded-2xl border border-sky-200/15 bg-sky-300/10 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-200">
              No AI interpretation
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-200">
              Source-backed word data only. CrossHeartPray does not add AI
              interpretation to this Deep Dive.
            </p>
          </div>

          <details className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Sources
            </summary>

            <div className="mt-3 space-y-3 text-xs leading-5">
              <div>
                <p className="font-bold text-slate-300">Word match source</p>
                <p className="mt-1 text-slate-400">{wordStudy.sourceName}</p>
              </div>

              <div>
                <p className="font-bold text-slate-300">Meaning source</p>
                <p className="mt-1 text-slate-400">
                  {wordStudy.lexiconSourceName}
                </p>
              </div>

              {strongsUrl ? (
                <a
                  href={strongsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-emerald-200/25 bg-emerald-300/10 px-4 py-2 text-center font-semibold text-emerald-50 hover:bg-emerald-300/15"
                >
                  View Strong&apos;s entry
                </a>
              ) : null}
            </div>
          </details>

          <details className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Advanced details
            </summary>

            <div className="mt-3 space-y-3 text-xs leading-5">
              <div>
                <p className="font-bold text-slate-300">Morphology</p>
                <p className="mt-1 break-words text-slate-400">
                  {wordStudy.morphology}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-300">Source gloss</p>
                <p className="mt-1 text-slate-400">{wordStudy.sourceGloss}</p>
              </div>

              <div>
                <p className="font-bold text-slate-300">Lemma</p>
                <p className="mt-1 break-words text-slate-400">
                  {wordStudy.lemma}
                </p>
              </div>
            </div>
          </details>

          <a
            href={verseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-center text-sm font-semibold text-white hover:bg-white/15"
          >
            Open verse in the Holy Bible app
          </a>
        </div>
      </div>
    </div>
  );
}

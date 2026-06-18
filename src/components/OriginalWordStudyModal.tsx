"use client";

import { useEffect, useMemo, useState } from "react";
import {
  isUsefulVerifiedWordStudy,
  normalizeStudyWord,
  originalLanguageName,
  type VerifiedWordStudy,
  type WordStudyPassage,
} from "../lib/originalLanguageWordStudy";

type OriginalWordStudyModalProps = {
  passage: WordStudyPassage;
  wordStudy: VerifiedWordStudy;
  wordStudies: VerifiedWordStudy[];
  verseUrl: string;
  onClose: () => void;
};

type WordStudyMode = "focused" | "all";

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

function hasSourceBackedFields(wordStudy: VerifiedWordStudy) {
  return Boolean(
    wordStudy.englishWord.trim() &&
      wordStudy.originalWord.trim() &&
      wordStudy.strongs.trim() &&
      wordStudy.lexiconMeaning.trim(),
  );
}

function sameWordStudy(first: VerifiedWordStudy, second: VerifiedWordStudy) {
  return (
    normalizeStudyWord(first.englishWord) === normalizeStudyWord(second.englishWord) &&
    first.originalWord.trim() === second.originalWord.trim() &&
    first.strongs.trim().toUpperCase() === second.strongs.trim().toUpperCase()
  );
}

function deterministicWordLinkLabel(wordStudy: VerifiedWordStudy) {
  const englishWord = normalizeStudyWord(wordStudy.englishWord);
  const sourceGloss = normalizeStudyWord(wordStudy.sourceGloss);
  const lexiconMeaning = normalizeStudyWord(wordStudy.lexiconMeaning);

  if (
    englishWord &&
    (englishWord === sourceGloss || englishWord === lexiconMeaning)
  ) {
    return "Straightforward source match";
  }

  return "Part of translated phrase";
}

function modeButtonClass(mode: WordStudyMode, activeMode: WordStudyMode) {
  if (mode === activeMode) {
    return "border-emerald-200/35 bg-emerald-300/15 text-emerald-50";
  }

  return "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10";
}

function wordButtonClass(wordStudy: VerifiedWordStudy, selectedWordStudy: VerifiedWordStudy) {
  if (sameWordStudy(wordStudy, selectedWordStudy)) {
    return "border-emerald-200/35 bg-emerald-300/15 text-emerald-50";
  }

  return "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10";
}

export default function OriginalWordStudyModal({
  passage,
  wordStudy,
  wordStudies,
  verseUrl,
  onClose,
}: OriginalWordStudyModalProps) {
  const [mode, setMode] = useState<WordStudyMode>("focused");
  const [selectedWordStudy, setSelectedWordStudy] = useState(wordStudy);

  useEffect(() => {
    setMode("focused");
    setSelectedWordStudy(wordStudy);
  }, [wordStudy]);

  const allWordStudies = useMemo(() => {
    const sourceBackedWordStudies = wordStudies.filter(hasSourceBackedFields);

    if (sourceBackedWordStudies.some((study) => sameWordStudy(study, wordStudy))) {
      return sourceBackedWordStudies;
    }

    return [wordStudy, ...sourceBackedWordStudies];
  }, [wordStudy, wordStudies]);

  const focusedWordStudies = useMemo(() => {
    const usefulWordStudies = allWordStudies.filter(isUsefulVerifiedWordStudy);

    if (usefulWordStudies.length > 0) {
      return usefulWordStudies;
    }

    return [wordStudy];
  }, [allWordStudies, wordStudy]);

  const displayedWordStudies = mode === "focused" ? focusedWordStudies : allWordStudies;

  useEffect(() => {
    if (
      displayedWordStudies.length > 0 &&
      !displayedWordStudies.some((study) => sameWordStudy(study, selectedWordStudy))
    ) {
      setSelectedWordStudy(displayedWordStudies[0]);
    }
  }, [displayedWordStudies, selectedWordStudy]);

  const languageName = originalLanguageName(selectedWordStudy.language);
  const strongsUrl = buildBibleHubStrongsUrl(selectedWordStudy.strongs);
  const sourceLabel = deterministicWordLinkLabel(selectedWordStudy);
  const isFocusedStudyWord = isUsefulVerifiedWordStudy(selectedWordStudy);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:items-center">
      <div className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-[1.5rem] border border-emerald-200/20 bg-slate-950 shadow-2xl sm:max-h-[560px]">
        <div className="shrink-0 border-b border-white/10 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                {languageName} Deep Dive
              </p>

              <h2 className="mt-2 truncate text-xl font-bold leading-tight text-white">
                {selectedWordStudy.englishWord}
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

        <div
          className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-5 py-4 text-left"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("focused")}
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] ${modeButtonClass("focused", mode)}`}
            >
              Focused
            </button>

            <button
              type="button"
              onClick={() => setMode("all")}
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] ${modeButtonClass("all", mode)}`}
            >
              All
            </button>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-400">
            Focused shows the clearest source-backed word links. All shows every
            source-backed word link for this verse.
          </p>

          {displayedWordStudies.length > 1 ? (
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Word links
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {displayedWordStudies.map((study, index) => (
                  <button
                    key={`${study.strongs}-${study.englishWord}-${index}`}
                    type="button"
                    onClick={() => setSelectedWordStudy(study)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${wordButtonClass(study, selectedWordStudy)}`}
                  >
                    {study.englishWord}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Meaning from source
            </p>
            <p className="mt-2 text-lg font-bold leading-7 text-white">
              {selectedWordStudy.lexiconMeaning}
            </p>

            {mode === "all" && !isFocusedStudyWord ? (
              <p className="mt-3 rounded-xl border border-amber-200/15 bg-amber-300/10 p-3 text-xs leading-5 text-amber-50">
                Basic source gloss. Focused hides this kind of word because the
                source meaning is mostly grammar, a simple connector, or a basic
                translated word.
              </p>
            ) : null}
          </div>

          <div className="mt-3 rounded-2xl border border-emerald-200/15 bg-emerald-300/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
              Original {languageName} word
            </p>

            <p className="mt-2 break-words text-3xl font-bold leading-snug text-white">
              {selectedWordStudy.originalWord}
            </p>

            <div className="mt-4 rounded-xl border border-emerald-200/15 bg-black/20 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-200">
                Pronunciation guide
              </p>
              <p className="mt-2 break-words text-base font-semibold leading-6 text-emerald-50">
                {selectedWordStudy.transliteration}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                Source transliteration for reading and teaching the original word.
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              English word in this verse
            </p>

            <p className="mt-2 text-lg font-bold leading-7 text-white">
              {selectedWordStudy.englishWord}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              {sourceLabel}
            </p>
          </div>

          {strongsUrl ? (
            <a
              href={strongsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-emerald-200/25 bg-emerald-300/10 px-5 py-2 text-center text-sm font-semibold text-emerald-50 hover:bg-emerald-300/15"
            >
              Open Strong&apos;s source
            </a>
          ) : null}

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Source transparency
            </p>

            <div className="mt-3 space-y-2 text-xs leading-5 text-slate-400">
              <p>
                Word source:{" "}
                <span className="font-semibold text-slate-300">
                  {selectedWordStudy.sourceName}
                </span>
              </p>

              <p>
                Meaning source:{" "}
                <span className="font-semibold text-slate-300">
                  {selectedWordStudy.lexiconSourceName}
                </span>
              </p>
            </div>
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
                <p className="mt-1 text-slate-400">{selectedWordStudy.sourceName}</p>
              </div>

              <div>
                <p className="font-bold text-slate-300">Meaning source</p>
                <p className="mt-1 text-slate-400">
                  {selectedWordStudy.lexiconSourceName}
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
                <p className="font-bold text-slate-300">Strong&apos;s number</p>
                <p className="mt-1 break-words text-slate-400">
                  {selectedWordStudy.strongs}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-300">Language</p>
                <p className="mt-1 break-words text-slate-400">
                  {languageName}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-300">Morphology</p>
                <p className="mt-1 break-words text-slate-400">
                  {selectedWordStudy.morphology}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-300">Source gloss</p>
                <p className="mt-1 text-slate-400">
                  {selectedWordStudy.sourceGloss}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-300">Lemma</p>
                <p className="mt-1 break-words text-slate-400">
                  {selectedWordStudy.lemma}
                </p>
              </div>

              {selectedWordStudy.sourceUrl ? (
                <div>
                  <p className="font-bold text-slate-300">Source URL</p>
                  <a
                    href={selectedWordStudy.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex break-all text-emerald-200 underline decoration-emerald-200/40 underline-offset-4"
                  >
                    {selectedWordStudy.sourceUrl}
                  </a>
                </div>
              ) : null}
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

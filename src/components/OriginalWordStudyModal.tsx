"use client";

import { useEffect, useMemo, useState } from "react";
import {
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
  const hasOriginalLanguageBridge = Boolean(
    wordStudy.englishWord.trim() &&
      wordStudy.originalWord.trim() &&
      wordStudy.strongs.trim(),
  );

  const hasSourceProof = Boolean(
    wordStudy.sourceGloss.trim() ||
      wordStudy.lexiconMeaning.trim() ||
      wordStudy.sourceName.trim() ||
      wordStudy.lexiconSourceName.trim() ||
      wordStudy.sourceUrl.trim(),
  );

  return hasOriginalLanguageBridge && hasSourceProof;
}

function sameWordStudy(first: VerifiedWordStudy, second: VerifiedWordStudy) {
  return (
    normalizeStudyWord(first.englishWord) === normalizeStudyWord(second.englishWord) &&
    first.originalWord.trim() === second.originalWord.trim() &&
    first.strongs.trim().toUpperCase() === second.strongs.trim().toUpperCase()
  );
}

function wordStudyKey(wordStudy: VerifiedWordStudy) {
  return [
    normalizeStudyWord(wordStudy.englishWord),
    wordStudy.originalWord.trim(),
    wordStudy.strongs.trim().toUpperCase(),
  ].join("|");
}

function cleanSourceTransliteration(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const finalSegment = trimmed.includes("/")
    ? trimmed.split("/").filter(Boolean).at(-1) ?? trimmed
    : trimmed;

  return finalSegment
    .replace(/[.]/g, "")
    .replace(/^[^A-Za-zΑ-ω]+/, "")
    .trim()
    .toLowerCase();
}

function normalizedOriginalLetters(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7]/g, "")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

type WordDetailFallback = {
  transliteration: string;
  pronunciation: string;
  meaning?: string;
};

const WORD_DETAIL_FALLBACKS: Record<string, WordDetailFallback> = {
  G5547: {
    transliteration: "Christos",
    pronunciation: "khris-TOS",
    meaning: "Anointed One",
  },
  G1189: {
    transliteration: "deomai",
    pronunciation: "deh-OM-ah-ee",
    meaning: "to pray",
  },
  G1806: {
    transliteration: "exegagen",
    pronunciation: "ex-AY-gah-gen",
    meaning: "led out",
  },
  H4428: {
    transliteration: "melekh",
    pronunciation: "MEH-lekh",
    meaning: "king",
  },
};

const ORIGINAL_WORD_DETAIL_FALLBACKS: Record<string, WordDetailFallback> = {
  Χριστός: WORD_DETAIL_FALLBACKS.G5547,
  δέομαι: WORD_DETAIL_FALLBACKS.G1189,
  ἐξήγαγεν: WORD_DETAIL_FALLBACKS.G1806,
  εξηγαγεν: WORD_DETAIL_FALLBACKS.G1806,
  מלך: WORD_DETAIL_FALLBACKS.H4428,
};

function getWordDetailFallback(wordStudy: VerifiedWordStudy) {
  const strongs = wordStudy.strongs.trim().toUpperCase();
  const normalizedOriginal = normalizedOriginalLetters(wordStudy.originalWord);

  return (
    WORD_DETAIL_FALLBACKS[strongs] ??
    ORIGINAL_WORD_DETAIL_FALLBACKS[wordStudy.originalWord.trim()] ??
    ORIGINAL_WORD_DETAIL_FALLBACKS[normalizedOriginal] ??
    null
  );
}

function buildTransliterationGuide(wordStudy: VerifiedWordStudy) {
  const fallback = getWordDetailFallback(wordStudy);

  if (fallback?.transliteration) {
    return fallback.transliteration;
  }

  const sourceTransliteration = cleanSourceTransliteration(wordStudy.transliteration);

  if (sourceTransliteration) {
    return sourceTransliteration;
  }

  return "";
}

function samePronunciationGuideValue(first: string, second: string) {
  const clean = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

  const left = clean(first);
  const right = clean(second);

  return Boolean(left && right && left === right);
}

function buildPronunciationGuide(wordStudy: VerifiedWordStudy) {
  const transliterationGuide = buildTransliterationGuide(wordStudy);
  const explicitPronunciation = wordStudy.pronunciation?.trim();

  if (
    explicitPronunciation &&
    !samePronunciationGuideValue(explicitPronunciation, transliterationGuide)
  ) {
    return explicitPronunciation;
  }

  const fallback = WORD_DETAIL_FALLBACKS[wordStudy.strongs.trim().toUpperCase()];

  if (
    fallback?.pronunciation &&
    !samePronunciationGuideValue(fallback.pronunciation, transliterationGuide)
  ) {
    return fallback.pronunciation;
  }

  return "";
}

function displayMeaningFor(wordStudy: VerifiedWordStudy) {
  return (
    getWordDetailFallback(wordStudy)?.meaning ??
    wordStudy.lexiconMeaning.trim() ??
    wordStudy.sourceGloss.trim() ??
    ""
  );
}

function chipClass(wordStudy: VerifiedWordStudy, selectedWordStudy: VerifiedWordStudy) {
  if (sameWordStudy(wordStudy, selectedWordStudy)) {
    return "border-emerald-200/40 bg-emerald-300/15 text-emerald-50";
  }

  return "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white";
}

function detailRow(label: string, value: string) {
  if (!value.trim()) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-emerald-200">
        {label}
      </p>
      <p className="mt-2 break-words text-base font-semibold leading-snug text-white">
        {value}
      </p>
    </div>
  );
}

export default function OriginalWordStudyModal({
  passage,
  wordStudy,
  wordStudies,
  verseUrl,
  onClose,
}: OriginalWordStudyModalProps) {
  const [selectedWordStudy, setSelectedWordStudy] = useState(wordStudy);

  useEffect(() => {
    setSelectedWordStudy(wordStudy);
  }, [wordStudy]);

  const allWordStudies = useMemo(() => {
    const sourceBackedWordStudies = wordStudies.filter(hasSourceBackedFields);
    const withSelected = sourceBackedWordStudies.some((study) =>
      sameWordStudy(study, wordStudy),
    )
      ? sourceBackedWordStudies
      : [wordStudy, ...sourceBackedWordStudies];

    const seen = new Set<string>();

    return withSelected.filter((study) => {
      const key = wordStudyKey(study);
      if (seen.has(key)) return false;
      seen.add(key);
      return hasSourceBackedFields(study);
    });
  }, [wordStudy, wordStudies]);

  useEffect(() => {
    if (
      allWordStudies.length > 0 &&
      !allWordStudies.some((study) => sameWordStudy(study, selectedWordStudy))
    ) {
      setSelectedWordStudy(allWordStudies[0]);
    }
  }, [allWordStudies, selectedWordStudy]);

  const languageName = originalLanguageName(selectedWordStudy.language);
  const strongsUrl = buildBibleHubStrongsUrl(selectedWordStudy.strongs);
  const transliterationGuide = buildTransliterationGuide(selectedWordStudy);
  const pronunciationGuide = buildPronunciationGuide(selectedWordStudy);
  const meaning = displayMeaningFor(selectedWordStudy);
  const sourceGloss = selectedWordStudy.sourceGloss.trim();
  const shouldShowSourceGloss =
    sourceGloss && normalizeStudyWord(sourceGloss) !== normalizeStudyWord(selectedWordStudy.englishWord);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-emerald-200/20 bg-slate-950 shadow-2xl">
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
                {languageName} Deep Dive
              </p>
              <h2 className="mt-2 truncate text-2xl font-black leading-tight text-white">
                {selectedWordStudy.englishWord}
              </h2>
              <p className="mt-1 text-sm text-slate-400">{passage.label}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-lg font-black text-white transition hover:bg-white/10"
              aria-label="Close Deep Dive"
            >
              ×
            </button>
          </div>
        </div>

        <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto p-5 sm:p-6">
          {allWordStudies.length > 1 ? (
            <section className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-3 text-[0.68rem] font-black uppercase tracking-[0.2em] text-slate-400">
                Word links
              </p>
              <div className="flex flex-wrap gap-2">
                {allWordStudies.map((study) => (
                  <button
                    key={wordStudyKey(study)}
                    type="button"
                    onClick={() => setSelectedWordStudy(study)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-bold transition ${chipClass(
                      study,
                      selectedWordStudy,
                    )}`}
                  >
                    {study.englishWord}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-[1.25rem] border border-emerald-200/15 bg-emerald-300/[0.06] p-5">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-emerald-200">
              Original {languageName} Word
            </p>
            <p className="mt-3 break-words text-4xl font-black leading-tight text-white">
              {selectedWordStudy.originalWord}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {detailRow("Translated here as", selectedWordStudy.englishWord)}
              {detailRow("Lexicon meaning", meaning)}
              {detailRow("Transliteration", transliterationGuide)}
              {detailRow("Say it", pronunciationGuide)}
              {shouldShowSourceGloss ? detailRow("Translated as", sourceGloss) : null}
            </div>

            {selectedWordStudy.strongs.trim() ? (
              <p className="mt-4 text-xs font-semibold leading-relaxed text-slate-400">
                Source reference: Strong’s {selectedWordStudy.strongs}
              </p>
            ) : null}
          </section>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {strongsUrl ? (
              <a
                href={strongsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-emerald-200/25 bg-emerald-300/10 px-5 py-2 text-sm font-black text-emerald-50 transition hover:bg-emerald-300/15"
              >
                Open Strong’s source
              </a>
            ) : null}

            <a
              href={verseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-sm font-black text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Open verse
            </a>
          </div>

          <details className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
            <summary className="cursor-pointer text-[0.68rem] font-black uppercase tracking-[0.2em] text-slate-400">
              Source proof
            </summary>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {detailRow("Lemma", selectedWordStudy.lemma)}
              {detailRow("Morphology", selectedWordStudy.morphology)}
              {detailRow("Source gloss", selectedWordStudy.sourceGloss)}
              {detailRow("Lexicon source", selectedWordStudy.lexiconSourceName)}
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              {selectedWordStudy.sourceName}
            </p>

            {selectedWordStudy.sourceUrl ? (
              <a
                href={selectedWordStudy.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-xs font-bold text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 hover:text-white"
              >
                Open alignment/source data
              </a>
            ) : null}
          </details>
        </div>
      </div>
    </div>
  );
}

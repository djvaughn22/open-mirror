"use client";

import { useEffect, useMemo, useState } from "react";

function cleanOriginalScriptDisplay(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0591-\u05BD\u05BF-\u05C7\u0300-\u036f]/g, "")
    .replace(/[\u25A0-\u25FF\uFFFD]/g, "")
    .normalize("NFC")
    .trim();
}


function makeDeepDivePronunciationGuide(transliteration?: string | null) {
  const cleaned = transliteration
    ?.trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!cleaned) {
    return "";
  }

  if (cleaned.includes("-")) {
    return cleaned;
  }

  return cleaned
    .split("-")
    .join(" ")
    .split(/\s+/)
    .map((word) => {
      const plain = word.replace(/[^A-Za-zāēīōūĀĒĪŌŪ]/g, "");

      if (plain.length <= 4) {
        return plain;
      }

      const pieces: string[] = [];
      let current = "";

      for (let index = 0; index < plain.length; index += 1) {
        const char = plain[index];
        const next = plain[index + 1] ?? "";
        const previous = plain[index - 1] ?? "";

        const isVowel = (value: string) => /[aeiouyāēīōūAEIOUYĀĒĪŌŪ]/.test(value);
        const charIsLetter = /[A-Za-zāēīōūĀĒĪŌŪ]/.test(char);
        const charIsConsonant = charIsLetter && !isVowel(char);
        const nextIsVowel = isVowel(next);
        const previousIsVowel = isVowel(previous);

        if (
          current &&
          charIsConsonant &&
          nextIsVowel &&
          (previousIsVowel || current.length >= 2)
        ) {
          pieces.push(current);
          current = char;
        } else {
          current += char;
        }
      }

      if (current) {
        pieces.push(current);
      }

      return pieces.join("-");
    })
    .filter(Boolean)
    .join("-");
}

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

  {makeDeepDivePronunciationGuide(wordStudy?.transliteration) ? (
    <div className="deep-dive-pronunciation-card mx-auto mt-5 max-w-md rounded-2xl border border-emerald-200/20 bg-slate-950/60 px-5 py-4 text-center">
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-100">
        PRONUNCIATION
      </p>
      <p className="mt-2 text-xl font-black text-white">
        {makeDeepDivePronunciationGuide(wordStudy?.transliteration)}
      </p>
    </div>
  ) : null}

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


type DeepDiveStrongDetailStudy = {
  sourceGloss?: string;
  lexiconMeaning?: string;
  strongs?: string;
  morphology?: string;
  originalWord?: string;
  transliteration?: string;
  pronunciation?: string;
};

function DeepDiveStrongDetailCard({
  study,
}: {
  study: DeepDiveStrongDetailStudy | null | undefined;
}) {
  if (!study) {
    return (
      <section className="deep-dive-strongs-detail-card mt-5 rounded-[1.5rem] border border-yellow-200/20 bg-yellow-300/[0.06] p-4 sm:p-5">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-yellow-100">
          Original-language detail
        </p>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
          No verified original-language word record is selected for this verse yet.
        </p>
      </section>
    );
  }

  const transliterationPronunciation = [study.transliteration, study.pronunciation]
    .filter(Boolean)
    .join(" · ");

  const detailRows = [
    { label: "Original word", value: study.originalWord },
    { label: "Transliteration / pronunciation", value: transliterationPronunciation },
    { label: "Source gloss", value: study.sourceGloss },
    { label: "Lexicon meaning", value: study.lexiconMeaning },
    { label: "Strong’s number", value: study.strongs },
    { label: "Morphology", value: study.morphology },
  ].filter((item): item is { label: string; value: string } =>
    Boolean(item.value && item.value.trim().length),
  );

  return (
    <section className="deep-dive-strongs-detail-card mt-5 rounded-[1.5rem] border border-emerald-200/15 bg-emerald-300/[0.06] p-4 sm:p-5">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-emerald-100">
        Strong’s / Lexicon Detail
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {detailRows.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
              {item.label}
            </p>
            <p className="mt-2 text-sm font-black leading-6 text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs font-semibold leading-6 text-slate-400">
        Verified local Strong’s and lexicon fields only. No AI interpretation is added here.
      </p>
    </section>
  );
}


type DeepDiveVisibleConcordanceStudy = {
  sourceGloss?: string;
  lexiconMeaning?: string;
  strongs?: string;
  morphology?: string;
  originalWord?: string;
  transliteration?: string;
  pronunciation?: string;
};

function DeepDiveVisibleConcordanceCard({
  study,
}: {
  study: DeepDiveVisibleConcordanceStudy | null | undefined;
}) {
  if (!study) {
    return (
      <section className="deep-dive-visible-concordance mt-5 rounded-[1.5rem] border border-yellow-200/20 bg-yellow-300/[0.06] p-4 text-left sm:p-5">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-yellow-100">
          Original-language detail
        </p>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
          No verified original-language word record is selected for this verse yet.
        </p>
      </section>
    );
  }

  const transliterationPronunciation = [study.transliteration, study.pronunciation]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="deep-dive-visible-concordance mt-5 rounded-[1.5rem] border border-amber-200/25 bg-amber-300/[0.07] p-4 text-left sm:p-5">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-amber-100">
        Strong’s Exhaustive Concordance
      </p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
        <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
          Full meaning
        </p>
        <p className="mt-2 text-base font-black leading-7 text-white">
          {study.lexiconMeaning || study.sourceGloss || "Not verified in this local record."}
        </p>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-black/25 p-4">
        <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
          Strong’s wording / source gloss
        </p>
        <p className="mt-2 text-base font-black leading-7 text-white">
          {study.sourceGloss || "Not verified in this local record."}
        </p>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
            Original word
          </p>
          <p className="mt-2 text-2xl font-black leading-7 text-white">
            {study.originalWord || "Not verified"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
            Transliteration / pronunciation
          </p>
          <p className="mt-2 text-sm font-black leading-6 text-white">
            {transliterationPronunciation || "Not verified"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
            Strong’s number
          </p>
          <p className="mt-2 text-sm font-black leading-6 text-white">
            {study.strongs || "Not verified"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
            Morphology
          </p>
          <p className="mt-2 text-sm font-black leading-6 text-white">
            {study.morphology || "Not verified in this local record."}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold leading-6 text-slate-400">
        Verified local Strong’s and lexicon fields only. No AI interpretation is added here.
      </p>
    </section>
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
              <h2 className="mt-2 text-2xl font-black leading-tight text-white">
                {meaning && normalizeStudyWord(meaning) !== normalizeStudyWord(selectedWordStudy.englishWord)
                  ? `${selectedWordStudy.englishWord} — ${meaning}`
                  : selectedWordStudy.englishWord}
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
            <details className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <summary className="cursor-pointer text-[0.68rem] font-black uppercase tracking-[0.2em] text-slate-400">
                Other verified words
              </summary>
              <div className="mt-4 flex flex-wrap gap-2">
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
            </details>
          ) : null}

          <section className="rounded-[1.25rem] border border-emerald-200/15 bg-emerald-300/[0.06] p-5">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-emerald-200">
              Original {languageName} Word
            </p>
            <p className="mt-3 break-words text-4xl font-black leading-tight text-white">
              {cleanOriginalScriptDisplay(selectedWordStudy.originalWord)}
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
        <DeepDiveVisibleConcordanceCard study={selectedWordStudy} />

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {strongsUrl ? (
              <a
                href={strongsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-emerald-200/25 bg-emerald-300/10 px-5 py-2 text-sm font-black text-emerald-50 transition hover:bg-emerald-300/15"
              >
                Strong’s
              </a>
            ) : null}

            <a
              href={verseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-sm font-black text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Verse
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
                Source data
              </a>
            ) : null}
          </details>
        </div>
      </div>
    </div>
  );
}

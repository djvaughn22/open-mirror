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

function cleanOriginalScriptDisplay(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0591-\u05BD\u05BF-\u05C7\u0300-\u036f]/g, "")
    .replace(/[\u25A0-\u25FF\uFFFD]/g, "")
    .normalize("NFC")
    .trim();
}

function cleanText(value?: string | null) {
  return String(value ?? "").trim();
}

function titleCase(value: string) {
  const cleaned = value.trim();

  if (!cleaned) return "";

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

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

function cleanSourceTransliteration(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return "";

  const finalSegment = trimmed.includes("/")
    ? trimmed.split("/").filter(Boolean).at(-1) ?? trimmed
    : trimmed;

  return finalSegment
    .replace(/[.]/g, "-")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/^[^A-Za-zΑ-ωא-ת]+/, "")
    .trim();
}

function buildTransliterationGuide(wordStudy: VerifiedWordStudy) {
  const fallback = getWordDetailFallback(wordStudy);

  if (fallback?.transliteration) {
    return fallback.transliteration;
  }

  return cleanSourceTransliteration(wordStudy.transliteration);
}

function buildPronunciationGuide(wordStudy: VerifiedWordStudy) {
  const fallback = getWordDetailFallback(wordStudy);

  if (wordStudy.pronunciation?.trim()) {
    return wordStudy.pronunciation.trim();
  }

  if (fallback?.pronunciation) {
    return fallback.pronunciation;
  }

  const transliteration = buildTransliterationGuide(wordStudy);

  if (!transliteration) return "";

  return transliteration
    .replace(/[./_]+/g, "-")
    .replace(/['’`]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function wordStudyKey(wordStudy: VerifiedWordStudy) {
  return [
    normalizeStudyWord(wordStudy.englishWord),
    cleanOriginalScriptDisplay(wordStudy.originalWord),
    wordStudy.strongs.trim().toUpperCase(),
    wordStudy.lemma.trim(),
    wordStudy.morphology.trim(),
  ].join("|");
}

function sameWordStudy(first: VerifiedWordStudy, second: VerifiedWordStudy) {
  return wordStudyKey(first) === wordStudyKey(second);
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

function DetailRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  const cleanValue = cleanText(value);

  if (!cleanValue && !children) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/70">
        {label}
      </p>
      <div className="mt-1 break-words text-sm font-semibold leading-relaxed text-white/90">
        {children ?? cleanValue}
      </div>
    </div>
  );
}

function SourceTextBlock({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  const cleanValue = cleanText(value);

  if (!cleanValue) return null;

  return (
    <section className="rounded-3xl border border-emerald-200/15 bg-emerald-300/[0.06] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/75">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-wrap break-words text-base font-bold leading-relaxed text-white">
        {cleanValue}
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

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const verifiedWordStudies = useMemo(() => {
    const seen = new Set<string>();
    const unique: VerifiedWordStudy[] = [];

    for (const study of wordStudies) {
      if (!hasSourceBackedFields(study)) continue;

      const key = wordStudyKey(study);

      if (seen.has(key)) continue;

      seen.add(key);
      unique.push(study);
    }

    return unique;
  }, [wordStudies]);

  const fallback = getWordDetailFallback(selectedWordStudy);
  const originalDisplay =
    cleanOriginalScriptDisplay(selectedWordStudy.originalWord) ||
    selectedWordStudy.originalWord.trim();
  const transliterationGuide = buildTransliterationGuide(selectedWordStudy);
  const pronunciationGuide = buildPronunciationGuide(selectedWordStudy);
  const strongsUrl = buildBibleHubStrongsUrl(selectedWordStudy.strongs);
  const sourceUrl = cleanText(selectedWordStudy.sourceUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 px-3 py-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Behind the Verse"
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/95 px-5 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-100/70">
                Behind the Verse
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
                Verified Strong&apos;s Data
              </h2>
              <p className="mt-1 text-xs font-bold text-white/55">
                {passage.label || selectedWordStudy.reference}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <section className="rounded-[1.75rem] border border-emerald-200/20 bg-gradient-to-br from-emerald-300/10 to-white/[0.03] p-5 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-emerald-100/75">
              English word
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-white">
              {titleCase(selectedWordStudy.englishWord)}
            </p>

            <div className="mx-auto mt-5 max-w-xl rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-5">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                Original word
              </p>
              <p className="mt-2 break-words text-4xl font-black leading-tight text-emerald-50">
                {originalDisplay}
              </p>

              {transliterationGuide ? (
                <p className="mt-3 text-lg font-black text-white">
                  {transliterationGuide}
                </p>
              ) : null}

              {pronunciationGuide ? (
                <p className="mt-2 text-sm font-bold text-emerald-100/80">
                  Pronunciation guide: {pronunciationGuide}
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {selectedWordStudy.strongs ? (
                strongsUrl ? (
                  <a
                    href={strongsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-4 py-2 text-xs font-black text-emerald-50 transition hover:bg-emerald-300/20"
                  >
                    {selectedWordStudy.strongs}
                  </a>
                ) : (
                  <span className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-4 py-2 text-xs font-black text-emerald-50">
                    {selectedWordStudy.strongs}
                  </span>
                )
              ) : null}

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-white/75">
                {originalLanguageName(selectedWordStudy.language)}
              </span>

              <a
                href={verseUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Open verse
              </a>
            </div>
          </section>

          <SourceTextBlock
            label="Source gloss"
            value={selectedWordStudy.sourceGloss}
          />

          <SourceTextBlock
            label="Lexicon meaning"
            value={fallback?.meaning || selectedWordStudy.lexiconMeaning}
          />

          <section className="grid gap-3 sm:grid-cols-2">
            <DetailRow label="Lemma" value={selectedWordStudy.lemma} />
            <DetailRow label="Morphology" value={selectedWordStudy.morphology} />
            <DetailRow label="Reference" value={selectedWordStudy.reference} />
            <DetailRow
              label="Source alignment"
              value={selectedWordStudy.sourceName}
            />
            <DetailRow
              label="Lexicon source"
              value={selectedWordStudy.lexiconSourceName}
            />
            <DetailRow label="Source URL">
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-100 underline decoration-emerald-200/40 underline-offset-4"
                >
                  {sourceUrl}
                </a>
              ) : null}
            </DetailRow>
          </section>

          {verifiedWordStudies.length > 1 ? (
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                Verified words in this verse
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {verifiedWordStudies.map((study) => {
                  const isSelected = sameWordStudy(study, selectedWordStudy);
                  const label = `${titleCase(study.englishWord)} · ${study.strongs}`;

                  return (
                    <button
                      key={wordStudyKey(study)}
                      type="button"
                      onClick={() => setSelectedWordStudy(study)}
                      className={[
                        "rounded-full border px-3 py-2 text-xs font-black transition",
                        isSelected
                          ? "border-emerald-200/40 bg-emerald-300/15 text-emerald-50"
                          : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-[11px] font-bold leading-relaxed text-white/50">
            Verified source fields only: alignment, Strong&apos;s number, lemma,
            morphology, source gloss, and lexicon meaning. No AI summary. No
            interpretation.
          </p>
        </div>
      </div>
    </div>
  );
}

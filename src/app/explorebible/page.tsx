"use client";

import { useEffect, useMemo, useState } from "react";
import { randomReferenceForSection } from "../../lib/bibleRandom";
import BibleVerseLookup from "../../components/BibleVerseLookup";
import OriginalWordStudyModal from "../../components/OriginalWordStudyModal";
import VerifiedVerseText from "../../components/VerifiedVerseText";
import {
  buildDeepDiveWordStudiesUrl,
  getDefaultWordStudy,
  hasVerifiedWordStudies,
  type VerifiedWordStudy,
  wordStudyLookupKey,
} from "../../lib/originalLanguageWordStudy";

type Passage = {
  label: string;
  code: string;
  chapter: string;
  verse: string;
  text: string;
};

type Section = {
  title: string;
  emoji: string;
  line: string;
  odds: string;
  gridClass?: string;
};

type OriginalLanguage = "hebrew" | "greek";

type ActiveWordStudy = {
  passage: Passage;
  wordStudy: VerifiedWordStudy;
};

const sections: Section[] = [
  {
    title: "Old Testament",
    emoji: "📜",
    line: "Open the story of promise, rescue, wisdom, prophets, and God’s faithfulness.",
    odds: "1 in 18,237",
  },
  {
    title: "Psalms",
    emoji: "🎶",
    line: "Pray, praise, cry out, worship, and hope through Scripture.",
    odds: "1 in 2,461",
  },
  {
    title: "Proverbs",
    emoji: "💡",
    line: "Find wisdom for words, choices, friendship, work, and the heart.",
    odds: "1 in 915",
  },
  {
    title: "Gospel",
    gridClass: "lg:col-start-2",
    emoji: "✝️",
    line: "Walk with Jesus through His words, works, cross, and resurrection.",
    odds: "1 in 3,779",
  },
  {
    title: "Epistles",
    gridClass: "lg:col-start-4",
    emoji: "✉️",
    line: "Read how the Church learns to live, love, serve, endure, and grow.",
    odds: "1 in 3,774",
  },
  {
    title: "Genesis",
    gridClass: "lg:col-start-2",
    emoji: "🌅",
    line: "The beginning: creation, fall, promise, covenant, and God’s story opening.",
    odds: "1 in 1,533",
  },
  {
    title: "Revelation",
    gridClass: "lg:col-start-4",
    emoji: "👑",
    line: "The end: worship, victory, restoration, and Jesus making all things new.",
    odds: "1 in 404",
  },
];
const CARD_TONES = [
  "border-emerald-200/15 bg-emerald-300/10",
  "border-yellow-200/15 bg-yellow-200/10",
  "border-red-200/15 bg-red-300/10",
  "border-sky-200/15 bg-sky-300/10",
  "border-lime-200/15 bg-lime-300/10",
  "border-orange-200/15 bg-orange-300/10",
  "border-violet-200/15 bg-violet-300/10",
];

function cardTone(index: number) {
  return CARD_TONES[index % CARD_TONES.length];
}

function randomPassage(section: Section, avoidLabel?: string) {
  return randomReferenceForSection(section.title, avoidLabel);
}

function buildPath(currentPath?: { section: Section; passage: Passage }[]) {
  return sections.map((section) => {
    const currentItem = currentPath?.find((item) => item.section.title === section.title);

    return {
      section,
      passage: randomPassage(section, currentItem?.passage.label),
    };
  });
}

function verseUrl(passage: Passage) {
  return `https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.${passage.verse}.WEBUS`;
}

function chapterUrl(passage: Passage) {
  return `https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.WEBUS`;
}

function hasVerifiedWordLinks(wordStudies: VerifiedWordStudy[]) {
  return hasVerifiedWordStudies(wordStudies);
}

function defaultOriginalLanguage(section: Section): OriginalLanguage {
  if (
    section.title === "Gospel" ||
    section.title === "Epistles" ||
    section.title === "Revelation"
  ) {
    return "greek";
  }

  return "hebrew";
}

function originalLanguageName(language: OriginalLanguage) {
  return language === "hebrew" ? "Hebrew" : "Greek";
}

function availableOriginalLanguages(sectionTitle: string): OriginalLanguage[] {
  if (
    sectionTitle === "Gospel" ||
    sectionTitle === "Epistles" ||
    sectionTitle === "Revelation"
  ) {
    return ["greek"];
  }

  return ["hebrew"];
}

function languageButtonClass(language: OriginalLanguage, activeLanguage: OriginalLanguage) {
  if (language === activeLanguage && language === "hebrew") {
    return "border-emerald-200/40 bg-emerald-300/15 text-emerald-100";
  }

  if (language === activeLanguage && language === "greek") {
    return "border-sky-200/40 bg-sky-300/15 text-sky-100";
  }

  return "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10";
}

export default function BibleExplorerPage() {
  const [path, setPath] = useState(() => buildPath());
  const [spinVersions, setSpinVersions] = useState(() => sections.map(() => 0));
  const [activeWordStudy, setActiveWordStudy] = useState<ActiveWordStudy | null>(null);
  const [wordStudiesByPassage, setWordStudiesByPassage] = useState<
    Record<string, VerifiedWordStudy[]>
  >({});

  const verseOfTheDayUrl = useMemo(() => {
    const today = new Date();
    const todayDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return `https://www.bible.com/verse-of-the-day`;
  }, []);

  function wordStudiesForPassage(passage: Passage) {
    return wordStudiesByPassage[wordStudyLookupKey(passage)] ?? [];
  }

  useEffect(() => {
    let cancelled = false;

    async function loadWordStudies() {
      const uniquePassages = new Map(
        path.map(({ passage }) => [wordStudyLookupKey(passage), passage]),
      );

      const entries = await Promise.all(
        [...uniquePassages.entries()].map(async ([key, passage]) => {
          try {
            const response = await fetch(buildDeepDiveWordStudiesUrl(passage));

            if (!response.ok) {
              return [key, []] as const;
            }

            const data = await response.json();

            return [
              key,
              Array.isArray(data.wordStudies) ? data.wordStudies : [],
            ] as const;
          } catch {
            return [key, []] as const;
          }
        }),
      );

      if (!cancelled) {
        setWordStudiesByPassage((current) => ({
          ...current,
          ...Object.fromEntries(entries),
        }));
      }
    }

    loadWordStudies();

    return () => {
      cancelled = true;
    };
  }, [path]);

  function spinAll() {
    setPath((current) => buildPath(current));
    setSpinVersions((current) => current.map((version) => version + 1));
  }

  function spinOne(index: number) {
    setPath((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              section: item.section,
              passage: randomPassage(item.section, item.passage.label),
            }
          : item,
      ),
    );

    setSpinVersions((current) =>
      current.map((version, itemIndex) =>
        itemIndex === index ? version + 1 : version,
      ),
    );
  }

  function openWordStudy(
    _section: Section,
    passage: Passage,
    selectedWordStudy?: VerifiedWordStudy,
  ) {
    const wordStudy =
      selectedWordStudy ?? getDefaultWordStudy(wordStudiesForPassage(passage));

    if (!wordStudy) {
      return;
    }

    setActiveWordStudy({
      passage,
      wordStudy,
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <nav className="grid grid-cols-3 items-center">
          <a href="/home" className="justify-self-start font-bold">
            Cross Heart Pray
          </a>

          <a
            href={verseOfTheDayUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open today's Bible verse"
            className="justify-self-center"
          >
            <img
              src="/brand/youversion-bible-app.png"
              alt="Holy Bible"
              className="h-10 w-10 rounded-lg"
            />
          </a>

          <details className="relative justify-self-end text-sm text-zinc-400">
            <summary className="cursor-pointer list-none text-2xl leading-none">
              ☰
            </summary>

            <div className="absolute right-0 z-50 mt-4 flex w-56 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right shadow-2xl">
              <a href="/home">Home</a>
              <a href="/cross">Cross</a>
              <a href="/heart">Heart</a>
              <a href="/pray">Pray</a>
              <a href="/explorebible">Holy Bible Explorer</a>
              <a href="https://www.bibleportal.com/" target="_blank" rel="noopener noreferrer">
                Bible Portal
              </a>
              <a href="/about">About</a>
            </div>
          </details>
        </nav>

        <section className="mx-auto max-w-5xl py-24 text-center">
          <p className="mb-8 flex items-center justify-center gap-8 text-6xl md:gap-14 md:text-7xl">
            <span>✝️</span>
            <span>❤️</span>
            <span>🙏</span>
          </p>

          <p className="mb-5 inline-flex rounded-full border border-white/15 bg-black/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
            Bible Bingo
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Holy Bible Explorer
          </h1>

          <p className="mx-auto mt-8 max-w-4xl text-2xl font-semibold leading-snug text-zinc-300 md:text-4xl">
            Open the Bible. Pick a square. Read the verse. Explore the chapter.
          </p>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
            Old Testament. Psalms. Proverbs. Gospel. Epistles. Genesis and
            Revelation side by side — the beginning and the end, with Jesus at
            the center.
          </p>

          <p className="mx-auto mt-5 max-w-2xl rounded-full border border-emerald-200/15 bg-emerald-300/10 px-5 py-2 text-sm font-semibold text-emerald-100">
            *Deep Dive opens when a verse has verified original-language word links.
          </p>

          <button
            type="button"
            onClick={spinAll}
            className="mt-10 rounded-full border border-white/15 bg-white/10 px-8 py-3 font-semibold text-slate-100 transition hover:bg-white/15"
          >
            New Bible Bingo Board
          </button>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {path.map(({ section, passage }, index) => (
            <article
              key={`${section.title}-${spinVersions[index]}`}
              className={`rounded-[2rem] border p-8 text-center text-slate-100 lg:col-span-2 ${section.gridClass ?? ""} ${cardTone(index)} ${spinVersions[index] > 0 ? "bible-card-spin" : ""}`}
              style={{
                minHeight: "340px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="text-5xl">{section.emoji}</div>

              <h2 className="mt-6 text-2xl font-bold">{section.title}</h2>

              <p className="mt-4 leading-7 text-slate-300">{section.line}</p>

              <p className="mt-6 text-2xl font-bold text-slate-100">
                {passage.label}
              </p>

              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-200">
                <VerifiedVerseText
                  passage={passage}
                  wordStudies={wordStudiesForPassage(passage)}
                  onWordClick={(wordStudy) => openWordStudy(section, passage, wordStudy)}
                />
              </p>

              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                <a
                  href={verseUrl(passage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/30"
                >View Verse in Bible App</a>

                <a
                  href={chapterUrl(passage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/30"
                >View Chapter in Bible App</a>

                <button
                  type="button"
                  onClick={() => openWordStudy(section, passage)}
                  disabled={!hasVerifiedWordLinks(wordStudiesForPassage(passage))}
                  title={
                    hasVerifiedWordLinks(wordStudiesForPassage(passage))
                      ? "Open verified original-language word study"
                      : "Deep Dive opens when this verse has verified underlined word links."
                  }
                  className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-5 py-2 text-sm font-semibold text-emerald-100 shadow-sm transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:border-zinc-700/70 disabled:bg-zinc-800/70 disabled:text-zinc-500 disabled:shadow-none disabled:hover:bg-zinc-800/70"
                >
                  Deep Dive*
                </button>
              </div>

              <button
                type="button"
                onClick={() => spinOne(index)}
                className="mt-4 text-sm font-semibold text-slate-200 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                Pick another {section.title}
              </button>

              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Odds: {section.odds}
              </p>
            </article>
          ))}
        </section>

        {activeWordStudy && (
          <OriginalWordStudyModal
            passage={activeWordStudy.passage}
            wordStudy={activeWordStudy.wordStudy}
            verseUrl={verseUrl(activeWordStudy.passage)}
            onClose={() => setActiveWordStudy(null)}
          />
        )}

        <BibleVerseLookup className="mt-8" />

        <section className="mt-10 px-4 py-8 sm:mt-14 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-7 text-left shadow-xl sm:px-8">
            <div className="text-center">
              <p className="text-3xl">✝️ ❤️ 🙏</p>

              <h2 className="mt-4 text-2xl font-bold text-white">
                Bible Bingo friends
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Roll a card. Read the verse. Open the chapter. Keep going.
              </p>
            </div>

            <ul className="mt-6 list-disc space-y-3 pl-5 text-sm leading-7 text-slate-300">
              <li>
                Each card rolls one verse from its own section of the Holy Bible.
              </li>
              <li>
                The cards use a local complete Bible library, so they load fast.
              </li>
              <li>
                The odds show the size of that section&apos;s verse pool.
              </li>
              <li>
                Use the Bible app buttons below: View Verse opens this exact verse. View Chapter opens the full chapter.
              </li>
            </ul>
          </div>
        </section>

        <footer className="border-t border-zinc-900 px-8 py-10 text-center text-sm text-zinc-500">
          <p>© 2026 Open Mirror LLC. Follow Jesus. Love God. Pray.</p>

          <div className="mx-auto mt-6 max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-left text-xs leading-6 text-zinc-500">
            <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
              Bible Bingo receipts
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-center text-zinc-400">
              Quick version: the cards roll from a full local Bible verse library.
              The words on the card are already in the app before you tap anything.
              Deep Dive only unlocks when the original-language match can be verified.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-bold text-zinc-300">Bible text on the cards</p>
                <p className="mt-2">
                  The card text uses the public domain World English Bible, American
                  English Edition, without Strong&apos;s Numbers (WEBUS), courtesy of
                  eBible.org. View Verse in Bible App and View Chapter in Bible App point to the same
                  WEBUS version in the Holy Bible app.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-bold text-zinc-300">Local verse library</p>
                <p className="mt-2">
                  31,103 / 31,103 verse records are stored locally in the app.
                  Each record carries its book, Bible book code, chapter, verse,
                  reference label, verse text, and Bible Bingo lane.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2">
                <p className="font-bold text-zinc-300">The roll</p>
                <p className="mt-2">
                  Each square rolls one verse from its own local lane. That keeps the
                  board balanced: wisdom can show up, Psalms can breathe, the Gospel
                  stays easy to find, and Genesis and Revelation stay side by side.
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <p>Old Testament: 1 / 18,237 ≈ 0.0055%</p>
                  <p>Psalms: 1 / 2,461 ≈ 0.0406%</p>
                  <p>Proverbs: 1 / 915 ≈ 0.1093%</p>
                  <p>Gospel: 1 / 3,779 ≈ 0.0265%</p>
                  <p>Epistles: 1 / 3,774 ≈ 0.0265%</p>
                  <p>Genesis: 1 / 1,533 ≈ 0.0652%</p>
                  <p>Revelation: 1 / 404 ≈ 0.2475%</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2">
                <p className="font-bold text-zinc-300">Deep Dive trust rule</p>
                <p className="mt-2">
                  Deep Dive is for the original Bible languages behind the verse:
                  Hebrew for Old Testament cards and Greek for New Testament cards.
                  A word only gets underlined when a trusted local source can connect
                  that exact English word in that exact verse to original-language
                  data such as Strong&apos;s number, lemma, morphology, transliteration,
                  or verified alignment. If the match is not proven, the word stays
                  plain and Deep Dive stays locked.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes bible-card-axis-spin {
          0% {
            opacity: 0.85;
            transform: perspective(900px) rotateY(0deg) scale(0.98);
          }

          45% {
            opacity: 0.45;
            transform: perspective(900px) rotateY(88deg) scale(0.96);
          }

          100% {
            opacity: 1;
            transform: perspective(900px) rotateY(360deg) scale(1);
          }
        }

        .bible-card-spin {
          animation: bible-card-axis-spin 700ms ease-in-out;
          transform-origin: center;
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .bible-card-spin {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  bibleBingoBoardIdFromPassages,
  randomReferenceForSection,
} from "../../lib/bibleRandom";
import BibleVerseLookup from "../../components/BibleVerseLookup";
import OriginalWordStudyModal from "../../components/OriginalWordStudyModal";
import VerifiedVerseText from "../../components/VerifiedVerseText";
import BibleBingoShareMenu from "../../components/BibleBingoShareMenu";
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
  const [spinningCards, setSpinningCards] = useState(() => sections.map(() => false));
  const [spinDelays, setSpinDelays] = useState(() => sections.map(() => 0));
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

  const boardId = useMemo(
    () => bibleBingoBoardIdFromPassages(path.map(({ passage }) => passage)),
    [path],
  );
  const boardPath = `/bible-bingo/${boardId}`;
  const boardUrl = `https://crossheartpray.com${boardPath}`;
  const boardShareText = [
    "I dealt 7 Bible Bingo cards.",
    "",
    "Which card should we explore?",
    "",
    boardUrl,
  ].join("\n");
  const boardShareSubject = "My Bible Bingo board";

  const boardHtmlEmail = `
    <div style="font-family: Arial, Helvetica, sans-serif; background: #f1f5f9; color: #0f172a; padding: 28px 12px;">
      <div style="max-width: 720px; margin: 0 auto;">
        <p style="font-size: 34px; text-align: center; margin: 0 0 14px;">✝️ ❤️ 🙏</p>
        <h1 style="font-family: Georgia, 'Times New Roman', serif; text-align: center; margin: 0; font-size: 34px; line-height: 1.15; color: #0f172a;">Bible Bingo Board</h1>
        <p style="text-align: center; color: #475569; font-size: 16px; line-height: 1.6; max-width: 560px; margin-left: auto; margin-right: auto;">
          Same 7 cards. Explore and share.
        </p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${boardUrl}" style="display: inline-block; background: #059669; color: #ffffff; padding: 13px 22px; border-radius: 999px; text-decoration: none; font-weight: 800; font-family: Arial, Helvetica, sans-serif; font-size: 15px;">
            Open Bible Bingo Board
          </a>
        </p>
        ${path.map(({ section, passage }, index) => `
          <div style="border: 1px solid #dbe3ee; border-radius: 18px; padding: 22px; margin: 16px 0; background: #ffffff;">
            <p style="font-size: 30px; text-align: center; margin: 0 0 8px;">${section.emoji}</p>
            <h2 style="font-family: Arial, Helvetica, sans-serif; text-align: center; margin: 8px 0 6px; font-size: 13px; line-height: 1.4; letter-spacing: 0.12em; text-transform: uppercase; color: #047857;">${section.title}</h2>
            <p style="font-family: Georgia, 'Times New Roman', serif; text-align: center; color: #0f172a; font-weight: bold; font-size: 24px; line-height: 1.25; margin: 10px 0 14px;">${passage.label}</p>
            <p style="font-family: Georgia, 'Times New Roman', serif; color: #334155; line-height: 1.7; font-size: 17px;">${passage.text}</p>
            <p style="text-align: center;">
              <a href="${verseUrl(passage)}" style="color: #065f46; font-weight: bold; text-decoration: none;">Verse</a>
              &nbsp; | &nbsp;
              <a href="${chapterUrl(passage)}" style="color: #065f46; font-weight: bold; text-decoration: none;">Chapter</a>
              &nbsp; | &nbsp;
              <a href="${boardUrl}?card=${index + 1}" style="color: #065f46; font-weight: bold; text-decoration: none;">Card</a>
            </p>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  function cardHtmlEmail(section: Section, passage: Passage, index: number) {
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; background: #f1f5f9; color: #0f172a; padding: 28px 12px;">
        <div style="max-width: 560px; margin: 0 auto;">
          <p style="font-size: 32px; text-align: center; margin: 0 0 12px;">${section.emoji}</p>
          <h1 style="font-family: Georgia, 'Times New Roman', serif; text-align: center; margin: 0; font-size: 30px; line-height: 1.15; color: #0f172a;">${section.title} Bible Bingo Card</h1>
          <p style="font-family: Georgia, 'Times New Roman', serif; text-align: center; color: #0f172a; font-weight: bold; font-size: 24px; line-height: 1.25; margin: 18px 0 12px;">${passage.label}</p>
          <div style="border: 1px solid #dbe3ee; border-radius: 18px; padding: 22px; margin: 16px 0; background: #ffffff;">
            <p style="font-family: Georgia, 'Times New Roman', serif; color: #334155; line-height: 1.7; font-size: 17px;">${passage.text}</p>
            <p style="text-align: center; margin: 22px 0 0;">
              <a href="${boardUrl}?card=${index + 1}" style="color: #065f46; font-weight: bold; text-decoration: none;">Open Live Card</a>
              &nbsp; | &nbsp;
              <a href="${verseUrl(passage)}" style="color: #065f46; font-weight: bold; text-decoration: none;">Verse</a>
              &nbsp; | &nbsp;
              <a href="${chapterUrl(passage)}" style="color: #065f46; font-weight: bold; text-decoration: none;">Chapter</a>
            </p>
          </div>
          <p style="text-align: center; color: #64748b; font-size: 13px; line-height: 1.6;">
            Cross Heart Pray · 7 Card Bible Bingo
          </p>
        </div>
      </div>
    `;
  }

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

  function revealBibleBingoCards(nextPath: typeof path, cardIndexes: number[]) {
    const delays = sections.map(() => 0);

    cardIndexes.forEach((cardIndex, dealIndex) => {
      delays[cardIndex] = dealIndex * 105;
    });

    setSpinDelays(delays);

    setSpinVersions((current) =>
      current.map((version, index) => (cardIndexes.includes(index) ? version + 1 : version)),
    );

    setSpinningCards((current) =>
      current.map((isSpinning, index) => (cardIndexes.includes(index) ? true : isSpinning)),
    );

    cardIndexes.forEach((cardIndex, dealIndex) => {
      const dealDelay = dealIndex * 105;

      window.setTimeout(() => {
        setPath((currentPath) =>
          currentPath.map((item, itemIndex) =>
            itemIndex === cardIndex ? nextPath[itemIndex] ?? item : item,
          ),
        );
      }, dealDelay + 430);

      window.setTimeout(() => {
        setSpinningCards((current) =>
          current.map((isSpinning, index) => (index === cardIndex ? false : isSpinning)),
        );
      }, dealDelay + 980);
    });
  }

  function spinAll() {
    revealBibleBingoCards(
      buildPath(),
      sections.map((_, index) => index),
    );
  }


  function spinOne(index: number) {
    const freshPath = buildPath();
    const nextPath = path.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            passage: freshPath[itemIndex]?.passage ?? item.passage,
          }
        : item,
    );

    revealBibleBingoCards(nextPath, [index]);
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
              <a href="/explorebible">Bible Bingo</a>
              <a href="/daily-hope">Daily Hope</a>
              <a href="/about">About</a>
            </div>
          </details>
        </nav>

        <section className="mx-auto max-w-5xl pt-10 pb-6 text-center sm:pt-12 sm:pb-8">
          <p className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-black uppercase tracking-[0.14em] text-zinc-300 sm:text-base">
            <span className="inline-flex items-center gap-1.5"><span className="text-2xl">✝️</span><span>Cross</span></span>
            <span className="inline-flex items-center gap-1.5"><span className="text-2xl">❤️</span><span>Heart</span></span>
            <span className="inline-flex items-center gap-1.5"><span className="text-2xl">🙏</span><span>Pray</span></span>
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Bible Bingo 7
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-zinc-400">
            Deep Dive on original Hebrew and Greek when available.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={spinAll}
              className="text-center justify-center items-center inline-flex rounded-full border border-white/15 bg-white/10 px-7 py-3 font-semibold text-slate-100 transition hover:bg-white/15"
            >Deal 7 Cards</button>

            <BibleBingoShareMenu
              boardHref={boardPath}
              boardUrl={boardUrl}
              shareText={boardShareText}
              emailSubject={boardShareSubject}
              htmlEmail={boardHtmlEmail}
              buttonLabel="Share board"
            />
          </div>
        </section>

        <p className="mb-4 text-center text-sm font-semibold text-slate-400">
          Deep Dive opens when verified word details are available.
        </p>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {path.map(({ section, passage }, index) => (
            <article
              id={`card-${index + 1}`}
              key={`${section.title}-${spinVersions[index]}`}
              className={`relative overflow-hidden rounded-[1.5rem] border p-5 text-center text-slate-100 lg:col-span-2 sm:p-6 ${section.gridClass ?? ""} ${cardTone(index)} ${spinVersions[index] > 0 ? "bible-card-spin" : ""} ${spinningCards[index] ? "bible-card-is-spinning" : ""}`}
              style={{
                minHeight: "285px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animationDelay: spinningCards[index] ? `${spinDelays[index]}ms` : "0ms",
              }}
            >

              <div className="absolute right-4 top-4">
                <BibleBingoShareMenu
                  boardHref={`${boardPath}?card=${index + 1}`}
                  boardUrl={`${boardUrl}?card=${index + 1}`}
                  shareText={[
                    `I dealt this ${section.title} Bible Bingo card on Cross Heart Pray.`,
                    "",
                    passage.label,
                    passage.text,
                    "",
                    "Open this card:",
                    `${boardUrl}?card=${index + 1}`,
                    "",
                    "Open in the Holy Bible app:",
                    verseUrl(passage),
                    "",
                    "Read the chapter:",
                    chapterUrl(passage),
                  ].join("\n")}
                  emailSubject={`${passage.label} Bible Bingo card`}
                  htmlEmail={cardHtmlEmail(section, passage, index)}
                  align="right"
                  itemLabel="card"
                  buttonLabel={`Share ${section.title} card`}
                  iconOnly
                />
              </div>

              <div className="text-4xl">{section.emoji}</div>

              <h2 className="mt-4 text-xl font-bold">{section.title}</h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">{section.line}</p>

              <p className="mt-4 text-xl font-bold text-slate-100">
                {passage.label}
              </p>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-200">
                <VerifiedVerseText
                  passage={passage}
                  wordStudies={wordStudiesForPassage(passage)}
                  onWordClick={(wordStudy) => openWordStudy(section, passage, wordStudy)}
                />
              </p>

              <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
                <a
                  href={verseUrl(passage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center justify-center items-center inline-flex rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/30"
                >Verse</a>

                <a
                  href={chapterUrl(passage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center justify-center items-center inline-flex rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/30"
                >Chapter</a>

                <button
                  type="button"
                  onClick={() => openWordStudy(section, passage)}
                  disabled={!hasVerifiedWordLinks(wordStudiesForPassage(passage))}
                  title={
                    hasVerifiedWordLinks(wordStudiesForPassage(passage))
                      ? "Open verified original-language word study"
                      : "Deep Dive opens when this verse has verified underlined word links."
                  }
                  className="text-center justify-center items-center inline-flex rounded-full border border-emerald-200/20 bg-emerald-300/10 px-5 py-2 text-sm font-semibold text-emerald-100 shadow-sm transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:border-zinc-700/70 disabled:bg-zinc-800/70 disabled:text-zinc-500 disabled:shadow-none disabled:hover:bg-zinc-800/70"
                >
                  Deep Dive
                </button>
              </div>

              <button
                type="button"
                onClick={() => spinOne(index)}
                className="mt-4 text-sm font-semibold text-slate-200 underline decoration-white/30 underline-offset-4 hover:text-white"
              >Deal this card</button>

              <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
                Shuffled from: <span className="text-white">{section.odds}</span>
              </p>
            </article>
          ))}
        </section>

        {activeWordStudy && (
          <OriginalWordStudyModal
            passage={activeWordStudy.passage}
            wordStudy={activeWordStudy.wordStudy}
            wordStudies={wordStudiesForPassage(activeWordStudy.passage)}
            verseUrl={verseUrl(activeWordStudy.passage)}
            onClose={() => setActiveWordStudy(null)}
          />
        )}

        <BibleVerseLookup className="mt-8" />

        <section className="mt-8 border-t border-zinc-900 px-4 py-8 text-center">
          <h2 className="text-xl font-bold text-white">How it works</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Every board opens a fresh path through the Bible. Verse opens the exact
            verse. Chapter opens the full chapter. Deep Dive opens when verified
            Hebrew or Greek word details are available.
          </p>
        </section>

        <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
          © 2026 Open Mirror LLC. Follow Jesus. Love God. Pray.
        </footer>
      </div>

      <style>{`
        @keyframes bible-card-axis-spin {
          0% {
            opacity: 1;
            transform: perspective(1000px) translate3d(-36px, -54px, 0) rotateY(-10deg) rotateZ(-5.5deg) scale(0.93);
          }

          18% {
            transform: perspective(1000px) translate3d(-16px, -25px, 0) rotateY(38deg) rotateZ(-2.4deg) scale(0.985);
          }

          42% {
            transform: perspective(1000px) translate3d(10px, 5px, 0) rotateY(104deg) rotateZ(1.6deg) scale(1.012);
          }

          60% {
            transform: perspective(1000px) translate3d(-7px, -3px, 0) rotateY(238deg) rotateZ(-1.1deg) scale(0.992);
          }

          82% {
            transform: perspective(1000px) translate3d(4px, -5px, 0) rotateY(335deg) rotateZ(0.7deg) scale(1.01);
          }

          100% {
            opacity: 1;
            transform: perspective(1000px) translate3d(0, 0, 0) rotateY(360deg) rotateZ(0deg) scale(1);
          }
        }

        @keyframes bible-card-back-face {
          0% {
            opacity: 0;
            transform: scale(0.985);
          }

          14% {
            opacity: 0.94;
            transform: scale(1);
          }

          76% {
            opacity: 0.94;
            transform: scale(1);
          }

          94% {
            opacity: 0;
            transform: scale(1.015);
          }

          100% {
            opacity: 0;
            transform: scale(1.015);
          }
        }

        @keyframes bible-card-soft-sheen {
          0% {
            opacity: 0;
            transform: translateX(-135%) rotate(12deg);
          }

          28% {
            opacity: 0.32;
          }

          100% {
            opacity: 0;
            transform: translateX(135%) rotate(12deg);
          }
        }

        .bible-card-spin {
          animation-name: bible-card-axis-spin;
          animation-duration: 980ms;
          animation-timing-function: cubic-bezier(0.16, 0.86, 0.24, 1.08);
          animation-fill-mode: both;
          transform-origin: center;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change: transform, opacity;
        }

        .bible-card-is-spinning {
          box-shadow:
            0 0 0 1px rgb(255 255 255 / 0.08),
            0 20px 50px rgb(16 185 129 / 0.16);
        }

        .bible-card-is-spinning::before {
          content: "✝️  ❤️  🙏";
          position: absolute;
          inset: 0;
          z-index: 18;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1.5rem;
          border: 1px solid rgb(255 255 255 / 0.14);
          background:
            radial-gradient(circle at 20% 18%, rgb(255 255 255 / 0.14), transparent 31%),
            radial-gradient(circle at 78% 24%, rgb(52 211 153 / 0.16), transparent 34%),
            repeating-linear-gradient(
              135deg,
              rgb(255 255 255 / 0.035) 0,
              rgb(255 255 255 / 0.035) 8px,
              transparent 8px,
              transparent 18px
            ),
            linear-gradient(135deg, rgb(15 23 42 / 0.98), rgb(6 78 59 / 0.95), rgb(30 41 59 / 0.98));
          color: rgb(240 253 250);
          font-size: 2.15rem;
          letter-spacing: 0.28rem;
          pointer-events: none;
          animation-name: bible-card-back-face;
          animation-duration: 980ms;
          animation-timing-function: ease-in-out;
          animation-fill-mode: both;
          animation-delay: inherit;
        }

        .bible-card-is-spinning::after {
          content: "";
          position: absolute;
          top: -20%;
          bottom: -20%;
          left: 0;
          z-index: 19;
          width: 34%;
          background: linear-gradient(
            90deg,
            transparent,
            rgb(255 255 255 / 0.16),
            transparent
          );
          pointer-events: none;
          animation-name: bible-card-soft-sheen;
          animation-duration: 720ms;
          animation-timing-function: ease-in-out;
          animation-fill-mode: both;
          animation-delay: inherit;
        }

        @media (prefers-reduced-motion: reduce) {
          .bible-card-spin,
          .bible-card-is-spinning::before,
          .bible-card-is-spinning::after {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}

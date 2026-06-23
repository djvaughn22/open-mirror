"use client";

import SiteFooter from "../../components/SiteFooter";


import SiteHeader from "../../components/SiteHeader";

import { useEffect, useMemo, useState } from "react";
import {
  bibleBingoBoardIdFromPassages,
  bibleBingoOddsForSection,
  randomReferenceForSection,
  seededReferenceForSection,
} from "../../lib/bibleRandom";
import { bibleReadingPlanHrefForReference, bibleReadingPlanLabelForReference } from "../../lib/bibleReadingPlan";
import LazyBibleVerseLookup from "../../components/LazyBibleVerseLookup";
import OriginalWordStudyModal from "../../components/OriginalWordStudyModal";
import VerifiedVerseText from "../../components/VerifiedVerseText";
import BibleBingoShareMenu from "../../components/BibleBingoShareMenu";
import CentralTimeBadge from "../../components/CentralTimeBadge";
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
    title: "Sunday — Epistles",
    emoji: "✉️",
    line: "Letters to the Church: faith, grace, love, endurance, and life in Christ.",
    odds: "Sunday • Epistles",
  },
  {
    title: "Monday — Law",
    emoji: "📜",
    line: "The beginning, covenant, commandments, rescue, worship, and God’s holy way.",
    odds: "Monday • Law",
  },
  {
    title: "Tuesday — History",
    emoji: "🏛️",
    line: "God’s people in real stories of courage, failure, mercy, kings, and return.",
    odds: "Tuesday • History",
  },
  {
    title: "Wednesday — Psalms",
    emoji: "🎶",
    line: "Prayer, praise, lament, worship, hope, and honest words with God.",
    odds: "Wednesday • Psalms",
  },
  {
    title: "Thursday — Poetry",
    emoji: "💡",
    line: "Wisdom, suffering, words, choices, work, wonder, and the heart.",
    odds: "Thursday • Poetry",
  },
  {
    title: "Friday — Prophecy",
    emoji: "🔥",
    line: "Warnings, promises, restoration, justice, hope, and God making all things new.",
    odds: "Friday • Prophecy",
  },
  {
    title: "Saturday — Gospels",
    emoji: "✝️",
    line: "Walk with Jesus through His words, works, cross, and resurrection.",
    odds: "Saturday • Gospels",
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

function centralDateSeed() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("year")}-${value("month")}-${value("day")}`;
}

function splitBibleBingoSectionTitle(title: string) {
  const parts = title.split("—").map((part) => part.trim()).filter(Boolean);

  if (parts.length >= 2) {
    return {
      dayLabel: parts[0],
      title: parts.slice(1).join(" — "),
    };
  }

  return {
    dayLabel: "",
    title,
  };
}

function shortBibleBingoSectionLine(title: string) {
  const cleanTitle = splitBibleBingoSectionTitle(title).title.toLowerCase();

  if (cleanTitle.includes("law")) return "Law and covenant.";
  if (cleanTitle.includes("history")) return "God’s people.";
  if (cleanTitle.includes("psalms")) return "Prayer and praise.";
  if (cleanTitle.includes("poetry")) return "Wisdom and wonder.";
  if (cleanTitle.includes("prophecy")) return "Warning and hope.";
  if (cleanTitle.includes("gospels")) return "Jesus and good news.";
  if (cleanTitle.includes("epistles")) return "Letters for faith.";

  return "Open Scripture.";
}

function centralDayIndex() {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
  }).format(new Date());

  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ].indexOf(weekday);
}

function displayIndexesStartingWith(startIndex: number) {
  const safeStart = startIndex >= 0 ? startIndex : 0;

  return sections.map((_, offset) => (safeStart + offset) % sections.length);
}

function oddsText(section: Section) {
  return `${section.odds} · ${bibleBingoOddsForSection(section.title).label}`;
}

function buildDailyPath() {
  const seed = centralDateSeed();

  return sections.map((section) => ({
    section,
    passage: seededReferenceForSection(section.title, seed),
  }));
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
  if (section.title.includes("Epistles") || section.title.includes("Gospels")) {
    return "greek";
  }

  return "hebrew";
}

function originalLanguageName(language: OriginalLanguage) {
  return language === "hebrew" ? "Hebrew" : "Greek";
}

function availableOriginalLanguages(sectionTitle: string): OriginalLanguage[] {
  if (sectionTitle.includes("Epistles") || sectionTitle.includes("Gospels")) {
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
  const [path, setPath] = useState(() => buildDailyPath());
  const [spinVersions, setSpinVersions] = useState(() => sections.map(() => 0));
  const [spinningCards, setSpinningCards] = useState(() => sections.map(() => false));
  const [spinDelays, setSpinDelays] = useState(() => sections.map(() => 0));
  const [focusedCardIndex, setFocusedCardIndex] = useState(() => centralDayIndex());
  const [focusedFlipVersion, setFocusedFlipVersion] = useState(0);
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


  function revealDailyBoardOnOpen() {
    revealBibleBingoCards(
      path,
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


  function focusDayCard(index: number) {
    setFocusedFlipVersion((version) => version + 1);
    setFocusedCardIndex(index);
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      revealDailyBoardOnOpen();
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  const focusedIndex = path[focusedCardIndex] ? focusedCardIndex : 0;
  const focusedCard = path[focusedIndex] ?? path[0];
  const focusedTitle = focusedCard ? splitBibleBingoSectionTitle(focusedCard.section.title) : null;
  const todayStartIndex = centralDayIndex();
  const displayIndexes = displayIndexesStartingWith(todayStartIndex);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteHeader />

        <section className="mx-auto max-w-5xl pt-10 pb-6 text-center sm:pt-12 sm:pb-8">
          <p className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-black uppercase tracking-[0.14em] text-zinc-300 sm:text-base">
            <span className="inline-flex items-center gap-1.5"><span className="text-2xl">✝️</span><span>Cross</span></span>
            <span className="inline-flex items-center gap-1.5"><span className="text-2xl">❤️</span><span>Heart</span></span>
            <span className="inline-flex items-center gap-1.5"><span className="text-2xl">🙏</span><span>Pray</span></span>
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Bible Bingo 7
          </h1>

          <CentralTimeBadge className="mt-5" showReadingPlan={false} />

          <p className="mx-auto mt-5 max-w-2xl text-sm font-bold leading-7 text-slate-300 sm:text-base">
            Deal 7 cards. See where they land. Read and fill the 52-week board.
          </p>


          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={spinAll}
              className="text-center justify-center items-center inline-flex rounded-full border border-white/15 bg-white/10 px-7 py-3 font-semibold text-slate-100 transition hover:bg-white/15"
            >Deal 7</button>

            <BibleBingoShareMenu
              boardHref={boardPath}
              boardUrl={boardUrl}
              shareText={boardShareText}
              emailSubject={boardShareSubject}
              htmlEmail={boardHtmlEmail}
              buttonLabel="Share"
              enableSignature
            />

            <a
              href="/bible-reading-plan"
              className="text-center justify-center items-center inline-flex rounded-full border border-emerald-200/25 bg-emerald-300/10 px-7 py-3 font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
            >
              Bible Reading Plan
            </a>
          </div>
        </section>


        <section className="mt-4">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.035] px-4 py-6 shadow-2xl shadow-black/25 sm:px-6 sm:py-8">
            <p className="text-center text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              Choose a day card
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
              {displayIndexes.map((cardIndex) => {
                const item = path[cardIndex];

                if (!item) {
                  return null;
                }

                const { section, passage } = item;
                const index = cardIndex;
                const isFocused = index === focusedIndex;
                const cardTitle = splitBibleBingoSectionTitle(section.title);
                const cardSummary = shortBibleBingoSectionLine(section.title);

                return (
                  <button
                    type="button"
                    key={`${section.title}-${passage.label}-${index}`}
                    onClick={() => focusDayCard(index)}
                    aria-pressed={isFocused}
                    aria-busy={spinningCards[index]}
                    className={`relative bible-bingo-deck-card flex min-h-[260px] flex-col overflow-hidden rounded-[1.5rem] border p-4 text-center shadow-xl transition duration-200 hover:-translate-y-1 ${cardTone(index)} ${spinVersions[index] > 0 ? "bible-card-spin" : ""} ${spinningCards[index] ? "bible-card-is-spinning" : ""} ${
                      isFocused
                        ? "border-white/50 bg-white/15 ring-2 ring-white/25"
                        : "border-white/10 opacity-90 hover:opacity-100"
                    }`}
                    style={{
                      animationDelay: spinningCards[index] ? `${spinDelays[index]}ms` : "0ms",
                    }}
                  >
                    <div className="flex justify-center gap-2 text-lg" aria-hidden="true">
                      <span>✝️</span>
                      <span>❤️</span>
                      <span>🙏</span>
                    </div>

                    <p className="mt-3 text-[0.72rem] font-black uppercase tracking-[0.24em] text-emerald-100">
                      {cardTitle.dayLabel}
                    </p>

                    <div className="mt-3 text-3xl">{section.emoji}</div>

                    <h2 className="mt-2 text-base font-black leading-5 text-white">
                      {cardTitle.title}
                    </h2>

                    <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2">
                      <p className="text-[0.56rem] font-black uppercase tracking-[0.16em] text-slate-400">
                        Day Theme
                      </p>
                      <p className="mt-1 text-[0.68rem] font-bold leading-5 text-slate-200">
                        {cardSummary}
                      </p>
                    </div>

                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-left">
                      <p className="text-[0.56rem] font-black uppercase tracking-[0.16em] text-slate-400">
                        Verse
                      </p>
                      <p className="mt-1 text-xs font-black leading-5 text-white">
                        {passage.label}
                      </p>
                      <p className="bible-card-verse-preview mt-2 text-[0.72rem] font-semibold leading-5 text-slate-100/90">
                        {passage.text}
                      </p>
                    </div>

                    <p className="mt-3 text-[0.62rem] font-black uppercase tracking-[0.14em] text-emerald-100">
                      {bibleBingoOddsForSection(section.title).label}
                    </p>

                    <p className={`mt-auto rounded-full border px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] ${
                      isFocused
                        ? "border-white/25 bg-white/20 text-white"
                        : "border-white/10 bg-black/15 text-slate-300"
                    }`}>
                      {isFocused ? "Focused" : "Focus"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {focusedCard ? (
            <article
              id={`card-${focusedIndex + 1}`}
              key={`${focusedCard.section.title}-${spinVersions[focusedIndex]}-${focusedFlipVersion}`}
              className={`relative bible-bingo-focused-card bible-card-focus-flip mx-auto mt-6 max-w-3xl overflow-hidden rounded-[2rem] border p-6 text-center text-slate-100 shadow-2xl shadow-black/30 sm:p-8 ${cardTone(focusedIndex)} ${spinVersions[focusedIndex] > 0 ? "bible-card-spin" : ""} ${spinningCards[focusedIndex] ? "bible-card-is-spinning" : ""}`}
              style={{
                minHeight: "430px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animationDelay: spinningCards[focusedIndex] ? `${spinDelays[focusedIndex]}ms` : "0ms",
              }}
            >
              <div className="mb-4 flex w-full justify-end">
                <BibleBingoShareMenu
                  boardHref={`${boardPath}?card=${focusedIndex + 1}`}
                  boardUrl={`${boardUrl}?card=${focusedIndex + 1}`}
                  shareText={[
                    `I dealt this ${focusedCard.section.title} Bible Bingo card on Cross Heart Pray.`,
                    "",
                    focusedCard.passage.label,
                    focusedCard.passage.text,
                    "",
                    "Open this card:",
                    `${boardUrl}?card=${focusedIndex + 1}`,
                    "",
                    "Open in the Holy Bible app:",
                    verseUrl(focusedCard.passage),
                    "",
                    "Read the chapter:",
                    chapterUrl(focusedCard.passage),
                  ].join("\n")}
                  emailSubject={`${focusedCard.passage.label} Bible Bingo card`}
                  htmlEmail={cardHtmlEmail(focusedCard.section, focusedCard.passage, focusedIndex)}
                  align="right"
                  itemLabel="card"
                  buttonLabel="Share"
                  enableSignature
                  iconOnly
                />
              </div>

              <div className="flex justify-center gap-4 text-3xl" aria-hidden="true">
                <span>✝️</span>
                <span>❤️</span>
                <span>🙏</span>
              </div>

              <div className="mt-5 text-5xl">{focusedCard.section.emoji}</div>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-slate-300">
                Bible Bingo Card {focusedIndex + 1}
              </p>

              <p className="mt-4 text-sm font-black uppercase tracking-[0.24em] text-emerald-100">
                {focusedTitle?.dayLabel}
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                {focusedTitle?.title ?? focusedCard.section.title}
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-slate-300">
                {focusedCard.section.line}
              </p>

              <p className="mt-6 text-2xl font-black text-white">
                {focusedCard.passage.label}
              </p>

              <div className="mt-5 w-full rounded-[1.5rem] border border-white/10 bg-black/25 px-5 py-5 text-lg font-bold leading-8 text-slate-100 sm:text-xl sm:leading-9">
                <VerifiedVerseText
                  passage={focusedCard.passage}
                  wordStudies={wordStudiesForPassage(focusedCard.passage)}
                  onWordClick={(wordStudy) => openWordStudy(focusedCard.section, focusedCard.passage, wordStudy)}
                />
              </div>

              <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row sm:flex-wrap sm:justify-center">
                <a
                  href={verseUrl(focusedCard.passage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center justify-center items-center inline-flex rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/30"
                >
                  Verse
                </a>

                <a
                  href={chapterUrl(focusedCard.passage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center justify-center items-center inline-flex rounded-full border border-white/25 bg-white/20 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/30"
                >
                  Chapter
                </a>

                <a
                  href={bibleReadingPlanHrefForReference(focusedCard.passage.code, focusedCard.passage.chapter)}
                  className="text-center justify-center items-center inline-flex min-h-[44px] rounded-full border border-sky-200/25 bg-sky-300/10 px-5 py-2 text-sm font-semibold text-sky-100 shadow-sm transition hover:bg-sky-300/15 touch-manipulation"
                >
                  {bibleReadingPlanLabelForReference(focusedCard.passage.code, focusedCard.passage.chapter)}
                </a>

                <button
                  type="button"
                  onClick={() => openWordStudy(focusedCard.section, focusedCard.passage)}
                  disabled={!hasVerifiedWordLinks(wordStudiesForPassage(focusedCard.passage))}
                  title={
                    hasVerifiedWordLinks(wordStudiesForPassage(focusedCard.passage))
                      ? "Open verified original-language word study"
                      : "Deep Dive opens when this verse has verified underlined word links."
                  }
                  className="text-center justify-center items-center inline-flex rounded-full border border-emerald-200/20 bg-emerald-300/10 px-5 py-2 text-sm font-semibold text-emerald-100 shadow-sm transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:border-zinc-700/70 disabled:bg-zinc-800/70 disabled:text-zinc-500 disabled:shadow-none disabled:hover:bg-zinc-800/70"
                >
                  Deep Dive
                </button>

                <button
                  type="button"
                  onClick={() => spinOne(focusedIndex)}
                  className="text-center justify-center items-center inline-flex rounded-full border border-yellow-200/30 bg-yellow-200/15 px-5 py-2 text-sm font-black text-yellow-50 shadow-sm transition hover:bg-yellow-200/25"
                >
                  Deal This Card
                </button>
              </div>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
                Odds: <span className="text-white">{oddsText(focusedCard.section)}</span>
              </p>
            </article>
          ) : null}
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

        <LazyBibleVerseLookup className="mt-8" initialReference="Mark 16:15" />

        <section className="mt-16 border-t border-white/10 px-4 pt-14 pb-8 text-center">
          <h2 className="text-xl font-bold text-white">How it works</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Every board opens a fresh path through the Bible. Verse opens the exact
            verse. Chapter opens the full chapter. Deep Dive opens when verified
            Hebrew or Greek word details are available.
          </p>
        </section>
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


        @keyframes bible-focus-card-flip {
          0% {
            opacity: 0;
            transform: perspective(1100px) rotateY(-78deg) translateY(12px) scale(0.96);
            filter: blur(5px);
          }

          45% {
            opacity: 1;
            transform: perspective(1100px) rotateY(8deg) translateY(0) scale(1.01);
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: perspective(1100px) rotateY(0deg) translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes bible-focus-card-symbols {
          0% {
            opacity: 0;
            transform: scale(0.86) translateY(10px);
          }

          35% {
            opacity: 0.95;
            transform: scale(1.04) translateY(0);
          }

          100% {
            opacity: 0;
            transform: scale(1.12) translateY(-10px);
          }
        }

        .bible-card-focus-flip {
          transform-style: preserve-3d;
          animation: bible-focus-card-flip 620ms ease-out both;
        }

        .bible-card-focus-flip::before {
          content: "✝️  ❤️  🙏";
          position: absolute;
          inset: 0;
          z-index: 8;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, rgb(15 23 42 / 0.76), rgb(15 23 42 / 0));
          font-size: clamp(2.4rem, 9vw, 5.25rem);
          letter-spacing: 0.22em;
          pointer-events: none;
          animation: bible-focus-card-symbols 620ms ease-out both;
        }

        .bible-card-focus-flip > * {
          position: relative;
          z-index: 1;
        }

        .bible-card-verse-preview {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .bible-bingo-deck-card.bible-card-is-spinning::before,
        .bible-bingo-focused-card.bible-card-is-spinning::before {
          content: "✝️  ❤️  🙏\\A Cross Heart Pray";
          white-space: pre-line;
          flex-direction: column;
          gap: 0.65rem;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 900;
          line-height: 1.25;
          text-align: center;
        }

        .bible-bingo-deck-card.bible-card-is-spinning::before {
          font-size: 1.2rem;
          letter-spacing: 0.08rem;
        }

        .bible-bingo-focused-card.bible-card-is-spinning::before {
          font-size: 2.35rem;
          letter-spacing: 0.14rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .bible-card-spin,
          .bible-card-is-spinning::before,
          .bible-card-is-spinning::after {
            animation: none;
          }
        }
      `}</style>
          <SiteFooter />
    </main>
  );
}

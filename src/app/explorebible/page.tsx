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

"use client";

import { useMemo, useState } from "react";

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
  gridClass?: string;
  passages: Passage[];
};

const sections: Section[] = [
  {
    title: "Old Testament",
    emoji: "📜",
    line: "Open the story of promise, rescue, wisdom, prophets, and God’s faithfulness.",
    passages: [
      { label: "Exodus 14:13", code: "EXO", chapter: "14", verse: "13", text: "Don’t be afraid. Stand firm and see the LORD’s salvation." },
      { label: "Deuteronomy 6:5", code: "DEU", chapter: "6", verse: "5", text: "Love the LORD your God with all your heart, soul, and strength." },
      { label: "Joshua 1:9", code: "JOS", chapter: "1", verse: "9", text: "Be strong and courageous. Do not be afraid or discouraged." },
      { label: "Ruth 1:16", code: "RUT", chapter: "1", verse: "16", text: "Where you go, I will go, and where you stay, I will stay." },
      { label: "1 Samuel 16:7", code: "1SA", chapter: "16", verse: "7", text: "People look at the outward appearance, but the LORD looks at the heart." },
      { label: "Isaiah 6:8", code: "ISA", chapter: "6", verse: "8", text: "Here I am. Send me." },
      { label: "Micah 6:8", code: "MIC", chapter: "6", verse: "8", text: "Act justly, love faithfulness, and walk humbly with your God." },
      { label: "Habakkuk 3:18", code: "HAB", chapter: "3", verse: "18", text: "I will celebrate in the LORD; I will rejoice in the God of my salvation." },
    ],
  },
  {
    title: "Psalms",
    emoji: "🎶",
    line: "Pray, praise, cry out, worship, and hope through Scripture.",
    passages: [
      { label: "Psalm 1:1", code: "PSA", chapter: "1", verse: "1", text: "How happy is the one who does not walk in the advice of the wicked." },
      { label: "Psalm 23:1", code: "PSA", chapter: "23", verse: "1", text: "The LORD is my shepherd; I have what I need." },
      { label: "Psalm 27:1", code: "PSA", chapter: "27", verse: "1", text: "The LORD is my light and my salvation — whom should I fear?" },
      { label: "Psalm 46:10", code: "PSA", chapter: "46", verse: "10", text: "Stop fighting, and know that I am God." },
      { label: "Psalm 51:10", code: "PSA", chapter: "51", verse: "10", text: "God, create a clean heart for me and renew a steadfast spirit within me." },
      { label: "Psalm 91:1", code: "PSA", chapter: "91", verse: "1", text: "The one who lives under the protection of the Most High dwells in the shadow of the Almighty." },
      { label: "Psalm 103:2", code: "PSA", chapter: "103", verse: "2", text: "My soul, bless the LORD, and do not forget all his benefits." },
      { label: "Psalm 139:14", code: "PSA", chapter: "139", verse: "14", text: "I will praise you because I have been remarkably and wondrously made." },
    ],
  },
  {
    title: "Proverbs",
    emoji: "💡",
    line: "Find wisdom for words, choices, friendship, work, and the heart.",
    passages: [
      { label: "Proverbs 3:5", code: "PRO", chapter: "3", verse: "5", text: "Trust in the LORD with all your heart, and do not rely on your own understanding." },
      { label: "Proverbs 4:23", code: "PRO", chapter: "4", verse: "23", text: "Guard your heart above all else, for it is the source of life." },
      { label: "Proverbs 11:25", code: "PRO", chapter: "11", verse: "25", text: "A generous person will be enriched, and the one who gives a drink will receive water." },
      { label: "Proverbs 15:1", code: "PRO", chapter: "15", verse: "1", text: "A gentle answer turns away anger, but a harsh word stirs up wrath." },
      { label: "Proverbs 16:3", code: "PRO", chapter: "16", verse: "3", text: "Commit your activities to the LORD, and your plans will be established." },
      { label: "Proverbs 18:10", code: "PRO", chapter: "18", verse: "10", text: "The name of the LORD is a strong tower; the righteous run to it and are protected." },
      { label: "Proverbs 27:17", code: "PRO", chapter: "27", verse: "17", text: "Iron sharpens iron, and one person sharpens another." },
      { label: "Proverbs 31:8", code: "PRO", chapter: "31", verse: "8", text: "Speak up for those who have no voice." },
    ],
  },
  {
    title: "Gospel",
    gridClass: "lg:col-start-2",
    emoji: "✝️",
    line: "Walk with Jesus through His words, works, cross, and resurrection.",
    passages: [
      { label: "Matthew 5:3", code: "MAT", chapter: "5", verse: "3", text: "Blessed are the poor in spirit, for the kingdom of heaven is theirs." },
      { label: "Matthew 6:9", code: "MAT", chapter: "6", verse: "9", text: "Our Father in heaven, your name be honored as holy." },
      { label: "Matthew 28:19", code: "MAT", chapter: "28", verse: "19", text: "Go, therefore, and make disciples of all nations." },
      { label: "Mark 4:9", code: "MRK", chapter: "4", verse: "9", text: "Let anyone who has ears to hear listen." },
      { label: "Luke 10:27", code: "LUK", chapter: "10", verse: "27", text: "Love the Lord your God with all your heart, soul, strength, and mind." },
      { label: "Luke 15:20", code: "LUK", chapter: "15", verse: "20", text: "While the son was still a long way off, his father saw him and was filled with compassion." },
      { label: "John 1:14", code: "JHN", chapter: "1", verse: "14", text: "The Word became flesh and dwelt among us." },
      { label: "John 10:11", code: "JHN", chapter: "10", verse: "11", text: "I am the good shepherd. The good shepherd lays down his life for the sheep." },
    ],
  },
  {
    title: "Epistles",
    gridClass: "lg:col-start-4",
    emoji: "✉️",
    line: "Read how the Church learns to live, love, serve, endure, and grow.",
    passages: [
      { label: "Romans 8:1", code: "ROM", chapter: "8", verse: "1", text: "There is now no condemnation for those in Christ Jesus." },
      { label: "Romans 12:2", code: "ROM", chapter: "12", verse: "2", text: "Do not be conformed to this age, but be transformed by the renewing of your mind." },
      { label: "1 Corinthians 13:4", code: "1CO", chapter: "13", verse: "4", text: "Love is patient, love is kind." },
      { label: "Galatians 5:22", code: "GAL", chapter: "5", verse: "22", text: "The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness." },
      { label: "Ephesians 2:10", code: "EPH", chapter: "2", verse: "10", text: "We are his workmanship, created in Christ Jesus for good works." },
      { label: "Philippians 2:5", code: "PHP", chapter: "2", verse: "5", text: "Adopt the same attitude as that of Christ Jesus." },
      { label: "Colossians 3:12", code: "COL", chapter: "3", verse: "12", text: "Put on compassion, kindness, humility, gentleness, and patience." },
      { label: "James 1:22", code: "JAS", chapter: "1", verse: "22", text: "Be doers of the word and not hearers only." },
    ],
  },
  {
    title: "Genesis",
    gridClass: "lg:col-start-2",
    emoji: "🌅",
    line: "The beginning: creation, fall, promise, covenant, and God’s story opening.",
    passages: [
      { label: "Genesis 1:1", code: "GEN", chapter: "1", verse: "1", text: "In the beginning God created the heavens and the earth." },
      { label: "Genesis 1:27", code: "GEN", chapter: "1", verse: "27", text: "God created mankind in his own image." },
      { label: "Genesis 3:15", code: "GEN", chapter: "3", verse: "15", text: "He will strike your head, and you will strike his heel." },
      { label: "Genesis 12:2", code: "GEN", chapter: "12", verse: "2", text: "I will make you into a great nation, I will bless you." },
      { label: "Genesis 15:6", code: "GEN", chapter: "15", verse: "6", text: "Abram believed the LORD, and he credited it to him as righteousness." },
      { label: "Genesis 50:20", code: "GEN", chapter: "50", verse: "20", text: "You planned evil against me; God planned it for good." },
    ],
  },
  {
    title: "Revelation",
    gridClass: "lg:col-start-4",
    emoji: "👑",
    line: "The end: worship, victory, restoration, and Jesus making all things new.",
    passages: [
      { label: "Revelation 1:8", code: "REV", chapter: "1", verse: "8", text: "I am the Alpha and the Omega, says the Lord God." },
      { label: "Revelation 3:20", code: "REV", chapter: "3", verse: "20", text: "See! I stand at the door and knock." },
      { label: "Revelation 5:12", code: "REV", chapter: "5", verse: "12", text: "Worthy is the Lamb who was slaughtered." },
      { label: "Revelation 7:17", code: "REV", chapter: "7", verse: "17", text: "The Lamb who is at the center of the throne will shepherd them." },
      { label: "Revelation 21:4", code: "REV", chapter: "21", verse: "4", text: "He will wipe away every tear from their eyes." },
      { label: "Revelation 22:13", code: "REV", chapter: "22", verse: "13", text: "I am the Alpha and the Omega, the first and the last, the beginning and the end." },
    ],
  },
];

function randomPassage(section: Section, avoidLabel?: string) {
  const availablePassages =
    section.passages.length > 1
      ? section.passages.filter((passage) => passage.label !== avoidLabel)
      : section.passages;

  return availablePassages[Math.floor(Math.random() * availablePassages.length)];
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
  return `https://www.bible.com/bible/111/${passage.code}.${passage.chapter}.${passage.verse}.NIV`;
}

function chapterUrl(passage: Passage) {
  return `https://www.bible.com/bible/111/${passage.code}.${passage.chapter}.NIV`;
}

export default function BibleExplorerPage() {
  const [path, setPath] = useState(() => buildPath());

  const verseOfTheDayUrl = useMemo(() => {
    const today = new Date();
    const todayDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return `https://www.bible.com/verse-of-the-day`;
  }, []);

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
  }

  return (
    <main className="min-h-screen bg-black text-white">
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

          <p className="mb-5 inline-flex rounded-full border border-zinc-700 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
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

          <button
            type="button"
            onClick={() => setPath((current) => buildPath(current))}
            className="mt-10 rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            New Bible Bingo Board
          </button>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {path.map(({ section, passage }, index) => (
            <article
              key={section.title}
              className={`rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center lg:col-span-2 ${section.gridClass ?? ""}`}
              style={{
                minHeight: "340px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="text-5xl">{section.emoji}</div>

              <h2 className="mt-6 text-2xl font-bold">{section.title}</h2>

              <p className="mt-4 leading-7 text-zinc-400">{section.line}</p>

              <p className="mt-6 text-2xl font-bold text-white">
                {passage.label}
              </p>

              <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-300">
                “{passage.text}”
              </p>

              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                <a
                  href={verseUrl(passage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
                >
                  Open Verse
                </a>

                <a
                  href={chapterUrl(passage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-white"
                >
                  Read Chapter
                </a>
              </div>

              <button
                type="button"
                onClick={() => spinOne(index)}
                className="mt-4 text-sm font-semibold text-zinc-500 underline decoration-zinc-700 underline-offset-4 hover:text-white"
              >
                Pick another {section.title}
              </button>
            </article>
          ))}
        </section>


        <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-5 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">
            Bible Verse Lookup
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Search Bible Verse
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/75">
            Type a verse like John 3:16, Psalm 23, Romans 8:28, or Genesis 1:1.
          </p>

          <form
            action="https://www.bible.com/search/bible"
            method="get"
            target="_blank"
            className="mx-auto mt-5 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              name="q"
              type="text"
              inputMode="text"
              placeholder="John 3:16"
              aria-label="Bible verse to search"
              className="min-h-12 flex-1 rounded-2xl border border-white/15 bg-black/25 px-4 text-base text-white placeholder:text-white/45 outline-none ring-0 focus:border-white/35"
            />
            <button
              type="submit"
              className="min-h-12 rounded-2xl bg-white px-5 font-semibold text-slate-950 shadow-sm transition hover:bg-white/90"
            >
              Search Bible Verse
            </button>
          </form>

          <p className="mt-3 text-xs text-white/50">
            Opens Bible.com / YouVersion so the Bible stays the destination.
          </p>
        </section>

        <section className="border-t border-zinc-900 px-6 py-20 text-center">
          <p className="mx-auto max-w-3xl text-lg leading-8 text-zinc-400">
            No AI. No explanation. No reflection required. Open Scripture and
            discover what God may show you today.
          </p>
        </section>

        <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
          <p>© 2026 Open Mirror LLC. Follow Jesus. Love God. Pray.</p>
          <p className="mx-auto mt-4 max-w-3xl text-xs leading-6 text-zinc-600">
            Scripture quotations marked CSB have been taken from the Christian Standard Bible®,
            Copyright © 2017 by Holman Bible Publishers. Used by permission.
            Christian Standard Bible® and CSB® are federally registered trademarks of Holman Bible Publishers.
          </p>
        </footer>
      </div>
    </main>
  );
}

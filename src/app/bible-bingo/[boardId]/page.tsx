import { notFound } from "next/navigation";
import BibleBingoShareBoard from "../../../components/BibleBingoShareBoard";
import { passagesForBibleBingoBoardId } from "../../../lib/bibleRandom";

type PageProps = {
  params: Promise<{
    boardId: string;
  }>;
};

const shareSections = [
  {
    title: "Old Testament",
    emoji: "📜",
    line: "Promise, rescue, wisdom, prophets, and God’s faithfulness.",
  },
  {
    title: "Psalms",
    emoji: "🎶",
    line: "Prayer, praise, crying out, and hope through Scripture.",
  },
  {
    title: "Proverbs",
    emoji: "💡",
    line: "Wisdom for words, choices, friendship, work, and the heart.",
  },
  {
    title: "Gospel",
    emoji: "✝️",
    line: "Walk with Jesus through His words, works, cross, and resurrection.",
  },
  {
    title: "Epistles",
    emoji: "✉️",
    line: "The Church learning to live, love, serve, endure, and grow.",
  },
  {
    title: "Genesis",
    emoji: "🌅",
    line: "Creation, fall, promise, covenant, and God’s story opening.",
  },
  {
    title: "Revelation",
    emoji: "👑",
    line: "Victory, restoration, and Jesus making all things new.",
  },
];

const cardTones = [
  "border-emerald-200/15 bg-emerald-300/10",
  "border-yellow-200/15 bg-yellow-200/10",
  "border-red-200/15 bg-red-300/10",
  "border-sky-200/15 bg-sky-300/10",
  "border-lime-200/15 bg-lime-300/10",
  "border-orange-200/15 bg-orange-300/10",
  "border-violet-200/15 bg-violet-300/10",
];

export default async function BibleBingoSharePage({ params }: PageProps) {
  const { boardId } = await params;
  const passages = passagesForBibleBingoBoardId(boardId);

  if (!passages) {
    notFound();
  }

  const boardPath = `/bible-bingo/${encodeURIComponent(boardId)}`;
  const boardUrl = `https://crossheartpray.com${boardPath}`;
  const shareText = [
    "I rolled a Bible Bingo board on Cross Heart Pray:",
    "",
    ...passages.flatMap((passage, index) => [
      `${index + 1}. ${shareSections[index].title}: ${passage.label}`,
      passage.text,
      "",
    ]),
    boardUrl,
  ].join("\n");
  const encodedShareText = encodeURIComponent(shareText);
  const encodedShareSubject = encodeURIComponent("My Bible Bingo board");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <nav className="grid grid-cols-3 items-center">
          <a href="/home" className="justify-self-start font-bold">
            Cross Heart Pray
          </a>

          <a
            href="/explorebible"
            className="justify-self-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
          >
            Bible Bingo
          </a>

          <a
            href="/about"
            className="justify-self-end text-sm font-semibold text-slate-400 hover:text-white"
          >
            About
          </a>
        </nav>

        <section className="mx-auto max-w-4xl py-16 text-center">
          <p className="mb-8 flex items-center justify-center gap-8 text-5xl md:gap-14 md:text-6xl">
            <span>✝️</span>
            <span>❤️</span>
            <span>🙏</span>
          </p>

          <p className="text-center justify-center items-center mb-5 inline-flex rounded-full border border-white/15 bg-black/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
            Shared Bible Bingo Board
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            7 Bible Bingo Cards
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Read the verses, open the chapters, and share the same board with a friend.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`sms:?&body=${encodedShareText}`}
              className="text-center justify-center items-center inline-flex rounded-full border border-emerald-200/20 bg-emerald-300/10 px-5 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
            >
              Text board
            </a>

            <a
              href={`mailto:?subject=${encodedShareSubject}&body=${encodedShareText}`}
              className="text-center justify-center items-center inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              Email board
            </a>

            <a
              href="/explorebible"
              className="text-center justify-center items-center inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              Roll new board
            </a>
          </div>
        </section>

        <BibleBingoShareBoard
          passages={passages}
          shareSections={shareSections}
          cardTones={cardTones}
        />

        <footer className="px-8 py-10 text-center text-sm text-zinc-500">
          <p>© 2026 Open Mirror LLC. Cross Heart Pray.</p>
        </footer>
      </div>
    </main>
  );
}

import { notFound } from "next/navigation";
import BibleBingoShareBoard from "../../../components/BibleBingoShareBoard";
import BibleBingoShareMenu from "../../../components/BibleBingoShareMenu";
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
    "I rolled a 7-card Bible Bingo board on Cross Heart Pray.",
    "",
    "Open the live board to read the same verses, use Deep Dive, and play from there:",
    "",
    boardUrl,
  ].join("\n");
  const shareSubject = "My Bible Bingo board";

  const htmlEmail = `
    <div style="font-family: Arial, sans-serif; background: #020617; color: #f8fafc; padding: 24px;">
      <div style="max-width: 760px; margin: 0 auto;">
        <p style="font-size: 32px; text-align: center; margin: 0 0 16px;">✝️ ❤️ 🙏</p>
        <h1 style="text-align: center; margin: 0; font-size: 32px;">Bible Bingo Board</h1>
        <p style="text-align: center; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
          Open the live board to use Deep Dive and the Bible app links.
        </p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${boardUrl}" style="display: inline-block; background: #064e3b; color: #ecfdf5; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: bold;">
            Open Live Bible Bingo Board
          </a>
        </p>
        ${passages.map((passage, index) => `
          <div style="border: 1px solid rgba(255,255,255,0.18); border-radius: 24px; padding: 18px; margin: 16px 0; background: rgba(255,255,255,0.06);">
            <p style="font-size: 28px; text-align: center; margin: 0;">${shareSections[index].emoji}</p>
            <h2 style="text-align: center; margin: 12px 0 8px; font-size: 22px;">${shareSections[index].title}</h2>
            <p style="text-align: center; color: #e2e8f0; font-weight: bold; font-size: 20px; margin: 12px 0;">${passage.label}</p>
            <p style="color: #cbd5e1; line-height: 1.7; font-size: 15px;">${passage.text}</p>
            <p style="text-align: center;">
              <a href="https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.${passage.verse}.WEBUS" style="color: #a7f3d0; font-weight: bold;">Verse</a>
              &nbsp; | &nbsp;
              <a href="https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.WEBUS" style="color: #a7f3d0; font-weight: bold;">Chapter</a>
              &nbsp; | &nbsp;
              <a href="${boardUrl}#card-${index + 1}" style="color: #a7f3d0; font-weight: bold;">Card</a>
            </p>
          </div>
        `).join("")}
      </div>
    </div>
  `;

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
            This link preserves the exact 7 cards. Read the verses, use Deep Dive, open the chapters, and play from here.
          </p>

          <div className="mx-auto mt-8 flex flex-col items-center justify-center gap-3">
            <BibleBingoShareMenu
              boardHref={boardPath}
              boardUrl={boardUrl}
              shareText={shareText}
              emailSubject={shareSubject}
              htmlEmail={htmlEmail}
            />

            <a
              href="/explorebible"
              className="text-sm font-semibold text-slate-400 underline decoration-white/20 underline-offset-4 hover:text-white"
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

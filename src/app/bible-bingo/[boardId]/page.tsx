import { notFound } from "next/navigation";
import BibleBingoShareBoard from "../../../components/BibleBingoShareBoard";
import BibleBingoShareMenu from "../../../components/BibleBingoShareMenu";
import { passagesForBibleBingoBoardId } from "../../../lib/bibleRandom";

type PageProps = {
  params: Promise<{
    boardId: string;
  }>;
  searchParams?: Promise<{
    card?: string | string[];
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

function verseUrl(passage: { code: string; chapter: number; verse: number }) {
  return `https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.${passage.verse}.WEBUS`;
}

function chapterUrl(passage: { code: string; chapter: number }) {
  return `https://www.bible.com/bible/206/${passage.code}.${passage.chapter}.WEBUS`;
}

export default async function BibleBingoSharePage({ params, searchParams }: PageProps) {
  const { boardId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawCardParam = Array.isArray(resolvedSearchParams.card)
    ? resolvedSearchParams.card[0]
    : resolvedSearchParams.card;

  const passages = passagesForBibleBingoBoardId(boardId);

  if (!passages) {
    notFound();
  }

  const requestedCardNumber = rawCardParam ? Number(rawCardParam) : NaN;
  const selectedCardIndex =
    Number.isInteger(requestedCardNumber) &&
    requestedCardNumber >= 1 &&
    requestedCardNumber <= passages.length
      ? requestedCardNumber - 1
      : null;

  const selectedPassage =
    selectedCardIndex === null ? null : passages[selectedCardIndex] ?? null;
  const selectedSection =
    selectedCardIndex === null ? null : shareSections[selectedCardIndex] ?? null;
  const selectedTone =
    selectedCardIndex === null ? null : cardTones[selectedCardIndex] ?? null;
  const isSingleCardView =
    selectedCardIndex !== null && selectedPassage !== null && selectedSection !== null && selectedTone !== null;

  const visiblePassages = isSingleCardView ? [selectedPassage] : passages;
  const visibleShareSections = isSingleCardView ? [selectedSection] : shareSections;
  const visibleCardTones = isSingleCardView ? [selectedTone] : cardTones;

  const boardPath = `/bible-bingo/${encodeURIComponent(boardId)}`;
  const boardUrl = `https://crossheartpray.com${boardPath}`;
  const cardPath = isSingleCardView ? `${boardPath}?card=${selectedCardIndex + 1}` : boardPath;
  const cardUrl = `https://crossheartpray.com${cardPath}`;

  const shareText = isSingleCardView
    ? [
        `I rolled this ${selectedSection.title} Bible Bingo card on Cross Heart Pray.`,
        "",
        selectedPassage.label,
        selectedPassage.text,
        "",
        "Open the live card:",
        cardUrl,
        "",
        "Open the full 7-card board:",
        boardUrl,
      ].join("\n")
    : [
        "I rolled a 7-card Bible Bingo board on Cross Heart Pray.",
        "",
        "Open the live board to read the same verses, use Deep Dive, and play from there:",
        "",
        boardUrl,
      ].join("\n");

  const shareSubject = isSingleCardView
    ? `${selectedPassage.label} Bible Bingo card`
    : "My Bible Bingo board";

  const htmlEmail = `
    <div style="font-family: Arial, Helvetica, sans-serif; background: #f1f5f9; color: #0f172a; padding: 28px 12px;">
      <div style="max-width: 720px; margin: 0 auto;">
        <p style="font-size: 34px; text-align: center; margin: 0 0 14px;">✝️ ❤️ 🙏</p>
        <h1 style="font-family: Georgia, 'Times New Roman', serif; text-align: center; margin: 0; font-size: 34px; line-height: 1.15; color: #0f172a;">Bible Bingo Board</h1>
        <p style="text-align: center; color: #475569; font-size: 16px; line-height: 1.6; max-width: 560px; margin-left: auto; margin-right: auto;">
          Same 7 cards. Same verses. Open the live board to keep playing, use Deep Dive, and open the Bible app links.
        </p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${boardUrl}" style="display: inline-block; background: #059669; color: #ffffff; padding: 13px 22px; border-radius: 999px; text-decoration: none; font-weight: 800; font-family: Arial, Helvetica, sans-serif; font-size: 15px;">
            Open Live Bible Bingo Board
          </a>
        </p>
        ${passages.map((passage, index) => `
          <div style="border: 1px solid #dbe3ee; border-radius: 18px; padding: 22px; margin: 16px 0; background: #ffffff;">
            <p style="font-size: 30px; text-align: center; margin: 0 0 8px;">${shareSections[index].emoji}</p>
            <h2 style="font-family: Arial, Helvetica, sans-serif; text-align: center; margin: 8px 0 6px; font-size: 13px; line-height: 1.4; letter-spacing: 0.12em; text-transform: uppercase; color: #047857;">${shareSections[index].title}</h2>
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

  const singleCardHtmlEmail = isSingleCardView
    ? `
      <div style="font-family: Arial, Helvetica, sans-serif; background: #f1f5f9; color: #0f172a; padding: 28px 12px;">
        <div style="max-width: 560px; margin: 0 auto;">
          <p style="font-size: 32px; text-align: center; margin: 0 0 12px;">${selectedSection.emoji}</p>
          <h1 style="font-family: Georgia, 'Times New Roman', serif; text-align: center; margin: 0; font-size: 30px; line-height: 1.15; color: #0f172a;">${selectedSection.title} Bible Bingo Card</h1>
          <p style="font-family: Georgia, 'Times New Roman', serif; text-align: center; color: #0f172a; font-weight: bold; font-size: 24px; line-height: 1.25; margin: 18px 0 12px;">${selectedPassage.label}</p>
          <div style="border: 1px solid #dbe3ee; border-radius: 18px; padding: 22px; margin: 16px 0; background: #ffffff;">
            <p style="font-family: Georgia, 'Times New Roman', serif; color: #334155; line-height: 1.7; font-size: 17px;">${selectedPassage.text}</p>
            <p style="text-align: center; margin: 22px 0 0;">
              <a href="${cardUrl}" style="color: #065f46; font-weight: bold; text-decoration: none;">Open Live Card</a>
              &nbsp; | &nbsp;
              <a href="${boardUrl}" style="color: #065f46; font-weight: bold; text-decoration: none;">All 7 Cards</a>
            </p>
          </div>
          <p style="text-align: center; color: #64748b; font-size: 13px; line-height: 1.6;">
            Cross Heart Pray · 7 Card Bible Bingo
          </p>
        </div>
      </div>
    `
    : "";

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
            {isSingleCardView ? "Shared Bible Bingo Card" : "Shared Bible Bingo Board"}
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {isSingleCardView ? "Bible Bingo Card" : "7 Bible Bingo Cards"}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            {isSingleCardView
              ? "This link opens one shared Bible Bingo card. Read the verse, use Deep Dive when available, or go back to all 7 cards."
              : "This link preserves the exact 7 cards. Read the verses, use Deep Dive, open the chapters, and play from here."}
          </p>

          {isSingleCardView ? (
            <a
              href={boardPath}
              className="mx-auto mt-6 inline-flex rounded-full border border-emerald-200/25 bg-emerald-300/10 px-5 py-2 text-sm font-bold text-emerald-50 shadow-sm transition hover:bg-emerald-300/15"
            >
              Back to all 7 Bible Bingo cards
            </a>
          ) : null}

          <div className="mx-auto mt-8 flex flex-col items-center justify-center gap-3">
            <BibleBingoShareMenu
              boardHref={isSingleCardView ? cardPath : boardPath}
              boardUrl={isSingleCardView ? cardUrl : boardUrl}
              shareText={shareText}
              emailSubject={shareSubject}
              htmlEmail={isSingleCardView ? singleCardHtmlEmail : htmlEmail}
              itemLabel={isSingleCardView ? "card" : "board"}
            />

            <a
              href="/explorebible"
              className="text-sm font-semibold text-slate-400 underline decoration-white/20 underline-offset-4 hover:text-white"
            >
              Roll new board
            </a>
          </div>
        </section>

        <div className={isSingleCardView ? "single-card-server-view" : undefined}>
          <BibleBingoShareBoard
            passages={visiblePassages}
            shareSections={visibleShareSections}
            cardTones={visibleCardTones}
          />
        </div>

        <footer className="px-8 py-10 text-center text-sm text-zinc-500">
          <p>© 2026 Open Mirror LLC. Cross Heart Pray.</p>
        </footer>
      </div>
    </main>
  );
}

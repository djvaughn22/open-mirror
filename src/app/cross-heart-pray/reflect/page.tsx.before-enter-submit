"use client";

import Link from "next/link";
import { useState } from "react";

function formatReflectionText(text: string) {
  return text
    .replace(/\s*##\s*(Reflection|✝️ Cross|❤️ Heart|🙏 Pray|📖 Scripture|Optional ACTS Scripture Guide|Next Faithful Step)\s*/g, "\n\n## $1\n\n")
    .replace(/\s*\*\*(Adoration|Confession|Thanksgiving|Supplication):\*\*\s*/g, "\n\n$1:\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderReflectionWithBibleLinks(text: string) {
  const books =
    "Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\\s*Samuel|2\\s*Samuel|1\\s*Kings|2\\s*Kings|1\\s*Chronicles|2\\s*Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Song\\s+of\\s+Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\\s*Corinthians|2\\s*Corinthians|Galatians|Ephesians|Philippians|Colossians|1\\s*Thessalonians|2\\s*Thessalonians|1\\s*Timothy|2\\s*Timothy|Titus|Philemon|Hebrews|James|1\\s*Peter|2\\s*Peter|1\\s*John|2\\s*John|3\\s*John|Jude|Revelation";

  const versePattern = new RegExp(
    `\\b(${books})\\s+\\d{1,3}:\\d{1,3}(?:-\\d{1,3})?\\b`,
    "gi"
  );

  const pieces = [];
  let lastIndex = 0;

  for (const match of text.matchAll(versePattern)) {
    const reference = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      pieces.push(text.slice(lastIndex, index));
    }

    pieces.push(
      <a
        key={`${reference}-${index}`}
        href={`https://www.bible.com/search/bible?q=${encodeURIComponent(reference)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-zinc-500 underline-offset-4 hover:text-white"
      >
        {reference}
      </a>
    );

    lastIndex = index + reference.length;
  }

  pieces.push(text.slice(lastIndex));

  return pieces;
}


function renderStyledReflection(text: string) {
  const bibleInstruction =
    "Click any Bible reference to open the passage in the Bible app. Read it in context, meditate on God's Word, and pray honestly in your own words. Open Mirror only points you toward Scripture; God's Word is the authority.";

  const actsInstruction =
    "Talk to God in prayer in whatever way feels natural to you. If you would like a simple structure, use the ACTS passages below as a guide.";

  return text.split(/\n\n+/).map((block, index) => {
    const trimmed = block.trim();

    if (trimmed === bibleInstruction || trimmed === actsInstruction) {
      return (
        <p
          key={`guidance-${index}`}
          className="my-6 text-center text-sm italic leading-7 text-yellow-300/80"
        >
          ({renderReflectionWithBibleLinks(trimmed)})
        </p>
      );
    }

    return (
      <div key={`reflection-${index}`} className="whitespace-pre-wrap">
        {renderReflectionWithBibleLinks(trimmed)}
      </div>
    );
  });
}

export default function CrossHeartPrayReflectPage() {
  const [problem, setProblem] = useState("");
  const [reflection, setReflection] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formattedReflection = reflection
    .replace(/\s*(#{2,4}\s+(Reflection|✝️ Cross|❤️ Heart|🙏 Pray|📖 Scripture|Optional ACTS Scripture Guide|Next Faithful Step))/g, "\n\n$1")
    .trim();

  async function beginReflection() {
    setError("");
    setReflection("");

    if (!problem.trim()) {
      setError("Please share what you are carrying.");
      return;
    }

    if (problem.length > 250) {
      setError("Please keep your reflection to 250 characters or less.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/reflect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problem }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate reflection.");
      }

      setReflection(formatReflectionText(data.reflection));
    } catch (err: any) {
      setError(
        err?.message || "The Mirror could not respond right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <nav className="mx-auto grid grid-cols-3 max-w-5xl items-center py-4">
        <a href="/welcome" className="justify-self-start font-bold">
          Open Mirror
        </a>

        <span aria-hidden="true" />

        <div className="justify-self-end flex items-center gap-4">
          <a
            href="https://www.bible.com/app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open YouVersion Bible App"
          >
            <img
              src="/brand/youversion-bible-app.png"
              alt="YouVersion Bible App"
              className="h-9 w-9 rounded-lg"
            />
          </a>

          <details className="relative text-sm text-zinc-400">
          <summary className="cursor-pointer list-none text-2xl leading-none">
            ☰
          </summary>

          <div className="absolute right-0 z-50 mt-4 flex w-56 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right shadow-2xl">
            <a href="/welcome">Home</a>
            <a href="/cross-heart-pray">Cross Heart Pray</a>
            <a href="/cross-heart-pray/reflect">Talk To The Mirror</a>
            <a href="/the-dj-cares">TheDJCares</a>
            <a href="/what-am-i-ai">WhatAmIAI</a>
          </div>
          </details>
        </div>

      </nav>

      <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 text-6xl">🪞</div>

        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          The Mirror
        </p>

        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Talk To The Mirror
        </h1>

        <p className="mt-6 max-w-2xl text-xl leading-9 text-zinc-300">
          Look honestly.
          <br />
          Tell the truth.
        </p>

        <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-zinc-400">
  The mirror helps you reflect. Cross Heart Pray helps you bring what you see
  to Jesus, receive God&apos;s truth through Scripture, and respond in prayer.
</p>

<p className="mx-auto mt-2 max-w-2xl text-center text-xs leading-5 text-zinc-500">
  * ACTS is a simple prayer guide: Adoration, Confession, Thanksgiving, and Supplication.
</p>

        <div className="mt-12 w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-left shadow-2xl">
          <label className="text-sm font-semibold text-zinc-300">
            What do you see?
          </label>

          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            maxLength={250}
            className="mt-4 min-h-36 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none"
placeholder="I am... I feel... I need help with... I am thankful for... I am struggling with... I am hoping for..."          />

          <p className="mt-2 text-right text-sm text-zinc-500">
            {problem.length}/250 characters
          </p>

          <button
            onClick={beginReflection}
            disabled={isLoading}
            className="mt-5 rounded-full bg-white px-8 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "The Mirror is reflecting..." : "Talk To The Mirror"}
          </button>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>



        {reflection && (
          <div className="mt-10 w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-left">
            <p className="mb-6 text-center text-base leading-7 text-zinc-400">
              The mirror reflects what you bring. Scripture reveals truth.
              Bring what you see to Jesus.
            </p>

            <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-yellow-400">
              <span className="block">Turn away from the mirror</span>
              <span className="mt-2 block">and lay what you see at the Cross.</span>
            </p>

            <div className="mt-8 whitespace-pre-wrap rounded-3xl border border-zinc-800 bg-black/40 p-6 text-left text-lg leading-9 text-zinc-200">
              {renderStyledReflection(formattedReflection)}
            </div>
          </div>
        )}

        <div className="mt-12 max-w-3xl text-center text-sm leading-7 text-zinc-500">
          CrossHeartPray provides biblical reflection and prayer guidance. It is
          not pastoral counseling, medical advice, legal advice, or a substitute
          for your local church, trusted relationships, or professional care
          when needed.
        </div>
      </section>
    </main>
  );
}

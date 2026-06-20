"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WelcomePage() {
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);

  async function welcome() {
    setIsOpening(true);

    try {
      await fetch("/api/site-entry", {
        method: "POST",
      });
    } catch {
      // Do not block entry.
    }

    router.push("/home");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <section className="mx-auto flex max-w-xl flex-col items-center text-center">
        <a
          href="https://www.bible.com/bible/206/MAT.5.WEBUS"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Matthew 5 in the Holy Bible"
          className="mb-10 inline-flex"
        >
          <img
            src="/brand/youversion-bible-app.png"
            alt="Holy Bible"
            className="h-12 w-12 rounded-xl shadow-lg shadow-black/25 transition hover:scale-105"
          />
        </a>

        <div
          className="flex flex-wrap items-center justify-center gap-5 text-6xl sm:text-7xl"
          aria-hidden="true"
        >
          <span>✝️</span>
          <span>❤️</span>
          <span>🙏</span>
        </div>

        <button
          type="button"
          onClick={welcome}
          disabled={isOpening}
          className="mt-10 rounded-full border border-white/15 bg-white/10 px-10 py-4 text-lg font-black uppercase tracking-[0.22em] text-white transition hover:bg-white/15 disabled:cursor-wait disabled:opacity-70"
        >
          {isOpening ? "Opening" : "Welcome"}
        </button>
      </section>
    </main>
  );
}

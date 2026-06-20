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

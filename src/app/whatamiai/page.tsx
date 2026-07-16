import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WhatAmIAI",
  description:
    "See what your own AI prompts say about how you use AI, think through one real situation, or look at your bigger patterns. Runs on your device.",
};

export default function WhatAmIAIPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-5 py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-300 transition mb-10"
        >
          ← Open Mirror LLC
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#E879F9] mb-4">
            Building
          </p>
          <h1 className="text-3xl font-black text-white mb-4">
            WhatAmIAI<span className="text-[#E879F9]">.com</span>
          </h1>
          <p className="text-base font-semibold leading-7 text-slate-300 max-w-sm mx-auto">
            Three reflection modes: paste your own AI prompts and see how you actually
            use AI, think through one real situation, or look at your bigger patterns.
            Runs on your device. No accounts, no labels.
          </p>
          <a
            href="https://whatamiai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-[#E879F9] px-7 py-3 text-sm font-black text-slate-950 hover:opacity-90 transition"
          >
            Open WhatAmIAI →
          </a>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WhatAmIAI — Know Yourself. For Real.",
  description: "AI reflection tools that help you compare answers, claim truth, and deepen self-awareness.",
};

const reflections = [
  { q: "What do I actually believe?", a: "Not what you were told. What you've lived." },
  { q: "Who am I when no one is watching?", a: "That's the version that matters most." },
  { q: "What am I avoiding?", a: "The answer is usually the next step." },
  { q: "What do I keep coming back to?", a: "That's a clue. Take it seriously." },
];

export default function WhatAmIAIPage() {
  return (
    <main className="min-h-screen bg-[#06040f] text-slate-100">
      <div className="mx-auto max-w-2xl px-5 py-10">

        {/* Bar */}
        <div className="flex items-center justify-between gap-4 mb-10 pb-4 border-b border-white/[0.07]">
          <Link href="https://openmirrorllc.com" className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-600 hover:text-slate-400 transition">
            Open Mirror LLC
          </Link>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
            WhatAmIAI
          </span>
        </div>

        {/* Hero */}
        <section className="mb-14">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-400 mb-5">
            Open Mirror LLC
          </p>
          <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white mb-6">
            What<br />Am<br />I?
          </h1>
          <p className="text-xl font-semibold text-slate-300 leading-7 mb-4 max-w-md">
            An AI reflection tool that helps you stop guessing and start knowing who you actually are.
          </p>
          <p className="text-sm font-semibold text-slate-500 leading-6 max-w-sm mb-8">
            Not a quiz. Not a personality label. A real conversation that goes where most people never go.
          </p>
          <div className="inline-flex items-center gap-3 rounded-full border border-violet-400/30 bg-violet-900/20 px-5 py-2.5">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
              Coming Soon — Building Now
            </span>
          </div>
        </section>

        {/* Reflection cards */}
        <section className="mb-14">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-600 mb-6">
            Questions worth asking
          </p>
          <div className="flex flex-col gap-3">
            {reflections.map((r) => (
              <div key={r.q} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                <p className="text-base font-black text-white mb-2">{r.q}</p>
                <p className="text-sm font-semibold text-slate-400 leading-6">{r.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What it will do */}
        <section className="mb-14 rounded-2xl border border-violet-400/15 bg-violet-950/20 p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-400 mb-5">
            What WhatAmIAI will do
          </p>
          <div className="flex flex-col gap-4">
            {[
              "Ask you questions most people never sit with",
              "Help you compare what you say vs. what you do",
              "Surface patterns you've been carrying for years",
              "Give you language for things you've felt but never named",
              "Never judge. Never label. Never put you in a box.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-violet-400 font-black mt-0.5">→</span>
                <p className="text-sm font-semibold text-slate-300 leading-6">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Back */}
        <div className="text-center">
          <Link
            href="https://openmirrorllc.com"
            className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-6 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-slate-400 hover:border-white/20 hover:text-white transition"
          >
            ← Open Mirror LLC
          </Link>
        </div>
      </div>
    </main>
  );
}

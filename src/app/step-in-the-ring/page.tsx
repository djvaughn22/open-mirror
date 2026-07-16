import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StepInTheRing",
  description:
    "Take any idea and turn it into a real first build. Seven questions, one fight plan. Live at stepinthering.com.",
};

export default function StepInTheRingPage() {
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
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#60A5FA] mb-4">
            Live
          </p>
          <h1 className="text-3xl font-black text-white mb-4">
            StepInTheRing<span className="text-[#60A5FA]">.com</span>
          </h1>
          <p className="text-base font-semibold leading-7 text-slate-300 max-w-sm mx-auto">
            Take any idea — even one you dreamed up on iDontCry — and turn it into a
            real first build. Seven questions, one fight plan.
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-400 max-w-xs mx-auto">
            Kids should build with a parent or trusted adult.
          </p>
          <a
            href="https://stepinthering.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-[#60A5FA] px-7 py-3 text-sm font-black text-slate-950 hover:opacity-90 transition"
          >
            Open StepInTheRing →
          </a>
        </div>
      </div>
    </main>
  );
}

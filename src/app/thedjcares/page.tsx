import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "theDJcares — Music as a Love Language",
  description: "Playlists that carry feeling, purpose, and healing. Music that holds the moment.",
};

const moods = [
  { label: "Grief", desc: "For when you don't have words yet.", color: "text-blue-300", border: "border-blue-400/20", bg: "bg-blue-950/20" },
  { label: "Healing", desc: "Slow. Honest. Hopeful.", color: "text-green-300", border: "border-green-400/20", bg: "bg-green-950/20" },
  { label: "Strength", desc: "When you need to remember who you are.", color: "text-orange-300", border: "border-orange-400/20", bg: "bg-orange-950/20" },
  { label: "Love", desc: "Not the easy kind. The kind that costs something.", color: "text-pink-300", border: "border-pink-400/20", bg: "bg-pink-950/20" },
  { label: "Faith", desc: "Songs that pray when you can't find the words.", color: "text-violet-300", border: "border-violet-400/20", bg: "bg-violet-950/20" },
  { label: "Joy", desc: "Because it still exists. Don't forget that.", color: "text-yellow-300", border: "border-yellow-400/20", bg: "bg-yellow-950/20" },
];

export default function TheDJCaresPage() {
  return (
    <main className="min-h-screen bg-[#080510] text-slate-100">
      <div className="mx-auto max-w-2xl px-5 py-10">

        {/* Bar */}
        <div className="flex items-center justify-between gap-4 mb-10 pb-4 border-b border-white/[0.07]">
          <Link href="https://openmirrorllc.com" className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-600 hover:text-slate-400 transition">
            Open Mirror LLC
          </Link>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-400">
            theDJcares
          </span>
        </div>

        {/* Hero */}
        <section className="mb-14">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-pink-400 mb-5">
            Open Mirror LLC
          </p>
          <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white mb-6">
            the<br />DJ<br />cares.
          </h1>
          <p className="text-xl font-semibold text-slate-300 leading-7 mb-4 max-w-md">
            Music as a love language. Playlists that carry feeling, purpose, and healing.
          </p>
          <p className="text-sm font-semibold text-slate-500 leading-6 max-w-sm mb-8">
            Not algorithm playlists. Hand-built collections for the moments that matter most — grief, strength, love, faith, joy.
          </p>
          <div className="inline-flex items-center gap-3 rounded-full border border-pink-400/30 bg-pink-900/20 px-5 py-2.5">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-pink-300">
              Coming Soon — Building Now
            </span>
          </div>
        </section>

        {/* Mood cards */}
        <section className="mb-14">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-600 mb-6">
            Playlists by feeling
          </p>
          <div className="grid grid-cols-2 gap-3">
            {moods.map((m) => (
              <div key={m.label} className={`rounded-2xl border ${m.border} ${m.bg} p-5`}>
                <p className={`text-lg font-black ${m.color} mb-1`}>{m.label}</p>
                <p className="text-xs font-semibold text-slate-400 leading-5">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What it will do */}
        <section className="mb-14 rounded-2xl border border-pink-400/15 bg-pink-950/20 p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-400 mb-5">
            What theDJcares will do
          </p>
          <div className="flex flex-col gap-4">
            {[
              "Curated playlists built for specific emotional moments",
              "Music that matches where you are, not just what's trending",
              "New drops when the moment calls for it",
              "No algorithm. No filler. Only songs that mean something.",
              "Built by someone who believes music can hold what words can't.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-pink-400 font-black mt-0.5">→</span>
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

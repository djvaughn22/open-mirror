import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "theDJcares",
  description: "Music as a love language — playlists that carry feeling, purpose, and healing.",
};

export default function TheDJCaresPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-5 py-10">

        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/[0.07]">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-600 hover:text-slate-400 transition">
            Open Mirror LLC
          </Link>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500">
            theDJcares
          </span>
        </div>

        <section className="text-center py-16">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-pink-400 mb-4">
            Concept / Coming Soon
          </p>
          <h1 className="text-4xl font-black text-white mb-5 leading-tight">
            theDJcares
          </h1>
          <p className="text-lg font-semibold text-slate-300 max-w-sm mx-auto mb-3 leading-7">
            Music as a love language — playlists that carry feeling, purpose, and healing.
          </p>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-6 mb-10">
            Layers of sound, story, and emotion woven into authentic playlists. Music that holds the moment.
          </p>

          <div className="inline-flex flex-col gap-3 items-center">
            <Link
              href="/"
              className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-6 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-slate-300 hover:border-white/25 hover:text-white transition"
            >
              ← Back to Open Mirror LLC
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

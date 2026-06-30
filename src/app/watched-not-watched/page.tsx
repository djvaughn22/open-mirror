import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watched Not Watched | Open Mirror LLC",
  description: "A clean-viewing concept for families who want safer ways to watch what they already have access to.",
};

export default function WatchedNotWatchedPage() {
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
          <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-400 mb-4">
            In Development
          </p>
          <h1 className="text-3xl font-black text-white mb-4">Watched Not Watched</h1>
          <p className="text-base font-semibold leading-7 text-slate-300 max-w-sm mx-auto">
            A clean-viewing concept for families who want safer ways to watch what they already have access to.
          </p>
          <p className="mt-6 text-sm text-slate-500">This project is in active development. Check back soon.</p>
        </div>
      </div>
    </main>
  );
}

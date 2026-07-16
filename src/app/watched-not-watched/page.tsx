import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WatchedNotWatched",
  description:
    "A fast watch list for movies and TV — thumbs, the Top 222, and picks based on what you liked. Live at watchednotwatched.com.",
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
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#22D3EE] mb-4">
            Live
          </p>
          <h1 className="text-3xl font-black text-white mb-4">
            WatchedNotWatched<span className="text-[#22D3EE]">.com</span>
          </h1>
          <p className="text-base font-semibold leading-7 text-slate-300 max-w-sm mx-auto">
            A fast watch list for movies and TV. Search anything, thumb it 👍 or 👎,
            sort the Top 222 of any decade or genre on a drag-and-drop board, and get
            picks based on what you liked.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Free. No account. Saved on your device, exportable anytime.
          </p>
          <a
            href="https://watchednotwatched.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-[#22D3EE] px-7 py-3 text-sm font-black text-slate-950 hover:opacity-90 transition"
          >
            Open WatchedNotWatched →
          </a>
        </div>
      </div>
    </main>
  );
}

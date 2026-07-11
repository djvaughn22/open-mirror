import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iDontCry | Open Mirror LLC",
  description:
    "The family's playground — dad jokes, games, and a Dream Lab to create anything with AI, free. Live at idontcry.com.",
};

export default function IDontCryPage() {
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
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#38BDF8] mb-4">
            Live
          </p>
          <h1 className="text-3xl font-black text-white mb-4">
            iDontCry<span className="text-[#38BDF8]">.com</span>
          </h1>
          <p className="text-base font-semibold leading-7 text-slate-300 max-w-sm mx-auto">
            The family&rsquo;s digital playground. Dad jokes, mini games, and the Dream Lab —
            dream up anything with AI, free, then step in the ring and build it for real.
          </p>
          <a
            href="https://idontcry.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-[#38BDF8] px-7 py-3 text-sm font-black text-slate-950 hover:opacity-90 transition"
          >
            Open iDontCry →
          </a>
        </div>
      </div>
    </main>
  );
}

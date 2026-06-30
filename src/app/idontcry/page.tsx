import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iDontCry | Open Mirror LLC",
  description: "A healing-first emotional support project for grief, strength, and honest moments.",
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
          <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500 mb-4">
            Concept / Coming Soon
          </p>
          <h1 className="text-3xl font-black text-white mb-4">iDontCry</h1>
          <p className="text-base font-semibold leading-7 text-slate-300 max-w-sm mx-auto">
            A healing-first emotional support project for grief, strength, and honest moments.
          </p>
          <p className="mt-6 text-sm text-slate-500">This project is in concept stage. Check back soon.</p>
        </div>
      </div>
    </main>
  );
}

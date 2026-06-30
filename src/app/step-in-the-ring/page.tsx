import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step In The Ring | Open Mirror LLC",
  description: "A parent-guided idea builder for turning a rough idea into a simple first MVP.",
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

        <div className="rounded-2xl border border-amber-200/20 bg-amber-950/10 p-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300 mb-4">
            Prototype / MVP
          </p>
          <h1 className="text-3xl font-black text-white mb-4">Step In The Ring</h1>
          <p className="text-base font-semibold leading-7 text-slate-300 max-w-sm mx-auto">
            A parent-guided idea builder for turning a rough idea into a simple first MVP.
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-400 max-w-xs mx-auto">
            Kids should build with a parent or trusted adult.
          </p>
          <a
            href="https://step-in-the-ring.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-full border border-amber-200/30 bg-amber-300/10 px-6 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-amber-100 hover:bg-amber-300/20 transition"
          >
            Start Building →
          </a>
        </div>
      </div>
    </main>
  );
}

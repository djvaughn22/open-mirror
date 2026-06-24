import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import CrossHeartPrayHero from "../../components/CrossHeartPrayHero";

export const metadata = {
  title: "About",
  description: "A simple daily Bible routine for CrossHeartPray.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteHeader />

        <CrossHeartPrayHero>
          <p>
            A simple daily Bible routine built to read, pray, deal cards, and
            come back to the Word.
          </p>
        </CrossHeartPrayHero>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          <Link
            href="/explorebible"
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 transition hover:border-emerald-200/40 hover:bg-white/[0.07]"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
              Random explorer
            </p>
            <h2 className="mt-4 text-2xl font-black text-white">Bible Bingo 7</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
              Seven verses, one board, chapter context, sharing, and Deep Dive
              when verified word-study data is available.
            </p>
          </Link>

          <Link
            href="/bible-reading-plan"
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 transition hover:border-emerald-200/40 hover:bg-white/[0.07]"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
              Structured path
            </p>
            <h2 className="mt-4 text-2xl font-black text-white">
              Bible Reading Plan
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
              Seven weekly lanes through Scripture, tracked in a simple
              fifty-two week board.
            </p>
          </Link>

          <Link
            href="/daily-hope"
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 transition hover:border-emerald-200/40 hover:bg-white/[0.07]"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
              Daily routine
            </p>
            <h2 className="mt-4 text-2xl font-black text-white">Daily Hope</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
              A repeatable prayer and Scripture routine for the day.
            </p>
          </Link>
        </section>

        <section className="mx-auto mt-12 max-w-4xl rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 text-center">
          <p className="text-3xl">✝️ ❤️ 🙏</p>
          <p className="mt-4 text-base font-black text-white">
            Cross Heart Pray
          </p>
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
            Come to Jesus. Receive God&apos;s everlasting, unconditional love.
            Pray, and let God&apos;s will be done.
          </p>
          <p className="mt-6 text-sm font-semibold text-slate-400">
            RIP Travis - VTL
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

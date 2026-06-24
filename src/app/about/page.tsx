import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata = {
  title: "About",
  description: "The CrossHeartPray Bible reading and discovery flow.",
};

export default function AboutPage() {
  return (
    <main className="chp-lively-dark-page min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteHeader />

        <section className="max-w-4xl text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">
            About CrossHeartPray
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">
            ✝️ Cross ❤️ Heart 🙏 Pray
          </h1>

          <div className="mt-5 max-w-3xl space-y-3">
            <p className="text-base font-semibold leading-8 text-slate-200 sm:text-lg sm:leading-9">
              CrossHeartPray brings the Bible everywhere.
            </p>
            <p className="text-sm font-semibold leading-7 text-slate-300 sm:text-base sm:leading-8">
              Discover one verse from 31,103. Open the chapter for context. Use Deep Dive.
            </p>
            <p className="text-sm font-semibold leading-7 text-slate-300 sm:text-base sm:leading-8">
              Follow Daily Hope. Track your Bible Reading Plan. Share what you find.
            </p>
          </div>

          <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-300">
            Home → Bible Reading Plan → Daily Hope → Bible Bingo 7 → About
          </p>
        </section>

        <section className="mt-14 max-w-4xl space-y-8 text-left">
          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-black text-white">Bible Reading Plan</h2>

            <ul className="mt-5 space-y-4 text-base leading-8 text-slate-300">
              <li>Open the one-page PDF.</li>
              <li>Follow a steady rhythm through Scripture.</li>
              <li>Return anytime from the menu.</li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
              <span className="rounded-full border border-white/10 px-3 py-2">Sunday — Epistles</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Monday — Law</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Tuesday — History</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Wednesday — Psalms</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Thursday — Poetry</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Friday — Prophecy</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Saturday — Gospels</span>
            </div>

            <Link
              href="/bible-reading-plan"
              className="mt-6 inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              Open Bible Reading Plan
            </Link>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-black text-white">Daily Hope</h2>

            <ul className="mt-5 space-y-4 text-base leading-8 text-slate-300">
              <li>Begin with the Sinner Prayer.</li>
              <li>Continue with the Salvation Prayer.</li>
              <li>Read the fixed hope verses for the day.</li>
              <li>Close with prayer.</li>
            </ul>

            <Link
              href="/daily-hope"
              className="mt-6 inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              Start Daily Hope
            </Link>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-black text-white">Bible Bingo 7</h2>

            <ul className="mt-5 space-y-4 text-base leading-8 text-slate-300">
              <li>One board.</li>
              <li>Seven Bible verses.</li>
              <li>Deep Dive word study when source-backed original-language data is available.</li>
            </ul>

            <div className="mt-6 rounded-[1.5rem] border border-emerald-200/15 bg-emerald-300/[0.06] p-5 text-left">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">Why 7 cards?</p>

              <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                One board. Seven places in Scripture. Each card has a purpose.
              </p>

              <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-slate-300">
                <li>Old Testament — beginning, history, prophecy</li>
                <li>Psalms — praise and prayer</li>
                <li>Proverbs — wisdom</li>
                <li>Gospel — Jesus</li>
                <li>Epistles — the Church</li>
                <li>Genesis + Revelation — the beginning and the end together</li>
              </ul>

              <p className="mt-4 text-base font-black text-emerald-50">
                God&apos;s master plan, on one board.
              </p>
            </div>

            <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">
                More card games to come
              </p>
              <p className="mt-2 text-sm font-semibold leading-7 text-slate-300">
                Same Bible-first idea: cards, verses, context, sharing, and Deep Dive.
              </p>
            </div>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              Open Bible Bingo
            </Link>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-black text-white">Cross Heart Pray</h2>

            <ul className="mt-5 space-y-4 text-base leading-8 text-slate-300">
              <li>
                <span className="font-black text-white">✝️ Cross:</span>{" "}
                <span className="font-semibold text-emerald-100">Call out to Jesus.</span>
              </li>
              <li>
                <span className="font-black text-white">❤️ Heart:</span>{" "}
                <span className="font-semibold text-emerald-100">Receive God’s love.</span>
              </li>
              <li>
                <span className="font-black text-white">🙏 Pray:</span>{" "}
                <span className="font-semibold text-emerald-100">Pray nonstop.</span>
              </li>
            </ul>
          </section>
        </section>

        <section className="mt-12 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 text-center">
          <p className="text-lg font-black text-white">
            Cross Heart Pray your way through it.
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-300">
            A simple formula for Truth, Joy and Peace.
          </p>
          <p className="mt-6 text-sm font-semibold text-slate-400">
            RIP Travis - VTL
          </p>
          <p className="mt-1 text-xl">✝️ ❤️ 🙏</p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

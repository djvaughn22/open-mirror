import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteHeader />

        <section className="max-w-4xl text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">
            About CrossHeartPray
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">
            A plan to come to Jesus.
          </h1>

          <p className="mt-7 max-w-3xl text-xl font-semibold leading-9 text-emerald-100 sm:text-2xl sm:leading-10">
            CrossHeartPray points people toward Jesus, prayer, and the Holy Bible.
          </p>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Start with Cross Heart Pray. Then open Scripture with Bible Bingo, Daily Hope, and the Bible Reading Plan.
          </p>
        </section>

        <section className="mt-14 max-w-4xl space-y-8 text-left">
          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-black text-white">
              Cross Heart Pray
            </h2>

            <ul className="mt-5 space-y-4 text-base leading-8 text-slate-300">
              <li>
                <span className="font-black text-white">✝️ Cross:</span>{" "}
                <span className="font-semibold text-emerald-100">Bring it to Jesus.</span>
              </li>
              <li>
                <span className="font-black text-white">❤️ Heart:</span>{" "}
                <span className="font-semibold text-emerald-100">Receive God’s love.</span>
              </li>
              <li>
                <span className="font-black text-white">🙏 Pray:</span>{" "}
                <span className="font-semibold text-emerald-100">Talk to God.</span>
              </li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-black text-white">
              Bible Bingo
            </h2>

            <ul className="mt-5 space-y-4 text-base leading-8 text-slate-300">
              <li>One board.</li>
              <li>Seven Bible verses.</li>
              <li>Deep Dive word study when source-backed original-language data is available.</li>
            </ul>

            <a
              href="/explorebible"
              className="mt-6 inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              Open Bible Bingo
            </a>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-black text-white">
              Daily Hope
            </h2>

            <ul className="mt-5 space-y-4 text-base leading-8 text-slate-300">
              <li>Begin with the Sinner Prayer.</li>
              <li>Continue with the Salvation Prayer.</li>
              <li>Read the fixed hope verses for the day.</li>
              <li>Close with prayer.</li>
            </ul>

            <a
              href="/daily-hope"
              className="mt-6 inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              Start Daily Hope
            </a>
          </section>

          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-black text-white">
              Bible Reading Plan
            </h2>

            <ul className="mt-5 space-y-4 text-base leading-8 text-slate-300">
              <li>Open the one-page PDF.</li>
              <li>Follow a steady rhythm through Scripture.</li>
              <li>Return anytime from the menu.</li>
            </ul>

            <a
              href="/resources/52-week-bible-reading-plan.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              Open Bible Reading Plan
            </a>
          </section>
        </section>
</div>
          <SiteFooter />
    </main>
  );
}

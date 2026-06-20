export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-16 grid grid-cols-3 items-center">
          <a href="/home" className="justify-self-start font-bold">
            CrossHeartPray
          </a>

          <a
            href="https://www.bible.com/verse-of-the-day"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open YouVersion Bible App"
            className="justify-self-center"
          >
            <img
              src="/brand/youversion-bible-app.png"
              alt="Holy Bible"
              className="h-10 w-10 rounded-lg"
            />
          </a>

          <details className="relative justify-self-end text-right">
            <summary className="cursor-pointer list-none rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/15">
              Menu
            </summary>

            <div className="absolute right-0 z-50 mt-4 flex w-56 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right shadow-2xl">
              <a href="/home">Home</a>
              <a href="/cross">Cross</a>
              <a href="/heart">Heart</a>
              <a href="/pray">Pray</a>
              <a href="/explorebible">Bible Bingo</a>
              <a href="/daily-hope">Daily Hope</a>
              <a href="/resources/52-week-bible-reading-plan.pdf" target="_blank" rel="noopener noreferrer">
                Bible Reading Plan
              </a>
              <a href="/about">About</a>
            </div>
          </details>
        </nav>

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

        <section className="mt-14 max-w-4xl border-t border-white/10 pt-8 text-left">
          <p className="text-sm font-semibold tracking-[0.24em] text-slate-400">
            ✝️ CROSS ❤️ HEART 🙏 PRAY
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-300">
            RIP Travis - VTL
          </p>
        </section>
      </div>
    </main>
  );
}

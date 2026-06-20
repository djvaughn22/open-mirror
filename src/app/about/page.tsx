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

        <section className="mx-auto max-w-4xl text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">
            About CrossHeartPray
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">
            What am I looking at?
          </h1>

          <p className="mt-7 max-w-3xl text-xl font-semibold leading-9 text-emerald-100 sm:text-2xl sm:leading-10">
            CrossHeartPray is a simple path back to Jesus: bring it to Him, receive God’s love, pray, then open the Holy Bible.
          </p>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            This site is for the moment when you want to begin again, but you do not know what to do first.
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-4xl space-y-6 text-left">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-xl shadow-black/10 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              Start here
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              Cross. Heart. Pray.
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8">
              <p className="text-slate-300">
                <span className="font-black text-white">✝️ Cross:</span>{" "}
                <span className="font-semibold text-emerald-100">Bring it to Jesus.</span>
              </p>

              <p className="text-slate-300">
                <span className="font-black text-white">❤️ Heart:</span>{" "}
                <span className="font-semibold text-emerald-100">Receive God’s love.</span>
              </p>

              <p className="text-slate-300">
                <span className="font-black text-white">🙏 Pray:</span>{" "}
                <span className="font-semibold text-emerald-100">Talk to God.</span>
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-xl shadow-black/10 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              Then open the Bible
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              Bible Bingo
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Bible Bingo is a simple, joyful way to open the Holy Bible: one board, seven verses, with source-backed Deep Dive word study when available.
            </p>

            <a
              href="/explorebible"
              className="mt-6 inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              Open Bible Bingo
            </a>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-xl shadow-black/10 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              If you do not know where to start
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              Daily Hope
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Daily Hope begins with the Sinner Prayer and Salvation Prayer, then gives you fixed daily hope verses and a closing prayer to help you keep going.
            </p>

            <a
              href="/daily-hope"
              className="mt-6 inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              Start with Daily Hope
            </a>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-xl shadow-black/10 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              Keep reading
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              Bible Reading Plan
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              The Bible Reading Plan is a one-page PDF you can open anytime to keep moving through Scripture with a steady rhythm.
            </p>

            <a
              href="/resources/52-week-bible-reading-plan.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              Open Bible Reading Plan
            </a>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-4xl border-t border-white/10 pt-8 text-left">
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

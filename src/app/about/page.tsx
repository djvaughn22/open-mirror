import BibleVerseLookup from "../../components/BibleVerseLookup";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-16 grid grid-cols-3 items-center">
          <a href="/home" className="justify-self-start font-bold">
            CrossHeartPray
          </a>

          <a href="https://www.bible.com/verse-of-the-day" target="_blank" rel="noopener noreferrer" aria-label="Open Bible.com Verse of the Day" className="justify-self-center">
            <img src="/brand/youversion-bible-app.png" alt="Holy Bible" className="h-10 w-10 rounded-lg" />
          </a>

          <details className="relative justify-self-end text-sm text-zinc-400">
            <summary className="cursor-pointer list-none text-2xl leading-none">
              ☰
            </summary>

            <div className="absolute right-0 z-50 mt-4 flex w-56 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right shadow-2xl">
              <a href="/home">Home</a>
              <a href="/cross">Cross</a>
              <a href="/heart">Heart</a>
              <a href="/pray">Pray</a>
              <a href="/explorebible">Bible Bingo</a>
              <a href="https://www.bibleportal.com/" target="_blank" rel="noopener noreferrer">
                Bible Portal
              </a>
              <a href="/about">About</a>
            </div>
          </details>
        </nav>

        <section className="mx-auto max-w-3xl text-center">
          <p className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-black uppercase tracking-[0.14em] text-zinc-300 sm:text-base">
            <span className="inline-flex items-center gap-1.5"><span className="text-2xl">✝️</span><span>Cross</span></span>
            <span className="inline-flex items-center gap-1.5"><span className="text-2xl">❤️</span><span>Heart</span></span>
            <span className="inline-flex items-center gap-1.5"><span className="text-2xl">🙏</span><span>Pray</span></span>
          </p>

          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
            Cross Heart Pray
          </h1>

          <div className="mx-auto mt-7 max-w-2xl space-y-4 text-xl font-semibold leading-8 text-zinc-300 sm:text-2xl sm:leading-9">
            <p>Cross Heart Pray is a simple way back to the Bible.</p>
            <p>Bible Bingo 7 is a daily board for discovery, context, deep dives, and sharing.</p>
            <p>Deal a board. Search a verse. Open the chapter. Dive deeper.</p>
            <p className="font-bold text-white">Share the verse, your heart, and your prayer.</p>
          </div>
        </section>

        <BibleVerseLookup />

        <section className="mx-auto mt-12 max-w-3xl border-t border-zinc-900 pt-10 text-center">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] px-6 py-8 shadow-2xl shadow-black/20 sm:px-8">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-zinc-500">
              RIP Nerf
            </p>

            <p className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              For the brokenhearted
            </p>

            <a
              href="https://www.bible.com/bible/206/PSA.34.18.WEBUS"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-6 block max-w-2xl rounded-[1.5rem] border border-white/10 bg-black/20 px-6 py-6 text-lg font-semibold leading-8 text-zinc-200 transition hover:bg-white/[0.07]"
            >
              <span className="block text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
                Psalm 34:18
              </span>
              <span className="mt-3 block">
                The Lord is close to the brokenhearted and saves those who are crushed in spirit.
              </span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

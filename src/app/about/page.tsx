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
            <p className="font-bold text-white">Share the verse, your heart, and your prayer.</p>
          </div>
        </section>

        <BibleVerseLookup />

        <section className="mx-auto mt-12 max-w-3xl border-t border-zinc-900 pt-10 text-center">
          <a
            href="https://www.bible.com/bible/206/2CO.3.17.WEBUS"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto block max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.045] px-6 py-7 text-lg font-semibold leading-8 text-zinc-200 shadow-2xl shadow-black/20 transition hover:bg-white/[0.07]"
          >
            <span className="block text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
              2 Corinthians 3:17
            </span>
            <span className="mt-3 block">
              Now the Lord is the Spirit, and where the Spirit of the Lord is, there is liberty.
            </span>
          </a>

          <p className="mt-8 text-sm font-black uppercase tracking-[0.22em] text-zinc-500">
            RIP Travis - VTL
          </p>

          <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-zinc-400">
            ✝️ Cross · ❤️ Heart · 🙏 Pray
          </p>
        </section>
      </div>
    </main>
  );
}

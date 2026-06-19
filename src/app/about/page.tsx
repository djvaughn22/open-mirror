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
            Bible Bingo 7
          </h1>

          <div className="mx-auto mt-7 max-w-2xl space-y-4 text-xl font-semibold leading-8 text-zinc-300 sm:text-2xl sm:leading-9">
            <p>
              A simple, joyful way to open the Holy Bible.
              <br />
              One board. Seven verses. Fresh discovery, context, Deep Dive word study, and easy sharing.
              <br />
              <span className="font-bold text-white">
                Deal your board, follow what stands out, and share a verse, a thought, or a prayer.
              </span>
            </p>
          </div>
        </section>

        <BibleVerseLookup
          initialReference="Proverbs 24:14"
          showSearch={false}
          spinMode="proverbs"
          spinLabel="Spin Proverbs"
          title="Wisdom for Your Soul"
          description="Open Proverbs 24:14, spin another proverb, and share what stands out."
        />

        
      </div>

      
        <section
          aria-label="Cross Heart Pray memorial"
          className="mx-auto mt-12 max-w-3xl border-t border-white/10 pt-8 text-center"
        >
          <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-300">
            RIP Travis - VTL
          </p>

          <p className="mt-3 text-base font-black text-white sm:text-lg">
            ✝️ Cross ❤️ Heart 🙏 Pray
          </p>
        </section>

      </main>
  );
}

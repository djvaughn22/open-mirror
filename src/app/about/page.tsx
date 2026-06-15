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
              <a href="/explorebible">Holy Bible Explorer</a>
              <a href="https://www.bibleportal.com/" target="_blank" rel="noopener noreferrer">
                Bible Portal
              </a>
              <a href="/about">About</a>
            </div>
          </details>
        </nav>

        <section className="mx-auto max-w-3xl space-y-6 text-lg leading-8 text-zinc-300">
          <h1 className="text-4xl font-bold text-white">About CrossHeartPray</h1>

          <p className="mt-4 text-lg font-semibold text-blue-300">
            A formula for Truth, Joy and Peace.
          </p>

          <p>CrossHeartPray is about action.</p>

          <p>Coming to the Cross.</p>

          <p>Opening your heart to God&apos;s love.</p>

          <p>Praying through the good, the bad, and the ugly.</p>

          <p>The micro moments and the macro moments.</p>

          <p>The daily decisions and the life-changing ones.</p>

          <p>One step at a time.</p>

          <p>Bible Explorer helps you explore the Holy Bible by section with Bible Bingo cards that reveal random verses from Old Testament, Psalms, Proverbs, Gospel, Epistles, Genesis, and Revelation, then lets you regenerate the cards or click into the verse and chapter for context in the Holy Bible app.</p>

          <p>CrossHeartPray doesn&apos;t replace the Bible.</p>

          <p>It doesn&apos;t replace prayer.</p>

          <p>It doesn&apos;t replace church, family, or community.</p>

          <p>It is simply a reminder.</p>

          <p>Cross Heart Pray your way through it.</p>

          <p>✝️ In the name of the Father, Son and Holy Ghost.</p>

          <p>❤️ Touch your heart and receive God&apos;s love.</p>

          <p>🙏 Put your hands together and Pray.</p>

          <p>Then take the next step.</p>

          <p>The Bible is the guide.</p>

          <p>Jesus is the destination.</p>

          <div className="mt-12 space-y-5 border-t border-zinc-800 pt-10 text-center">
            <p className="text-5xl">✝️ ❤️ 🙏</p>

            <p className="text-2xl font-bold text-white">Cross Heart Pray</p>

            <p className="text-base font-semibold tracking-wide text-zinc-400">
              RIP Travis. VTL.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

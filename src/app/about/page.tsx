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

          <p>Cross Heart Pray is simple.</p>

          <p>Turn to Jesus.</p>

          <p>Open your heart to God.</p>

          <p>Pray.</p>

          <p>Whether you are strong in your faith, just beginning, returning after years away, asking questions, carrying a burden, celebrating a victory, or simply curious, you are welcome here.</p>

          <p>The Holy Bible has helped people find Truth, Joy and Peace for generations.</p>

          <p>Cross Heart Pray is a simple reminder to open it, read it, think about it, and carry it with you throughout the day.</p>

          <p>Bring it to Jesus.</p>

          <p>The good, the bad, and the ugly.</p>

          <p>One step at a time.</p>

          <hr className="border-zinc-800" />

          <p className="text-5xl">✝️ ❤️ 🙏</p>

          <p className="text-2xl font-bold text-white">Cross Heart Pray</p>

          <p>RIP Travis. VTL.</p>
        </section>
      </div>
    </main>
  );
}

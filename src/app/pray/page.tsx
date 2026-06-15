export default function PrayPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <nav className="mb-16 grid grid-cols-3 items-center">
          <a href="/home" className="justify-self-start font-bold">
            CrossHeartPray
          </a>

          <span aria-hidden="true" />

          <div className="justify-self-end flex items-center gap-4">
            <a href="https://www.bible.com/verse-of-the-day" target="_blank" rel="noopener noreferrer" aria-label="Open YouVersion Bible App">
              <img src="/brand/youversion-bible-app.png" alt="YouVersion Bible App" className="h-9 w-9 rounded-lg" />
            </a>

            <details className="relative text-sm text-zinc-400">
              <summary className="cursor-pointer list-none text-2xl leading-none">☰</summary>
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
          </div>
        </nav>

        <div className="text-center">
          <div className="mb-8 text-7xl">🙏</div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Step 3
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Pray
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-xl font-semibold leading-9 text-blue-300 sm:text-2xl sm:leading-10">
            Just talk to God. Let His will be done.
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-xl font-semibold leading-9 text-zinc-300 sm:text-2xl sm:leading-10">
            Pray in the morning
            <br />
            Pray all day and evenings
            <br />
            Your Father is near
          </p>
        </div>

        <section className="mt-16 rounded-[2rem] border border-zinc-800 bg-zinc-950 px-8 py-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
            Prayer
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl gap-10 md:grid-cols-3">
            <div>
              <div className="text-4xl">🙌</div>
              <h2 className="mt-5 text-2xl font-bold">Praise God</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Praise God the Almighty..
                <br />
                Always!
              </p>
            </div>

            <div>
              <div className="text-4xl">❤️</div>
              <h2 className="mt-5 text-2xl font-bold">Thank God</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Thank God for His love.
                <br />
                Always!
              </p>
            </div>

            <div>
              <div className="text-4xl">🙏</div>
              <h2 className="mt-5 text-2xl font-bold">Ask God</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Ask God for guidance.
                <br />
                Always!
              </p>
            </div>
          </div>
        </section>

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <a href="/explorebible" target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-700 px-8 py-3 text-center font-semibold text-white hover:border-white">
              Holy Bible Explorer
            </a>
        </div>
      </section>
      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © 2026 Open Mirror LLC. Follow Jesus. Love God. Pray.
      </footer>
    </main>
  );
}

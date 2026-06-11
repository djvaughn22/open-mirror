export default function HeartPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <nav className="mb-16 grid grid-cols-3 items-center">
          <a href="/welcome" className="justify-self-start font-bold">
            Open Mirror
          </a>

          <span aria-hidden="true" />

          <div className="justify-self-end flex items-center gap-4">
            <a href="https://www.bible.com/app" target="_blank" rel="noopener noreferrer" aria-label="Open YouVersion Bible App">
              <img src="/brand/youversion-bible-app.png" alt="YouVersion Bible App" className="h-9 w-9 rounded-lg" />
            </a>

            <details className="relative text-sm text-zinc-400">
              <summary className="cursor-pointer list-none text-2xl leading-none">☰</summary>
              <div className="absolute right-0 z-50 mt-4 flex w-56 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right shadow-2xl">
                <a href="/welcome">Home</a>
                <a href="/cross-heart-pray">Cross Heart Pray</a>
                <a href="/bible-explorer">Holy Bible Explorer</a>
                <a href="/the-dj-cares">TheDJCares</a>
                <a href="/what-am-i-ai">WhatAmIAI</a>
              </div>
            </details>
          </div>
        </nav>

        <div className="text-center">
          <div className="mb-8 text-7xl">❤️</div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Step Two
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Heart
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl font-semibold leading-9 text-zinc-300 sm:text-2xl sm:leading-10">
            God loves you deeply
            <br />
            His grace and mercy are true
            <br />
            Walk within His love
          </p>
        </div>

        <section className="mt-16 rounded-[2rem] border border-zinc-800 bg-zinc-950 px-8 py-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
            The Heart
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl gap-10 md:grid-cols-3">
            <div>
              <div className="text-4xl">❤️</div>
              <h2 className="mt-5 text-2xl font-bold">God Loves</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                God is love.
                <br />
                His love is for all.
              </p>
            </div>

            <div>
              <div className="text-4xl">🕊️</div>
              <h2 className="mt-5 text-2xl font-bold">God Gives Grace</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Grace is a gift.
                <br />
                Mercy is real.
              </p>
            </div>

            <div>
              <div className="text-4xl">📖</div>
              <h2 className="mt-5 text-2xl font-bold">God Speaks Truth</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                God&apos;s Word is true.
                <br />
                His truth leads to life.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <a href="/cross-heart-pray/pray" className="rounded-full bg-white px-8 py-3 text-center font-semibold text-black">
            Next: Pray
          </a>
        </div>
      </section>
      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © 2026 Open Mirror LLC. Follow Jesus. Love God. Pray.
      </footer>
    </main>
  );
}

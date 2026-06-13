export default function CrossPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <nav className="mb-16 grid grid-cols-3 items-center">
        <a href="/home" className="justify-self-start font-bold">
          CrossHeartPray
        </a>

        <span aria-hidden="true" />

        <div className="justify-self-end flex items-center gap-4">
          <a
            href="https://www.bible.com/verse-of-the-day"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open YouVersion Bible App"
          >
            <img
              src="/brand/youversion-bible-app.png"
              alt="YouVersion Bible App"
              className="h-9 w-9 rounded-lg"
            />
          </a>

          <details className="relative text-sm text-zinc-400">
          <summary className="cursor-pointer list-none text-2xl leading-none">
            ☰
          </summary>

          <div className="absolute right-0 z-50 mt-4 flex w-56 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right shadow-2xl">
              <a href="/home">Home</a>
              <a href="/cross">Cross</a>
              <a href="/heart">Heart</a>
              <a href="/pray">Pray</a>
              <a href="/explorebible">Holy Holy Bible Explorer</a>
              <a href="/the-dj-cares">TheDJCares</a>
              <a href="/what-am-i-ai">WhatAmIAI</a>
              <a href="https://www.bibleportal.com/" target="_blank" rel="noopener noreferrer">
                Bible Portal
              </a>
              <a href="/about">About</a>
            </div>
          </details>
        </div>

        </nav>

        <div className="text-center">
          <div className="mb-8 text-7xl">✝️</div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Step One
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Cross
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-2xl font-semibold leading-10 text-zinc-300">
            Jesus died on cross
            <br />
            He descended into hell
            <br />
            And He rose again
          </p>
        </div>

        

<section className="mt-16 rounded-[2rem] border border-zinc-800 bg-zinc-950 px-8 py-12 text-center">
  <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
    The Cross
  </p>

  <div className="mx-auto mt-10 grid max-w-4xl gap-10 md:grid-cols-3">
    <div>
      <div className="text-4xl">✝️</div>
      <h2 className="mt-5 text-2xl font-bold">Jesus Died</h2>
      <p className="mt-4 leading-7 text-zinc-400">
        Jesus died on the Cross.
        <br />
        He gave His life for all.
      </p>
    </div>

    <div>
      <div className="text-4xl">⬇️</div>
      <h2 className="mt-5 text-2xl font-bold">He Descended</h2>
      <p className="mt-4 leading-7 text-zinc-400">
        He descended into hell.
        <br />
        Death did not hold Him.
      </p>
    </div>

    <div>
      <div className="text-4xl">☀️</div>
      <h2 className="mt-5 text-2xl font-bold">He Rose Again</h2>
      <p className="mt-4 leading-7 text-zinc-400">
        Jesus rose again.
        <br />
        Life is found in Him.
      </p>
    </div>
  </div>
</section>



        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="/heart"
            className="rounded-full bg-white px-8 py-3 text-center font-semibold text-black"
          >
            Next: Heart
          </a>
        </div>
      </section>
      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © 2026 Open Mirror LLC. Follow Jesus. Love God. Pray.
      </footer>
    </main>
  );
}
export default function CrossPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <nav className="mb-16 grid grid-cols-3 items-center">
        <a href="/" className="justify-self-start font-bold">
          Open Mirror
        </a>

        <a
          href="https://www.bible.com/app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open YouVersion Bible App"
          className="justify-self-center"
        >
          <img
            src="/brand/youversion-bible-app.png"
            alt="YouVersion Bible App"
            className="h-9 w-9 rounded-lg"
          />
        </a>

        <details className="relative justify-self-end text-sm text-zinc-400">
          <summary className="cursor-pointer list-none text-2xl leading-none">
            ☰
          </summary>

          <div className="absolute right-0 z-50 mt-4 flex w-56 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right shadow-2xl">
            <a href="/">Home</a>
            <a href="/cross-heart-pray">Cross Heart Pray</a>
            <a href="/cross-heart-pray/reflect">Talk To The Mirror</a>
            <a href="/the-dj-cares">TheDJCares</a>
            <a href="/what-am-i-ai">WhatAmIAI</a>
          </div>
        </details>

        </nav>

        <div className="text-center">
          <div className="mb-8 text-7xl">✝️</div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Step One
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Cross
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
            The Cross is where you stop pretending you can save yourself.
            You surrender, repent, accept forgiveness, and remember that Jesus
            redeems sinners.
          </p>
        </div>

        <section className="mt-16 grid gap-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-2xl font-bold">Surrender</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              Bring the real thing to Jesus. Not the polished version. Not the
              edited version. The honest version.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-2xl font-bold">Repent</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              Turn from what is false, destructive, hidden, proud, selfish, or
              separating you from God.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-2xl font-bold">Accept Forgiveness</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              The Cross is not where shame wins. The Cross is where Jesus
              forgives, restores, and redeems.
            </p>
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href="/cross-heart-pray/heart"
            className="rounded-full bg-white px-8 py-3 text-center font-semibold text-black"
          >
            Next: Heart
          </a>
          <a
            href="/cross-heart-pray/reflect"
            className="rounded-full border border-zinc-700 px-8 py-3 text-center font-semibold text-white hover:border-white"
          >
            Begin Reflection
          </a>
        </div>
      </section>
    </main>
  );
}
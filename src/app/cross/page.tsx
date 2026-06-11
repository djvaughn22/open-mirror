
export default function CrossPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-5">
        <nav className="mx-auto grid grid-cols-3 max-w-6xl items-center">
        <a href="/welcome" className="justify-self-start font-bold">
          Open Mirror
        </a>

        <span aria-hidden="true" />

        <div className="justify-self-end flex items-center gap-4">
          <a
            href="https://www.bible.com/app"
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
            <a href="/welcome">Home</a>
            <a href="/welcome">Cross Heart Pray</a>
            <a href="/bible-explorer">Holy Bible Explorer</a>
            <a href="/the-dj-cares">TheDJCares</a>
            <a href="/what-am-i-ai">WhatAmIAI</a>
          </div>
          </details>
        </div>

        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mb-6 text-7xl">✝️</div>

        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-zinc-500">
          Step One
        </p>

        <h1 className="mb-6 text-5xl font-bold">Bring it to the Cross.</h1>

        <p className="mx-auto mb-12 max-w-2xl text-xl leading-9 text-zinc-300">
          Lay down what you&apos;ve been carrying. Bring the truth to Jesus.
          Find forgiveness, freedom, and a new beginning.
        </p>

        <div className="grid gap-4 text-left md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">1</p>
            <h2 className="mb-2 text-xl font-semibold">Name it</h2>
            <p className="text-zinc-400">
              Fear, shame, anger, sin, confusion, regret, grief, or a decision
              you do not know how to carry.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">2</p>
            <h2 className="mb-2 text-xl font-semibold">Lay it down</h2>
            <p className="text-zinc-400">
              You were not made to carry everything alone or save yourself by
              strength, performance, or control.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">3</p>
            <h2 className="mb-2 text-xl font-semibold">Trust Jesus</h2>
            <p className="text-zinc-400">
              Bring the real thing to Him. Not the polished version. Not the
              hidden version. The honest one.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-2 font-semibold">Reflection Question</p>
          <p className="text-zinc-300">
            What do I need to lay down at the Cross today?
          </p>
        </div>
      </section>
    </main>
  );
}
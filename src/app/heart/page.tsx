import Link from "next/link";

export default function HeartPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-5">
        <nav className="mx-auto grid grid-cols-3 max-w-6xl items-center">
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
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mb-6 text-7xl">❤️</div>

        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-zinc-500">
          Step Two
        </p>

        <h1 className="mb-6 text-5xl font-bold">
          Receive God's Love
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl leading-9 text-zinc-300">
          Receive God's love, grace, mercy, and truth.
          <br />
          You are loved more than you know.
        </p>

        <div className="mx-auto max-w-3xl space-y-6 text-center text-lg leading-8 text-zinc-300">
          <p>Not because you earned it.</p>

          <p>Not because you deserve it.</p>

          <p>Because that is who God is.</p>

          <p>His mercy is new every morning.</p>

          <p>His grace is sufficient.</p>

          <p>His promises are true.</p>
        </div>

        <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">1</p>

            <h2 className="mb-2 text-xl font-semibold">
              Receive Love
            </h2>

            <p className="text-zinc-400">
              Let God's love speak louder than shame, fear, pride, failure,
              and doubt.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">2</p>

            <h2 className="mb-2 text-xl font-semibold">
              Trust Grace
            </h2>

            <p className="text-zinc-400">
              You are not beyond mercy. You are not forgotten. You are not alone.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">3</p>

            <h2 className="mb-2 text-xl font-semibold">
              Share Love
            </h2>

            <p className="text-zinc-400">
              Love received becomes love given.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-2 font-semibold">Reflection Question</p>

          <p className="text-zinc-300">
            What would change if you truly believed God loved you?
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-2 font-semibold">Scripture</p>

          <p className="text-zinc-300">
            "We love because He first loved us."
          </p>

          <p className="mt-2 text-zinc-500">
            1 John 4:19
          </p>
        </div>

        <Link
          href="/cross-heart-pray/reflect"
          className="mt-10 inline-block rounded-full bg-white px-8 py-3 font-semibold text-black"
        >
          Talk To The Mirror
        </Link>
      </section>
    </main>
  );
}

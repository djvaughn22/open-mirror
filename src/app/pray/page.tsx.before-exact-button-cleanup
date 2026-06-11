import Link from "next/link";

export default function PrayPage() {
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
            <a href="/cross-heart-pray">Cross Heart Pray</a>
            <a href="/cross-heart-pray/reflect">Talk To The Mirror</a>
            <a href="/the-dj-cares">TheDJCares</a>
            <a href="/what-am-i-ai">WhatAmIAI</a>
          </div>
          </details>
        </div>

        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mb-6 text-7xl">🙏</div>

        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-zinc-500">
          Step Three
        </p>

        <h1 className="mb-6 text-5xl font-bold">
          Talk Honestly With God
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl leading-9 text-zinc-300">
          Praise Him.
          <br />
          Thank Him.
          <br />
          Ask for help.
          <br />
          Trust Him with the next step.
        </p>

        <div className="mt-12 grid gap-4 text-left md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">A</p>

            <h2 className="mb-2 text-xl font-semibold">
              Adoration
            </h2>

            <p className="text-zinc-400">
              Praise God for who He is.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">C</p>

            <h2 className="mb-2 text-xl font-semibold">
              Confession
            </h2>

            <p className="text-zinc-400">
              Bring your sins, struggles, and failures honestly before Him.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">T</p>

            <h2 className="mb-2 text-xl font-semibold">
              Thanksgiving
            </h2>

            <p className="text-zinc-400">
              Thank God for His blessings, grace, and faithfulness.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">S</p>

            <h2 className="mb-2 text-xl font-semibold">
              Supplication
            </h2>

            <p className="text-zinc-400">
              Ask God for help, wisdom, strength, guidance, and peace.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-2 font-semibold">Reflection Question</p>

          <p className="text-zinc-300">
            What do I need to say honestly to God today?
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-2 font-semibold">Scripture</p>

          <p className="text-zinc-300">
            "Do not be anxious about anything, but in everything by prayer and
            supplication with thanksgiving let your requests be made known to
            God."
          </p>

          <p className="mt-2 text-zinc-500">
            Philippians 4:6
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
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

        <div className="text-center">
          <div className="mb-8 text-7xl">❤️</div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Step Two
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Heart
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
            The Heart is where you receive what Jesus gives: God&apos;s love,
            mercy, grace, forgiveness, and faith. You do not just know it in
            your head. You let it reach your heart.
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-xl italic leading-9 text-zinc-400">
            God is love for you
            <br />
            Open your heart and receive
            <br />
            Walk within His truth
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-xl italic leading-9 text-zinc-400">
            God is love for you
            <br />
            Open your heart and receive
            <br />
            Walk within His truth
          </p>
        </div>

        <section className="mt-16 grid gap-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-2xl font-bold">Receive God&apos;s Love</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              You are not loved because you performed perfectly. You are loved
              because God is love, and Jesus came to save.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-2xl font-bold">Trust His Mercy</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              Mercy means your failure does not get the final word. God&apos;s
              grace does.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-2xl font-bold">Share His Love</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              What God gives you is not meant to stay hidden. Receive His love,
              then carry it into your family, your work, your friendships, and
              your next decision.
            </p>
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href="/cross-heart-pray/pray"
            className="rounded-full bg-white px-8 py-3 text-center font-semibold text-black"
          >
            Next: Pray
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
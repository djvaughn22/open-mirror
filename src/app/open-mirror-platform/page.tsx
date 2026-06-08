export default function OpenMirrorPlatformPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto grid grid-cols-3 max-w-6xl items-center px-6 py-6">
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

      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-5xl">🪞</div>

        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Reflection · Faith · Growth · Purpose
        </p>

        <h1 className="text-5xl font-bold leading-tight md:text-7xl">
          Open Mirror Platform
        </h1>

        <h2 className="mt-6 text-3xl font-semibold text-zinc-300 md:text-5xl">
          One question.
          <br />
          Many mirrors.
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          Open Mirror is the home for tools, content, and communities designed
          to help people reflect honestly, grow intentionally, and move forward
          with purpose.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/welcome"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Explore Open Mirror
          </a>

          <a
            href="#ecosystem"
            className="rounded-full border border-zinc-700 px-8 py-3"
          >
            View Ecosystem
          </a>
        </div>
      </section>

      <section
        id="ecosystem"
        className="border-t border-zinc-900 px-6 py-24 text-center"
      >
        <h2 className="text-4xl font-bold md:text-6xl">
          Look in the mirror.
          <br />
          What do you see?
        </h2>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
          <a
            href="/cross-heart-pray"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8"
          >
            <div className="text-4xl">✝️ ❤️ 🙏</div>
            <h3 className="mt-4 text-2xl font-bold">Cross Heart Pray</h3>
            <p className="mt-4 text-zinc-400">
              Faith-centered reflection and prayer.
            </p>
          </a>

          <a
            href="/what-am-i-ai"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8"
          >
            <div className="text-4xl">🤖 🪞</div>
            <h3 className="mt-4 text-2xl font-bold">What Am I AI?</h3>
            <p className="mt-4 text-zinc-400">
              Discover patterns hidden in your words.
            </p>
          </a>

          <a
            href="/the-dj-cares"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8"
          >
            <div className="text-4xl">🎵 ❤️ 🤝</div>
            <h3 className="mt-4 text-2xl font-bold">The DJ Cares</h3>
            <p className="mt-4 text-zinc-400">
              Encouragement, help, and hope.
            </p>
          </a>
        </div>
      </section>

      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © Open Mirror LLC. Built one step at a time.
      </footer>
    </main>
  );
}
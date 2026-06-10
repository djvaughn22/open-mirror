const products = [
  {
    name: "Cross Heart Pray",
    emoji: "✝️ ❤️ 🙏",
    href: "/cross-heart-pray",
    description:
      "A simple visual language for seeking Jesus, knowing God’s love, and staying close to God through prayer.",
  },
  {
    name: "TheDJCares",
    emoji: "🎵 ❤️ 🤝",
    href: "/the-dj-cares",
    status: "Coming Soon",
    description:
      "Spins uplifting music, podcasts, sermons, and more for any mood, moment, or season.",
  },
  {
    name: "WhatAmIAI",
    emoji: "🤖 📖",
    href: "/what-am-i-ai",
    status: "Coming Soon",
    description:
      "A deeper step-by-step reflection experience with related Bible stories, Gospel-focused Scripture, and space to see more clearly.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto grid max-w-6xl grid-cols-3 items-center px-6 py-6">
        <a href="/welcome" className="justify-self-start font-bold">
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
            <a href="/welcome">Home</a>
            <a href="/cross-heart-pray">Cross Heart Pray</a>
            <a href="/cross-heart-pray/reflect">Begin Reflection</a>
            <a href="/the-dj-cares">TheDJCares</a>
            <a href="/what-am-i-ai">WhatAmIAI</a>
          </div>
        </details>
      </nav>

      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-5xl tracking-[0.35em] md:text-6xl">
          ✝️ ❤️ 🙏
        </p>

        <h1 className="text-6xl font-bold leading-tight md:text-8xl">
          Open the Bible.
        </h1>

        <h2 className="mt-6 text-3xl font-semibold text-zinc-300 md:text-5xl">
          The truth will set you free.
        </h2>

        <a
          href="https://www.bible.com/search/bible?q=John%208%3A31-32"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-sm text-zinc-500 underline decoration-zinc-700 underline-offset-4 hover:text-white"
        >
          John 8:31–32
        </a>

        <div className="mt-12">
          <a
            href="/cross-heart-pray/reflect"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Begin Reflection
          </a>
        </div>
      </section>

      <section
        id="mission"
        className="border-t border-zinc-900 px-6 py-24 text-center"
      >
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          The Mission
        </p>

        <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Spend time in God&apos;s Word.
          <br />
          Grow closer to God.
          <br />
          Live it. Share it.
        </h2>
      </section>

      <section
        id="journey"
        className="border-t border-zinc-900 px-6 py-24 text-center"
      >
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          More Coming
        </p>

        <h2 className="text-4xl font-bold md:text-5xl">
          Built around Scripture, prayer, and faith.
        </h2>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 text-left md:grid-cols-3">
          {products.map((product) =>
            product.href ? (
              <a
                key={product.name}
                href={product.href}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 transition hover:-translate-y-1 hover:border-zinc-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-3xl">{product.emoji}</div>
                  {product.status && (
                    <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {product.status}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-2xl font-bold">{product.name}</h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  {product.description}
                </p>
              </a>
            ) : (
              <div
                key={product.name}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 opacity-90"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-3xl">{product.emoji}</div>
                  <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    {product.status}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-bold">{product.name}</h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  {product.description}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © Open Mirror LLC. Open God&apos;s Word. Pray. Follow Jesus.
      </footer>
    </main>
  );
}

const products = [
  {
    name: "Cross Heart Pray",
    emoji: "✝️ ❤️ 🙏",
    href: "/cross-heart-pray",
    description:
      "Turn away from the mirror. Bring what you see to Jesus, receive God’s truth through Scripture, and pray honestly.",
  },
  {
    name: "TheDJCares",
    emoji: "🎵 ❤️ 🤝",
    href: "/the-dj-cares",
    description:
      "Coming soon: Music, playlists, and encouragement that help people find hope, healing, and the right soundtrack for the road ahead.",
  },
  {
    name: "WhatAmIAI",
    emoji: "🤖 🪞",
    href: "/what-am-i-ai",
    description:
      "Coming soon: A tool for noticing patterns, questions, and blind spots more clearly.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto grid grid-cols-3 max-w-6xl items-center px-6 py-6">
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
            <a href="/cross-heart-pray/reflect">Talk To The Mirror</a>
            <a href="/the-dj-cares">TheDJCares</a>
            <a href="/what-am-i-ai">WhatAmIAI</a>
          </div>
        </details>

      </nav>

      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Truth · Reflection · Freedom
        </p>

        <h1 className="text-6xl font-bold leading-tight md:text-8xl">
          Look in the Mirror.
        </h1>

        <h2 className="mt-6 text-3xl font-semibold text-zinc-300 md:text-5xl">
          What do you see?
        </h2>

        <h3 className="mt-6 text-3xl font-semibold text-zinc-300 md:text-5xl">
          The Truth Will Set You Free.
        </h3>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          Pause for a moment. Look honestly at yourself and notice what has your
          attention. God already knows you fully.
        </p>

        <p className="mt-8 max-w-2xl text-xl leading-9 text-zinc-300">
          Do not stay at the mirror.
          <br />
          Turn.
          <br />
          Give your attention to Jesus.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/cross-heart-pray/reflect"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Talk To The Mirror
          </a>

          <a
            href="#journey"
            className="rounded-full border border-zinc-700 px-8 py-3"
          >
            Explore The Journey
          </a>
        </div>
      </section>

      <section className="border-t border-zinc-900 px-6 py-24 text-center">
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          The Mission
        </p>

        <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Tell the truth.
          <br />
          Find hope.
          <br />
          Take the next step.
        </h2>

        <div className="mx-auto mt-10 max-w-3xl space-y-6 text-lg leading-8 text-zinc-400">
          <p>
            Bring your gratitude, hope, purpose, growth, questions, and change.
          </p>

          <p>
            Bring your fear, pain, grief, confusion, and anxiety.
          </p>

          <p>
            Look honestly at what is there. Then turn away from the mirror,
            bring it to Jesus, and open God&apos;s Word.
          </p>

          <p className="text-zinc-300">
            Seek the fruit of the Spirit:
          </p>

          <p>
            Love. Joy. Peace. Patience. Kindness. Goodness. Faithfulness.
            Gentleness. Self-control.
          </p>

          <a
            href="https://www.bible.com/search/bible?q=Galatians%205%3A22-23"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-zinc-500 underline decoration-zinc-700 underline-offset-4 hover:text-white"
          >
            Galatians 5:22–23
          </a>

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
            Resist the Drift
          </p>

          <p className="text-zinc-300">
            Whether you are seeking God for the first time or returning after
            wandering, turn toward Jesus. Read Scripture in context. Pray
            honestly. Follow Him.
          </p>
        </div>
      </section>

      <section
        id="journey"
        className="border-t border-zinc-900 px-6 py-24 text-center"
      >
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          One Question · A Clear Next Step
        </p>

        <h2 className="text-4xl font-bold md:text-5xl">
          Where would you like to begin?
        </h2>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 text-left md:grid-cols-3">
          {products.map((product) => (
            <a
              key={product.name}
              href={product.href}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 transition hover:-translate-y-1 hover:border-zinc-500"
            >
              <div className="text-3xl">{product.emoji}</div>

              <h3 className="mt-4 text-2xl font-bold">{product.name}</h3>

              <p className="mt-4 leading-7 text-zinc-400">
                {product.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-900 px-6 py-24 text-center">
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Start Here
        </p>

        <h2 className="mx-auto max-w-3xl text-4xl font-bold md:text-5xl">
          Look for a moment.
          <br />
          Then turn.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Notice what has your attention. Then turn away from the mirror and
          give your attention to Jesus. Open Mirror uses AI only to suggest
          Bible passages that may help you begin reading Scripture.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
          AI does not provide the answers or speak for God. God&apos;s Word is
          the authority. Jesus is the answer.
        </p>

        <a
          href="/cross-heart-pray/reflect"
          className="mt-10 inline-block rounded-full bg-white px-8 py-3 font-semibold text-black"
        >
          Talk To The Mirror
        </a>
      </section>

      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © Open Mirror LLC. Open God&apos;s Word. Pray honestly. Follow Jesus.
      </footer>
    </main>
  );
}

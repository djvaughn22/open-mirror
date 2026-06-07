const products = [
  {
    name: "Cross Heart Pray",
    emoji: "✝️ ❤️ 🙏",
    href: "/cross-heart-pray",
    description:
      "Bring what you see to God. Lay it at the Cross, receive His love, pray honestly, and discover Scripture for your situation.",
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
      "Coming soon: A deeper mirror for patterns, questions, blind spots, growth, and truth.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="font-bold">Open Mirror</div>

        <div className="flex gap-6 text-sm text-zinc-400">
          <a href="/cross-heart-pray">Cross Heart Pray</a>
          <a href="/the-dj-cares">TheDJCares</a>
          <a href="/what-am-i-ai">WhatAmIAI</a>
          <a href="https://www.bible.com/" target="_blank" rel="noopener noreferrer">Bible</a>
        </div>
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
          Open Mirror exists to help people honestly reflect, seek truth, find
          hope, and take their next step.
        </p>

        <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-300">
          The mirror doesn&apos;t judge.
          <br />
          The mirror reveals.
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
          <p>Everyone is carrying something.</p>

          <p>
            Anxiety. Fear. Pain. Shame. Anger. Grief. Loneliness. Questions. Confusion.
          </p>

          <p>
            Open Mirror is a place to pause, reflect honestly, seek truth, and
            move forward with wisdom, purpose, and hope.
          </p>

          <p className="text-zinc-300">
            The mirror is the doorway. Truth is the path. Jesus is the answer.
          </p>
        </div>
      </section>

      <section
        id="journey"
        className="border-t border-zinc-900 px-6 py-24 text-center"
      >
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          One Question · Many Mirrors
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
          Look in the mirror.
          <br />
          What do you see?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Bring what you see to the Mirror. AI will help connect your reflection
          with prayer, Scripture, and a next step rooted in truth.
        </p>

        <a
          href="/cross-heart-pray/reflect"
          className="mt-10 inline-block rounded-full bg-white px-8 py-3 font-semibold text-black"
        >
          Talk To The Mirror
        </a>
      </section>

      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © Open Mirror LLC. The mirror doesn&apos;t judge. The mirror reveals.
      </footer>
    </main>
  );
}

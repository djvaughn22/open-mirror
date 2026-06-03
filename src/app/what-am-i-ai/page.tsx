export default function WhatAmIAIPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="font-bold">
          Open Mirror
        </a>

        <div className="flex gap-6 text-sm text-zinc-400">
          <a href="/">Home</a>
          <a href="/cross-heart-pray">Cross Heart Pray</a>
          <a href="/the-dj-cares">The DJ Cares</a>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-5xl">🤖 🪞</div>

        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Purpose · Growth · Truth
        </p>

        <h1 className="text-5xl font-bold leading-tight md:text-7xl">
          What Am I AI?
        </h1>

        <h2 className="mt-6 text-3xl font-semibold text-zinc-300 md:text-5xl">
          Who are you becoming?
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          Every conversation leaves clues. Every question reveals something.
          What Am I AI is being built to help people discover patterns,
          strengths, blind spots, opportunities, purpose, and growth hidden
          inside their own words.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#join"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Join Early Access
          </a>

          <a
            href="/cross-heart-pray/reflect"
            className="rounded-full border border-zinc-700 px-8 py-3"
          >
            Talk To The Mirror
          </a>
        </div>
      </section>

      <section className="border-t border-zinc-900 px-6 py-24 text-center">
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Beyond Reflection
        </p>

        <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Your words reveal patterns.
          <br />
          Patterns reveal direction.
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          Most people leave fingerprints in everything they write, ask, fear,
          pursue, avoid, celebrate, and dream about.
        </p>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          What Am I AI is designed to reflect those patterns back in a way that
          is useful, honest, and actionable.
        </p>
      </section>

      <section className="border-t border-zinc-900 px-6 py-24 text-center">
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Future Vision
        </p>

        <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Discover purpose.
          <br />
          Take the next step.
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          Over time, What Am I AI may help people understand how their gifts,
          habits, interests, strengths, struggles, and values fit together.
        </p>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Not simply who they are today, but who they are becoming.
        </p>
      </section>

      <section
        id="join"
        className="border-t border-zinc-900 px-6 py-24 text-center"
      >
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Start Here
        </p>

        <h2 className="mx-auto max-w-3xl text-4xl font-bold md:text-5xl">
          What might your words reveal?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Join early updates as What Am I AI develops tools for purpose,
          growth, self-awareness, and truth.
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4">
          <input
            className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
            placeholder="Email address"
          />

          <input
            className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
            placeholder="What would you want to learn about yourself?"
          />

          <button className="rounded-full bg-white px-8 py-3 font-semibold text-black">
            Join Early Access
          </button>
        </div>
      </section>

      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © Open Mirror LLC. Purpose, growth, and truth.
      </footer>
    </main>
  );
}
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
          Reflection · Patterns · Discovery
        </p>

        <h1 className="text-5xl font-bold leading-tight md:text-7xl">
          What Am I AI?
        </h1>

        <h2 className="mt-6 text-3xl font-semibold text-zinc-300 md:text-5xl">
          Your questions reveal more than you think.
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          Every prompt, journal entry, conversation, and question leaves clues.
          What Am I AI helps people discover recurring themes, strengths,
          blind spots, motivations, fears, and opportunities hidden inside
          their own words.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#join"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Join Early Access
          </a>

          <a
            href="/"
            className="rounded-full border border-zinc-700 px-8 py-3"
          >
            Back to Open Mirror
          </a>
        </div>
      </section>

      <section className="border-t border-zinc-900 px-6 py-24 text-center">
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          The Mirror
        </p>

        <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Look in the mirror.
          <br />
          What do you see?
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          A founder. A parent. A creator. A leader. A student. A dreamer.
        </p>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Most people leave fingerprints in everything they write. What Am I AI
          helps uncover those patterns and reflect them back in a way that is
          useful, actionable, and honest.
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
          Join early updates as What Am I AI develops tools for self-awareness,
          pattern recognition, personal growth, and reflection.
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
        © Open Mirror LLC. Built one step at a time.
      </footer>
    </main>
  );
}
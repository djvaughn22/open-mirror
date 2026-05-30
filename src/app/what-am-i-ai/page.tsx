export default function WhatAmIAI() {
  return (
    <main className="min-h-screen bg-black px-8 py-12 text-white">
      <a href="/" className="text-sm text-zinc-400 hover:text-white">
        ← Back to Open Mirror
      </a>

      <section className="mx-auto flex min-h-[80vh] max-w-4xl flex-col justify-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-500">
          Coming Soon
        </p>

        <h1 className="text-5xl font-bold leading-tight md:text-7xl">
          What Am I AI?
        </h1>

        <p className="mt-8 text-2xl leading-10 text-zinc-300">
          Your words leave patterns. Open Mirror helps you see them.
        </p>

        <p className="mt-8 text-lg leading-8 text-zinc-400">
          What Am I AI? is a reflection tool designed to help people notice
          patterns in their own words, questions, fears, strengths, habits, and
          conversations.
        </p>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          The goal is not to let AI define who you are. The goal is to use AI as
          a mirror — a tool that helps reveal what may already be present.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">1. Paste</h2>
            <p className="mt-3 text-zinc-400">
              Bring your words, notes, journal entries, or conversations.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">2. Reflect</h2>
            <p className="mt-3 text-zinc-400">
              Identify recurring themes, blind spots, strengths, and questions.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">3. Grow</h2>
            <p className="mt-3 text-zinc-400">
              Turn insight into better questions, better choices, and intentional action.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

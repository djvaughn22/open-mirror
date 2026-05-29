export default function CrossHeartPray() {
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
          Cross Heart Pray
        </h1>

        <p className="mt-8 text-2xl leading-10 text-zinc-300">
          Bring your situation. Explore Scripture. Pray with confidence.
        </p>

        <p className="mt-8 text-lg leading-8 text-zinc-400">
          Cross Heart Pray is an AI-assisted Scripture and prayer experience
          designed to help people connect real-life challenges with God&apos;s
          Word.
        </p>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          The goal is not to replace prayer, pastors, churches, mentors, or
          personal discernment. The goal is to help people slow down, seek
          relevant Scripture, understand biblical themes, and form prayers
          grounded in God&apos;s Word.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">1. Share</h2>
            <p className="mt-3 text-zinc-400">
              Describe what you are facing in plain language.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">2. Search</h2>
            <p className="mt-3 text-zinc-400">
              Explore Scripture, context, themes, and passages related to your
              situation.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">3. Pray</h2>
            <p className="mt-3 text-zinc-400">
              Build a prayer rooted in Scripture, humility, wisdom, and trust in
              God.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="text-2xl font-bold">MVP 1</h2>
          <p className="mt-4 text-zinc-400">
            The first version will be simple: enter a real-life situation,
            receive relevant Scripture passages, see brief context, and generate
            a prayer based on those passages.
          </p>
        </div>
      </section>
    </main>
  );
}

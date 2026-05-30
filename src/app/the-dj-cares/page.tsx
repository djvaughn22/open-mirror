export default function TheDJCares() {
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
          The DJ Cares
        </h1>

        <p className="mt-8 text-2xl leading-10 text-zinc-300">
          Encouragement, music, practical help, and hope for people who need it.
        </p>

        <p className="mt-8 text-lg leading-8 text-zinc-400">
          The DJ Cares is the human care arm of Open Mirror — a place for
          encouragement, resources, playlists, practical support, and stories
          that help people keep going.
        </p>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          Some people need a tool. Some people need a prayer. Some people need a
          song, a word, a reminder, or someone willing to care.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">Music</h2>
            <p className="mt-3 text-zinc-400">
              Playlists and songs that help people express what they cannot say.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">Care</h2>
            <p className="mt-3 text-zinc-400">
              Practical encouragement and resources for people facing hard seasons.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">Action</h2>
            <p className="mt-3 text-zinc-400">
              Turning reflection into generosity, service, and real-world help.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

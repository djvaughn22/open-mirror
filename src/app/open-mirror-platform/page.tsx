export default function OpenMirrorPlatform() {
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
          Open Mirror Platform
        </h1>

        <p className="mt-8 text-2xl leading-10 text-zinc-300">
          The future home for reflection tools, journals, prompts, content, and guided growth.
        </p>

        <p className="mt-8 text-lg leading-8 text-zinc-400">
          Open Mirror Platform will bring together tools that help people see
          clearly, choose wisely, and live intentionally.
        </p>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          The platform begins simply: questions, reflections, content, and
          lightweight tools. Over time, it will grow into a connected system for
          reflection, prayer, learning, journaling, and action.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">See Clearly</h2>
            <p className="mt-3 text-zinc-400">
              Reflection tools that help people slow down and tell the truth.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">Choose Wisely</h2>
            <p className="mt-3 text-zinc-400">
              Prompts and guidance that support better decisions and deeper wisdom.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold">Live Intentionally</h2>
            <p className="mt-3 text-zinc-400">
              Turning reflection into habits, service, content, and real life change.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

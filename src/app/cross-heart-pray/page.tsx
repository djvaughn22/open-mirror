export default function CrossHeartPrayPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="font-bold">
          Open Mirror
        </a>
        <div className="flex gap-6 text-sm text-zinc-400">
          <a href="/">Home</a>
          <a href="/what-am-i-ai">What Am I AI?</a>
          <a href="/the-dj-cares">The DJ Cares</a>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-5xl">✝️ ❤️ 🙏</div>

        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Scripture · Prayer · Next Right Step
        </p>

        <h1 className="text-5xl font-bold leading-tight md:text-7xl">
          Cross Heart Pray
        </h1>

        <h2 className="mt-6 text-3xl font-semibold text-zinc-300 md:text-5xl">
          Bring your situation.
          <br />
          Seek wisdom.
          <br />
          Pray with confidence.
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          Cross Heart Pray is being built as a faith-centered reflection tool
          that helps people slow down, bring real life decisions before God,
          explore Scripture, and take the next right step.
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
          A fear. A question. A burden. A decision. A sin. A hope. A calling.
          Cross Heart Pray is designed to help you reflect honestly, turn toward
          God&apos;s Word, and pray before you move.
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
          What situation do you want to bring before God?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Join early updates as Cross Heart Pray develops scripture-grounded
          tools for prayer, reflection, and faithful action.
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4">
          <input
            className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
            placeholder="Email address"
          />
          <input
            className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
            placeholder="What are you praying through?"
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
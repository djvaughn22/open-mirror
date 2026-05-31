const products = [
  {
    name: "Cross Heart Pray",
    emoji: "✝️ ❤️ 🙏",
    href: "/cross-heart-pray",
    description:
      "Faith-centered reflection, prayer, and scriptural guidance for life’s real decisions.",
  },
  {
    name: "What Am I AI?",
    emoji: "🤖 🪞",
    href: "/what-am-i-ai",
    description:
      "A reflection tool that helps you notice patterns in your own words, questions, and conversations.",
  },
  {
    name: "The DJ Cares",
    emoji: "🎵 ❤️ 🤝",
    href: "/the-dj-cares",
    description:
      "Encouragement, music, practical help, and resources for people who need care and hope.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="font-bold">Open Mirror</div>

        <div className="flex gap-6 text-sm text-zinc-400">
          <a href="#mission">Mission</a>
          <a href="#products">Coming Soon</a>
          <a href="#join">Join</a>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          See Clearly · Choose Wisely · Live Intentionally
        </p>

        <h1 className="text-6xl font-bold leading-tight md:text-8xl">
          Look in the mirror.
        </h1>

        <h2 className="mt-6 text-3xl font-semibold text-zinc-300 md:text-5xl">
          What do you see?
        </h2>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
          Open Mirror helps people reflect honestly, learn continuously, and
          move forward with purpose.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#join"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Join Early Access
          </a>

          <a
            href="#products"
            className="rounded-full border border-zinc-700 px-8 py-3"
          >
            View What&apos;s Coming
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
          Reflect honestly.
          <br />
          Learn continuously.
          <br />
          Move forward with purpose.
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          Most platforms tell people what to think. Open Mirror is being built
          to help people slow down, see themselves more clearly, seek wisdom,
          and take the next right step.
        </p>
      </section>

      <section
        id="products"
        className="border-t border-zinc-900 px-6 py-24 text-center"
      >
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          One Question · Many Mirrors
        </p>

        <h2 className="text-4xl font-bold md:text-5xl">What&apos;s Coming</h2>

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

      <section
        id="join"
        className="border-t border-zinc-900 px-6 py-24 text-center"
      >
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Start Here
        </p>

        <h2 className="mx-auto max-w-3xl text-4xl font-bold md:text-5xl">
          What do you see?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Join early updates as Open Mirror builds tools, content, and
          experiences for reflection, faith, growth, and purpose.
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4">
          <input
            className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
            placeholder="Email address"
          />

          <input
            className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
            placeholder="What do you see?"
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
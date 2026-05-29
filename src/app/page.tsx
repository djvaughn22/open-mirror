const products = [
  [
    "Cross Heart Pray",
    "Bring your situation. Explore Scripture. Pray with confidence. AI-assisted help grounded in God’s Word.",
  ],
  [
    "What Am I AI?",
    "A reflection tool designed to help people notice patterns in their own words, thoughts, questions, and conversations.",
  ],
  [
    "The DJ Cares",
    "Encouragement, music, practical help, and resources for people who need care and hope.",
  ],
  [
    "Open Mirror Platform",
    "The future home for reflection tools, journaling, learning systems, and new ways to grow intentionally.",
  ],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-lg font-bold tracking-wide">Open Mirror</div>
        <div className="hidden gap-6 text-sm text-zinc-400 sm:flex">
          <a href="#mission">Mission</a>
          <a href="#products">Coming Soon</a>
          <a href="#join">Join</a>
        </div>
      </nav>

      <section className="flex min-h-[85vh] flex-col items-center justify-center px-8 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-500">
          Reflection • Wisdom • Prayer • Purpose
        </p>

        <h1 className="max-w-5xl text-5xl font-bold leading-tight md:text-7xl">
          See clearly.
          <br />
          Choose wisely.
          <br />
          Live intentionally.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
          Open Mirror is building tools and content that help people slow down,
          reflect honestly, seek wisdom, and move forward with purpose.
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

      <section id="mission" className="border-t border-zinc-900 px-8 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-500">
            Mission
          </p>
          <h2 className="text-3xl font-bold md:text-5xl">
            Better tools for honest reflection.
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            In a world filled with noise, distraction, comparison, and endless
            opinions, Open Mirror exists to help people ask better questions,
            pursue deeper answers, and take the next right step.
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            We believe technology should help people think more deeply, not
            distract them more often. For products that provide spiritual
            guidance or prayer support, Scripture is the foundation and AI is
            only a tool.
          </p>
        </div>
      </section>

      <section id="products" className="px-8 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-500">
            Coming Soon
          </p>
          <h2 className="mb-10 text-3xl font-bold md:text-5xl">
            One mission. Multiple doors.
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {products.map(([name, description]) => (
              <div
                key={name}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8"
              >
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-yellow-500">
                  Coming Soon
                </p>
                <h3 className="text-2xl font-bold">{name}</h3>
                <p className="mt-4 text-zinc-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="border-t border-zinc-900 px-8 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-500">
            Ask More
          </p>
          <h2 className="text-3xl font-bold md:text-5xl">
            Follow the build.
          </h2>
          <p className="mt-6 text-zinc-400">
            Join the early access list to follow the journey, test new features,
            and help shape what Open Mirror becomes.
          </p>

          <div className="mt-8 grid gap-3">
            <input
              className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
              placeholder="Name"
            />
            <input
              className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
              placeholder="Email address"
            />
            <input
              className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
              placeholder="What are you seeking or building?"
            />
            <button className="rounded-full bg-white px-8 py-3 font-semibold text-black">
              Join Early Access
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © Open Mirror LLC. Built one step at a time.
      </footer>
    </main>
  );
}
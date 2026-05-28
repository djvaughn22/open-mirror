const products = [
  ["theDJcares", "Music as a love language. Share feelings through playlists."],
  ["WhatAmIAI", "Identity reflection with AI, truth, and self-awareness."],
  ["Cross Heart Pray", "Prayer, scripture, healing, and daily encouragement."],
  ["Open Mirror Goods", "Journals, apparel, cards, printables, and tools."],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-lg font-bold tracking-wide">Open Mirror</div>
        <div className="hidden gap-6 text-sm text-zinc-400 sm:flex">
          <a href="#mission">Mission</a>
          <a href="#products">Products</a>
          <a href="#join">Join</a>
        </div>
      </nav>

      <section className="flex min-h-[85vh] flex-col items-center justify-center px-8 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-500">
          Faith • Identity • Creativity • AI
        </p>

        <h1 className="max-w-5xl text-5xl font-bold leading-tight md:text-7xl">
          Look in the mirror.
          <br />
          Tell the truth.
          <br />
          Return to God.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
          Open Mirror is a mission-driven platform helping people see
          themselves clearly, create from love, and share what heals.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#join"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Join the Journey
          </a>
          <a
            href="#products"
            className="rounded-full border border-zinc-700 px-8 py-3"
          >
            Explore Products
          </a>
        </div>
      </section>

      <section id="mission" className="border-t border-zinc-900 px-8 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-500">
            Mission
          </p>
          <h2 className="text-3xl font-bold md:text-5xl">
            Build things that point people back to truth.
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            This starts with simple tools, honest stories, music, prayer,
            reflection, and products that help people remember who they are and
            who God made them to become.
          </p>
        </div>
      </section>

      <section id="products" className="px-8 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-500">
            Ecosystem
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
            Start here
          </p>
          <h2 className="text-3xl font-bold md:text-5xl">
            Follow the build.
          </h2>
          <p className="mt-6 text-zinc-400">
            The first version is being built now: tools, journals, music,
            prayer, and a public playbook for mission-driven creators.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
              placeholder="Email address"
            />
            <button className="rounded-full bg-white px-8 py-3 font-semibold text-black">
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © Open Mirror. Built one step at a time.
      </footer>
    </main>
  );
}
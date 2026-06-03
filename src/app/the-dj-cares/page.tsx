export default function TheDJCaresPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="font-bold">
          Open Mirror
        </a>

        <div className="flex gap-6 text-sm text-zinc-400">
          <a href="/">Home</a>
          <a href="/cross-heart-pray">Cross Heart Pray</a>
          <a href="/what-am-i-ai">What Am I AI?</a>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-5xl">🎵 ❤️ 🤝</div>

        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Music · Encouragement · Hope
        </p>

        <h1 className="text-5xl font-bold leading-tight md:text-7xl">
          The DJ Cares
        </h1>

        <h2 className="mt-6 text-3xl font-semibold text-zinc-300 md:text-5xl">
          The right soundtrack
          <br />
          for the road ahead.
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          The DJ Cares uses music, playlists, and encouragement to help people
          find hope, healing, and perspective for what they are facing.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#start"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Find Encouragement
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
          After The Mirror
        </p>

        <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Sometimes hope
          <br />
          comes through a song.
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          After someone reflects, prays, and takes the next step, music can help
          carry encouragement into the rest of the day.
        </p>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          The DJ Cares is being built to connect real life situations with songs,
          playlists, reminders, and encouragement for the road ahead.
        </p>
      </section>

      <section className="border-t border-zinc-900 px-6 py-24 text-center">
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Future Vision
        </p>

        <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Music first.
          <br />
          Encouragement always.
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          Playlists for grief, courage, gratitude, repentance, joy, endurance,
          family, faith, recovery, work, rest, and starting again.
        </p>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Over time, AI can help match what someone brings to the Mirror with
          music that encourages, comforts, challenges, and helps them keep going.
        </p>
      </section>

      <section
        id="start"
        className="border-t border-zinc-900 px-6 py-24 text-center"
      >
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Start Here
        </p>

        <h2 className="mx-auto max-w-3xl text-4xl font-bold md:text-5xl">
          What are you carrying today?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          The DJ Cares is growing into a place for music, playlists, and
          encouragement shaped around real life.
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4">
          <input
            className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
            placeholder="Email address"
          />

          <input
            className="rounded-full border border-zinc-800 bg-black px-6 py-3 text-white outline-none"
            placeholder="What kind of encouragement do you need?"
          />

          <button className="rounded-full bg-white px-8 py-3 font-semibold text-black">
            Join Early Access
          </button>
        </div>
      </section>

      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © Open Mirror LLC. Music, encouragement, and hope for the road ahead.
      </footer>
    </main>
  );
}
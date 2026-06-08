export default function TheDJCaresPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto grid grid-cols-3 max-w-6xl items-center px-6 py-6">
        <a href="/welcome" className="justify-self-start font-bold">
          Open Mirror
        </a>

        <span aria-hidden="true" />

        <div className="justify-self-end flex items-center gap-4">
          <a
            href="https://www.bible.com/app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open YouVersion Bible App"
          >
            <img
              src="/brand/youversion-bible-app.png"
              alt="YouVersion Bible App"
              className="h-9 w-9 rounded-lg"
            />
          </a>

          <details className="relative text-sm text-zinc-400">
          <summary className="cursor-pointer list-none text-2xl leading-none">
            ☰
          </summary>

          <div className="absolute right-0 z-50 mt-4 flex w-56 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right shadow-2xl">
            <a href="/welcome">Home</a>
            <a href="/cross-heart-pray">Cross Heart Pray</a>
            <a href="/cross-heart-pray/reflect">Talk To The Mirror</a>
            <a href="/the-dj-cares">TheDJCares</a>
            <a href="/what-am-i-ai">WhatAmIAI</a>
          </div>
          </details>
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
          What kind of encouragement do you need?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Request early access and tell us what kind of music, playlists, or
          encouragement would help you most.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <a
            href="mailto:ask@openmirrorllc.com?subject=TheDJCares%20Early%20Access"
            className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Request Early Access
          </a>

          <p className="mt-4 text-sm text-zinc-500">
            This opens your email app so you can send a request directly.
          </p>
        </div>
      </section>

      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © Open Mirror LLC. Music, encouragement, and hope for the road ahead.
      </footer>
    </main>
  );
}
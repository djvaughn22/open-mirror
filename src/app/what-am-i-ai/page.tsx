const features = [
  {
    title: "The Deep Dive",
    emoji: "🪞",
    text: "Notice the good and the harmful — habits, feelings, patterns, gifts, burdens, strengths, struggles, and opportunities that may be easy to miss.",
  },
  {
    title: "Good Fruit",
    emoji: "🌱",
    text: "Explore signs of love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control already growing in your life.",
  },
  {
    title: "Destructive Patterns",
    emoji: "⚠️",
    text: "Carefully notice patterns that may be pulling you away from peace, truth, love, humility, service, and self-control.",
  },
  {
    title: "Simple Changes",
    emoji: "👣",
    text: "Self-identify simple ways to change anything you feel called to change — one honest step at a time.",
  },
  {
    title: "Gifts & Burdens",
    emoji: "🎁",
    text: "Reflect on what moves your heart, what you care about, what you keep noticing, and where your life experience may help someone else.",
  },
  {
    title: "Ways to Serve",
    emoji: "🤝",
    text: "Explore small and large opportunities to help others through family, neighbors, churches, charities, ministries, and communities.",
  },
  {
    title: "Calling & Next Steps",
    emoji: "🧭",
    text: "Explore possible next faithful steps without ego, pressure, or pretending to have it all figured out.",
  },
  {
    title: "Approved Opportunities",
    emoji: "✅",
    text: "Connect with Cross Heart Pray approved opportunities to serve, give, volunteer, encourage, learn, and grow.",
  },
];

export default function WhatAmIAIPage() {
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const verseOfTheDayUrl = `https://www.bibleportal.com/verse-of-the-day?version=NIV&date=${todayDate}`;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <nav className="grid grid-cols-3 items-center">
          <a href="/home" className="justify-self-start font-bold">
            Cross Heart Pray
          </a>

          <a
            href={verseOfTheDayUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open today's Bible verse"
            className="justify-self-center"
          >
            <img
              src="/brand/youversion-bible-app.png"
              alt="Holy Bible"
              className="h-10 w-10 rounded-lg"
            />
          </a>

          <details className="relative justify-self-end text-sm text-zinc-400">
            <summary className="cursor-pointer list-none text-2xl leading-none">
              ☰
            </summary>

            <div className="absolute right-0 z-50 mt-4 flex w-56 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right shadow-2xl">
              <a href="/home">Home</a>
              <a href="/cross">Cross</a>
              <a href="/heart">Heart</a>
              <a href="/pray">Pray</a>
              <a href="/the-dj-cares">TheDJCares</a>
              <a href="/what-am-i-ai">WhatAmIAI</a>
              <a href="/explorebible">Holy Bible Explorer</a>
            </div>
          </details>
        </nav>

        <section className="mx-auto max-w-5xl py-24 text-center">
          <p className="mb-8 flex items-center justify-center gap-8 text-6xl md:gap-14 md:text-7xl">
            <span>🤖</span>
            <span>📖</span>
            <span>🌱</span>
          </p>

          <p className="mb-5 inline-flex rounded-full border border-zinc-700 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Coming Soon
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            WhatAmIAI
          </h1>

          <p className="mx-auto mt-8 max-w-4xl text-2xl font-semibold leading-snug text-zinc-300 md:text-4xl">
            A Gospel-first reflection tool for noticing what is growing, what is
            hurting, what is hidden, and where you may feel called to serve.
          </p>

          <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-lg font-semibold text-zinc-400 sm:grid-cols-4">
            <p>Look honestly.</p>
            <p>Notice the fruit.</p>
            <p>Choose the next step.</p>
            <p>Serve with love.</p>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center">
          <div className="text-5xl">🤖</div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-yellow-400">
            Coming Soon
          </p>

          <h2 className="mt-4 text-2xl font-bold">WhatAmIAI</h2>

          <p className="mx-auto mt-4 max-w-3xl leading-7 text-zinc-400">
            A deeper reflection tool for exploring identity, calling, gifts,
            patterns, purpose, and next steps — with AI asking questions, not
            giving labels.
          </p>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 px-8 py-14 text-center">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.32em] text-yellow-400">
            AI As A Question Tool
          </p>

          <h2 className="mx-auto max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
            Not to guide you.
            <br />
            Not to define you.
            <br />
            To help you ask better questions.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
            WhatAmIAI will use AI not to guide, advise, define, diagnose, or
            decide for you. It will simply ask thoughtful questions for
            self-discovery and help you self-identify simple ways to change
            anything you feel called to change.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Bring what you notice back to Scripture, prayer, trusted people, and
            Jesus.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 px-8 py-14 text-center">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.32em] text-yellow-400">
            The Foundation
          </p>

          <h2 className="mx-auto max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
            The way of Jesus.
            <br />
            The fruit of the Spirit.
            <br />
            The next faithful step.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
            The experience will be shaped by the core principles Jesus taught in
            the Sermon on the Mount and the fruit of the Spirit Paul describes:
            love, joy, peace, patience, kindness, goodness, faithfulness,
            gentleness, and self-control.
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center"
              style={{
                minHeight: "250px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="text-5xl">{feature.emoji}</div>

              <h2 className="mt-8 text-2xl font-bold">{feature.title}</h2>

              <p className="mt-4 leading-7 text-zinc-400">{feature.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 px-8 py-14 text-center">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.32em] text-yellow-400">
            Service & Calling
          </p>

          <h2 className="mx-auto max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
            Small steps matter.
            <br />
            Big callings can start quietly.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
            WhatAmIAI will help people hunger for helping others by exploring
            gifts, burdens, habits, feelings, opportunities, and simple next
            steps — from a prayer, a message, or a meal to serving through a
            church, charity, ministry, or community need.
          </p>
        </section>

        <section className="border-t border-zinc-900 px-6 py-20 text-center">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/home"
              className="rounded-full border border-zinc-700 px-8 py-3 font-semibold text-white"
            >
              Back to Cross Heart Pray
            </a>

            <a
              href="/explorebible"
              className="rounded-full bg-white px-8 py-3 font-semibold text-black"
            >
              Open Holy Bible Explorer
            </a>
          </div>
        </section>

        <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
          Follow Jesus. Love God. Pray.
        </footer>
      </div>
    </main>
  );
}

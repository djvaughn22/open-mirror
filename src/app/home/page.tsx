const steps = [
  {
    title: "Cross",
    emoji: "✝️",
    href: "/cross",
    comingSoon: false,
    text: "Jesus Christ. His life, teachings, sacrifice, resurrection, and promise.",
  },
  {
    title: "Heart",
    emoji: "❤️",
    href: "/heart",
    comingSoon: false,
    text: "God's love, grace, mercy, and truth.",
  },
  {
    title: "Pray",
    emoji: "🙏",
    href: "/pray",
    comingSoon: false,
    text: "A daily relationship with God through prayer.",
  },
];

export default function HomePage() {
  const verseOfTheDayUrl = "https://www.bible.com/verse-of-the-day";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <nav className="grid grid-cols-3 items-center">
          <span aria-hidden="true" />

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
              <a href="/explorebible">Holy Bible Explorer</a>
              <a href="https://www.bibleportal.com/" target="_blank" rel="noopener noreferrer">
                Bible Portal
              </a>
              <a href="/about">About</a>
            </div>
          </details>
        </nav>

        <section className="mx-auto max-w-4xl py-24 text-center">
          <p className="mb-8 flex items-center justify-center gap-8 text-6xl md:gap-14 md:text-7xl">
            <span>✝️</span>
            <span>❤️</span>
            <span>🙏</span>
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Cross Heart Pray
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-2xl font-semibold leading-snug text-zinc-300 md:text-4xl">
            your way through the Holy Bible
          </p>

          <p className="mx-auto mt-5 max-w-3xl text-xl font-semibold leading-snug text-blue-400 md:text-2xl">
            for Truth, Joy and Peace.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-6">
          {steps.map((step, index) => (
            <a
              key={step.title}
              href={step.href}
              className={`rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center transition hover:border-white md:col-span-2`}
              style={{
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="text-5xl">{step.emoji}</div>

              {step.comingSoon && (
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-yellow-400">
                  Coming Soon
                </p>
              )}

              <h2 className={step.comingSoon ? "mt-4 text-2xl font-bold" : "mt-8 text-2xl font-bold"}>
                {step.title}
              </h2>

              <p className="mt-4 leading-7 text-zinc-400" style={{ flex: 1 }}>
                {step.text}
              </p>
            </a>
          ))}
        </section>

        <section className="border-t border-zinc-900 px-6 py-20 text-center">
          <a
            href="/explorebible"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Bible Explorer
          </a>
        </section>

        <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
          © 2026 Open Mirror LLC. Follow Jesus. Love God. Pray.
        </footer>
      </div>
    </main>
  );
}

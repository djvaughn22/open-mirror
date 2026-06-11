const steps = [
  {
    title: "Cross",
    emoji: "✝️",
    href: "/cross-heart-pray/cross",
    text: "Jesus Christ. His life, teachings, sacrifice, resurrection, and promise.",
  },
  {
    title: "Heart",
    emoji: "❤️",
    href: "/cross-heart-pray/heart",
    text: "God's love, grace, mercy, and truth.",
  },
  {
    title: "Pray",
    emoji: "🙏",
    href: "/cross-heart-pray/pray",
    text: "A daily relationship with God through prayer.",
  },
];

const more = [
  {
    title: "TheDJCares",
    emoji: "🎵 ❤️ 🤝",
    href: "/the-dj-cares",
    status: "Coming Soon",
    text: "Spins uplifting music, podcasts, sermons, and more for any mood, moment, or season.",
  },
  {
    title: "WhatAmIAI",
    emoji: "🤖 📖",
    href: "/what-am-i-ai",
    status: "Coming Soon",
    text: "A deeper step-by-step reflection experience with related Bible stories, Gospel-focused Scripture, and space to see more clearly.",
  },
];

export default function WelcomePage() {
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const verseOfTheDayUrl = `https://www.bibleportal.com/verse-of-the-day?version=NIV&date=${todayDate}`;

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
              <a href="/welcome">Home</a>
              <a href="/cross-heart-pray/cross">Cross</a>
              <a href="/cross-heart-pray/heart">Heart</a>
              <a href="/cross-heart-pray/pray">Pray</a>
              <a href="/the-dj-cares">TheDJCares</a>
              <a href="/what-am-i-ai">WhatAmIAI</a>
              <a href="/bible-explorer">
            Holy Bible Explorer
          </a>
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
            your way through the Holy Bible.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <a
              key={step.title}
              href={step.href}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center transition hover:border-white"
              style={{
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="text-5xl">{step.emoji}</div>

              <h2 className="mt-8 text-2xl font-bold">{step.title}</h2>

              <p className="mt-4 leading-7 text-zinc-400" style={{ flex: 1 }}>
                {step.text}
              </p>
            </a>
          ))}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {more.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center transition hover:border-white"
              style={{
                minHeight: "240px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="text-5xl">{item.emoji}</div>

              <h2 className="mt-8 text-2xl font-bold">{item.title}</h2>

              {item.status && (
                <span className="mt-4 rounded-full border border-zinc-700 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  {item.status}
                </span>
              )}

              <p className="mt-5 leading-7 text-zinc-400" style={{ flex: 1 }}>
                {item.text}
              </p>
            </a>
          ))}
        </section>

        <section className="border-t border-zinc-900 px-6 py-20 text-center">
          <a
            href="/bible-explorer"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Holy Bible Explorer
          </a>
        </section>

        <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
          © 2026 Open Mirror LLC. Follow Jesus. Love God. Pray.
        </footer>
      </div>
    </main>
  );
}

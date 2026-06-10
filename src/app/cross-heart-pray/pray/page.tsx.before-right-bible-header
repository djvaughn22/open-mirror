const prayerSteps = [
  {
    title: "Adoration",
    text: "Begin by praising God for who He is: holy, loving, merciful, faithful, powerful, and present.",
  },
  {
    title: "Confession",
    text: "Tell the truth to God. Confess sin, fear, pride, resentment, weakness, and anything you are carrying.",
  },
  {
    title: "Thanksgiving",
    text: "Thank God for His mercy, forgiveness, provision, protection, patience, and love.",
  },
  {
    title: "Supplication",
    text: "Ask God for help. Ask for wisdom, courage, forgiveness, healing, direction, strength, and the next right step.",
  },
];

export default function PrayPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <nav className="mb-16 grid grid-cols-3 items-center">
        <a href="/welcome" className="justify-self-start font-bold">
          Open Mirror
        </a>

        <a
          href="https://www.bible.com/app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open YouVersion Bible App"
          className="justify-self-center"
        >
          <img
            src="/brand/youversion-bible-app.png"
            alt="YouVersion Bible App"
            className="h-9 w-9 rounded-lg"
          />
        </a>

        <details className="relative justify-self-end text-sm text-zinc-400">
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

        </nav>

        <section className="text-center">
          <div className="mb-8 text-7xl">🙏</div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Step Three
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Pray
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
            Prayer is honest conversation with God. The ACTS model gives you a
            simple way to pray when you do not know where to start.
          </p>
        </section>

        <div style={{ height: "72px" }} />

        <section
          style={{
            display: "grid",
            gap: "32px",
          }}
        >
          {prayerSteps.map((step) => (
            <div
              key={step.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-950"
              style={{
                paddingTop: "32px",
                paddingRight: "32px",
                paddingBottom: "34px",
                paddingLeft: "32px",
              }}
            >
              <h2 className="text-2xl font-bold">{step.title}</h2>

              <p className="mt-5 leading-7 text-zinc-400">{step.text}</p>
            </div>
          ))}
        </section>

        <div style={{ height: "96px" }} />

        <section
          className="rounded-3xl border border-zinc-800 bg-zinc-950 text-center"
          style={{
            paddingTop: "56px",
            paddingRight: "48px",
            paddingBottom: "76px",
            paddingLeft: "48px",
          }}
        >
          <h2 className="text-3xl font-bold">Then seek Scripture.</h2>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-zinc-400">
            After prayer, bring your reflection to the mirror and seek a
            Bible-grounded response for what you are facing.
          </p>

          <div style={{ marginTop: "44px" }}>
            <a
              href="/cross-heart-pray/reflect"
              className="inline-flex rounded-full bg-white px-8 py-3 font-semibold text-black transition hover:bg-zinc-200"
            >
              Begin Reflection 📖
            </a>
          </div>
        </section>

        <div style={{ height: "120px" }} />
      </section>
    </main>
  );
}
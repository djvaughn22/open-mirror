const prayerSteps = [
  {
    letter: "A",
    title: "Adoration",
    text: "Praise God for who He is: holy, loving, merciful, faithful, powerful, and present.",
  },
  {
    letter: "C",
    title: "Confession",
    text: "Bring sin and truth before God. Confess what needs forgiveness, mercy, and change.",
  },
  {
    letter: "T",
    title: "Thanksgiving",
    text: "Thank God for His mercy, forgiveness, provision, patience, faithfulness, and love.",
  },
  {
    letter: "S",
    title: "Supplication",
    text: "Ask God for help, wisdom, courage, forgiveness, healing, direction, and strength.",
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

        <section className="text-center">
          <div className="mb-8 text-7xl">🙏</div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Step Three
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Pray
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
            Prayer is personal conversation with God. Speak to Him in your own
            words. If you would like help finding a simple structure, ACTS can
            guide you through Scripture.
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-xl italic leading-9 text-zinc-400">
            Speak to God in prayer
            <br />
            Rest in His love and sacrifice
            <br />
            Bring Him all your heart
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
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-yellow-400">
                  {step.letter}
                </span>
                <h2 className="text-2xl font-bold">{step.title}</h2>
              </div>

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
          <h2 className="text-3xl font-bold">Begin with reflection.</h2>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-zinc-400">
            Take a moment at the mirror. Then turn toward Jesus, open the Bible,
            and continue through Cross, Heart, and Pray.
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
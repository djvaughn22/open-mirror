const steps = [
  {
    title: "Cross",
    emoji: "✝️",
    href: "/cross-heart-pray/cross",
    text: "Surrender what you are carrying to Jesus. Repent, receive forgiveness, and remember that the Cross is where grace meets the truth.",
    cta: "Learn The Cross",
  },
  {
    title: "Heart",
    emoji: "❤️",
    href: "/cross-heart-pray/heart",
    text: "Receive God’s love, mercy, and grace in your heart. Let His truth move from something you know into something you live.",
    cta: "Learn The Heart",
  },
  {
    title: "Pray",
    emoji: "🙏",
    href: "/cross-heart-pray/pray",
    text: "Pray honestly with God using a simple rhythm: adoration, confession, thanksgiving, and asking for help.",
    cta: "Learn To Pray",
  },
];

export default function CrossHeartPrayPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <nav className="grid grid-cols-3 items-center">
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

        <section
          className="mx-auto max-w-4xl text-center"
          style={{ paddingTop: "96px", paddingBottom: "96px" }}
        >
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Cross Heart Pray
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Bring it to Jesus.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
            Cross Heart Pray is a simple reflection journey: surrender at the
            Cross, receive God&apos;s love in your heart, pray honestly, then
            seek Scripture for truth, hope, forgiveness, and the next right
            step.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/cross-heart-pray/cross"
              className="rounded-full bg-white px-8 py-3 font-semibold text-black transition hover:bg-zinc-200"
            >
              Start With The Cross
            </a>

            <a
              href="/cross-heart-pray/reflect"
              className="rounded-full border border-zinc-700 px-8 py-3 font-semibold text-white transition hover:border-white"
            >
              Go To The Mirror
            </a>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <a
              key={step.title}
              href={step.href}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 transition hover:border-white"
              style={{
                minHeight: "360px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="text-5xl">{step.emoji}</div>

              <h2 className="mt-8 text-2xl font-bold">{step.title}</h2>

              <p className="mt-4 leading-7 text-zinc-400" style={{ flex: 1 }}>
                {step.text}
              </p>

              <p className="mt-8 text-sm font-semibold text-zinc-300">
                {step.cta} →
              </p>
            </a>
          ))}
        </section>

        <div style={{ height: "140px" }} />

        <section
          className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 text-center"
          style={{
            paddingTop: "56px",
            paddingRight: "48px",
            paddingBottom: "72px",
            paddingLeft: "48px",
          }}
        >
          <h2 className="text-3xl font-bold">Then bring it to the mirror.</h2>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-zinc-400">
            After Cross, Heart, and Pray, Open Mirror helps you reflect honestly
            and seek a Scripture-grounded response for what you are carrying.
          </p>

          <div style={{ marginTop: "40px" }}>
            <a
              href="/cross-heart-pray/reflect"
              className="inline-flex rounded-full bg-white px-8 py-3 font-semibold text-black transition hover:bg-zinc-200"
            >
              Begin Reflection
            </a>
          </div>
        </section>

        <div style={{ height: "120px" }} />
      </div>
    </main>
  );
}
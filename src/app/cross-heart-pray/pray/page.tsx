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
        <nav className="mb-16 flex items-center justify-between">
          <a
            href="/cross-heart-pray"
            className="text-sm font-semibold text-zinc-300"
          >
            ← Cross Heart Pray
          </a>

          <a
            href="/reflect"
            className="rounded-full border border-zinc-700 px-5 py-2 text-sm text-zinc-200 hover:border-white hover:text-white"
          >
            Begin Reflection
          </a>
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
              href="/reflect"
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
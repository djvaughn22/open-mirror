import BibleVerseLookup from "../../components/BibleVerseLookup";

const steps = [
  {
    title: "Cross",
    emoji: "✝️",
    href: "/cross",
    comingSoon: false,
    text: <>Jesus,<br />Son of God</>,
  },
  {
    title: "Heart",
    emoji: "❤️",
    href: "/heart",
    comingSoon: false,
    text: <>God&apos;s<br />Love</>,
  },
  {
    title: "Pray",
    emoji: "🙏",
    href: "/pray",
    comingSoon: false,
    text: <>Starts<br />with you</>,
  },
];
const HOME_CARD_TONES = [
  "border-emerald-100/20 bg-white/[0.055] shadow-2xl shadow-emerald-950/20",
  "border-red-100/20 bg-white/[0.055] shadow-2xl shadow-red-950/20",
  "border-sky-100/20 bg-white/[0.055] shadow-2xl shadow-sky-950/20",
];

function homeCardTone(index: number) {
  return HOME_CARD_TONES[index % HOME_CARD_TONES.length];
}

export default function HomePage() {
  const verseOfTheDayUrl = "https://www.bible.com/verse-of-the-day";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
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
              <a href="/explorebible">Bible Bingo</a>
              <a href="https://www.bibleportal.com/" target="_blank" rel="noopener noreferrer">
                Bible Portal
              </a>
              <a href="/about">About</a>
            </div>
          </details>
        </nav>

        <section className="mx-auto max-w-5xl pt-10 pb-12 text-center sm:pt-14 sm:pb-16">
          <p className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-black uppercase tracking-[0.14em] sm:text-base text-white">
            <span className="inline-flex items-center gap-2 text-white"><span className="text-2xl text-white">✝️</span><span>Cross</span></span>
            <span className="inline-flex items-center gap-2 text-white"><span className="text-2xl text-white">❤️</span><span>Heart</span></span>
            <span className="inline-flex items-center gap-2 text-white"><span className="text-2xl text-white">🙏</span><span>Pray</span></span>
          </p>

          <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl">
            Bible Bingo 7
          </h1>

          <div className="mx-auto mt-7 max-w-3xl space-y-3 text-2xl font-extrabold leading-tight sm:text-4xl text-blue-300">
            <p>Deal 7 cards</p>
            <p>Open the Bible</p>
            <p>Share a verse</p>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/explorebible"
              className="rounded-full border border-white/20 bg-white/10 px-8 py-3 text-center font-bold text-white shadow-lg shadow-black/20 transition hover:bg-white/15"
            >
              Deal Bible Bingo 7
            </a>


          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-6 text-white">
          {steps.map((step, index) => (
            <a
              key={step.title}
              href={step.href}
              className={`rounded-[1.5rem] border px-6 py-7 text-center text-slate-100 transition duration-200 hover:-translate-y-1 hover:bg-white/[0.075] md:col-span-2 ${homeCardTone(index)}`}
              style={{
                minHeight: "205px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="text-4xl text-white">{step.emoji}</div>

              {step.comingSoon && (
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-yellow-400 text-white">
                  Coming Soon
                </p>
              )}

              <h2 className={step.comingSoon ? "mt-3 text-xl font-black tracking-tight" : "mt-5 text-xl font-black tracking-tight"}>
                {step.title}
              </h2>

              <p className="mt-4 text-base font-semibold leading-7 text-blue-300" style={{ flex: 1 }}>
                {step.text}
              </p>
            </a>
          ))}
        </section>

        <BibleVerseLookup className="mt-6 pb-12 sm:mt-7 sm:pb-14" />

        <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
          © 2026 Open Mirror LLC · Follow Jesus · Love God · Pray
        </footer>
      </div>
    </main>
  );
}

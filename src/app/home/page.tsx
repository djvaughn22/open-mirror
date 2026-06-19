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

        <section className="mx-auto max-w-5xl py-20 text-center sm:py-24">
          <p className="mb-7 flex items-center justify-center gap-6 text-5xl md:gap-12 md:text-6xl">
            <span className="rounded-3xl border border-emerald-200/15 bg-emerald-300/10 px-4 py-3 shadow-lg shadow-emerald-950/20">✝️</span>
            <span className="rounded-3xl border border-red-200/15 bg-red-300/10 px-4 py-3 shadow-lg shadow-red-950/20">❤️</span>
            <span className="rounded-3xl border border-sky-200/15 bg-sky-300/10 px-4 py-3 shadow-lg shadow-sky-950/20">🙏</span>
          </p>

          <p className="mx-auto mb-5 inline-flex rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-200">
            7 Card Bible Bingo
          </p>

          <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl">
            Cross Heart Pray
          </h1>

          <div className="mx-auto mt-8 max-w-4xl">
            <p className="text-3xl font-extrabold leading-tight text-zinc-100 sm:text-5xl">
              Remember Jesus
            </p>

            <p className="mt-3 text-2xl font-bold leading-tight text-zinc-300 sm:text-4xl">
              Receive God&apos;s love
            </p>

            <p className="mt-4 text-xl font-bold leading-snug text-zinc-100 sm:text-3xl">
              Pray
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/explorebible"
              className="rounded-full border border-white/20 bg-white/10 px-8 py-3 text-center font-bold text-white shadow-lg shadow-black/20 transition hover:bg-white/15"
            >
              Deal Bible Bingo 7
            </a>


          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-6">
          {steps.map((step, index) => (
            <a
              key={step.title}
              href={step.href}
              className={`rounded-[2rem] border p-8 text-center text-slate-100 transition duration-200 hover:-translate-y-1 hover:bg-white/[0.075] md:col-span-2 ${homeCardTone(index)}`}
              style={{
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="rounded-3xl border border-white/10 bg-black/15 px-5 py-4 text-5xl shadow-lg shadow-black/20">{step.emoji}</div>

              {step.comingSoon && (
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-yellow-400">
                  Coming Soon
                </p>
              )}

              <h2 className={step.comingSoon ? "mt-4 text-2xl font-black tracking-tight" : "mt-8 text-2xl font-black tracking-tight"}>
                {step.title}
              </h2>

              <p className="mt-5 text-lg font-semibold leading-8 text-slate-200" style={{ flex: 1 }}>
                {step.text}
              </p>
            </a>
          ))}
        </section>

        <section className="border-t border-zinc-900 px-6 pt-12 pb-4 text-center sm:pt-14 sm:pb-5">
          <a
            href="/explorebible"
            className="rounded-full border border-white/20 bg-white/10 px-8 py-3 font-bold text-white shadow-lg shadow-black/20 transition hover:bg-white/15"
          >
            Bible Bingo
          </a>
        </section>


        <BibleVerseLookup className="mt-6 pb-12 sm:mt-7 sm:pb-14" />

        <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
          © 2026 Open Mirror LLC · Follow Jesus · Love God · Pray
        </footer>
      </div>
    </main>
  );
}

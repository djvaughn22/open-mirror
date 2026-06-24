import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Welcome",
  description:
    "CrossHeartPray is a simple daily Bible routine with a 52-week Reading Plan, Daily Hope, and Bible Bingo 7.",
};

const dailyWays = [
  {
    href: "/bible-reading-plan",
    icon: "📖",
    eyebrow: "Structured",
    title: "52-week Bible Reading Plan",
    body:
      "A steady path through Scripture with seven lanes across each week and a simple rhythm to return to every day.",
    cta: "Open Reading Plan",
  },
  {
    href: "/daily-hope",
    icon: "🌅",
    eyebrow: "Repeatable",
    title: "Daily Hope",
    body:
      "A short prayer and Scripture routine for the day, ready whenever you want to slow down and come back to the Word.",
    cta: "Open Daily Hope",
  },
  {
    href: "/explorebible",
    icon: "🎲",
    eyebrow: "Fun shuffle",
    title: "Bible Bingo 7",
    body:
      "Deal seven Bible cards, pick what stands out, open the chapter, and keep exploring where the verse leads.",
    cta: "Shuffle 7 Cards",
  },
];

const studyDetails = [
  {
    title: "Open the chapter",
    body: "A verse can quickly turn into context, chapter reading, and related Bible app study.",
  },
  {
    title: "Keep following the thread",
    body: "Bible Bingo connects discovery back into the bigger Bible reading rhythm.",
  },
  {
    title: "Deep Dive the words",
    body: "When verified data is available, open Strong’s-linked Hebrew and Greek meaning.",
  },
];

const crossHeartPrayCards = [
  { icon: "✝️", title: "Call out to Jesus" },
  { icon: "❤️", title: "Receive God’s love" },
  { icon: "🙏", title: "Pray nonstop" },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteHeader />

        <section className="mx-auto max-w-5xl text-center">
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-sm font-black uppercase tracking-[0.34em] text-white sm:text-base">
            <span className="inline-flex items-center gap-3">
              <span className="text-4xl tracking-normal">✝️</span>
              <span>Cross</span>
            </span>
            <span className="inline-flex items-center gap-3">
              <span className="text-4xl tracking-normal">❤️</span>
              <span>Heart</span>
            </span>
            <span className="inline-flex items-center gap-3">
              <span className="text-4xl tracking-normal">🙏</span>
              <span>Pray</span>
            </span>
          </div>

          <h1 className="mt-8 text-5xl font-black tracking-tight text-white sm:text-7xl">
            Cross Heart Pray all day.
          </h1>

          <p className="mt-4 text-2xl font-black text-emerald-100 sm:text-3xl">
            Your way through the Bible daily.
          </p>

          <p className="mx-auto mt-8 max-w-3xl text-base font-semibold leading-8 text-slate-300 sm:text-lg">
            Follow the 52-week Bible Reading Plan, pray through Daily Hope, or
            shuffle Bible Bingo 7 and see where the Word leads.
          </p>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-3">
          {dailyWays.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-7 text-left shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-emerald-200/40 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-5xl">{item.icon}</p>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.2em] text-emerald-100">
                  {item.eyebrow}
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-black tracking-tight text-white">
                {item.title}
              </h2>

              <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
                {item.body}
              </p>

              <div className="mt-7">
                <span className="inline-flex rounded-full border border-emerald-200/25 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-100 transition group-hover:bg-emerald-300/20">
                  {item.cta} →
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-[2rem] border border-emerald-200/15 bg-gradient-to-r from-emerald-300/[0.12] to-slate-900">
          <div className="grid gap-0 lg:grid-cols-[1fr_1.05fr]">
            <div className="p-8">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-100">
                Open a verse. Keep going.
              </p>

              <h2 className="mt-4 text-3xl font-black text-white">
                One verse can open a whole trail.
              </h2>

              <p className="mt-4 text-sm font-semibold leading-7 text-slate-200">
                Bible Bingo starts with a shuffle, but it can lead into chapter
                context, Bible app study, related verse reading, and a deeper
                look at the original words.
              </p>

              <Link
                href="/explorebible"
                className="mt-7 inline-flex rounded-full bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-200"
              >
                Try Bible Bingo 7 →
              </Link>
            </div>

            <div className="grid gap-4 bg-slate-950/45 p-6">
              {studyDetails.map((detail) => (
                <div
                  key={detail.title}
                  className="rounded-[1.4rem] border border-white/10 bg-slate-950/55 p-5"
                >
                  <h3 className="text-base font-black text-white">
                    {detail.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
                    {detail.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100">
              The simple flow underneath
            </p>
            <h2 className="mt-4 text-3xl font-black text-white">
              Cross. Heart. Pray.
            </h2>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {crossHeartPrayCards.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-6 text-center"
              >
                <p className="text-4xl">{item.icon}</p>
                <h3 className="mt-4 text-xl font-black text-white">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-4xl text-center">
          <p className="text-sm font-semibold leading-7 text-slate-400">
            Built for personal daily access to a Bible routine and to share with
            family, friends, and the world.
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

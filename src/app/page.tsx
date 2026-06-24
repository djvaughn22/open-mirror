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
    eyebrow: "Read steady",
    title: "52-week Bible Reading Plan",
    body:
      "A simple path through the Bible, week by week. Seven lanes, one daily rhythm, easy to return to.",
    cta: "Open the plan",
  },
  {
    href: "/daily-hope",
    icon: "🌅",
    eyebrow: "Start with hope",
    title: "Daily Hope",
    body:
      "A short prayer and Scripture routine for the day. Same verses, same rhythm, ready whenever you are.",
    cta: "Open Daily Hope",
  },
  {
    href: "/explorebible",
    icon: "🎲",
    eyebrow: "Shuffle and explore",
    title: "Bible Bingo 7",
    body:
      "Deal seven Bible cards, pick what stands out, open the chapter, and follow the verse deeper.",
    cta: "Shuffle cards",
  },
];

const studyDetails = [
  {
    title: "Open the Bible app",
    body: "Every verse can lead into the Bible app for the chapter and related reading.",
  },
  {
    title: "Follow the thread",
    body: "Bible Bingo connects random discovery back into the weekly reading rhythm.",
  },
  {
    title: "Deep Dive the words",
    body: "When verified data is available, open Strong’s-linked Hebrew and Greek word study.",
  },
];

const crossHeartPrayCards = [
  {
    icon: "✝️",
    title: "Call out to Jesus",
  },
  {
    icon: "❤️",
    title: "Receive God’s love",
  },
  {
    icon: "🙏",
    title: "Pray nonstop",
  },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteHeader />

        <section className="mx-auto max-w-5xl text-center">
          <p className="text-6xl font-black tracking-tight text-white sm:text-7xl">
            ✝️ ❤️ 🙏
          </p>

          <p className="mt-5 text-lg font-black tracking-[0.22em] text-emerald-100 sm:text-xl">
            CrossHeartPray
          </p>

          <h1 className="mx-auto mt-7 max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl">
            Your way through the Bible daily.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-200">
            A simple place to read, pray, shuffle, explore, and come back
            tomorrow.
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-300">
            Built for daily access to a Bible routine — and to share with
            family, friends, and the world.
          </p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          {dailyWays.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.025] p-7 text-left shadow-2xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-emerald-200/45 hover:from-emerald-300/[0.12] hover:to-white/[0.04]"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-5xl">{item.icon}</p>
                <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-emerald-100">
                  {item.eyebrow}
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-black tracking-tight text-white">
                {item.title}
              </h2>

              <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
                {item.body}
              </p>

              <p className="mt-7 inline-flex rounded-full border border-emerald-200/30 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-100 transition group-hover:bg-emerald-300/20">
                {item.cta} →
              </p>
            </Link>
          ))}
        </section>

        <section className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-[2rem] border border-emerald-200/15 bg-emerald-300/[0.07]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <div className="p-7 lg:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100">
                Open a verse. Keep going.
              </p>

              <h2 className="mt-4 text-3xl font-black text-white">
                One verse can become a whole study.
              </h2>

              <p className="mt-4 text-sm font-semibold leading-7 text-slate-200">
                Bible Bingo can start random, but it does not have to stay
                random. Open the verse, read the chapter, follow related Bible
                app study, and Deep Dive the original words when source-backed
                data is available.
              </p>

              <Link
                href="/explorebible"
                className="mt-7 inline-flex rounded-full bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-200"
              >
                Try Bible Bingo 7 →
              </Link>
            </div>

            <div className="grid gap-3 border-t border-emerald-200/10 bg-slate-950/35 p-5 lg:border-l lg:border-t-0">
              {studyDetails.map((detail) => (
                <div
                  key={detail.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/55 p-5"
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
      </div>

      <SiteFooter />
    </main>
  );
}

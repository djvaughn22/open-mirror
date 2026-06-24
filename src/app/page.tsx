import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import BibleBingoKingCard from "../components/BibleBingoKingCard";
import CrossHeartPrayHero from "../components/CrossHeartPrayHero";

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
    eyebrow: "Daily",
    title: "Daily Hope",
    body:
      "A short prayer and Scripture routine for the day, ready whenever you want to slow down and come back to the Word.",
    cta: "Open Daily Hope",
  },
  {
    href: "/explorebible",
    icon: "king-of-hearts",
    eyebrow: "7-card deck",
    title: "Bible Bingo 7",
    body:
      "Deal seven Bible cards, pick what stands out, open the chapter, and keep exploring where the verse leads.",
    cta: "Deal 7 Cards",
  },
];

const studyDetails = [
  {
    title: "Open the chapter",
    body: "A verse can turn into context, chapter reading, and related Bible app study.",
  },
  {
    title: "Follow the trail",
    body: "Bible Bingo connects a random card back into the bigger Bible reading rhythm.",
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

        <CrossHeartPrayHero>
          <p>
            Follow the 52-week Bible Reading Plan, pray through Daily Hope, or
            deal Bible Bingo 7 cards and see where the Word leads.
          </p>
        </CrossHeartPrayHero>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {dailyWays.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-7 text-left shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-emerald-200/40 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-4">
                {item.icon === "king-of-hearts" ? (
                  <BibleBingoKingCard className="h-16 w-12" />
                ) : (
                  <p className="text-5xl">{item.icon}</p>
                )}
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

        <section className="mx-auto mt-12 max-w-5xl rounded-[2rem] border border-emerald-200/15 bg-gradient-to-br from-emerald-300/[0.10] via-slate-900 to-slate-950 p-5 shadow-2xl shadow-emerald-950/15 sm:mt-14 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-100">
                Open a verse. Keep going.
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
                One verse can open a whole trail.
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-200 sm:text-base">
                Bible Bingo starts with a 7-card deal, then opens into chapter
                context, Bible app study, related verses, and original word
                study when verified data is available.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/explorebible"
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-200 sm:w-auto"
              >
                Deal Bible Bingo 7 →
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {studyDetails.map((detail) => (
              <div
                key={detail.title}
                className="rounded-[1.35rem] border border-white/10 bg-slate-950/55 p-4 sm:p-5"
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
        </section>
        <section className="mx-auto mt-14 max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100">
              The simple flow underneath
            </p>
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

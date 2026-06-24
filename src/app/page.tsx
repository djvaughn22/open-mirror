import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Welcome",
  description:
    "Cross Heart Pray your way through the Bible daily with a 52-week Reading Plan, Daily Hope, and Bible Bingo 7.",
};

const dailyWays = [
  {
    href: "/bible-reading-plan",
    icon: "📖",
    eyebrow: "Structured daily path",
    title: "52-week Bible Reading Plan",
    body:
      "Read through Scripture in seven weekly lanes. Keep the rhythm simple, mark progress, and come back daily.",
    cta: "Open Reading Plan",
  },
  {
    href: "/daily-hope",
    icon: "🌅",
    eyebrow: "Repeatable daily routine",
    title: "Daily Hope",
    body:
      "Start with prayer, read the same hope-filled verses by day, and return to a steady routine anytime.",
    cta: "Open Daily Hope",
  },
  {
    href: "/explorebible",
    icon: "🎲",
    eyebrow: "Fun random explorer",
    title: "Bible Bingo 7",
    body:
      "Shuffle seven Bible cards, follow the verse that stands out, open the chapter, and share what you find.",
    cta: "Shuffle 7 Cards",
  },
];

const studyDetails = [
  "Bible app verse and chapter links for related reading.",
  "Deep Dive word study when verified source data is available.",
  "Strong’s-linked original Hebrew and Greek word meaning without guessing.",
];

const crossHeartPrayCards = [
  {
    icon: "✝️",
    title: "Call to Jesus",
    body: "Come to Jesus with the good, the bad, and the ugly.",
  },
  {
    icon: "❤️",
    title: "Receive God’s Love",
    body: "Receive God’s everlasting, unconditional love.",
  },
  {
    icon: "🙏",
    title: "Pray!",
    body: "Talk to God, and let God’s will be done.",
  },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteHeader />

        <section className="mx-auto max-w-5xl text-center">
          <p className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            ✝️ ❤️ 🙏
          </p>

          <p className="mt-5 text-sm font-black uppercase tracking-[0.32em] text-emerald-100">
            CrossHeartPray
          </p>

          <h1 className="mx-auto mt-6 max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl">
            Cross Heart Pray your way through the Bible daily.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-200">
            A simple Bible web app for daily Scripture, steady routine, and
            joyful discovery.
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-300">
            Follow the structured 52-week plan, pray through Daily Hope, or
            shuffle Bible Bingo 7 and explore where the Word leads.
          </p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          {dailyWays.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 text-left transition hover:-translate-y-1 hover:border-emerald-200/45 hover:bg-white/[0.07]"
            >
              <p className="text-4xl">{item.icon}</p>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
                {item.eyebrow}
              </p>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
                {item.title}
              </h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
                {item.body}
              </p>
              <p className="mt-7 inline-flex rounded-full border border-emerald-200/30 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-100 transition group-hover:bg-emerald-300/15">
                {item.cta} →
              </p>
            </Link>
          ))}
        </section>

        <section className="mx-auto mt-12 max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
          <div className="grid gap-7 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100">
                Explore deeper
              </p>
              <h2 className="mt-4 text-3xl font-black text-white">
                Open a verse, then keep going.
              </h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
                Bible Bingo is not just a random card. It connects the verse to
                chapter context, Bible app reading, and source-backed Deep Dive
                study when available.
              </p>
            </div>

            <div className="grid gap-3">
              {studyDetails.map((detail) => (
                <div
                  key={detail}
                  className="rounded-2xl border border-white/10 bg-slate-950/45 px-5 py-4 text-sm font-bold leading-6 text-slate-200"
                >
                  {detail}
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
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-5 text-center"
              >
                <p className="text-3xl">{item.icon}</p>
                <h3 className="mt-3 text-xl font-black text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-4xl text-center">
          <p className="text-sm font-semibold leading-7 text-slate-400">
            Built for personal daily access to a Bible routine, and to share
            with family, friends, and the world.
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

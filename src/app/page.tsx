import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import BibleBingoKingCard from "../components/BibleBingoKingCard";
import CrossHeartPrayHero from "../components/CrossHeartPrayHero";

export const metadata = {
  title: "✝️ ❤️ 🙏 Welcome | Cross Heart Pray",
  description:
    "Bible App Every Day with Bible Bingo 7, the Bible Reading Plan, Daily Hope, and source-backed Behind the Verse study.",
};

const dailyWays = [
  {
    href: "/bible-reading-plan",
    icon: "📖",
    eyebrow: "READ",
    title: "52-week Bible Reading Plan",
    body:
      "A clean weekly path through Scripture with seven simple lanes and progress that stays out of the way.",
    cta: "Open plan",
  },
  {
    href: "/daily-hope",
    icon: "🌅",
    eyebrow: "PRAY",
    title: "Daily Hope",
    body:
      "A short daily prayer and Scripture rhythm for slowing down and coming back to the Word.",
    cta: "Open hope",
  },
  {
    href: "/explorebible",
    icon: "king-of-hearts",
    eyebrow: "DEAL",
    title: "Bible Bingo 7",
    body:
      "Seven Bible cards, one focused verse, the full chapter, and a simple path to keep exploring.",
    cta: "Deal cards",
  },
];

const sourceTiles = [
  {
    eyebrow: "1 VERSE",
    title: "John 1:1",
    body: "A focused starting point.",
    href: "https://www.bible.com/bible/206/JHN.1.1.WEBUS",
    external: true,
  },
  {
    eyebrow: "CHAPTER",
    title: "Open the Bible",
    body: "Read the verse in context.",
    href: "https://www.bible.com/bible/206/JHN.1.WEBUS",
    external: true,
  },
  {
    eyebrow: "SOURCE",
    title: "Logos · G3056",
    body: "Verified original word study.",
    href: "https://biblehub.com/greek/3056.htm",
    external: true,
  },
];

export default function WelcomePage() {
  return (
    <main className="chp-lively-dark-page min-h-screen overflow-hidden bg-[#05070c] text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.12),transparent_32%),linear-gradient(180deg,#05070c_0%,#08111a_48%,#05070c_100%)]" />

      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        <SiteHeader />

        <CrossHeartPrayHero className="pt-2 sm:pt-4" />

        <section className="mx-auto mt-8 grid max-w-6xl gap-4 lg:grid-cols-3">
          {dailyWays.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07] sm:p-7"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/25 shadow-inner shadow-white/5">
                  {item.icon === "king-of-hearts" ? (
                    <BibleBingoKingCard className="h-11 w-9" />
                  ) : (
                    <span className="text-3xl leading-none">{item.icon}</span>
                  )}
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.22em] text-slate-200">
                  {item.eyebrow}
                </span>
              </div>

              <h2 className="mt-8 max-w-xs text-2xl font-black leading-tight tracking-tight text-white">
                {item.title}
              </h2>

              <p className="mt-4 min-h-[5.25rem] text-sm font-semibold leading-7 text-slate-300">
                {item.body}
              </p>

              <div className="mt-7">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition group-hover:border-white/30 group-hover:bg-white/[0.12]">
                  {item.cta} <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_30px_110px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:mt-12">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden border-b border-white/10 p-7 sm:p-9 lg:border-b-0 lg:border-r lg:border-white/10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.12),transparent_45%)]" />

              <div className="relative">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-emerald-100">
                  Behind the Verse
                </p>

                <h2 className="mt-4 max-w-md text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl">
                  Open the Word, then go deeper.
                </h2>

                <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-slate-300">
                  Start with one verse. Open the full chapter. Follow the reading plan.
                  When a word is verified, look behind the English into the Hebrew or Greek source.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  <Link
                    href="/explorebible"
                    className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-slate-200"
                  >
                    Open Bible Bingo 7 →
                  </Link>
                  <Link
                    href="/bible-reading-plan"
                    className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/[0.11]"
                  >
                    Reading Plan →
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="grid gap-3">
                {sourceTiles.map((item) => {
                  const content = (
                    <div className="group rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-white/25 hover:bg-white/[0.06]">
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-slate-400">
                        {item.eyebrow}
                      </p>
                      <p className="mt-2 text-xl font-black tracking-tight text-white underline decoration-white/20 underline-offset-4 transition group-hover:decoration-white/60">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
                        {item.body}
                      </p>
                    </div>
                  );

                  return item.external ? (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  ) : (
                    <Link key={item.title} href={item.href}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

const flowCards = [
  {
    title: "Bible Bingo 7",
    href: "/",
    line: "Discover a specific Bible verse.",
  },
  {
    title: "Bible Reading Plan",
    href: "/bible-reading-plan",
    line: "Open the chapter, understand the context, and track your way through the Bible.",
  },
  {
    title: "Daily Hope",
    href: "/daily-hope",
    line: "Return to daily prayers and hope verses.",
  },
  {
    title: "Cross",
    href: "/cross",
    line: "Bring it to Jesus.",
  },
  {
    title: "Heart",
    href: "/heart",
    line: "Receive God’s everlasting, unconditional love.",
  },
  {
    title: "Pray",
    href: "/pray",
    line: "Talk to God and let His will be done.",
  },
  {
    title: "About",
    href: "/about",
    line: "The 7-second version of the whole flow.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteHeader />

        <section className="max-w-4xl text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">
            About
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">
            ✝️ ❤️ 🙏
          </h1>

          <p className="mt-7 max-w-3xl text-xl font-semibold leading-9 text-emerald-100 sm:text-2xl sm:leading-10">
            CrossHeartPray helps you read the Bible, find specific verses, open chapters for context, track your Bible Reading Plan, and share anything with anyone.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-emerald-200/15 bg-emerald-300/[0.06] p-5 text-left">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">
              The flow
            </p>

            <p className="mt-3 text-base font-semibold leading-8 text-slate-300">
              Bible Bingo 7 → Bible Reading Plan → Daily Hope → Cross → Heart → Pray → About
            </p>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-2">
          {flowCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 text-left transition hover:border-emerald-200/40 hover:bg-white/[0.07]"
            >
              <h2 className="text-2xl font-black text-white">
                {card.title}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                {card.line}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-12 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 text-center">
          <p className="text-lg font-black text-white">
            Cross Heart Pray your way through it.
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-300">
            A simple formula for Truth, Joy and Peace.
          </p>
          <p className="mt-6 text-sm font-semibold text-slate-400">
            RIP Travis - VTL
          </p>
          <p className="mt-1 text-xl">
            ✝️ ❤️ 🙏
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Welcome",
  description:
    "Cross Heart Pray your way through the Bible daily with a 52-week Reading Plan or the Bible Bingo 7-card shuffle.",
};

const mainPaths = [
  {
    href: "/bible-reading-plan",
    eyebrow: "Structured daily plan",
    title: "52-week Bible Reading Plan",
    body:
      "Follow seven simple lanes through Scripture each week. Read a little, mark progress, and keep coming back.",
    cta: "Open the Reading Plan",
  },
  {
    href: "/explorebible",
    eyebrow: "Fun random explorer",
    title: "Bible Bingo 7-card shuffle",
    body:
      "Deal seven verses from the Bible, choose the card that stands out, open the chapter, and explore deeper.",
    cta: "Shuffle Bible Bingo 7",
  },
];

const routineLinks = [
  {
    href: "/daily-hope",
    title: "Daily Hope",
    body: "A repeatable prayer and Scripture routine for the day.",
  },
  {
    href: "/about",
    title: "About",
    body: "What CrossHeartPray is, why it exists, and how the routine fits together.",
  },
];

const crossHeartPrayCards = [
  {
    icon: "✝️",
    title: "Cross",
    body: "Come to Jesus. Bring the good, the bad, and the ugly.",
  },
  {
    icon: "❤️",
    title: "Heart",
    body: "Receive God’s everlasting, unconditional love.",
  },
  {
    icon: "🙏",
    title: "Pray",
    body: "Talk to God. Let His will be done.",
  },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteHeader />

        <section className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-100">
            ✝️ Cross ❤️ Heart 🙏 Pray
          </p>

          <h1 className="mx-auto mt-6 max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl">
            Cross Heart Pray your way through the Bible daily.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-200">
            Choose a structured 52-week Reading Plan or the fun Bible Bingo
            7-card shuffle.
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-300">
            Take the Word of God with you. Read with a plan, shuffle into a
            random verse, open the chapter, and come back again tomorrow.
          </p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          {mainPaths.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 text-left transition hover:border-emerald-200/45 hover:bg-white/[0.07]"
            >
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100">
                {item.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
                {item.title}
              </h2>
              <p className="mt-4 text-base font-semibold leading-8 text-slate-300">
                {item.body}
              </p>
              <p className="mt-7 inline-flex rounded-full border border-emerald-200/30 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-100 transition group-hover:bg-emerald-300/15">
                {item.cta} →
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {routineLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <h2 className="text-2xl font-black text-white">{item.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                {item.body}
              </p>
              <p className="mt-5 text-sm font-black text-emerald-100">
                Open {item.title} →
              </p>
            </Link>
          ))}
        </section>

        <section className="mx-auto mt-14 max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100">
              The simple flow underneath
            </p>
            <h2 className="mt-4 text-3xl font-black text-white">
              Cross. Heart. Pray.
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
              This is the quiet formula behind the routine.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {crossHeartPrayCards.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-5 text-center"
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
            Built first from a daily Bible routine, then shared for kids,
            family, old friends, new friends, and anyone who wants to follow
            along.
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

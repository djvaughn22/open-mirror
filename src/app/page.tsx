import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Welcome",
  description:
    "A simple Bible web app for Bible Bingo 7, a Bible Reading Plan, and Daily Hope.",
};

const routineLinks = [
  {
    href: "/explorebible",
    eyebrow: "Random explorer",
    title: "Bible Bingo 7",
    body:
      "Deal seven verses, follow what stands out, open the chapter, and use Deep Dive when source-backed word study is available.",
    cta: "Open Bible Bingo",
  },
  {
    href: "/bible-reading-plan",
    eyebrow: "Structured path",
    title: "Bible Reading Plan",
    body:
      "Follow a simple weekly rhythm through Scripture with seven lanes and fifty-two weeks.",
    cta: "Open Reading Plan",
  },
  {
    href: "/daily-hope",
    eyebrow: "Daily routine",
    title: "Daily Hope",
    body:
      "A repeatable prayer and Scripture routine for each day, built from the daily paper routine that helped start this site.",
    cta: "Open Daily Hope",
  },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteHeader />

        <section className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-100">
            ✝️ Cross ❤️ Heart 🙏 Pray
          </p>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl">
            Take the Word of God with you.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-200">
            A simple Bible web app for my kids, family, old friends, new friends,
            and anyone who wants to follow along.
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-300">
            Use a structured Bible Reading Plan, a repeatable Daily Hope routine,
            or a random Bible Bingo 7 explorer that can open any verse into
            context and Deep Dive study.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/explorebible"
              className="rounded-full bg-emerald-300 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-200"
            >
              Start Bible Bingo 7
            </Link>
            <Link
              href="/bible-reading-plan"
              className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/15"
            >
              Follow the Reading Plan
            </Link>
          </div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          {routineLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 text-left transition hover:border-emerald-200/40 hover:bg-white/[0.07]"
            >
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
                {item.eyebrow}
              </p>
              <h2 className="mt-4 text-2xl font-black text-white">
                {item.title}
              </h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
                {item.body}
              </p>
              <p className="mt-6 text-sm font-black text-emerald-100">
                {item.cta} →
              </p>
            </Link>
          ))}
        </section>

        <section className="mx-auto mt-14 max-w-4xl rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 text-center">
          <p className="text-base font-black text-white">
            Cross Heart Pray is the quiet formula underneath the routine.
          </p>
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
            Come to Jesus. Receive God&apos;s everlasting, unconditional love.
            Pray, and let God&apos;s will be done.
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

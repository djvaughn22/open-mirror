import { type BibleReadingPlanWeek } from "../lib/bibleReadingPlan";
import BibleReadingPlanProgress from "./BibleReadingPlanProgress";
import PrintButton from "./PrintButton";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type BibleReadingPlanTrackerProps = {
  weeks: BibleReadingPlanWeek[];
};

const READING_PLAN_LANES = [
  { day: "Sunday", lane: "Epistles", note: "Letters for faith and life in Christ." },
  { day: "Monday", lane: "Law", note: "Beginnings, covenant, and God’s way." },
  { day: "Tuesday", lane: "History", note: "Real stories of God with His people." },
  { day: "Wednesday", lane: "Psalms", note: "Prayer, praise, and honest worship." },
  { day: "Thursday", lane: "Poetry", note: "Wisdom, wonder, and the heart." },
  { day: "Friday", lane: "Prophecy", note: "Warnings, promises, and hope." },
  { day: "Saturday", lane: "Gospels", note: "Jesus—His words, works, and way." },
];

export default function BibleReadingPlanTracker({ weeks }: BibleReadingPlanTrackerProps) {
  return (
    <main className="chp-lively-dark-page min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-black">
      <section className="mx-auto max-w-6xl px-4 py-4 print:max-w-none print:px-0 print:py-0 sm:px-6 sm:py-6">
        <SiteHeader className="mb-3 sm:mb-5 print:hidden" />

        <section className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950/45 p-4 shadow-xl shadow-black/20 print:border-black print:bg-white sm:rounded-[2rem] sm:p-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.20),transparent_26rem),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.14),transparent_24rem)]" />

          <div className="relative grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <div
                className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-black uppercase tracking-[0.26em] text-white sm:text-base"
                aria-hidden="true"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="text-3xl tracking-normal">✝️</span>
                  <span>Cross</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="text-3xl tracking-normal">❤️</span>
                  <span>Heart</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="text-3xl tracking-normal">🙏</span>
                  <span>Pray</span>
                </span>
              </div>

              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-white print:text-black sm:text-6xl">
                Bible Reading Plan
              </h1>

              <p className="mt-3 max-w-2xl text-lg font-black leading-snug text-emerald-100 print:text-black sm:text-xl">
                Start with one day. Keep the rhythm.
              </p>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 print:text-black">
                A 52-week path through Scripture, organized by seven weekly lanes.
                Read the day, open the Bible app, and mark it done.
              </p>

              <div className="mt-4 flex flex-col gap-2 print:hidden sm:flex-row sm:items-center">
                <a
                  href="#reading-plan-board"
                  className="inline-flex justify-center rounded-full bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/25 transition hover:bg-emerald-200"
                >
                  Open today&apos;s board ↓
                </a>

                <PrintButton />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-[1.1rem] border border-emerald-200/20 bg-emerald-300/10 p-3 text-center">
                <p className="text-3xl font-black text-white">52</p>
                <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-emerald-100">
                  Weeks
                </p>
              </div>

              <div className="rounded-[1.1rem] border border-yellow-200/20 bg-yellow-300/10 p-3 text-center">
                <p className="text-3xl font-black text-white">7</p>
                <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-yellow-100">
                  Lanes
                </p>
              </div>

              <div className="rounded-[1.1rem] border border-sky-200/20 bg-sky-300/10 p-3 text-center">
                <p className="text-3xl font-black text-white">1</p>
                <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-sky-100">
                  Day
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 print:hidden">
          {READING_PLAN_LANES.map((lane) => (
            <article
              key={lane.day}
              className="rounded-[0.95rem] border border-white/10 bg-white/[0.045] p-3 shadow-sm shadow-black/10"
            >
              <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-emerald-100">
                {lane.day}
              </p>
              <h2 className="mt-1 text-base font-black text-white">
                {lane.lane}
              </h2>
              <p className="mt-1 text-[0.72rem] font-semibold leading-4 text-slate-300">
                {lane.note}
              </p>
            </article>
          ))}
        </section>

        <div id="reading-plan-board" className="chp-reading-progress-shell mt-4 scroll-mt-6">
          <BibleReadingPlanProgress weeks={weeks} />
        </div>

        <SiteFooter />
      </section>
    </main>
  );
}

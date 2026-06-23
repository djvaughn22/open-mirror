import {
  BIBLE_READING_PLAN_PDF_HREF,
  BIBLE_READING_PLAN_SOURCE,
  BIBLE_READING_PLAN_SOURCE_NOTE,
  type BibleReadingPlanWeek,
} from "../lib/bibleReadingPlan";
import BibleReadingPlanProgress from "./BibleReadingPlanProgress";
import PrintButton from "./PrintButton";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type BibleReadingPlanTrackerProps = {
  weeks: BibleReadingPlanWeek[];
};

export default function BibleReadingPlanTracker({ weeks }: BibleReadingPlanTrackerProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-black">
      <section className="mx-auto max-w-6xl px-6 py-8 print:max-w-none print:px-0 print:py-0">
        <SiteHeader className="mb-10 sm:mb-12 print:hidden" />

        <div className="text-center">
          <div
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-base font-black uppercase tracking-[0.24em] text-white sm:text-lg"
            aria-hidden="true"
          >
            <span className="text-3xl">✝️</span>
            <span>Cross</span>
            <span className="text-3xl">❤️</span>
            <span>Heart</span>
            <span className="text-3xl">🙏</span>
            <span>Pray</span>
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white print:text-black sm:text-7xl">
            Bible Reading Plan
          </h1>

          <p className="mt-3 text-xl font-black text-emerald-100 print:text-black sm:text-3xl">
            Fill the 52-week board.
          </p>

          <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-center print:border-black print:bg-white">
            <p className="text-sm font-black text-slate-100 print:text-black sm:text-base">
              One full-year board. Read, check, and watch it fill.
            </p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-100 print:text-black sm:text-xs">
              Sunday Epistles: letters · Monday Law: beginnings · Tuesday History: stories · Wednesday Psalms: prayer · Thursday Poetry: wisdom · Friday Prophecy: promises · Saturday Gospels: Jesus
            </p>
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-xs font-semibold leading-6 text-slate-400 print:text-black">
            Source: {BIBLE_READING_PLAN_SOURCE}. {BIBLE_READING_PLAN_SOURCE_NOTE}
          </p>

          <div className="mt-7 flex flex-col items-center gap-4 print:hidden">
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              <PrintButton />

              <a
                href={BIBLE_READING_PLAN_PDF_HREF}
                download
                className="w-full max-w-sm rounded-full border border-white/15 bg-white/10 px-6 py-3 text-center text-sm font-black uppercase tracking-[0.18em] text-slate-100 shadow-lg shadow-black/15 transition hover:bg-white/15 sm:w-auto"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>

        <BibleReadingPlanProgress weeks={weeks} />

        <SiteFooter />
      </section>
    </main>
  );
}

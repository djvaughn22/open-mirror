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
            Start Week 1 any day.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-semibold leading-7 text-slate-300 print:text-black sm:text-base">
            A simple 52-week Bible reading tracker with local progress, PDF download, and Bible App links.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-xs font-semibold leading-6 text-slate-400 print:text-black">
            Source: {BIBLE_READING_PLAN_SOURCE}. {BIBLE_READING_PLAN_SOURCE_NOTE}
          </p>

          <div className="mt-7 flex flex-col items-center gap-4 print:hidden">
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={BIBLE_READING_PLAN_PDF_HREF}
                download
                className="w-full max-w-sm rounded-full border border-emerald-200/30 bg-emerald-300/15 px-6 py-3 text-center text-sm font-black uppercase tracking-[0.18em] text-emerald-50 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-300/22 sm:w-auto"
              >
                Download PDF
              </a>

<PrintButton />
            </div>
          </div>
        </div>

        <BibleReadingPlanProgress weeks={weeks} />

        <SiteFooter />
      </section>
    </main>
  );
}

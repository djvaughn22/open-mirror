import { type BibleReadingPlanWeek } from "../lib/bibleReadingPlan";
import BibleReadingPlanProgress from "./BibleReadingPlanProgress";
import PrintButton from "./PrintButton";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import CrossHeartPrayHero from "./CrossHeartPrayHero";

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
    <main className="min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-black">
      <section className="mx-auto max-w-7xl px-4 py-5 print:max-w-none print:px-0 print:py-0 sm:px-6 sm:py-8">
        <SiteHeader className="mb-5 sm:mb-12 print:hidden" />

        <div className="text-center">
          <CrossHeartPrayHero compact className="print:hidden" />

          <h1 className="mt-4 text-3xl font-black tracking-tight text-white print:text-black sm:mt-6 sm:text-7xl">
            Bible Reading Plan
          </h1>

          <p className="mt-2 text-lg font-black text-emerald-100 print:text-black sm:mt-3 sm:text-3xl">
            Daily Bible reading.
          </p>
<div className="mt-7 flex flex-col items-center gap-4 print:hidden">
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
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

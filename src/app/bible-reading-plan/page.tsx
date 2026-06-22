import BibleReadingPlanTracker from "../../components/BibleReadingPlanTracker";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { BIBLE_READING_PLAN_WEEKS } from "../../lib/bibleReadingPlan";

export const metadata = {
  title: "Bible Reading Plan | Cross Heart Pray",
  description: "A digital 52-week Bible reading plan tracker with Bible App links.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BibleReadingPlanPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <SiteHeader />
      <BibleReadingPlanTracker weeks={BIBLE_READING_PLAN_WEEKS} />
      <SiteFooter />
    </div>
  );
}

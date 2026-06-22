import BibleReadingPlanTracker from "../../components/BibleReadingPlanTracker";
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
  return <BibleReadingPlanTracker weeks={BIBLE_READING_PLAN_WEEKS} />;
}

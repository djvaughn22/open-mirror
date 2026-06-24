import BibleReadingPlanTracker from "../../components/BibleReadingPlanTracker";
import { BIBLE_READING_PLAN_WEEKS } from "../../lib/bibleReadingPlan";

export const metadata = {
  title: "✝️ ❤️ 🙏 Bible Reading Plan",
  description: "A full-year digital Bible Reading Plan board that fills as you read.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BibleReadingPlanPage() {
  return <BibleReadingPlanTracker weeks={BIBLE_READING_PLAN_WEEKS} />;
}

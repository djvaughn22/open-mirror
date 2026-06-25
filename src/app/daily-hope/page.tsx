import DailyHopeRoutine from "../../components/DailyHopeRoutine";
import {
  dailyHopeClosingPrayer,
  dailyHopeOpeningPrayers,
  getDailyHopeDays,
  getDailyHopeMissingReferences,
} from "../../lib/dailyHopeRoutine";

export const metadata = {
  title: "Daily Hope",
  description: "A fixed Daily Hope prayer and Scripture routine that keeps the day simple while each verse can connect to Bible Bingo, the Reading Plan, and source-backed Deep Dive.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DailyHopePage() {
  const days = getDailyHopeDays();
  const missingReferences = getDailyHopeMissingReferences();

  return (
    <DailyHopeRoutine
      openingPrayers={dailyHopeOpeningPrayers}
      closingPrayer={dailyHopeClosingPrayer}
      days={days}
      missingReferences={missingReferences}
    />
  );
}

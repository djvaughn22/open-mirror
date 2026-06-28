"use client";

import { CHP_OFFICIAL_BIBLE_READING_PLAN_PDF } from "@/lib/crossHeartPrayOfficialAssets";
import BibleVerseLookup from "./BibleVerseLookup";

type LazyBibleVerseLookupProps = {
  className?: string;
  initialReference?: string;
  suggestedReferences?: string[];
};

export default function LazyBibleVerseLookup(props: LazyBibleVerseLookupProps) {
  return (
    <section className="mt-20 border-t border-white/10 pt-14">
      <BibleVerseLookup {...props} />
    </section>
  );
}

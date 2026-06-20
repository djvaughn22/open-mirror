"use client";

import dynamic from "next/dynamic";

const BibleVerseLookup = dynamic(() => import("./BibleVerseLookup"), {
  ssr: false,
  loading: () => (
    <section className="mt-20 border-t border-white/10 pt-14">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 p-6 text-center text-sm font-semibold text-slate-400 shadow-xl shadow-black/15">
        Loading Bible Verse Lookup…
      </div>
    </section>
  ),
});

type LazyBibleVerseLookupProps = {
  className?: string;
};

export default function LazyBibleVerseLookup(props: LazyBibleVerseLookupProps) {
  return (
    <section className="mt-20 border-t border-white/10 pt-14">
      <BibleVerseLookup {...props} />
    </section>
  );
}

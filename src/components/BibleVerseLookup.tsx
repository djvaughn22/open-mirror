"use client";

type BibleVerseLookupProps = {
  className?: string;
};

export default function BibleVerseLookup({
  className = "mt-12",
}: BibleVerseLookupProps) {
  return (
    <section
      className={`${className} text-center text-slate-100`}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">
        Bible Verse Lookup
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-100">
        Search Bible Verse
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-200">
        Type a verse like John 3:16, Psalm 23, Romans 8:28, or Genesis 1:1.
      </p>

      <form
        action="https://www.bible.com/search/bible"
        method="get"
        target="_blank"
        className="mx-auto mt-5 flex max-w-xl flex-col gap-3 sm:flex-row"
      >
        <input
          name="q"
          type="text"
          inputMode="text"
          placeholder="John 3:16"
          aria-label="Bible verse to search"
          className="min-h-12 flex-1 rounded-2xl border border-white/15 bg-black/20 px-4 text-base text-white placeholder:text-white/40 outline-none ring-0 focus:border-emerald-200/50"
        />

        <button
          type="submit"
          className="min-h-12 rounded-2xl border border-white/15 bg-white/10 px-5 font-semibold text-slate-100 transition hover:bg-white/15"
        >
          Search Bible Verse
        </button>
      </form>

      <p className="mt-3 text-xs text-slate-300">
        Opens Bible.com / YouVersion so the Bible stays the destination.
      </p>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type BibleReadingPlanDay,
  type BibleReadingPlanWeek,
} from "../lib/bibleReadingPlan";

type BibleReadingPlanProgressProps = {
  weeks: BibleReadingPlanWeek[];
};

const STORAGE_KEY = "crossheartpray:bible-reading-plan:v1";

type StoredProgress = {
  startDateKey: string;
  done: Record<string, boolean>;
};

function centralDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

function centralWeekdaySlug(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
  })
    .format(date)
    .trim()
    .toLowerCase();
}

function dateKeyToUtcMs(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    return Date.UTC(1970, 0, 1);
  }

  return Date.UTC(year, month - 1, day);
}

function daysBetween(startDateKey: string, endDateKey: string) {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((dateKeyToUtcMs(endDateKey) - dateKeyToUtcMs(startDateKey)) / dayMs);
}

function doneKey(day: BibleReadingPlanDay) {
  return `week-${day.week}-${day.daySlug}`;
}

const BIBLE_COM_BOOK_CODES: Record<string, string> = {
  Genesis: "GEN",
  Exodus: "EXO",
  Leviticus: "LEV",
  Numbers: "NUM",
  Deuteronomy: "DEU",
  Joshua: "JOS",
  Judges: "JDG",
  Ruth: "RUT",
  "1 Samuel": "1SA",
  "2 Samuel": "2SA",
  "1 Kings": "1KI",
  "2 Kings": "2KI",
  "1 Chronicles": "1CH",
  "2 Chronicles": "2CH",
  Ezra: "EZR",
  Nehemiah: "NEH",
  Esther: "EST",
  Job: "JOB",
  Psalm: "PSA",
  Psalms: "PSA",
  Proverbs: "PRO",
  Ecclesiastes: "ECC",
  "Song of Solomon": "SNG",
  "Song of Songs": "SNG",
  Isaiah: "ISA",
  Jeremiah: "JER",
  Lamentations: "LAM",
  Ezekiel: "EZK",
  Daniel: "DAN",
  Hosea: "HOS",
  Joel: "JOL",
  Amos: "AMO",
  Obadiah: "OBA",
  Jonah: "JON",
  Micah: "MIC",
  Nahum: "NAM",
  Habakkuk: "HAB",
  Zephaniah: "ZEP",
  Haggai: "HAG",
  Zechariah: "ZEC",
  Malachi: "MAL",
  Matthew: "MAT",
  Mark: "MRK",
  Luke: "LUK",
  John: "JHN",
  Acts: "ACT",
  Romans: "ROM",
  "1 Corinthians": "1CO",
  "2 Corinthians": "2CO",
  Galatians: "GAL",
  Ephesians: "EPH",
  Philippians: "PHP",
  Colossians: "COL",
  "1 Thessalonians": "1TH",
  "2 Thessalonians": "2TH",
  "1 Timothy": "1TI",
  "2 Timothy": "2TI",
  Titus: "TIT",
  Philemon: "PHM",
  Hebrews: "HEB",
  James: "JAS",
  "1 Peter": "1PE",
  "2 Peter": "2PE",
  "1 John": "1JN",
  "2 John": "2JN",
  "3 John": "3JN",
  Jude: "JUD",
  Revelation: "REV",
  "Gen": "GEN",
  "Exod": "EXO",
  "Exo": "EXO",
  "Ex": "EXO",
  "Lev": "LEV",
  "Num": "NUM",
  "Deut": "DEU",
  "Dt": "DEU",
  "Josh": "JOS",
  "Jos": "JOS",
  "Judg": "JDG",
  "Jdg": "JDG",
  "1 Sam": "1SA",
  "2 Sam": "2SA",
  "1Sam": "1SA",
  "2Sam": "2SA",
  "1 Kgs": "1KI",
  "2 Kgs": "2KI",
  "1 Ki": "1KI",
  "2 Ki": "2KI",
  "1 Chr": "1CH",
  "2 Chr": "2CH",
  "Neh": "NEH",
  "Esth": "EST",
  "Ps": "PSA",
  "Psa": "PSA",
  "Prov": "PRO",
  "Pr": "PRO",
  "Eccl": "ECC",
  "Eccles": "ECC",
  "Song": "SNG",
  "Isa": "ISA",
  "Jer": "JER",
  "Lam": "LAM",
  "Ezek": "EZK",
  "Ezk": "EZK",
  "Dan": "DAN",
  "Hos": "HOS",
  "Obad": "OBA",
  "Mic": "MIC",
  "Nah": "NAM",
  "Hab": "HAB",
  "Zeph": "ZEP",
  "Hag": "HAG",
  "Zech": "ZEC",
  "Mal": "MAL",
  "Matt": "MAT",
  "Mt": "MAT",
  "Mk": "MRK",
  "Lk": "LUK",
  "Jn": "JHN",
  "Rom": "ROM",
  "1 Cor": "1CO",
  "2 Cor": "2CO",
  "1Cor": "1CO",
  "2Cor": "2CO",
  "Gal": "GAL",
  "Eph": "EPH",
  "Phil": "PHP",
  "Php": "PHP",
  "Col": "COL",
  "1 Thess": "1TH",
  "2 Thess": "2TH",
  "1 Thes": "1TH",
  "2 Thes": "2TH",
  "1Thess": "1TH",
  "2Thess": "2TH",
  "1 Tim": "1TI",
  "2 Tim": "2TI",
  "1Tim": "1TI",
  "2Tim": "2TI",
  "Philem": "PHM",
  "Heb": "HEB",
  "Jas": "JAS",
  "1 Pet": "1PE",
  "2 Pet": "2PE",
  "1Pet": "1PE",
  "2Pet": "2PE",
  "Rev": "REV",
};

const BIBLE_COM_BOOK_NAMES = Object.keys(BIBLE_COM_BOOK_CODES).sort(
  (left, right) => right.length - left.length,
);

const DAY_CATEGORY_BY_NAME: Record<string, string> = {
  sunday: "Epistles",
  sun: "Epistles",
  monday: "Law",
  mon: "Law",
  tuesday: "History",
  tue: "History",
  wednesday: "Psalms",
  wed: "Psalms",
  thursday: "Poetry",
  thu: "Poetry",
  friday: "Prophecy",
  fri: "Prophecy",
  saturday: "Gospels",
  sat: "Gospels",
};

function readingPlanCategory(day: BibleReadingPlanDay) {
  const labelKey = day.dayLabel.trim().toLowerCase();
  const slugKey = day.daySlug.trim().toLowerCase();

  return DAY_CATEGORY_BY_NAME[labelKey] ?? DAY_CATEGORY_BY_NAME[slugKey] ?? day.category;
}

function bibleSearchUrl(reading: string) {
  const normalizedReading = reading.trim().replace(/\./g, "").replace(/\s+/g, " ");
  const bookName = BIBLE_COM_BOOK_NAMES.find(
    (name) =>
      normalizedReading === name ||
      normalizedReading.startsWith(`${name} `),
  );

  if (!bookName) {
    return `https://www.bible.com/search/bible?q=${encodeURIComponent(reading)}`;
  }

  const code = BIBLE_COM_BOOK_CODES[bookName];
  const remaining = normalizedReading.slice(bookName.length).trim();
  const chapterMatch = remaining.match(/\d+/);
  const chapter = chapterMatch?.[0] ?? "1";

  return `https://www.bible.com/bible/206/${code}.${chapter}.WEBUS`;
}

function readStorage(): StoredProgress | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<StoredProgress>;

    if (!parsed.startDateKey || !parsed.done) {
      return null;
    }

    return {
      startDateKey: parsed.startDateKey,
      done: parsed.done,
    };
  } catch {
    return null;
  }
}

export default function BibleReadingPlanProgress({ weeks }: BibleReadingPlanProgressProps) {
  const [startDateKey, setStartDateKey] = useState(() => centralDateKey());
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  const todayDateKey = centralDateKey();
  const totalDays = weeks.length * 7;

  useEffect(() => {
    const saved = readStorage();

    if (saved) {
      setStartDateKey(saved.startDateKey);
      setDone(saved.done);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        startDateKey,
        done,
      }),
    );
  }, [done, loaded, startDateKey]);

  const flatDays = useMemo(() => weeks.flatMap((week) => week.days), [weeks]);
  const nextPlanDay = flatDays.find((day) => !done[doneKey(day)]) ?? null;
  const activeWeekNumber = nextPlanDay?.week ?? weeks.length;
  const activeWeek = weeks.find((week) => week.week === activeWeekNumber) ?? weeks[0] ?? null;
  const todaySlug = centralWeekdaySlug();
  const todayPlanDay =
    activeWeek?.days.find((day) => day.daySlug === todaySlug) ??
    activeWeek?.days[0] ??
    nextPlanDay;

  const completedCount = Object.values(done).filter(Boolean).length;
  const percentComplete = Math.round((completedCount / totalDays) * 100);
  const activeWeekCompletedCount =
    activeWeek?.days.filter((day) => done[doneKey(day)]).length ?? 0;
  const activeWeekPercent = activeWeek
    ? Math.round((activeWeekCompletedCount / activeWeek.days.length) * 100)
    : 0;

  function toggleDone(day: BibleReadingPlanDay) {
    const key = doneKey(day);

    setDone((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function resetToToday() {
    setStartDateKey(centralDateKey());
    setDone({});
  }

  function clearProgress() {
    setDone({});
  }

  if (!loaded) {
    return (
      <section className="mx-auto mt-10 max-w-4xl print:hidden">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
            Loading Tracker
          </p>
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
            Preparing your local Bible reading progress on this device.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto mt-10 max-w-5xl print:hidden">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 sm:p-7">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
                Saved on this device
              </p>

              <h2 className="mt-4 text-3xl font-black text-white">
                Week {activeWeekNumber}
              </h2>

              <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                This plan starts at Week 1 whenever you begin. Check readings as you finish them. Progress saves automatically in this browser on this device.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <p className="text-3xl font-black text-white">{completedCount}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
                    of {totalDays} done
                  </p>
                  <p className="mt-1 text-xs font-bold text-emerald-100">{percentComplete}%</p>
                </div>

                <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4 text-center">
                  <p className="text-3xl font-black text-white">{activeWeekCompletedCount}/7</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
                    this week
                  </p>
                  <p className="mt-1 text-xs font-bold text-emerald-100">{activeWeekPercent}%</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetToToday}
                  className="rounded-full border border-emerald-200/30 bg-emerald-300/15 px-4 py-3 text-sm font-black text-emerald-50 transition hover:bg-emerald-300/25"
                >
                  Start Week 1 Today
                </button>

                <button
                  type="button"
                  onClick={clearProgress}
                  className="rounded-full border border-red-200/20 bg-red-300/10 px-4 py-3 text-sm font-black text-red-100 transition hover:bg-red-300/15"
                >
                  Clear All Progress
                </button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-emerald-200/25 bg-emerald-300/[0.08] p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
                Today
              </p>

              {todayPlanDay ? (
                <>
                  <h2 className="mt-4 text-3xl font-black text-white">
                    Week {todayPlanDay.week} • {todayPlanDay.dayLabel}
                  </h2>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-100">
                    {readingPlanCategory(todayPlanDay)}
                  </p>
                  <p className="mt-5 text-3xl font-black text-white">
                    {todayPlanDay.reading}
                  </p>

                  {nextPlanDay && nextPlanDay !== todayPlanDay ? (
                    <p className="mt-3 text-xs font-semibold leading-6 text-slate-300">
                      Next unfinished: Week {nextPlanDay.week} • {nextPlanDay.dayLabel} • {nextPlanDay.reading}
                    </p>
                  ) : null}

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={bibleSearchUrl(todayPlanDay.reading)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-emerald-200/30 bg-emerald-300/20 px-5 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-emerald-50 transition hover:bg-emerald-300/30"
                    >
                      Open in Bible App
                    </a>

                    <button
                      type="button"
                      onClick={() => toggleDone(todayPlanDay)}
                      className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-100 transition hover:bg-white/15"
                    >
                      {done[doneKey(todayPlanDay)] ? "Mark Not Done" : "Mark Done"}
                    </button>
                  </div>
                </>
              ) : (
                <p className="mt-5 text-base font-semibold leading-7 text-slate-200">
                  Plan complete. Clear all progress to begin again.
                </p>
              )}
            </div>
          </div>

          <div className="mt-7">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
              52 Week Board
            </p>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-[repeat(13,minmax(0,1fr))]">
              {weeks.map((week) => {
                const weekDoneCount = week.days.filter((day) => done[doneKey(day)]).length;
                const isActive = week.week === activeWeekNumber;
                const isComplete = weekDoneCount === week.days.length;

                return (
                  <div
                    key={`board-week-${week.week}`}
                    className={`rounded-xl border px-2 py-2 text-center ${
                      isActive
                        ? "border-emerald-200/50 bg-emerald-300/20"
                        : isComplete
                          ? "border-emerald-200/25 bg-emerald-300/10"
                          : "border-white/10 bg-black/15"
                    }`}
                  >
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-slate-300">
                      Week
                    </p>
                    <p className="text-base font-black text-white">{week.week}</p>
                    <p className="text-[0.65rem] font-bold text-emerald-100">{weekDoneCount}/7</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {activeWeek ? (
        <section className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 print:mt-4 print:max-w-none print:border-black print:bg-white print:p-0 print:shadow-none sm:p-7">
          <div className="mb-6 text-center print:mb-3">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100 print:text-black">
              Current Week
            </p>
            <h2 className="mt-3 text-3xl font-black text-white print:text-black">
              Week {activeWeek.week}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-400 print:text-black">
              Start with today, then fill the rest of the week.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-7 print:grid-cols-7">
            {activeWeek.days.map((day) => {
              const key = doneKey(day);
              const isDone = Boolean(done[key]);
              const isToday = day.daySlug === todaySlug;
              const isNext = nextPlanDay ? doneKey(nextPlanDay) === key : false;

              return (
                <div
                  key={key}
                  className={`flex min-h-[12rem] flex-col rounded-2xl border p-3 print:min-h-0 print:border-black ${
                    isToday
                      ? "border-emerald-200/50 bg-emerald-300/18"
                      : isDone
                        ? "border-emerald-200/35 bg-emerald-300/12"
                        : isNext
                          ? "border-yellow-200/35 bg-yellow-300/10"
                          : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-100 print:text-black">
                    {readingPlanCategory(day)}
                  </p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 print:text-black">
                    {day.dayLabel}
                  </p>

                  {isToday ? (
                    <p className="mt-3 rounded-full border border-emerald-200/30 bg-emerald-300/15 px-3 py-1 text-center text-[0.65rem] font-black uppercase tracking-[0.14em] text-emerald-50 print:hidden">
                      Today
                    </p>
                  ) : null}

                  <p className="mt-3 text-xl font-black leading-snug text-white print:mt-0 print:text-black">
                    {day.reading}
                  </p>

                  <div className="mt-auto flex items-end justify-between gap-2 pt-4 print:hidden">
                    <button
                      type="button"
                      onClick={() => toggleDone(day)}
                      aria-pressed={isDone}
                      aria-label={`${isDone ? "Mark not done" : "Mark done"}: Week ${day.week} ${day.dayLabel} ${day.reading}`}
                      className="h-9 w-9 shrink-0 rounded-full border border-white/20 bg-white/10 text-sm font-black text-white transition hover:bg-white/15"
                    >
                      {isDone ? "✓" : ""}
                    </button>

                    <a
                      href={bibleSearchUrl(day.reading)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black uppercase tracking-[0.14em] text-emerald-100 underline underline-offset-4"
                    >
                      Open
                    </a>
                  </div>

                  <p className="mt-2 hidden text-xs font-black print:block">
                    {isDone ? "Done" : "Not done"}
                  </p>
                </div>
              );
            })}
          </div>

          <details className="mt-8 rounded-2xl border border-white/10 bg-black/10 p-4 print:hidden">
            <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.16em] text-emerald-100">
              Full 52-week checklist
            </summary>

            <div className="mt-5 grid grid-cols-1 gap-4">
              {weeks.map((week) => (
                <article
                  key={`full-week-${week.week}`}
                  className="rounded-[1.25rem] border border-white/10 bg-white/[0.025] p-3"
                >
                  <h3 className="text-sm font-black text-white">
                    Week {week.week}
                  </h3>

                  <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-7">
                    {week.days.map((day) => {
                      const key = doneKey(day);
                      const isDone = Boolean(done[key]);

                      return (
                        <div
                          key={`full-${key}`}
                          className={`rounded-xl border p-2 ${
                            isDone
                              ? "border-emerald-200/35 bg-emerald-300/15"
                              : "border-white/10 bg-black/10"
                          }`}
                        >
                          <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-emerald-100">
                            {day.dayLabel}
                          </p>
                          <p className="mt-1 text-sm font-black text-white">{day.reading}</p>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => toggleDone(day)}
                              aria-pressed={isDone}
                              className="h-7 w-7 rounded-full border border-white/20 bg-white/10 text-xs font-black text-white"
                            >
                              {isDone ? "✓" : ""}
                            </button>

                            <a
                              href={bibleSearchUrl(day.reading)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-emerald-100 underline underline-offset-4"
                            >
                              Open
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </details>
        </section>
      ) : null}
    </>
  );

}
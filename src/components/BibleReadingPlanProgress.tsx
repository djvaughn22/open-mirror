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

  const todayPlanIndex = daysBetween(startDateKey, todayDateKey);
  const todayPlanDay =
    todayPlanIndex >= 0 && todayPlanIndex < flatDays.length
      ? flatDays[todayPlanIndex]
      : null;

  const completedCount = Object.values(done).filter(Boolean).length;
  const percentComplete = Math.round((completedCount / totalDays) * 100);

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
      <section className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr] print:hidden">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
            Plan Start
          </p>

          <h2 className="mt-4 text-2xl font-extrabold text-slate-50">
            Start Week 1
          </h2>

          <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
            Pick any calendar day. That day becomes Week 1, Day 1. Your checks save on this device only.
          </p>

          <label className="mt-5 block text-xs font-black uppercase tracking-[0.18em] text-emerald-100">
            Start date
          </label>

          <input
            type="date"
            value={startDateKey}
            onChange={(event) => setStartDateKey(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base font-bold text-white outline-none transition focus:border-emerald-200/50"
          />

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={resetToToday}
              className="rounded-full border border-emerald-200/30 bg-emerald-300/15 px-4 py-3 text-sm font-black text-emerald-50 transition hover:bg-emerald-300/25"
            >
              Restart today
            </button>

            <button
              type="button"
              onClick={clearProgress}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-slate-100 transition hover:bg-white/10"
            >
              Clear checks
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-emerald-200/25 bg-emerald-300/[0.08] p-6 shadow-2xl shadow-emerald-950/20 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
                Today’s Reading
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
                </>
              ) : todayPlanIndex < 0 ? (
                <>
                  <h2 className="mt-4 text-3xl font-black text-white">
                    Not started yet
                  </h2>
                  <p className="mt-5 text-base font-semibold leading-7 text-slate-200">
                    Your selected start date is in the future.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-3xl font-black text-white">
                    Plan complete
                  </h2>
                  <p className="mt-5 text-base font-semibold leading-7 text-slate-200">
                    You have passed the 52-week plan window. Restart any day to begin again.
                  </p>
                </>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
              <p className="text-3xl font-black text-white">{completedCount}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
                of {totalDays} done
              </p>
              <p className="mt-1 text-xs font-bold text-emerald-100">{percentComplete}%</p>
            </div>
          </div>

          {todayPlanDay ? (
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
                {done[doneKey(todayPlanDay)] ? "Mark not done" : "Mark done"}
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 print:mt-4 print:max-w-none print:border-black print:bg-white print:p-0 print:shadow-none sm:p-7">
        <div className="mb-6 text-center print:mb-3">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100 print:text-black">
            PDF-Style Tracker
          </p>
          <h2 className="mt-3 text-3xl font-black text-white print:text-black">
            52 Week Checklist
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-400 print:text-black">
            Follow the plan rhythm, start any day, and keep going.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 print:gap-2">
          {weeks.map((week) => (
            <article
              key={week.week}
              className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4 print:break-inside-avoid print:border-black print:bg-white print:p-3"
            >
              <h3 className="text-lg font-black text-white print:text-black">
                Week {week.week}
              </h3>

              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-7 print:grid-cols-7">
                {week.days.map((day) => (
                  <div
                    key={`${week.week}-${day.daySlug}-header`}
                    className="hidden rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-3 text-center md:block print:block print:border-black print:bg-white"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-100 print:text-black">
                      {readingPlanCategory(day)}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 print:text-black">
                      {day.dayLabel}
                    </p>
                  </div>
                ))}

                {week.days.map((day) => {
                  const key = doneKey(day);
                  const isDone = Boolean(done[key]);

                  return (
                    <div
                      key={key}
                      className={`flex min-h-[10.5rem] flex-col rounded-2xl border p-3 print:min-h-0 print:border-black ${
                        isDone
                          ? "border-emerald-200/35 bg-emerald-300/15"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <div className="md:hidden print:hidden">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-100">
                          {readingPlanCategory(day)}
                        </p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          {day.dayLabel}
                        </p>
                      </div>

                      <p className="mt-3 text-base font-black leading-snug text-white print:mt-0 print:text-black">
                        {day.reading}
                      </p>

                      <div className="mt-auto flex items-end justify-between gap-2 pt-4 print:hidden">
                        <button
                          type="button"
                          onClick={() => toggleDone(day)}
                          aria-pressed={isDone}
                          aria-label={`${isDone ? "Mark not done" : "Mark done"}: Week ${day.week} ${day.dayLabel} ${day.reading}`}
                          className="h-8 w-8 shrink-0 rounded-full border border-white/20 bg-white/10 text-sm font-black text-white transition hover:bg-white/15"
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
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

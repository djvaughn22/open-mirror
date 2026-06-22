"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BIBLE_READING_PLAN_PDF_HREF,
  BIBLE_READING_PLAN_SOURCE,
  BIBLE_READING_PLAN_SOURCE_NOTE,
  type BibleReadingPlanDay,
  type BibleReadingPlanWeek,
} from "../lib/bibleReadingPlan";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type BibleReadingPlanTrackerProps = {
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

function bibleSearchUrl(reading: string) {
  return `https://www.bible.com/search/bible?q=${encodeURIComponent(reading)}`;
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

export default function BibleReadingPlanTracker({ weeks }: BibleReadingPlanTrackerProps) {
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-black">
      <section className="mx-auto max-w-6xl px-6 py-8 print:max-w-none print:px-0 print:py-0">
        <SiteHeader className="mb-10 sm:mb-12 print:hidden" />

        <div className="text-center">
          <div
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-base font-black uppercase tracking-[0.24em] text-white sm:text-lg"
            aria-hidden="true"
          >
            <span className="text-3xl">✝️</span>
            <span>Cross</span>
            <span className="text-3xl">❤️</span>
            <span>Heart</span>
            <span className="text-3xl">🙏</span>
            <span>Pray</span>
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white print:text-black sm:text-7xl">
            Bible Reading Plan
          </h1>

          <p className="mt-3 text-xl font-black text-emerald-100 print:text-black sm:text-3xl">
            Start Week 1 any day.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-semibold leading-7 text-slate-300 print:text-black sm:text-base">
            A simple 52-week Bible reading tracker with local progress, PDF download, and Bible App links.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-xs font-semibold leading-6 text-slate-400 print:text-black">
            Source: {BIBLE_READING_PLAN_SOURCE}. {BIBLE_READING_PLAN_SOURCE_NOTE}
          </p>

          <div className="mt-7 flex flex-col items-center gap-4 print:hidden">
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={BIBLE_READING_PLAN_PDF_HREF}
                download
                className="w-full max-w-sm rounded-full border border-emerald-200/30 bg-emerald-300/15 px-6 py-3 text-center text-sm font-black uppercase tracking-[0.18em] text-emerald-50 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-300/22 sm:w-auto"
              >
                Download PDF
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full max-w-sm rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-100 transition hover:bg-white/15 sm:w-auto"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>

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
                      {todayPlanDay.category}
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
                  {week.days.map((day) => {
                    const key = doneKey(day);
                    const isDone = Boolean(done[key]);

                    return (
                      <div
                        key={key}
                        className={`rounded-2xl border p-3 print:border-black ${
                          isDone
                            ? "border-emerald-200/35 bg-emerald-300/15"
                            : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-100 print:text-black">
                              {day.dayLabel}
                            </p>
                            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 print:text-black">
                              {day.category}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleDone(day)}
                            aria-pressed={isDone}
                            className="h-8 w-8 shrink-0 rounded-full border border-white/15 bg-white/10 text-sm font-black text-white transition hover:bg-white/15 print:hidden"
                          >
                            {isDone ? "✓" : ""}
                          </button>
                        </div>

                        <p className="mt-3 text-base font-black text-white print:text-black">
                          {day.reading}
                        </p>

                        <a
                          href={bibleSearchUrl(day.reading)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-xs font-black uppercase tracking-[0.14em] text-emerald-100 underline underline-offset-4 print:hidden"
                        >
                          Open
                        </a>

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

        <SiteFooter />
      </section>
    </main>
  );
}

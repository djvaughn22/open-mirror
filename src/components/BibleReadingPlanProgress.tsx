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
  const [saveMessage, setSaveMessage] = useState("");
  const [targetDayKey, setTargetDayKey] = useState("");

  const todayDateKey = centralDateKey();
  const totalDays = weeks.length * 7;

  useEffect(() => {
    const saved = readStorage();

    if (saved) {
      setStartDateKey(saved.startDateKey);
      setDone(saved.done);
    }

    const params = new URLSearchParams(window.location.search);
    const targetWeek = params.get("week");
    const targetDay = params.get("day");

    if (targetWeek && targetDay) {
      const key = `week-${targetWeek}-${targetDay}`;
      setTargetDayKey(key);
      window.setTimeout(() => {
        document.getElementById(key)?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }, 300);
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
  const completedCount = Object.values(done).filter(Boolean).length;
  const percentComplete = Math.round((completedCount / totalDays) * 100);

  function toggleDone(day: BibleReadingPlanDay) {
    const key = doneKey(day);

    setDone((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function saveProgressNow() {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        startDateKey,
        done,
      }),
    );

    setSaveMessage("Saved on this device.");
  }

  function resetToToday() {
    const confirmed = window.confirm(
      "Start over and clear all Bible Reading Plan progress saved on this device?",
    );

    if (!confirmed) {
      return;
    }

    const todayKey = centralDateKey();
    setStartDateKey(todayKey);
    setDone({});
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        startDateKey: todayKey,
        done: {},
      }),
    );
    setSaveMessage("Started over on this device.");
  }

  function clearProgress() {
    const confirmed = window.confirm(
      "Clear all Bible Reading Plan progress saved on this device?",
    );

    if (!confirmed) {
      return;
    }

    setDone({});
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        startDateKey,
        done: {},
      }),
    );
    setSaveMessage("Progress cleared on this device.");
  }

  function progressBackupPayload() {
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      startDateKey,
      done,
    };
  }

  function encodeProgressBackup() {
    const json = JSON.stringify(progressBackupPayload());
    const bytes = new TextEncoder().encode(json);
    let binary = "";

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return "crossheartpray-reading-plan-v1:" + window.btoa(binary);
  }

  function decodeProgressBackup(code: string): StoredProgress | null {
    try {
      const cleaned = code.trim().replace(/^crossheartpray-reading-plan-v1:/i, "");
      const binary = window.atob(cleaned);
      const bytes = Uint8Array.from(binary, function(character) {
        return character.charCodeAt(0);
      });
      const json = new TextDecoder().decode(bytes);
      const parsed = JSON.parse(json) as Partial<StoredProgress>;

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

  function emailProgressBackup() {
    saveProgressNow();

    const subject = "Cross Heart Pray Bible Reading Plan Backup";
    const body = [
      "Cross Heart Pray Bible Reading Plan Backup",
      "",
      "Saved: " + new Date().toLocaleString(),
      "Progress: " + completedCount + "/" + totalDays,
      "",
      "Restore code:",
      encodeProgressBackup(),
      "",
      "To restore later: open the Bible Reading Plan, tap Restore Backup, and paste the restore code.",
    ].join("\n");

    window.location.href =
      "mailto:?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);

    setSaveMessage("Email backup opened. Send it to yourself.");
  }

  async function copyProgressBackup() {
    saveProgressNow();

    try {
      await navigator.clipboard.writeText(encodeProgressBackup());
      setSaveMessage("Backup code copied.");
    } catch {
      setSaveMessage("Copy failed. Use Email Backup.");
    }
  }

  function restoreProgressBackup() {
    const code = window.prompt("Paste your Cross Heart Pray backup code:");

    if (!code) {
      return;
    }

    const restored = decodeProgressBackup(code);

    if (!restored) {
      setSaveMessage("Backup code was not valid.");
      return;
    }

    setStartDateKey(restored.startDateKey);
    setDone(restored.done);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
    setSaveMessage("Backup restored on this device.");
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

  const laneColumns = weeks[0]?.days ?? [];

  return (
    <>
      <section className="mx-auto mt-8 max-w-6xl rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 shadow-xl shadow-black/15 print:hidden sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">
              Next Reading
            </p>

            {nextPlanDay ? (
              <>
                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Week {nextPlanDay.week} • {nextPlanDay.dayLabel}
                </h2>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-100">
                  {readingPlanCategory(nextPlanDay)}
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {nextPlanDay.reading}
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Plan complete
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
                  Restart any day to begin again.
                </p>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-center">
            <p className="text-3xl font-black text-white">{completedCount}</p>
            <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-slate-300">
              of {totalDays} done
            </p>
            <p className="mt-1 text-xs font-bold text-emerald-100">{percentComplete}%</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
          {nextPlanDay ? (
            <>
              <a
                href={bibleSearchUrl(nextPlanDay.reading)}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-emerald-200/30 bg-emerald-300/20 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-50 transition hover:bg-emerald-300/30"
              >
                Open Bible
              </a>

              <button
                type="button"
                onClick={() => toggleDone(nextPlanDay)}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
              >
                {done[doneKey(nextPlanDay)] ? "Unread" : "Mark Read"}
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={saveProgressNow}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
          >
            Save
          </button>

          <button
            type="button"
            onClick={emailProgressBackup}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
          >
            Email Backup
          </button>

          <button
            type="button"
            onClick={copyProgressBackup}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
          >
            Copy Backup
          </button>

          <button
            type="button"
            onClick={restoreProgressBackup}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
          >
            Restore
          </button>

          <button
            type="button"
            onClick={resetToToday}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
          >
            Start Today
          </button>

          <button
            type="button"
            onClick={clearProgress}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
          >
            Clear
          </button>
        </div>

        {saveMessage ? (
          <p className="mt-4 text-center text-xs font-bold text-emerald-100 sm:text-left">
            {saveMessage}
          </p>
        ) : null}
      </section>

      <section className="mx-auto mt-8 max-w-7xl print:mt-6">
        <div className="mb-4 flex flex-col gap-2 text-center print:text-left sm:text-left">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100 print:text-black">
            7 Bible lanes across • 52 weeks down
          </p>
          <h2 className="text-2xl font-black text-white print:text-black sm:text-4xl">
            Follow the columns. Keep the weeks.
          </h2>
        </div>

        <div className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20 print:overflow-visible print:border-black print:bg-white print:shadow-none">
          <table className="min-w-[1120px] w-full border-separate border-spacing-0 text-left print:min-w-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 w-20 border-b border-r border-white/10 bg-slate-950/95 px-3 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.16em] text-slate-300 print:static print:border-black print:bg-white print:text-black">
                  Week
                </th>

                {laneColumns.map((lane) => (
                  <th
                    key={lane.daySlug}
                    className="w-[14.28%] border-b border-white/10 bg-slate-900/70 px-3 py-4 align-top print:border-black print:bg-white"
                  >
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-emerald-100 print:text-black">
                      {lane.dayLabel}
                    </p>
                    <p className="mt-1 text-base font-black text-white print:text-black">
                      {readingPlanCategory(lane)}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {weeks.map((week) => (
                <tr key={week.week} className="align-top">
                  <th className="sticky left-0 z-10 border-b border-r border-white/10 bg-slate-950/95 px-3 py-4 text-center print:static print:border-black print:bg-white">
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-slate-400 print:text-black">
                      Week
                    </p>
                    <p className="text-xl font-black text-white print:text-black">
                      {week.week}
                    </p>
                  </th>

                  {laneColumns.map((lane) => {
                    const day =
                      week.days.find((candidate) => candidate.daySlug === lane.daySlug) ??
                      week.days.find((candidate) => candidate.dayLabel === lane.dayLabel);

                    if (!day) {
                      return (
                        <td
                          key={`${week.week}-${lane.daySlug}`}
                          className="border-b border-white/10 px-3 py-4 print:border-black"
                        />
                      );
                    }

                    const key = doneKey(day);
                    const isDone = Boolean(done[key]);
                    const isTarget = key === targetDayKey;

                    return (
                      <td
                        key={key}
                        id={key}
                        className={`border-b border-white/10 px-3 py-4 print:border-black ${
                          isTarget ? "bg-emerald-300/10 ring-2 ring-emerald-200/40" : ""
                        }`}
                      >
                        <div className={`flex h-full min-h-[8.5rem] flex-col rounded-2xl border px-3 py-3 ${
                          isDone
                            ? "border-emerald-200/35 bg-emerald-300/10"
                            : "border-white/10 bg-black/20"
                        } print:border-black print:bg-white`}>
                          <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-emerald-100 print:text-black">
                            {day.dayLabel}
                          </p>

                          <p className="mt-1 text-sm font-black leading-5 text-white print:text-black">
                            {day.reading}
                          </p>

                          <p className="mt-1 text-[0.68rem] font-bold leading-5 text-slate-300 print:text-black">
                            {readingPlanCategory(day)}
                          </p>

                          <div className="mt-auto flex flex-col gap-2 pt-3 print:hidden">
                            <a
                              href={bibleSearchUrl(day.reading)}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-center text-[0.62rem] font-black uppercase tracking-[0.12em] text-white transition hover:bg-white/15"
                            >
                              Open
                            </a>

                            <button
                              type="button"
                              onClick={() => toggleDone(day)}
                              className={`rounded-full border px-3 py-1.5 text-[0.62rem] font-black uppercase tracking-[0.12em] transition ${
                                isDone
                                  ? "border-emerald-200/35 bg-emerald-300/20 text-emerald-50 hover:bg-emerald-300/30"
                                  : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                              }`}
                            >
                              {isDone ? "Read" : "Mark Read"}
                            </button>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

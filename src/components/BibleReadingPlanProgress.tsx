"use client";

import { useEffect, useMemo, useState } from "react";
import type { BibleReadingPlanWeek } from "../lib/bibleReadingPlan";

type BibleReadingPlanProgressProps = {
  weeks: BibleReadingPlanWeek[];
};

type AnyRecord = Record<string, unknown>;

const STORAGE_KEY = "crossheartpray:bible-reading-plan:v1";

const LANES = [
  { key: "sunday", day: "Sunday", short: "Sun", lane: "Epistles" },
  { key: "monday", day: "Monday", short: "Mon", lane: "Law" },
  { key: "tuesday", day: "Tuesday", short: "Tue", lane: "History" },
  { key: "wednesday", day: "Wednesday", short: "Wed", lane: "Psalms" },
  { key: "thursday", day: "Thursday", short: "Thu", lane: "Poetry" },
  { key: "friday", day: "Friday", short: "Fri", lane: "Prophecy" },
  { key: "saturday", day: "Saturday", short: "Sat", lane: "Gospels" },
];

const BOOK_CODES: Record<string, string> = {
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
  Psalms: "PSA",
  Psalm: "PSA",
  Proverbs: "PRO",
  Ecclesiastes: "ECC",
  "Song of Solomon": "SNG",
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
};

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as AnyRecord)
    : {};
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function weekNumber(week: unknown, fallback: number) {
  const record = asRecord(week);
  return (
    numberValue(record.week) ??
    numberValue(record.weekNumber) ??
    numberValue(record.number) ??
    fallback
  );
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function readingsArray(week: unknown): unknown[] {
  const record = asRecord(week);
  for (const candidate of [record.days, record.readings, record.items, record.entries]) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function readingForLane(week: unknown, laneIndex: number) {
  const record = asRecord(week);
  const lane = LANES[laneIndex];

  const direct =
    record[lane.key] ??
    record[lane.day] ??
    record[lane.day.toLowerCase()] ??
    record[lane.day.toUpperCase()] ??
    record[lane.lane] ??
    record[lane.lane.toLowerCase()];

  if (direct) return direct;

  const array = readingsArray(week);
  return (
    array.find((item) => {
      const itemRecord = asRecord(item);
      const haystack = [
        itemRecord.day,
        itemRecord.dayLabel,
        itemRecord.weekday,
        itemRecord.lane,
        itemRecord.category,
        itemRecord.section,
      ]
        .map(cleanText)
        .join(" ");

      return (
        normalizeKey(haystack).includes(lane.key) ||
        normalizeKey(haystack).includes(normalizeKey(lane.lane))
      );
    }) ??
    array[laneIndex] ??
    null
  );
}

function labelForReading(reading: unknown) {
  if (typeof reading === "string") return reading.trim();

  const record = asRecord(reading);
  const label =
    cleanText(record.label) ||
    cleanText(record.reference) ||
    cleanText(record.reading) ||
    cleanText(record.passage) ||
    cleanText(record.chapters) ||
    cleanText(record.title);

  if (label) return label;

  const book = cleanText(record.book) || cleanText(record.bookName);
  const chapters =
    cleanText(record.chapterRange) ||
    cleanText(record.chapters) ||
    cleanText(record.chapter) ||
    cleanText(record.range);

  return [book, chapters].filter(Boolean).join(" ").trim() || "Reading";
}

function laneForReading(reading: unknown, laneIndex: number) {
  const record = asRecord(reading);
  return (
    cleanText(record.lane) ||
    cleanText(record.category) ||
    cleanText(record.section) ||
    LANES[laneIndex].lane
  );
}

function idForReading(reading: unknown, weekNo: number, laneIndex: number) {
  const record = asRecord(reading);
  return (
    cleanText(record.id) ||
    cleanText(record.key) ||
    cleanText(record.storageKey) ||
    `week-${weekNo}-${LANES[laneIndex].key}`
  );
}

function firstChapterFromLabel(label: string) {
  const match = label.match(/\b(\d+)(?:[-–]\d+)?\b/);
  return match ? match[1] : "1";
}

function bookCodeFromLabel(label: string, reading: unknown) {
  const record = asRecord(reading);
  const direct =
    cleanText(record.bookCode) ||
    cleanText(record.bibleCode) ||
    cleanText(record.code);

  if (direct) return direct.toUpperCase();

  const book =
    cleanText(record.book) ||
    cleanText(record.bookName) ||
    Object.keys(BOOK_CODES)
      .sort((a, b) => b.length - a.length)
      .find((name) => label.startsWith(`${name} `) || label === name) ||
    "";

  return BOOK_CODES[book] || "";
}

function bibleUrl(reading: unknown) {
  const record = asRecord(reading);
  const direct =
    cleanText(record.href) ||
    cleanText(record.url) ||
    cleanText(record.bibleUrl) ||
    cleanText(record.youVersionUrl);

  if (direct) return direct;

  const label = labelForReading(reading);
  const code = bookCodeFromLabel(label, reading);
  const chapter = firstChapterFromLabel(label);

  if (!code) return "https://www.bible.com/bible/206";
  return `https://www.bible.com/bible/206/${code}.${chapter}.WEBUS`;
}

function flattenPlan(weeks: BibleReadingPlanWeek[]) {
  return weeks.flatMap((week, weekIndex) => {
    const weekNo = weekNumber(week, weekIndex + 1);

    return LANES.map((lane, laneIndex) => {
      const reading = readingForLane(week, laneIndex);
      const label = labelForReading(reading);
      const id = idForReading(reading, weekNo, laneIndex);

      return {
        id,
        weekNo,
        laneIndex,
        day: lane.day,
        short: lane.short,
        lane: laneForReading(reading, laneIndex),
        label,
        href: bibleUrl(reading),
      };
    });
  });
}

function loadProgress() {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    const result: Record<string, boolean> = {};

    if (Array.isArray(parsed)) {
      parsed.forEach((id) => {
        if (typeof id === "string") result[id] = true;
      });
      return result;
    }

    if (parsed && typeof parsed === "object") {
      Object.entries(parsed as Record<string, unknown>).forEach(([key, value]) => {
        if (value === true || value === "true") result[key] = true;
        if (value && typeof value === "object") {
          const record = value as Record<string, unknown>;
          if (record.read === true || record.done === true || record.completed === true) {
            result[key] = true;
          }
        }
      });
    }

    return result;
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event("crossheartpray:bible-reading-plan-progress"));
}

export default function BibleReadingPlanProgress({ weeks }: BibleReadingPlanProgressProps) {
  const readings = useMemo(() => flattenPlan(weeks), [weeks]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const doneCount = readings.filter((reading) => progress[reading.id]).length;
  const totalCount = readings.length;
  const percent = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const nextReading = readings.find((reading) => !progress[reading.id]) ?? readings[0];

  function toggleReading(id: string) {
    setProgress((current) => {
      const next = { ...current, [id]: !current[id] };
      if (!next[id]) delete next[id];
      saveProgress(next);
      return next;
    });
  }

  function exportPlan(includeChecks: boolean) {
    if (typeof window === "undefined") return;

    const title = includeChecks
      ? "CrossHeartPray Bible Reading Plan - With Checks"
      : "CrossHeartPray Bible Reading Plan - Clean";

    const header = ["Week", ...LANES.map((lane) => `${lane.short} ${lane.lane}`)].join("\t");
    const rows = weeks.map((week, weekIndex) => {
      const weekNo = weekNumber(week, weekIndex + 1);
      const cells = LANES.map((lane, laneIndex) => {
        const item = readingForLane(week, laneIndex);
        const label = labelForReading(item);
        const id = idForReading(item, weekNo, laneIndex);
        const mark = includeChecks ? (progress[id] ? "☑ " : "☐ ") : "";
        return `${mark}${label}`;
      });

      return [String(weekNo), ...cells].join("\t");
    });

    const progressLine = includeChecks
      ? `${doneCount} of ${totalCount} read (${percent}%)`
      : "";

    const content = [title, progressLine, "", header, ...rows]
      .filter((line) => line !== "")
      .join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = includeChecks
      ? "crossheartpray-bible-reading-plan-with-checks.txt"
      : "crossheartpray-bible-reading-plan-clean.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  }

  async function copyPlanLink() {
    if (typeof window === "undefined") return;

    const url = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="chp-reading-sheet overflow-hidden rounded-2xl border border-white/10 bg-slate-950/35">
      {nextReading ? (
        <div className="chp-next-reading-row border-b border-white/10 bg-white/[0.04] px-3 pb-4 pt-3 sm:px-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-emerald-100">
              Next Reading
            </p>

            <p className="text-sm font-black text-white">
              Week {nextReading.weekNo} • {nextReading.day}
            </p>

            <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-emerald-100">
              {nextReading.lane}
            </p>

            <a
              href={nextReading.href}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 max-w-full truncate text-lg font-black leading-tight text-emerald-50 underline decoration-emerald-300/50 decoration-2 underline-offset-4 transition hover:text-white hover:decoration-emerald-100 sm:text-xl"
              title={nextReading.label}
            >
              {nextReading.label}
            </a>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-[0.66rem] font-black uppercase tracking-[0.12em] text-slate-100 transition hover:bg-white/15">
                <input
                  type="checkbox"
                  checked={Boolean(progress[nextReading.id])}
                  onChange={() => toggleReading(nextReading.id)}
                  className="h-3.5 w-3.5 accent-emerald-300"
                />
                Read
              </label>

              <button
                type="button"
                onClick={() => exportPlan(false)}
                className="inline-flex h-8 items-center rounded-full border border-white/15 bg-white/10 px-3 text-[0.62rem] font-black uppercase tracking-[0.12em] text-slate-100 transition hover:bg-white/15"
              >
                Export clean
              </button>

              <button
                type="button"
                onClick={() => exportPlan(true)}
                className="inline-flex h-8 items-center rounded-full border border-emerald-200/25 bg-emerald-300/12 px-3 text-[0.62rem] font-black uppercase tracking-[0.12em] text-emerald-50 transition hover:bg-emerald-300/20"
              >
                Export with checks
              </button>

              <button
                type="button"
                onClick={copyPlanLink}
                className="inline-flex h-8 items-center rounded-full border border-white/15 bg-white/10 px-3 text-[0.62rem] font-black uppercase tracking-[0.12em] text-slate-100 transition hover:bg-white/15"
              >
                {copied ? "Copied" : "Copy link"}
              </button>

              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-slate-300">
                {doneCount}/{totalCount} • {percent}%
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="chp-reading-table overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-slate-900/70">
              <th className="w-12 border-r border-white/10 px-2 py-1.5 text-[0.58rem] font-black uppercase tracking-[0.14em] text-slate-300">
                Week
              </th>
              {LANES.map((lane) => (
                <th
                  key={lane.key}
                  className="border-r border-white/10 px-2 py-1.5 text-[0.58rem] font-black uppercase tracking-[0.12em] text-slate-200 last:border-r-0"
                >
                  <span className="text-emerald-100">{lane.short}</span>{" "}
                  <span>{lane.lane}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {weeks.map((week, weekIndex) => {
              const weekNo = weekNumber(week, weekIndex + 1);

              return (
                <tr
                  key={weekNo}
                  className="border-b border-white/[0.065] last:border-b-0"
                >
                  <th className="border-r border-white/10 bg-slate-950/45 px-2 py-1 text-center text-xs font-black leading-none text-white">
                    {weekNo}
                  </th>

                  {LANES.map((lane, laneIndex) => {
                    const reading = readingForLane(week, laneIndex);
                    const label = labelForReading(reading);
                    const id = idForReading(reading, weekNo, laneIndex);
                    const href = bibleUrl(reading);
                    const isRead = Boolean(progress[id]);

                    return (
                      <td
                        key={lane.key}
                        className={`border-r border-white/[0.07] px-2 py-1 last:border-r-0 ${
                          isRead ? "bg-emerald-300/[0.075]" : "bg-white/[0.015]"
                        }`}
                      >
                        <div className="flex min-h-6 items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={isRead}
                            onChange={() => toggleReading(id)}
                            aria-label={`${isRead ? "Mark unread" : "Mark read"} ${label}`}
                            className="h-3.5 w-3.5 shrink-0 accent-emerald-300"
                          />

                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-w-0 truncate text-[0.82rem] font-black leading-tight text-emerald-50 underline decoration-emerald-300/45 decoration-2 underline-offset-3 transition hover:text-white hover:decoration-emerald-100"
                            title={label}
                          >
                            {label}
                          </a>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/10 bg-white/[0.025] px-3 py-2 text-[0.64rem] font-bold leading-5 text-slate-400">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {LANES.map((lane) => (
            <span key={lane.key}>
              <span className="text-emerald-100">{lane.short}</span> {lane.lane}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

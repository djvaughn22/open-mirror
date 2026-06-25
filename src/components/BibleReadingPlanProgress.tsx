"use client";

import { useEffect, useMemo, useState } from "react";
import type { BibleReadingPlanWeek } from "../lib/bibleReadingPlan";

type BibleReadingPlanProgressProps = {
  weeks: BibleReadingPlanWeek[];
};

type AnyRecord = Record<string, unknown>;

const STORAGE_KEY = "crossheartpray:bible-reading-plan:v1";

const LANES = [
  {
    key: "sunday",
    day: "Sunday",
    short: "Sun",
    lane: "Epistles",
    summary: "Romans through Jude.",
  },
  {
    key: "monday",
    day: "Monday",
    short: "Mon",
    lane: "Law",
    summary: "Genesis through Deuteronomy.",
  },
  {
    key: "tuesday",
    day: "Tuesday",
    short: "Tue",
    lane: "History",
    summary: "Joshua through Esther.",
  },
  {
    key: "wednesday",
    day: "Wednesday",
    short: "Wed",
    lane: "Psalms",
    summary: "Psalms.",
  },
  {
    key: "thursday",
    day: "Thursday",
    short: "Thu",
    lane: "Poetry",
    summary: "Job through Song of Solomon.",
  },
  {
    key: "friday",
    day: "Friday",
    short: "Fri",
    lane: "Prophecy",
    summary: "Isaiah through Malachi.",
  },
  {
    key: "saturday",
    day: "Saturday",
    short: "Sat",
    lane: "Gospels",
    summary: "Matthew, Mark, Luke, John.",
  },
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
  const [highlightedReadingId, setHighlightedReadingId] = useState("");

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    let clearHighlightTimer: number | undefined;

    function targetIdFromUrl() {
      const hashTarget = window.location.hash.replace(/^#/, "").trim();
      if (hashTarget) return hashTarget;

      const params = new URLSearchParams(window.location.search);
      const week = params.get("week")?.trim();
      const day = params.get("day")?.trim();

      return week && day ? `week-${week}-${day}` : "";
    }

    function highlightTargetCell() {
      const targetId = targetIdFromUrl();
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      if (clearHighlightTimer) {
        window.clearTimeout(clearHighlightTimer);
      }

      setHighlightedReadingId(targetId);

      window.setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }, 80);

      clearHighlightTimer = window.setTimeout(() => {
        setHighlightedReadingId((current) => (current === targetId ? "" : current));
      }, 5200);
    }

    highlightTargetCell();
    window.addEventListener("hashchange", highlightTargetCell);

    return () => {
      if (clearHighlightTimer) {
        window.clearTimeout(clearHighlightTimer);
      }

      window.removeEventListener("hashchange", highlightTargetCell);
    };
  }, []);

  const doneCount = readings.filter((reading) => progress[reading.id]).length;
  const totalCount = readings.length;
  const daysLeft = Math.max(totalCount - doneCount, 0);
  const weeksLeft = weeks.filter((week, weekIndex) => {
    const weekNo = weekNumber(week, weekIndex + 1);

    return LANES.some((lane, laneIndex) => {
      const reading = readingForLane(week, laneIndex);
      const id = idForReading(reading, weekNo, laneIndex);
      return !progress[id];
    });
  }).length;
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
    const escapeHtml = (value: unknown) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const asRecord = (value: unknown): Record<string, unknown> =>
      value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};

    const pickText = (record: Record<string, unknown>, keys: string[]) => {
      for (const key of keys) {
        const value = record[key];

        if (typeof value === "string" && value.trim()) {
          return value.trim();
        }

        if (typeof value === "number") {
          return String(value);
        }
      }

      return "";
    };

    const compactText = (value: unknown): string => {
      if (typeof value === "string" || typeof value === "number") {
        return String(value).trim();
      }

      if (Array.isArray(value)) {
        return value
          .map(compactText)
          .filter(Boolean)
          .join("; ");
      }

      const record = asRecord(value);

      if (!Object.keys(record).length) {
        return "";
      }

      const direct = pickText(record, [
        "reference",
        "references",
        "reading",
        "readings",
        "passage",
        "passages",
        "books",
        "book",
        "label",
        "title",
        "text",
      ]);

      if (direct) {
        return direct;
      }

      return Object.entries(record)
        .filter(([key]) => !["id", "key", "day", "name", "title", "label"].includes(key))
        .map(([, item]) => compactText(item))
        .filter(Boolean)
        .join("; ");
    };

    const dayLabels = [
      "Sunday — Epistles",
      "Monday — Law",
      "Tuesday — History",
      "Wednesday — Psalms",
      "Thursday — Poetry",
      "Friday — Prophecy",
      "Saturday — Gospels",
    ];

    const weekRows = (Array.isArray(weeks) ? (weeks as unknown[]) : []).map(
      (week, weekIndex) => {
        const record = asRecord(week);
        const weekLabel =
          pickText(record, ["weekLabel", "label", "title"]) ||
          `Week ${pickText(record, ["week", "number"]) || weekIndex + 1}`;

        const arraySource =
          (Array.isArray(record.days) && record.days) ||
          (Array.isArray(record.lanes) && record.lanes) ||
          (Array.isArray(record.readings) && record.readings) ||
          null;

        const keyedSource = [
          record.sunday,
          record.monday,
          record.tuesday,
          record.wednesday,
          record.thursday,
          record.friday,
          record.saturday,
        ];

        const cells = dayLabels.map((dayLabel, dayIndex) => {
          const source = arraySource?.[dayIndex] ?? keyedSource[dayIndex] ?? "";
          const sourceRecord = asRecord(source);
          const label =
            pickText(sourceRecord, ["dayLabel", "label", "title", "day"]) || dayLabel;
          const text =
            compactText(sourceRecord.readings) ||
            compactText(sourceRecord.reading) ||
            compactText(sourceRecord.passages) ||
            compactText(sourceRecord.passage) ||
            compactText(sourceRecord.books) ||
            compactText(source);

          return {
            label,
            text,
          };
        });

        return {
          weekLabel,
          cells,
        };
      },
    );

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>CrossHeartPray Bible Reading Plan — One Page</title>
  <style>
    @page { size: letter landscape; margin: 0.22in; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; color: #000; font-family: Arial, Helvetica, sans-serif; }
    body { width: 10.56in; height: 8.06in; overflow: hidden; }
    .page { width: 10.56in; height: 8.06in; overflow: hidden; }
    .top { display: flex; align-items: end; justify-content: space-between; gap: 12px; margin-bottom: 5px; border-bottom: 1.5px solid #000; padding-bottom: 4px; }
    h1 { margin: 0; font-size: 18px; line-height: 1; letter-spacing: -0.02em; }
    .note { margin: 0; font-size: 7px; line-height: 1.15; text-align: right; max-width: 4.5in; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { border: 0.75px solid #000; vertical-align: top; overflow: hidden; }
    th { height: 18px; padding: 2px; font-size: 6.5px; line-height: 1; text-transform: uppercase; letter-spacing: 0.03em; }
    th.week { width: 0.46in; }
    td.week { width: 0.46in; padding: 2px; font-size: 6px; line-height: 1; font-weight: 900; text-align: center; }
    td.day { height: 0.135in; padding: 1.5px 2px; font-size: 5.45px; line-height: 1.05; }
    .cell-label { display: block; font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cell-text { display: block; margin-top: 1px; max-height: 15px; overflow: hidden; }
    .box { display: inline-block; width: 6px; height: 6px; border: 0.75px solid #000; margin-right: 2px; vertical-align: -1px; }
    .footer { margin-top: 4px; display: flex; justify-content: space-between; font-size: 6.5px; line-height: 1; }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="top">
      <h1>CrossHeartPray Bible Reading Plan</h1>
      <p class="note">One-page export. Seven weekly lanes connected to Bible Bingo, progress tracking, chapters, and source-backed Deep Dive.</p>
    </div>
    <table>
      <thead>
        <tr>
          <th class="week">Week</th>
          ${dayLabels.map((label) => `<th>${escapeHtml(label)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${weekRows
          .map(
            (row, index) => `<tr>
              <td class="week">${index + 1}</td>
              ${row.cells
                .map(
                  (cell) => `<td class="day">
                    <span class="cell-label">${includeChecks ? '<span class="box"></span>' : ""}${escapeHtml(cell.label)}</span>
                    <span class="cell-text">${escapeHtml(cell.text)}</span>
                  </td>`,
                )
                .join("")}
            </tr>`,
          )
          .join("")}
      </tbody>
    </table>
    <div class="footer">
      <span>✝️ Cross ❤️ Heart 🙏 Pray</span>
      <span>Print settings: Letter · Landscape · Scale 100% · Margins default/minimum</span>
    </div>
  </main>
  <script>
    window.addEventListener("load", () => {
      setTimeout(() => window.print(), 150);
    });
  </script>
</body>
</html>`;

    const exportWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!exportWindow) {
      return;
    }

    exportWindow.document.open();
    exportWindow.document.write(html);
    exportWindow.document.close();
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
    <section className="chp-reading-sheet overflow-visible rounded-2xl border border-white/10 bg-slate-950/35">
      <div className="chp-plan-progress-summary border-b border-white/10 bg-slate-950/45 p-3 print:hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-2">
            <span className="text-lg font-black leading-none text-white">{weeksLeft}</span>
            <span className="text-[0.58rem] font-black uppercase tracking-[0.14em] text-emerald-100">
              weeks left
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between gap-3 text-[0.62rem] font-black uppercase tracking-[0.14em] text-slate-300">
              <span>{doneCount} read</span>
              <span className="text-emerald-100">{percent}% done</span>
            </div>
            <div className="h-2 overflow-visible rounded-full border border-white/10 bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.35)] transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/20 bg-sky-300/10 px-3 py-2">
            <span className="text-lg font-black leading-none text-white">{daysLeft}</span>
            <span className="text-[0.58rem] font-black uppercase tracking-[0.14em] text-sky-100">
              days left
            </span>
          </div>
        </div>
      </div>

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
              <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-200/25 bg-emerald-300/10 px-3 text-[0.66rem] font-black uppercase tracking-[0.12em] text-emerald-50 transition hover:bg-emerald-300/18">
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
                className="inline-flex h-8 items-center rounded-xl border border-white/20 bg-slate-950/40 px-3 text-[0.62rem] font-black uppercase tracking-[0.12em] text-slate-100 transition hover:border-white/30 hover:bg-white/10"
              >
                Export 1-page
              </button>

              <button
                type="button"
                onClick={() => exportPlan(true)}
                className="inline-flex h-8 items-center rounded-xl border border-emerald-200/25 bg-emerald-300/10 px-3 text-[0.62rem] font-black uppercase tracking-[0.12em] text-emerald-50 transition hover:border-emerald-200/40 hover:bg-emerald-300/18"
              >
                Export 1-page checks
              </button>

              <button
                type="button"
                onClick={copyPlanLink}
                className="inline-flex h-8 items-center rounded-full border border-white/15 bg-white/10 px-3 text-[0.62rem] font-black uppercase tracking-[0.12em] text-slate-100 transition hover:bg-white/15"
              >
                {copied ? "Copied" : "Copy link"}
              </button>

              <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-1.5 text-[0.62rem] font-black uppercase tracking-[0.12em] text-slate-300">
                {daysLeft} left • {percent}% done
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="chp-reading-table overflow-x-auto">
        <table className="min-w-[1120px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-slate-900/75">
              <th className="w-12 border-r border-white/10 px-2 py-3 text-center text-[0.6rem] font-black uppercase tracking-[0.14em] text-slate-300">
                Week
              </th>
              {LANES.map((lane) => (
                <th
                  key={lane.key}
                  className="border-r border-white/10 px-2.5 py-3 text-left last:border-r-0"
                >
                  <div className="flex min-h-[3.25rem] flex-col justify-center gap-0.5">
                    <p className="text-[0.58rem] font-black uppercase tracking-[0.16em] text-emerald-100">
                      {lane.day}
                    </p>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-white">
                      {lane.lane}
                    </p>
                    <p className="text-[0.62rem] font-bold normal-case tracking-normal text-slate-400">
                      {lane.summary}
                    </p>
                  </div>
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
                        id={id}
                        key={lane.key}
                        className={`chp-reading-plan-cell scroll-mt-36 border-r border-white/[0.07] px-3 py-1.5 text-left transition duration-500 last:border-r-0 ${
                          highlightedReadingId === id
                            ? "chp-reading-target-cell bg-emerald-300/[0.18]"
                            : isRead
                              ? "bg-emerald-300/[0.075]"
                              : "bg-white/[0.015]"
                        }`}
                      >
                        <div className="flex min-h-[2.15rem] items-center justify-start gap-2">
                          <input
                            type="checkbox"
                            checked={isRead}
                            onChange={() => toggleReading(id)}
                            aria-label={`${isRead ? "Mark unread" : "Mark read"} ${label}`}
                            className="h-4 w-4 shrink-0 accent-emerald-300"
                          />

                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block min-w-0 max-w-[9.5rem] truncate text-left text-[0.98rem] font-black leading-snug text-emerald-50 underline decoration-emerald-300/45 decoration-2 underline-offset-3 transition hover:text-white hover:decoration-emerald-100"
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

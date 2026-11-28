// ─────────────────────────────────────────────────────────────────────────────
// Learning progress, kept on this device only (owner direction, Nov 27-28
// 2026: "continue learning", saved interests, recently visited subjects,
// local progress storage; account sync can come later).
//
// What's stored, under one localStorage key: which paths you started, which
// steps you marked done, the subjects you saved, and the last subjects you
// opened. Every value is an id from our own lists (paths.ts, taxonomy.ts);
// anything else is dropped when it's read back. Nothing typed is ever stored,
// and nothing here is sent anywhere.
//
// The functions are pure (they take a state and return a new one) so tests
// can check them without a browser. The browser part is load/save/subscribe.
// ─────────────────────────────────────────────────────────────────────────────

import { PATHS, pathBySlug, type LearningPath, type PathStep } from "./paths.ts";
import { SUBJECTS } from "./taxonomy.ts";

export const STORAGE_KEY = "om-learning";
export const CHANGE_EVENT = "om-learning-change";
const MAX_RECENT = 6;
const MAX_SAVED = 60;

export type PathProgress = { started: string; done: string[]; touched: string };
export type LearningState = { v: 1; paths: Record<string, PathProgress>; saved: string[]; recent: string[] };

export const EMPTY: LearningState = Object.freeze({ v: 1, paths: {}, saved: [], recent: [] }) as LearningState;

const SUBJECT_SLUGS = new Set(SUBJECTS.map((s) => s.slug));
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export function today(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** Read back anything (a parsed string, a hand-edited value, an old version) and keep only what's valid. */
export function sanitize(raw: unknown): LearningState {
  if (!raw || typeof raw !== "object") return EMPTY;
  const r = raw as Partial<LearningState>;
  const paths: Record<string, PathProgress> = {};
  if (r.paths && typeof r.paths === "object") {
    for (const [slug, p] of Object.entries(r.paths)) {
      const path = pathBySlug(slug);
      if (!path || !p || typeof p !== "object") continue;
      const stepIds = new Set(path.steps.map((s) => s.id));
      const done = Array.isArray(p.done) ? [...new Set(p.done.filter((d): d is string => typeof d === "string" && stepIds.has(d)))] : [];
      const started = typeof p.started === "string" && DAY.test(p.started) ? p.started : today();
      const touched = typeof p.touched === "string" && DAY.test(p.touched) ? p.touched : started;
      paths[slug] = { started, done, touched };
    }
  }
  const list = (v: unknown, max: number) =>
    Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string" && SUBJECT_SLUGS.has(x)))].slice(0, max) : [];
  return { v: 1, paths, saved: list(r.saved, MAX_SAVED), recent: list(r.recent, MAX_RECENT) };
}

export function startPath(s: LearningState, slug: string, now = new Date()): LearningState {
  if (!pathBySlug(slug) || s.paths[slug]) return s;
  const day = today(now);
  return { ...s, paths: { ...s.paths, [slug]: { started: day, done: [], touched: day } } };
}

export function toggleStep(s: LearningState, slug: string, stepId: string, now = new Date()): LearningState {
  const path = pathBySlug(slug);
  if (!path || !path.steps.some((st) => st.id === stepId)) return s;
  const day = today(now);
  const cur = s.paths[slug] ?? { started: day, done: [], touched: day };
  const done = cur.done.includes(stepId) ? cur.done.filter((d) => d !== stepId) : [...cur.done, stepId];
  // Keep path order, so "next step" is always the first one not done.
  const ordered = path.steps.map((st) => st.id).filter((id) => done.includes(id));
  return { ...s, paths: { ...s.paths, [slug]: { ...cur, done: ordered, touched: day } } };
}

export function resetPath(s: LearningState, slug: string): LearningState {
  if (!s.paths[slug]) return s;
  const paths = { ...s.paths };
  delete paths[slug];
  return { ...s, paths };
}

export function toggleSaved(s: LearningState, subject: string): LearningState {
  if (!SUBJECT_SLUGS.has(subject)) return s;
  const saved = s.saved.includes(subject) ? s.saved.filter((x) => x !== subject) : [subject, ...s.saved].slice(0, MAX_SAVED);
  return { ...s, saved };
}

export function visitSubject(s: LearningState, subject: string): LearningState {
  if (!SUBJECT_SLUGS.has(subject)) return s;
  if (s.recent[0] === subject) return s;
  return { ...s, recent: [subject, ...s.recent.filter((x) => x !== subject)].slice(0, MAX_RECENT) };
}

export type PathStatus = { path: LearningPath; done: number; total: number; next?: PathStep; finished: boolean; touched: string };

export function pathStatus(s: LearningState, slug: string): PathStatus | undefined {
  const path = pathBySlug(slug);
  const p = s.paths[slug];
  if (!path || !p) return undefined;
  const next = path.steps.find((st) => !p.done.includes(st.id));
  return { path, done: p.done.length, total: path.steps.length, next, finished: !next, touched: p.touched };
}

/** Paths in progress, most recently touched first; finished ones after. */
export function continueList(s: LearningState): PathStatus[] {
  return PATHS.map((p) => pathStatus(s, p.slug))
    .filter((x): x is PathStatus => !!x)
    .sort((a, b) => Number(a.finished) - Number(b.finished) || b.touched.localeCompare(a.touched));
}

// ── Browser storage (every call guarded: private windows and blocked storage
//    simply behave like a fresh visit) ──────────────────────────────────────

export function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function load(): LearningState {
  const raw = readRaw();
  if (!raw) return EMPTY;
  try {
    return sanitize(JSON.parse(raw));
  } catch {
    return EMPTY;
  }
}

export function save(s: LearningState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // Storage full or blocked: the page still works, it just won't remember.
  }
  try {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* no window */
  }
}

export function update(fn: (s: LearningState) => LearningState): LearningState {
  const next = fn(load());
  save(next);
  return next;
}

export function subscribe(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === STORAGE_KEY) cb();
  };
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

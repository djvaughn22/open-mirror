// ─────────────────────────────────────────────────────────────────────────────
// The canonical event archive.
//
// Same bargain as the Sprint 1 desk store: plain JSON files under data/, no
// database, no vendor, $0. The ingestion job runs where the operator controls
// it and the archive is committed, so the published wire is diffable and every
// change to a published fact shows up in a git history.
//
// SportsEventStore is the seam. A Postgres implementation drops in later
// without the feed, the writer or the pipeline knowing.
// ─────────────────────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { CanonicalEvent } from "./types.ts";

export interface SportsEventStore {
  list(): CanonicalEvent[];
  get(id: string): CanonicalEvent | undefined;
  save(event: CanonicalEvent): void;
  saveAll(events: CanonicalEvent[]): void;
  remove(id: string): boolean;
  writable(): boolean;
}

const EVENTS_DIR = join(process.cwd(), "data", "sports", "events");

/** A file name that cannot escape the events directory. */
function fileFor(id: string): string {
  return `${id.replace(/[^a-zA-Z0-9._-]/g, "_")}.json`;
}

function readAll(): CanonicalEvent[] {
  if (!existsSync(EVENTS_DIR)) return [];
  const events: CanonicalEvent[] = [];
  for (const file of readdirSync(EVENTS_DIR)) {
    if (!file.endsWith(".json")) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(join(EVENTS_DIR, file), "utf8"));
    } catch {
      // A corrupt archive file changes every streak and standing computed from
      // it, so it is an error, never a silent skip.
      throw new Error(`data/sports/events/${file} is not valid JSON`);
    }
    const event = parsed as CanonicalEvent;
    if (!event || typeof event.id !== "string" || !Array.isArray(event.sides) || event.sides.length !== 2) {
      throw new Error(`data/sports/events/${file} is not a valid canonical event`);
    }
    events.push(event);
  }
  return events.sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date)));
}

export const fileEventStore: SportsEventStore = {
  list: readAll,
  get(id) {
    const path = join(EVENTS_DIR, fileFor(id));
    if (!existsSync(path)) return undefined;
    return JSON.parse(readFileSync(path, "utf8")) as CanonicalEvent;
  },
  save(event) {
    mkdirSync(EVENTS_DIR, { recursive: true });
    writeFileSync(join(EVENTS_DIR, fileFor(event.id)), `${JSON.stringify(event, null, 2)}\n`, "utf8");
  },
  saveAll(events) {
    for (const e of events) this.save(e);
  },
  remove(id) {
    const path = join(EVENTS_DIR, fileFor(id));
    if (!existsSync(path)) return false;
    rmSync(path);
    return true;
  },
  writable() {
    try {
      mkdirSync(EVENTS_DIR, { recursive: true });
      const probe = join(EVENTS_DIR, ".write-probe");
      writeFileSync(probe, "");
      return true;
    } catch {
      return false;
    }
  },
};

/** An in-memory store, so the whole pipeline can be tested without touching disk. */
export function memoryEventStore(seed: CanonicalEvent[] = []): SportsEventStore {
  const map = new Map(seed.map((e) => [e.id, e]));
  return {
    list: () => [...map.values()].sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date))),
    get: (id) => map.get(id),
    save(event) {
      map.set(event.id, event);
    },
    saveAll(events) {
      for (const e of events) map.set(e.id, e);
    },
    remove: (id) => map.delete(id),
    writable: () => true,
  };
}

export const eventStore: SportsEventStore = fileEventStore;

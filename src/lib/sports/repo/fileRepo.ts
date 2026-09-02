// ─────────────────────────────────────────────────────────────────────────────
// The file repository — the crawler's home, and the only store tests touch.
//
// Canonical events stay in data/sports/events as committed JSON, which is what
// makes the machine-gathered archive reviewable in a diff. Submissions and
// credentials get their own files so a developer can run the whole first-party
// flow locally with no database at all.
//
// This is NOT what production writes to: a serverless deployment has no durable
// filesystem, and `writable()` says so honestly rather than failing at 9pm when
// a coach taps submit.
// ─────────────────────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { fileEventStore } from "../graph/eventStore.ts";
import type { SportsRepository } from "./types.ts";

import type { StoredCredential, SubmissionRecord } from "../submit/types.ts";

const DIR = join(process.cwd(), "data", "sports");
const SUBMISSIONS = join(DIR, "submissions.json");
const CREDENTIALS = join(DIR, "credentials.json");

function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    throw new Error(`${path} is not valid JSON`);
  }
}

function writeJson(path: string, value: unknown): void {
  mkdirSync(DIR, { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export const fileRepository: SportsRepository = {
  async listEvents() {
    return fileEventStore.list();
  },
  async getEvent(id) {
    return fileEventStore.get(id);
  },
  async saveEvent(event) {
    fileEventStore.save(event);
  },

  async listSubmissions(options) {
    let all = readJson<SubmissionRecord[]>(SUBMISSIONS, []);
    if (options?.status) all = all.filter((s) => s.status === options.status);
    all.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
    return options?.limit ? all.slice(0, options.limit) : all;
  },
  async saveSubmission(record) {
    const all = readJson<SubmissionRecord[]>(SUBMISSIONS, []).filter((s) => s.id !== record.id);
    all.push(record);
    writeJson(SUBMISSIONS, all);
  },
  async findSubmissionByFingerprint(fingerprint) {
    return readJson<SubmissionRecord[]>(SUBMISSIONS, []).find((s) => s.fingerprint === fingerprint);
  },

  async findCredentialByHash(tokenHash) {
    return readJson<StoredCredential[]>(CREDENTIALS, []).find((c) => c.tokenHash === tokenHash);
  },
  async listCredentials() {
    return readJson<StoredCredential[]>(CREDENTIALS, []);
  },
  async saveCredential(credential) {
    const all = readJson<StoredCredential[]>(CREDENTIALS, []).filter((c) => c.id !== credential.id);
    all.push(credential);
    writeJson(CREDENTIALS, all);
  },
  async revokeCredential(id, at) {
    const all = readJson<StoredCredential[]>(CREDENTIALS, []);
    const found = all.find((c) => c.id === id);
    if (!found) return false;
    found.revokedAt = at;
    writeJson(CREDENTIALS, all);
    return true;
  },

  async writable() {
    try {
      mkdirSync(DIR, { recursive: true });
      const probe = join(DIR, ".write-probe");
      writeFileSync(probe, "");
      rmSync(probe);
      return true;
    } catch {
      return false;
    }
  },
  describe: () => "local files (data/sports)",
};

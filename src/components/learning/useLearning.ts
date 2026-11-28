"use client";

// React access to the on-device learning progress (lib/learning/progress.ts).
// The server always renders the empty state; the browser fills in what this
// device remembers right after the page loads.

import { useSyncExternalStore } from "react";
import { EMPTY, readRaw, sanitize, subscribe, type LearningState } from "../../lib/learning/progress.ts";

let lastRaw: string | null | undefined;
let lastState: LearningState = EMPTY;

function getSnapshot(): LearningState {
  const raw = readRaw();
  if (raw === lastRaw) return lastState;
  lastRaw = raw;
  if (!raw) {
    lastState = EMPTY;
    return lastState;
  }
  try {
    lastState = sanitize(JSON.parse(raw));
  } catch {
    lastState = EMPTY;
  }
  return lastState;
}

const getServerSnapshot = () => EMPTY;

export function useLearning(): LearningState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

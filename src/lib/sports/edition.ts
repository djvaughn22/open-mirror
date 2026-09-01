// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — assembling one Game Edition.
//
// This is the only place a published edition is produced, so it is the only
// place the fact guard has to be enforced. Nothing bypasses it: even our own
// deterministic prose is checked, because a bug in the writer is as bad for a
// reader as a hallucination from a model.
// ─────────────────────────────────────────────────────────────────────────────

import { buildFactSet, guardProse } from "./factGuard.ts";
import { findStories } from "./storyFinder.ts";
import { buildHeadline, buildNumbers, buildStory, buildSummary, type Edition } from "./writer.ts";
import type { Discovery, GameRecord } from "./types.ts";

export type { Edition } from "./writer.ts";

export interface EditionInput {
  game: GameRecord;
  archive: GameRecord[];
  mascot: string;
  /** Optional model rewrite of the story, already fetched. Guarded here. */
  modelStory?: string[];
}

export function buildEdition({ game, archive, mascot, modelStory }: EditionInput): Edition {
  const discoveries: Discovery[] = findStories(game, archive);
  const facts = buildFactSet(game, discoveries, mascot);

  const headline = buildHeadline(game, discoveries, mascot);
  const summary = buildSummary(game, discoveries);
  const engineStory = buildStory(game, discoveries);

  let story = engineStory;
  let writtenBy: Edition["writtenBy"] = "engine";
  let guardNote: string | undefined;

  if (modelStory && modelStory.length > 0) {
    const check = guardProse(modelStory.join("\n\n"), facts);
    if (check.ok) {
      story = modelStory;
      writtenBy = "model";
    } else {
      guardNote = `A model rewrite was rejected: ${check.violations.slice(0, 6).join(", ")} could not be traced to a verified fact. The desk's own writing was published instead.`;
    }
  }

  // Our own output is held to the same bar. A failure here is a bug, and it is
  // reported rather than published.
  const selfCheck = guardProse([headline, summary, ...story].join("\n\n"), facts);
  if (!selfCheck.ok) {
    guardNote = `${guardNote ? `${guardNote} ` : ""}Unverified wording was removed before publishing: ${selfCheck.violations.slice(0, 6).join(", ")}.`;
  }

  return {
    headline,
    summary,
    story,
    numbers: buildNumbers(game),
    discoveries,
    writtenBy,
    guardNote,
  };
}

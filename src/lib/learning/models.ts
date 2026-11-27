// ─────────────────────────────────────────────────────────────────────────────
// Open Mirror Learning: the data shapes for what comes next (owner direction,
// Nov 26-27 2026, "University data foundation"). Types only. Nothing here is
// stored, sold or shown yet; today's pages use taxonomy.ts, resources.ts and
// careers.ts. These shapes are written so the next pass can add courses,
// paths and progress without reshaping what exists.
//
// Ground rules carried into every shape:
// - Free knowledge stays free. A paid assessment, if one ever exists, is
//   optional and separate from learning.
// - Progress belongs to the learner: kept on their device unless they choose
//   an account, exportable, deletable.
// - No credential claims accreditation, a degree, or equivalence to a
//   license. Every credential names who reviewed it and against what.
// - Every outside resource keeps its source, license and checked date.
// ─────────────────────────────────────────────────────────────────────────────

import type { Cost, License, Level, PathwayId, ResourceKind } from "./resources.ts";

export type Id = string;
export type IsoDate = string;

/** A learning objective: what someone can DO afterward, in one sentence. */
export type Objective = { id: Id; text: string; skills: Id[] };

export type Skill = {
  id: Id;
  name: string;
  /** O*NET skill or knowledge element, when one fits (for career links). */
  onet?: string;
};

export type Prerequisite = { kind: "subject" | "course" | "skill"; id: Id; note?: string };

export type Exercise = {
  id: Id;
  prompt: string;
  /** "self" = learner checks it; "auto" = a deterministic check; "reviewer" = a person. */
  check: "self" | "auto" | "reviewer";
  objective: Id;
};

export type Project = {
  id: Id;
  title: string;
  /** What finished looks like, written so a reviewer could judge it. */
  doneWhen: string[];
  objectives: Id[];
  /** Private by default; the learner decides whether to share. */
  visibility: "private" | "link" | "public";
};

export type Assessment = {
  id: Id;
  title: string;
  objectives: Id[];
  format: "quiz" | "practical" | "portfolio" | "oral";
  /** Published before anyone takes it. */
  standard: string;
  cost: "free" | "paid";
};

/** A lesson points at outside resources or our own text; it never copies a protected work. */
export type Lesson = {
  id: Id;
  title: string;
  objectives: Id[];
  resources: Id[];
  exercises: Id[];
  minutes?: number;
};

export type Module = { id: Id; title: string; lessons: Id[]; project?: Id };

export type Course = {
  id: Id;
  title: string;
  subject: Id;
  level: Level;
  modules: Id[];
  prerequisites: Prerequisite[];
  /** Curriculum versioning: courses change; old versions stay readable. */
  version: string;
  publishedAt: IsoDate;
  changelog: { version: string; date: IsoDate; note: string }[];
  /** Who wrote and who reviewed it, by role; real people only, with consent. */
  authors: Id[];
  reviewers: Id[];
};

export type LearningPath = {
  id: Id;
  title: string;
  why: PathwayId;
  steps: { kind: "course" | "resource" | "project" | "occupation"; id: Id; note?: string }[];
};

/** Kept on the learner's device by default (localStorage), exportable as JSON. */
export type Progress = {
  learner: "this-device" | Id;
  items: { kind: "lesson" | "exercise" | "project" | "resource"; id: Id; status: "started" | "done"; at: IsoDate }[];
};

/** A resource's metadata as the verifier keeps it. */
export type ResourceRecord = {
  id: Id;
  url: string;
  kind: ResourceKind;
  cost: Cost;
  license: License;
  licenseName?: string;
  /** Last time the link answered, and how it was checked. */
  verification: { checked: IsoDate; method: "automated" | "browser" | "manual"; status: "ok" | "moved" | "broken" | "blocked" };
  /** Why a reviewer included it; never a made-up rating. */
  inclusionNote?: string;
};

export type Community = {
  id: Id;
  name: string;
  kind: "library" | "extension" | "club" | "mentor-network" | "online-forum" | "meetup";
  url: string;
  local?: { city?: string; state?: string };
  /** Listed with permission when it's a private group. */
  permission: "public-org" | "granted";
};

/** Experts are real, consenting people. None are listed today. */
export type ExpertContributor = {
  id: Id;
  role: "author" | "reviewer" | "mentor";
  fields: Id[];
  /** How their expertise was confirmed, in words. */
  verifiedBy: string;
  conflicts: string[];
  consentAt: IsoDate;
};

/** A future, optional, expert-reviewed credential. Never accreditation. */
export type Credential = {
  id: Id;
  title: string;
  objectives: Id[];
  assessment: Id;
  reviewers: Id[];
  /** Printed on every credential. */
  limits: string;
  verifyUrl: string;
  appeals: string;
  version: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Contact registry — single source of truth for /contact.
//
// Work-with rewrite (owner's brief, 2026-07-19): Contact now says plainly
// that people can hire or collaborate with Open Mirror — three ways to help,
// one mailto action with a subject line, the visible address, and the
// evenings/weekends line. Still no form, no prices, and nothing promised
// about availability, acceptance, timelines, or results.
// ─────────────────────────────────────────────────────────────────────────────

import { STUDIO } from "./products";

export const SERVICE_EMAIL = STUDIO.email;

export const PAGE_TITLE = "Contact";

export const EYEBROW = "Work with Open Mirror";

export const HEADLINE = "Bring me what you’re building.";

/** One-line description for metadata, OG tags, and structured data. */
export const META_DESCRIPTION =
  "Open Mirror builds original products and works with a small number of people on their ideas, projects, and problems. Email ask@openmirrorllc.com.";

export const INTRO = [
  "Open Mirror creates its own products, but I also work with a small number of people who have an idea, an unfinished project, or something that should work better than it does today.",
  "You do not need a polished plan. Tell me what you have, where you are stuck, and what you would like to make real.",
];

export const SECTION_HEADING = "A practical way forward";

export const SECTION_COPY =
  "I can help you shape the idea, simplify the experience, improve an existing build, or identify the next step that will make the biggest difference.";

/** The three ways Open Mirror helps — rendered as compact cards. */
export const SERVICES = [
  {
    title: "Shape the idea",
    copy: "Turn a rough thought into a clear product, feature, service, or first build.",
  },
  {
    title: "Improve what exists",
    copy: "Find what is confusing, unfinished, or getting in the way—and make it work better.",
  },
  {
    title: "Find the next step",
    copy: "Separate what matters now from what can wait, then move the project forward.",
  },
];

export const CTA_HEADING = "Tell me what you’re working on.";

export const CTA_COPY =
  "Send a short note about the idea, the current problem, and what a good result would look like. I will read it personally and let you know whether Open Mirror is a good fit.";

export const CTA_BUTTON = "Start the conversation";

export const MAILTO_SUBJECT = "Open Mirror project inquiry";

/** Pre-filled note structure — three short questions, nothing else. */
export const MAILTO_BODY =
  "What are you building?\n\nWhere are you stuck?\n\nWhat would a good result look like?\n";

/** Shown once, small, under the action. */
export const AVAILABILITY_NOTE =
  "I run Open Mirror alongside a full-time job and reply personally during evenings and weekends.";

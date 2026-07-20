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

export const HEADLINE = "Let’s build something real.";

/** One-line description for metadata, OG tags, and structured data. */
export const META_DESCRIPTION =
  "Open Mirror builds original products and works with a small number of people on their ideas, projects, and problems. Email ask@openmirrorllc.com.";

export const INTRO = [
  "Open Mirror builds original products, but I also work with a small number of people who have an idea, an existing project, or a problem worth solving.",
  "Whether you need help shaping the idea, improving what you already built, or finding the clearest next step, tell me what you are working on.",
];

/** The three ways Open Mirror helps — rendered as compact cards. */
export const SERVICES = [
  {
    title: "Shape the idea",
    copy: "Turn a rough thought into a clear product, useful feature, or practical first build.",
  },
  {
    title: "Improve the build",
    copy: "Find what is confusing, unfinished, or getting in the way—and make it work better.",
  },
  {
    title: "Find the next step",
    copy: "Get an honest assessment of what matters now, what can wait, and what should happen next.",
  },
];

export const CTA_HEADING = "Start a conversation";

export const CTA_COPY =
  "Send a short note about what you are building, where you are stuck, and what a good result would look like.";

export const CTA_BUTTON = "Tell me what you’re building";

export const MAILTO_SUBJECT = "Open Mirror project inquiry";

/** Shown once, small, under the action. */
export const AVAILABILITY_NOTE =
  "Open Mirror is built outside my full-time work, so I reply personally during evenings and weekends.";

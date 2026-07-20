// ─────────────────────────────────────────────────────────────────────────────
// Contact registry — single source of truth for /contact.
//
// Say-less rules (owner, 2026-07-19): the page is a heading, the focus line,
// the email address, one "Send an email" action, and the evenings/weekends
// line. No form, no consulting or client language, no availability talk
// beyond that one line.
// ─────────────────────────────────────────────────────────────────────────────

import { STUDIO } from "./products";

export const SERVICE_EMAIL = STUDIO.email;

export const PAGE_TITLE = "Contact";

/** One-line description for metadata, OG tags, and structured data. */
export const META_DESCRIPTION =
  "Open Mirror is focused on building its own products. For general questions, email ask@openmirrorllc.com.";

/** The single opening line, shown once. */
export const CORE_MESSAGE =
  "Open Mirror is focused on building its own products.";

/** Shown once, small, under the action. */
export const AVAILABILITY_NOTE =
  "Messages are usually reviewed during evenings and weekends.";

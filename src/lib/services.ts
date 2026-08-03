// ─────────────────────────────────────────────────────────────────────────────
// Contact registry — single source of truth for /contact.
//
// Say-less rewrite (owner, 2026-07-20): Contact is a simple "email me and
// we'll talk" page. No pitch, no service cards, no pre-filled questionnaire,
// no personal-reply promises. One address, one button, the two honest
// availability facts. Keep it this plain.
// ─────────────────────────────────────────────────────────────────────────────

import { STUDIO } from "./products";

export const SERVICE_EMAIL = STUDIO.email;

export const PAGE_TITLE = "Contact";

export const EYEBROW = "Contact";

export const HEADLINE = "Contact Open Mirror";

/** One-line description for metadata, OG tags, and structured data. */
export const META_DESCRIPTION =
  "Contact Open Mirror LLC — email ask@openmirrorllc.com.";

/** The whole message. One line. */
export const BODY_LINE =
  "Have an idea, a project, or a question? Email me and we'll talk.";

export const EMAIL_BUTTON = "Email me";

export const MAILTO_SUBJECT = "Open Mirror";

/** The one shared contact action (2026-08-02): every "Contact" link in the
 *  family opens email to the verified address — never a contact webpage. */
export const CONTACT_MAILTO = `mailto:${SERVICE_EMAIL}?subject=${encodeURIComponent(
  "Open Mirror Inquiry",
)}`;

// ─────────────────────────────────────────────────────────────────────────────
// Consulting availability — one switch, one place (2026-07-20).
//
// Flip AVAILABILITY when reality changes and the public line updates wherever
// it renders (Contact, About). Never copy these strings into pages, and never
// hard-code "available" anywhere else. This is a plain statement of capacity,
// not an urgency tactic.
// ─────────────────────────────────────────────────────────────────────────────

export type ConsultingAvailability =
  | "one-project" // the normal state: one outside project at a time
  | "at-capacity" // heads-down on existing work
  | "contact-welcome" // nothing promised either way; notes welcome
  | "not-accepting"; // no outside work for now

export const AVAILABILITY: ConsultingAvailability = "one-project";

const AVAILABILITY_LINES: Record<ConsultingAvailability, string> = {
  "one-project":
    "Open Mirror takes one outside project at a time, when there is a good fit.",
  "at-capacity":
    "Open Mirror is currently focused on existing work, but you can still email.",
  "contact-welcome": "You are welcome to email about what you are building.",
  "not-accepting":
    "Open Mirror is not taking outside projects right now, but you can still email.",
};

export const AVAILABILITY_LINE = AVAILABILITY_LINES[AVAILABILITY];

/** Shown once, small, under the action. */
export const AVAILABILITY_NOTE =
  "I run Open Mirror alongside a full-time job and reply during evenings and weekends.";

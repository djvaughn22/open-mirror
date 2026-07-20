// ─────────────────────────────────────────────────────────────────────────────
// Contact registry — single source of truth for /contact.
//
// One quiet page: Open Mirror builds its own products first; occasional
// independent project inquiries are welcome, one at a time, when the fit is
// right. No prices, no tiers, no urgency, no proof gallery. If a payment link
// is ever added, it gets added here — not sprinkled through the page.
// ─────────────────────────────────────────────────────────────────────────────

import { STUDIO } from "./products";

export const SERVICE_EMAIL = STUDIO.email;

export const PAGE_TITLE = "Project inquiry";

/** One-line description for metadata, OG tags, and structured data. */
export const META_DESCRIPTION =
  "Open Mirror is focused on building its own products. Occasional independent project inquiries are welcome — tell me what you want to build, what already exists, and where you are stuck.";

/** The single opening — one short invitation, shown once at every screen size. */
export const CORE_MESSAGE =
  "Tell me what you want to build, what already exists, and where you are stuck.";

/** The context line above the invitation. Calm, selective, open. */
export const FIT_MESSAGE =
  "Open Mirror is focused on building its own products. Now and then there is room for one independent project, when the scope is limited and the fit is right. Sending a message does not guarantee availability.";

/** Shown once, near the form. */
export const AVAILABILITY_NOTE =
  "Messages are usually reviewed during evenings and weekends.";

/** Shown near the form. Sets expectations honestly, without apology. */
export const PRIVACY_NOTE =
  "What you share here is only used to respond to your message. It isn't shared, sold, or added to a mailing list.";

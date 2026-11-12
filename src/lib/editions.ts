// ─────────────────────────────────────────────────────────────────────────────
// Customer editions — the pure part (list, validation, owner email text).
//
// A request is only a request. Nothing is approved, licensed, charged or
// deployed automatically; the owner reviews each one by hand. Rights are NOT
// yet verified for any property, so every one is a "concept" until the owner
// flips `rightsVerified` here (and only then does the page say "available").
// Never list CrossHeartPray or TheDJCares. Fambookagram/Friendbookagram are
// discontinued and stay out.
// ─────────────────────────────────────────────────────────────────────────────

export const EDITION_START_PRICE = "$499";

export type EditionProperty = {
  id: string;
  name: string;
  line: string;
  /** Owner has confirmed suitability AND licensing rights. All false for now. */
  rightsVerified: boolean;
};

export const EDITION_PROPERTIES: EditionProperty[] = [
  { id: "website-starter", name: "Website starter (Step In The Ring)", line: "Pick an example, make it yours, download the files.", rightsVerified: false },
  { id: "opendoku", name: "OpenDoku", line: "A puzzle and photo-game site.", rightsVerified: false },
  { id: "watched-not-watched", name: "WatchedNotWatched", line: "A simple watched / not-watched tracker.", rightsVerified: false },
  { id: "whatamiai", name: "WhatAmIAI", line: "A plain-language guide to using AI.", rightsVerified: false },
  { id: "sports-desk", name: "Local sports desk (iDontCry)", line: "Teams, scores and schedules for one community.", rightsVerified: false },
  { id: "other", name: "Something else", line: "Tell us what you have in mind.", rightsVerified: false },
];

export const LIMITS = { name: 80, email: 120, business: 120, message: 1200 } as const;

export type EditionInput = {
  property?: unknown; name?: unknown; email?: unknown; business?: unknown; message?: unknown;
  website?: unknown; // honeypot — real people never fill it
  stamp?: unknown;   // ms timestamp the page was opened
};

export type EditionClean = { property: string; name: string; email: string; business: string; message: string };
export type EditionCheck =
  | { ok: true; value: EditionClean }
  | { ok: false; fields: Partial<Record<keyof EditionClean, string>> };

const str = (v: unknown) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;
// Long digit runs look like card / account / ID numbers. We never want them.
const NUMBERY = /(?:\d[ -]?){9,}/;

export function checkEdition(input: EditionInput): EditionCheck {
  const fields: Partial<Record<keyof EditionClean, string>> = {};
  const property = str(input.property);
  const name = str(input.name);
  const email = str(input.email).toLowerCase();
  const business = str(input.business);
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (!EDITION_PROPERTIES.some((p) => p.id === property)) fields.property = "Choose one of the options.";
  if (!name) fields.name = "Add your name.";
  else if (name.length > LIMITS.name) fields.name = "Keep your name under 80 characters.";
  if (!EMAIL.test(email) || email.length > LIMITS.email) fields.email = "Add an email address we can reply to.";
  if (business.length > LIMITS.business) fields.business = "Keep this under 120 characters.";
  if (message.length < 10) fields.message = "Tell us a little about what you want to make (at least a sentence).";
  else if (message.length > LIMITS.message) fields.message = "Keep this under 1,200 characters.";
  for (const k of ["name", "business", "message"] as const) {
    const v = k === "name" ? name : k === "business" ? business : message;
    if (!fields[k] && NUMBERY.test(v)) fields[k] = "Please leave out long numbers. We never need account, card or ID numbers.";
  }
  if (Object.keys(fields).length > 0) return { ok: false, fields };
  return { ok: true, value: { property, name, email, business, message } };
}

/** Honeypot filled, or form submitted faster than a person can type. */
export function looksAutomated(input: EditionInput, nowMs: number): boolean {
  if (str(input.website) !== "") return true;
  const t = Number(input.stamp);
  return !Number.isFinite(t) || nowMs - t < 4000 || nowMs - t > 24 * 3600_000;
}

export function propertyName(id: string): string {
  return EDITION_PROPERTIES.find((p) => p.id === id)?.name ?? id;
}

export function ownerMailText(r: EditionClean, ref: string): { subject: string; text: string } {
  return {
    subject: `Edition request ${ref}: ${propertyName(r.property)}`,
    text: [
      `Reference: ${ref}`,
      `Property: ${propertyName(r.property)}`,
      `Name: ${r.name}`,
      `Email: ${r.email}`,
      `Business: ${r.business || "(not given)"}`,
      "",
      r.message,
      "",
      "Nothing has been approved, licensed, charged or deployed. Reply by hand.",
    ].join("\n"),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Partnership inquiry — shared schema for /partnership.
//
// Client-safe: constants, the three steps, and the pure validator used by both
// the browser form and the server route, so the two can never drift apart. No
// secrets, no server imports. Verification codes, tokens, rate limits, and
// email delivery live in partnershipServer.ts.
//
// What this form must never collect (owner brief, 2026-10-08): proof of funds,
// fund sizes, net worth, account numbers, or any personal financial detail.
// It is an invitation to a conversation — not a securities offering — so it
// never grows an amount, a check size, or an accreditation question.
// ─────────────────────────────────────────────────────────────────────────────

import { sanitizeBlock, sanitizeLine } from "./deviceRequest.ts";

export const PARTNERSHIP_PATH = "/partnership";

export const WAYS = [
  {
    value: "Capital",
    hint: "Patient, values-aligned investment.",
  },
  {
    value: "Operating partnership",
    hint: "Hands-on help from someone who has built and run a business.",
  },
  {
    value: "Distribution",
    hint: "Help getting useful things to the people they're for.",
  },
  {
    value: "Strategic advice",
    hint: "A seasoned point of view, now and then.",
  },
  {
    value: "Other",
    hint: "Something else you have in mind.",
  },
] as const;

export type Way = (typeof WAYS)[number]["value"];
const WAY_VALUES: readonly string[] = WAYS.map((w) => w.value);

export const PARTNERSHIP_LIMITS = {
  name: 100,
  role: 100,
  firm: 120,
  email: 254,
  url: 300,
  otherWay: 120,
  experience: 1200,
  resonates: 1200,
  minExperience: 20,
  minResonates: 10,
  codeLength: 6,
  /** Hard cap on the raw request body — anything larger is rejected unread. */
  maxBodyBytes: 16_384,
} as const;

export type PartnershipField =
  | "name"
  | "email"
  | "role"
  | "firm"
  | "profileUrl"
  | "experience"
  | "ways"
  | "otherWay"
  | "resonates";

/** The three questions, in order. The form adds a fourth "Confirm" step. */
export const STEPS: readonly {
  key: string;
  title: string;
  short: string;
  fields: readonly PartnershipField[];
}[] = [
  { key: "who", title: "Who are you?", short: "You", fields: ["name", "email", "role", "firm"] },
  { key: "work", title: "What do you do?", short: "Work", fields: ["profileUrl", "experience"] },
  {
    key: "together",
    title: "How might we work together?",
    short: "Together",
    fields: ["ways", "otherWay", "resonates"],
  },
];

export const FIELD_LABELS: Record<PartnershipField, string> = {
  name: "Your name",
  email: "Work email",
  role: "Your role",
  firm: "Firm or company",
  profileUrl: "Firm or professional profile link",
  experience: "Relevant investment or operating experience",
  ways: "Ways you might work together",
  otherWay: "Tell us what you have in mind",
  resonates: "What resonates with Open Mirror's direction?",
};

export type PartnershipData = {
  name: string;
  email: string;
  role: string;
  firm: string;
  profileUrl: string;
  experience: string;
  ways: Way[];
  otherWay: string;
  resonates: string;
};

export type PartnershipValidation =
  | { ok: true; data: PartnershipData }
  | { ok: false; fieldErrors: Partial<Record<PartnershipField | "form", string>> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Two shapes that only ever mean a private identifier: a US Social Security
// number, and a long run of digits (card or account numbers). Phone numbers
// and years stay well clear of both.
const SSN_RE = /\b\d{3}-\d{2}-\d{4}\b/;
const LONG_DIGITS_RE = /(?:\d[ -]?){13,}/;

export function looksLikeFinancialDetail(text: string): boolean {
  return SSN_RE.test(text) || LONG_DIGITS_RE.test(text);
}

const FINANCIAL_DETAIL_MESSAGE =
  "Please leave out account, card, or ID numbers — they aren't needed here.";

/**
 * Accepts "linkedin.com/in/name" as well as a full link; returns a normalized
 * https/http URL, or "" when it can't be a public web address.
 */
export function normalizeProfileUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return "";
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return "";
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return "";
  if (url.username || url.password) return "";
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname)) return "";
  return url.toString();
}

/**
 * Pure validation + normalization. Runs identically in the browser (so people
 * see a problem before a round trip) and on the server (which is the only
 * validation that counts). Free text is sanitized and length-checked, never
 * silently truncated; the ways list is allowlisted.
 */
export function validatePartnershipInquiry(input: unknown): PartnershipValidation {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, fieldErrors: { form: "The inquiry could not be read." } };
  }
  const raw = input as Record<string, unknown>;
  const fieldErrors: Partial<Record<PartnershipField, string>> = {};
  const L = PARTNERSHIP_LIMITS;

  const name = sanitizeLine(raw.name);
  const email = sanitizeLine(raw.email);
  const role = sanitizeLine(raw.role);
  const firm = sanitizeLine(raw.firm);
  const profileRaw = sanitizeLine(raw.profileUrl);
  const experience = sanitizeBlock(raw.experience);
  const otherWay = sanitizeLine(raw.otherWay);
  const resonates = sanitizeBlock(raw.resonates);

  const line = (key: PartnershipField, value: string, max: number, missing: string) => {
    if (!value) fieldErrors[key] = missing;
    else if (value.length > max) fieldErrors[key] = `Please keep this to ${max} characters or fewer.`;
    else if (looksLikeFinancialDetail(value)) fieldErrors[key] = FINANCIAL_DETAIL_MESSAGE;
  };

  line("name", name, L.name, "Please add your name.");
  if (!email) fieldErrors.email = "Please add your work email.";
  else if (email.length > L.email || !EMAIL_RE.test(email))
    fieldErrors.email = "That email doesn't look complete — please check it.";
  line("role", role, L.role, "Please add your role, such as Partner or Operator.");
  line("firm", firm, L.firm, "Please add your firm or company. “Independent” is fine.");

  let profileUrl = "";
  if (!profileRaw) fieldErrors.profileUrl = "Please add a link to your firm or professional profile.";
  else if (profileRaw.length > L.url) fieldErrors.profileUrl = `Please keep the link to ${L.url} characters or fewer.`;
  else {
    profileUrl = normalizeProfileUrl(profileRaw);
    if (!profileUrl) fieldErrors.profileUrl = "That link doesn't look right — try something like firm.com or linkedin.com/in/yourname.";
  }

  const block = (key: PartnershipField, value: string, min: number, max: number, missing: string, short: string) => {
    if (!value) fieldErrors[key] = missing;
    else if (value.length < min) fieldErrors[key] = short;
    else if (value.length > max) fieldErrors[key] = `Please keep this to ${max} characters or fewer.`;
    else if (looksLikeFinancialDetail(value)) fieldErrors[key] = FINANCIAL_DETAIL_MESSAGE;
  };

  block(
    "experience",
    experience,
    L.minExperience,
    L.experience,
    "A few lines about your experience is plenty.",
    "A little more, please — a sentence or two is enough."
  );

  const waysIn = Array.isArray(raw.ways) ? raw.ways : [];
  const ways = WAY_VALUES.filter((w) => waysIn.includes(w)) as Way[];
  if (ways.length === 0) fieldErrors.ways = "Please choose at least one.";
  if (waysIn.some((w) => typeof w !== "string" || !WAY_VALUES.includes(w)))
    fieldErrors.ways = "Please choose from the options shown.";

  const otherChosen = ways.includes("Other");
  if (otherChosen) line("otherWay", otherWay, L.otherWay, "Please say a few words about what you have in mind.");

  block(
    "resonates",
    resonates,
    L.minResonates,
    L.resonates,
    "Please add a short note — even one sentence.",
    "A little more, please — one sentence is enough."
  );

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return {
    ok: true,
    data: {
      name,
      email,
      role,
      firm,
      profileUrl,
      experience,
      ways,
      otherWay: otherChosen ? otherWay : "",
      resonates,
    },
  };
}

/** Errors for one step only — the form validates a step before moving on. */
export function stepErrors(
  stepIndex: number,
  input: unknown
): Partial<Record<PartnershipField, string>> {
  const result = validatePartnershipInquiry(input);
  if (result.ok) return {};
  const fields = STEPS[stepIndex]?.fields ?? [];
  return Object.fromEntries(
    Object.entries(result.fieldErrors).filter(([k]) => (fields as readonly string[]).includes(k))
  );
}

/** Plain-text summary — the email body, and the copy-and-send fallback. */
export function buildInquirySummaryText(data: PartnershipData): string {
  const ways = data.ways
    .map((w) => (w === "Other" && data.otherWay ? `Other: ${data.otherWay}` : w))
    .join(", ");
  return [
    "── Who ──",
    `Name: ${data.name}`,
    `Work email: ${data.email}`,
    `Role: ${data.role}`,
    `Firm: ${data.firm}`,
    "",
    "── What they do ──",
    `Profile: ${data.profileUrl}`,
    "Experience:",
    data.experience,
    "",
    "── How we might work together ──",
    `Interested in: ${ways}`,
    "What resonates:",
    data.resonates,
  ].join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Build Machine interest — shared, client-safe helpers for the interest form.
//
// This is deliberately the site's SAFEST working contact mechanism: the form
// composes a plain email to the service inbox in the visitor's own mail app.
// Nothing is stored, no backend is required, and it works today with zero
// configuration. If a server endpoint is ever wanted, it should follow the
// deviceRequestServer.ts pattern — but that is an owner decision, not a
// default.
//
// Data rules (owner brief, 2026-08-04): collect only what is necessary.
// Never ask for serial numbers, passwords, company data, or detailed private
// information through this public form.
// ─────────────────────────────────────────────────────────────────────────────

// The .ts extension keeps this importable by the node test runner
// (--experimental-strip-types), matching deviceRequestServer.ts.
import { sanitizeBlock, sanitizeLine } from "./deviceRequest.ts";

export const INTEREST_TYPES = [
  "I want to buy a Build Machine",
  "I want to transform my own computer",
  "My business has retired computers",
  "I have computers to sell or donate",
  "I want first-batch availability updates",
] as const;
export type InterestType = (typeof INTEREST_TYPES)[number];

export const INTEREST_COMPUTER_TYPES = [
  "Laptop",
  "Desktop",
  "Mini PC",
  "Workstation",
  "Mac",
  "Mixed / several types",
  "Not sure",
] as const;

export type InterestFormData = {
  name: string;
  email: string;
  interestType: InterestType;
  approximateQuantity: string;
  computerType: string;
  manufacturerModel: string;
  cityState: string;
  message: string;
};

/** Plain-text body for the composed email. Only what the visitor typed. */
export function buildInterestEmailBody(data: InterestFormData): string {
  return [
    "Open Mirror — Build Machine interest",
    "",
    `Interest: ${sanitizeLine(data.interestType)}`,
    `Name: ${sanitizeLine(data.name)}`,
    `Email: ${sanitizeLine(data.email)}`,
    `Approximate quantity: ${sanitizeLine(data.approximateQuantity) || "—"}`,
    `Computer type: ${sanitizeLine(data.computerType) || "—"}`,
    `Manufacturer/model if known: ${sanitizeLine(data.manufacturerModel) || "—"}`,
    `City/state: ${sanitizeLine(data.cityState) || "—"}`,
    "",
    "Message:",
    sanitizeBlock(data.message) || "—",
    "",
    "Please do not include serial numbers, passwords, or confidential company information.",
  ].join("\n");
}

export function buildInterestMailto(
  serviceEmail: string,
  data: InterestFormData
): string {
  const subject = `Build Machine interest — ${data.interestType}`;
  return `mailto:${serviceEmail}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(buildInterestEmailBody(data))}`;
}

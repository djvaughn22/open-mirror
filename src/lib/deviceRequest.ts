// ─────────────────────────────────────────────────────────────────────────────
// Device request — shared schema for the Build Machine intake.
//
// Client-safe: constants, sanitizers, and the pure validator used by both the
// browser form and the server route, so the two can never drift apart. No
// secrets, no server imports. Server-only concerns (request numbers, email
// delivery, rate limiting) live in deviceRequestServer.ts.
//
// Payment rule (owner, 2026-07-19): no payment is taken on this website.
// Approved requests receive a Novo invoice by email; payment happens on that
// hosted invoice. This module must never grow a card field, a price total,
// or a payment token.
// ─────────────────────────────────────────────────────────────────────────────

export const TERMS_VERSION = "2026-07-19.1";
export const TERMS_EFFECTIVE_DATE = "July 19, 2026";

export const SOURCE_PAGE = "/products/old-laptop-to-build-machine";
export const CONFIRMATION_PATH =
  "/products/old-laptop-to-build-machine/request-received";
export const SERVICE_TERMS_PATH =
  "/products/old-laptop-to-build-machine/service-terms";
export const PRIVACY_PATH = "/products/old-laptop-to-build-machine/privacy";

// Centralized pricing. The pilot prices below are the ones already approved
// and live on the product page — nothing else may hard-code a dollar amount.
export const PRICING = {
  playbook: "$39",
  conversionFrom: "From $149",
  postPilotFrom: "$199",
  reviewLine:
    "Final pricing for an approved request is confirmed during review, before any invoice is sent.",
} as const;

export const DEVICE_TYPES = ["Laptop", "Desktop"] as const;
export type DeviceType = (typeof DEVICE_TYPES)[number];

export const POWERS_ON = ["Yes", "No", "Sometimes", "Unknown"] as const;

export const CONDITIONS = [
  "Good — works, normal wear",
  "Fair — works, noticeable wear",
  "Poor — damage or known problems",
  "Not sure",
] as const;

export const PREFERRED_CONTACT = ["Email", "Phone"] as const;

// Each acknowledgement is its own unchecked-by-default checkbox and its own
// validation error. They are never combined into one vague confirmation.
export const ACKNOWLEDGEMENTS = [
  {
    key: "ownership",
    label:
      "I own this device or have permission from its owner to request this work.",
  },
  {
    key: "erasure",
    label:
      "I understand that this service includes intentionally erasing the device.",
  },
  {
    key: "dataLoss",
    label: "I understand that erased data may be permanently unrecoverable.",
  },
  {
    key: "backedUp",
    label: "I have already backed up everything I want to keep.",
  },
  {
    key: "notLostStolen",
    label: "I will not send a device reported lost or stolen.",
  },
  {
    key: "noGuarantee",
    label:
      "I understand that submitting this request does not guarantee acceptance.",
  },
  {
    key: "waitForInstructions",
    label:
      "I understand that I must wait for approval and shipping instructions before sending the device.",
  },
  {
    key: "reviewedTerms",
    label: "I have reviewed the service terms and privacy notice.",
  },
] as const;

export type AcknowledgementKey = (typeof ACKNOWLEDGEMENTS)[number]["key"];

export const LIMITS = {
  short: 120,
  long: 1000,
  email: 254,
  phone: 40,
  zip: 10,
  /** Hard cap on the raw request body — anything larger is rejected unread. */
  maxBodyBytes: 32_768,
} as const;

export type DeviceRequestData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deviceType: DeviceType;
  manufacturer: string;
  model: string;
  approximateAge: string;
  powersOn: (typeof POWERS_ON)[number];
  operatingSystem: string;
  sizeOrWeight: string;
  condition: (typeof CONDITIONS)[number];
  intendedUse: string;
  notes: string;
  zip: string;
  preferredContact: (typeof PREFERRED_CONTACT)[number];
  acknowledgements: Record<AcknowledgementKey, true>;
};

export type ValidationResult =
  | { ok: true; data: DeviceRequestData }
  | { ok: false; fieldErrors: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

/** One-line text: control characters and angle brackets out, whitespace collapsed. */
export function sanitizeLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Multi-line text: keeps newlines, drops other control chars and angle brackets. */
export function sanitizeBlock(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function oneOf<T extends readonly string[]>(
  options: T,
  value: string
): value is T[number] {
  return (options as readonly string[]).includes(value);
}

/**
 * Pure validation + normalization. Runs identically in the browser (so
 * customers see errors before a round trip) and on the server (which is the
 * only validation that counts). Enum values are allowlisted; everything
 * free-text is sanitized and length-checked, never silently truncated.
 */
export function validateDeviceRequest(input: unknown): ValidationResult {
  const fieldErrors: Record<string, string> = {};
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, fieldErrors: { form: "The request body is not valid." } };
  }
  const raw = input as Record<string, unknown>;

  const line = (key: string) => sanitizeLine(raw[key]);
  const block = (key: string) => sanitizeBlock(raw[key]);

  const requireShort = (key: string, label: string, value: string) => {
    if (!value) fieldErrors[key] = `${label} is required.`;
    else if (value.length > LIMITS.short)
      fieldErrors[key] = `${label} must be ${LIMITS.short} characters or fewer.`;
  };
  const optionalShort = (key: string, label: string, value: string) => {
    if (value.length > LIMITS.short)
      fieldErrors[key] = `${label} must be ${LIMITS.short} characters or fewer.`;
  };

  const firstName = line("firstName");
  const lastName = line("lastName");
  const email = line("email");
  const phone = line("phone");
  const deviceType = line("deviceType");
  const manufacturer = line("manufacturer");
  const model = line("model");
  const approximateAge = line("approximateAge");
  const powersOn = line("powersOn");
  const operatingSystem = line("operatingSystem");
  const sizeOrWeight = line("sizeOrWeight");
  const condition = line("condition");
  const intendedUse = block("intendedUse");
  const notes = block("notes");
  const zip = line("zip");
  const preferredContact = line("preferredContact");

  requireShort("firstName", "First name", firstName);
  requireShort("lastName", "Last name", lastName);

  if (!email) fieldErrors.email = "Email address is required.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email))
    fieldErrors.email = "Enter a valid email address.";

  if (phone.length > LIMITS.phone)
    fieldErrors.phone = `Phone number must be ${LIMITS.phone} characters or fewer.`;

  if (!oneOf(DEVICE_TYPES, deviceType))
    fieldErrors.deviceType = "Choose Laptop or Desktop.";

  requireShort("manufacturer", "Manufacturer", manufacturer);
  optionalShort("model", "Model", model);
  optionalShort("approximateAge", "Approximate age", approximateAge);

  if (!oneOf(POWERS_ON, powersOn))
    fieldErrors.powersOn = "Choose whether the device powers on.";

  optionalShort("operatingSystem", "Operating system", operatingSystem);
  optionalShort("sizeOrWeight", "Approximate size or weight", sizeOrWeight);

  if (!oneOf(CONDITIONS, condition))
    fieldErrors.condition = "Choose the general condition.";

  if (!intendedUse)
    fieldErrors.intendedUse =
      "Tell us what you want to use the finished machine for.";
  else if (intendedUse.length > LIMITS.long)
    fieldErrors.intendedUse = `Please keep this under ${LIMITS.long} characters.`;

  if (notes.length > LIMITS.long)
    fieldErrors.notes = `Please keep notes under ${LIMITS.long} characters.`;

  if (!zip) fieldErrors.zip = "ZIP code is required for shipping context.";
  else if (!ZIP_RE.test(zip))
    fieldErrors.zip = "Enter a 5-digit US ZIP code (or ZIP+4).";

  if (!oneOf(PREFERRED_CONTACT, preferredContact))
    fieldErrors.preferredContact = "Choose how you prefer to be contacted.";
  else if (preferredContact === "Phone" && !phone)
    fieldErrors.phone = "A phone number is required when phone is the preferred contact method.";

  const ackRaw =
    typeof raw.acknowledgements === "object" &&
    raw.acknowledgements !== null &&
    !Array.isArray(raw.acknowledgements)
      ? (raw.acknowledgements as Record<string, unknown>)
      : {};
  const acknowledgements = {} as Record<AcknowledgementKey, true>;
  for (const ack of ACKNOWLEDGEMENTS) {
    if (ackRaw[ack.key] === true) acknowledgements[ack.key] = true;
    else
      fieldErrors[`ack-${ack.key}`] =
        "This confirmation is required before the request can be reviewed.";
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  return {
    ok: true,
    data: {
      firstName,
      lastName,
      email,
      phone,
      deviceType: deviceType as DeviceType,
      manufacturer,
      model,
      approximateAge,
      powersOn: powersOn as (typeof POWERS_ON)[number],
      operatingSystem,
      sizeOrWeight,
      condition: condition as (typeof CONDITIONS)[number],
      intendedUse,
      notes,
      zip,
      preferredContact: preferredContact as (typeof PREFERRED_CONTACT)[number],
      acknowledgements,
    },
  };
}

/**
 * Plain-text summary of a validated request. Used for the email fallback when
 * server delivery is not configured, and for the copyable block customers can
 * keep. Contains only what the customer typed — never a password field,
 * because the form has none.
 */
export function buildRequestSummaryText(
  data: DeviceRequestData,
  opts?: { requestNumber?: string; submittedAt?: string }
): string {
  const lines = [
    "Open Mirror — Build Machine device request",
    ...(opts?.requestNumber ? [`Request number: ${opts.requestNumber}`] : []),
    ...(opts?.submittedAt ? [`Submitted: ${opts.submittedAt}`] : []),
    "",
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "—"}`,
    `Preferred contact: ${data.preferredContact}`,
    `ZIP code: ${data.zip}`,
    "",
    `Device type: ${data.deviceType}`,
    `Manufacturer: ${data.manufacturer}`,
    `Model: ${data.model || "—"}`,
    `Approximate age: ${data.approximateAge || "—"}`,
    `Powers on: ${data.powersOn}`,
    `Operating system: ${data.operatingSystem || "—"}`,
    `Approximate size or weight: ${data.sizeOrWeight || "—"}`,
    `General condition: ${data.condition}`,
    "",
    `Intended use: ${data.intendedUse}`,
    `Notes: ${data.notes || "—"}`,
    "",
    `Terms version: ${TERMS_VERSION}`,
    "Acknowledgements confirmed:",
    ...ACKNOWLEDGEMENTS.map((a) => `  [x] ${a.label}`),
  ];
  return lines.join("\n");
}

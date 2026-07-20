// ─────────────────────────────────────────────────────────────────────────────
// Device request — server core.
//
// Everything the /api/device-request route does, with the outside world
// injected (clock, sender, rate store, config) so tests can exercise every
// path without sending a real email. The route file is a thin wrapper.
//
// Safety rules this module enforces:
//   - The request number and timestamps are generated HERE. Anything the
//     browser claims about them is ignored.
//   - Delivery failure is reported honestly — never a false success.
//   - Missing configuration disables submission with a structured error;
//     the exact missing variable names go to server logs only.
//   - Form contents are never logged.
// ─────────────────────────────────────────────────────────────────────────────

import { randomInt } from "node:crypto";

import {
  ACKNOWLEDGEMENTS,
  buildRequestSummaryText,
  LIMITS,
  SOURCE_PAGE,
  TERMS_VERSION,
  validateDeviceRequest,
  type DeviceRequestData,
} from "./deviceRequest.ts";

// Readable, non-sequential public identifier. No I/L/O/0/1 so a request
// number can be read over the phone without ambiguity.
const ID_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const REQUEST_NUMBER_RE = /^OM-DEV-[A-HJ-NP-Z2-9]{6}$/;

export function makeRequestNumber(rand: (max: number) => number = randomInt): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += ID_ALPHABET[rand(ID_ALPHABET.length)];
  return `OM-DEV-${suffix}`;
}

export type OutboundEmail = {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
};

export type Sender = (email: OutboundEmail) => Promise<{ ok: boolean }>;

export type DeviceRequestConfig = {
  /** Owner inbox for new-request notifications. */
  notifyEmail?: string;
  /** Verified sender identity, e.g. "Open Mirror <requests@openmirrorllc.com>". */
  fromEmail?: string;
  /** Whether the email provider credential is present (never the credential itself). */
  providerKeyPresent: boolean;
  /** Kill switch — DEVICE_REQUEST_FORM_ENABLED=0 turns the form off. */
  formEnabled: boolean;
};

export function readDeviceRequestConfig(
  env: Record<string, string | undefined> = process.env
): DeviceRequestConfig {
  return {
    notifyEmail: env.DEVICE_REQUEST_NOTIFY_EMAIL,
    fromEmail: env.DEVICE_REQUEST_FROM_EMAIL,
    providerKeyPresent: Boolean(env.RESEND_API_KEY),
    formEnabled: env.DEVICE_REQUEST_FORM_ENABLED !== "0",
  };
}

/** Names of the config pieces still missing — for server logs, never responses. */
export function missingConfig(config: DeviceRequestConfig): string[] {
  const missing: string[] = [];
  if (!config.providerKeyPresent) missing.push("RESEND_API_KEY");
  if (!config.notifyEmail) missing.push("DEVICE_REQUEST_NOTIFY_EMAIL");
  if (!config.fromEmail) missing.push("DEVICE_REQUEST_FROM_EMAIL");
  return missing;
}

export function deviceRequestConfigured(
  env: Record<string, string | undefined> = process.env
): boolean {
  const config = readDeviceRequestConfig(env);
  return config.formEnabled && missingConfig(config).length === 0;
}

// ── Rate limiting ────────────────────────────────────────────────────────────
// Best-effort in-memory limiter. On serverless this protects each warm
// instance; it is a speed bump for abuse, not an accounting system, and it
// deliberately stores nothing durable about visitors.

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX_PER_WINDOW = 5;
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

export class RateStore {
  private hits = new Map<string, number[]>();

  count(key: string, since: number): number {
    return (this.hits.get(key) ?? []).filter((t) => t >= since).length;
  }

  add(key: string, at: number): void {
    const kept = (this.hits.get(key) ?? []).filter(
      (t) => t >= at - RATE_WINDOW_MS
    );
    kept.push(at);
    this.hits.set(key, kept);
    // Opportunistic prune so the map cannot grow without bound.
    if (this.hits.size > 5000) {
      for (const [k, times] of this.hits) {
        if (times.every((t) => t < at - RATE_WINDOW_MS)) this.hits.delete(k);
      }
    }
  }
}

// ── Emails ───────────────────────────────────────────────────────────────────
// Plain text only. Text emails cannot execute or render anything a submitter
// typed, so sanitized field values are safe to include verbatim.

export type RequestMeta = {
  requestNumber: string;
  submittedAtIso: string;
};

export function buildOwnerEmailText(
  data: DeviceRequestData,
  meta: RequestMeta
): string {
  return [
    `New device request ${meta.requestNumber}`,
    `Submitted: ${meta.submittedAtIso}`,
    `Source page: ${SOURCE_PAGE}`,
    `Terms version: ${TERMS_VERSION}`,
    "",
    "── Customer ──",
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "—"}`,
    `Preferred contact: ${data.preferredContact}`,
    `ZIP code: ${data.zip}`,
    "",
    "── Device ──",
    `Type: ${data.deviceType}`,
    `Manufacturer: ${data.manufacturer}`,
    `Model: ${data.model || "—"}`,
    `Approximate age: ${data.approximateAge || "—"}`,
    `Powers on: ${data.powersOn}`,
    `Operating system: ${data.operatingSystem || "—"}`,
    `Approximate size or weight: ${data.sizeOrWeight || "—"}`,
    `General condition: ${data.condition}`,
    "",
    "── Intended use ──",
    data.intendedUse,
    "",
    "── Notes ──",
    data.notes || "—",
    "",
    "── Acknowledgements (all confirmed) ──",
    ...ACKNOWLEDGEMENTS.map((a) => `[x] ${a.label}`),
    "",
    "── Copy-ready Novo invoice block ──",
    `Customer name: ${data.firstName} ${data.lastName}`,
    `Customer email: ${data.email}`,
    `Request number: ${meta.requestNumber}`,
    `Service description: Build Machine conversion — ${data.deviceType} (${[
      data.manufacturer,
      data.model,
    ]
      .filter(Boolean)
      .join(" ")}) — reference ${meta.requestNumber}`,
    "Approved price: [set after review]",
    "Shipping: [set per approved policy]",
    "Notes: [ ]",
    "",
    "Next steps: review, then reply Accepted / More information needed / Declined.",
    "See DEVICE_REQUEST_OPERATIONS.md in the open-mirror repo.",
  ].join("\n");
}

export function buildCustomerEmailText(
  data: DeviceRequestData,
  meta: RequestMeta
): string {
  return [
    `Open Mirror received your device request ${meta.requestNumber}.`,
    "",
    "PLEASE DO NOT SHIP YOUR DEVICE YET.",
    "",
    "What happens next:",
    "1. Open Mirror reviews your request.",
    "2. You hear back: accepted, more information needed, or declined.",
    "3. If accepted, you receive a secure Novo invoice by email. No payment is taken on the Open Mirror website.",
    "4. After payment is confirmed, you receive shipping instructions.",
    "5. Ship the approved device with your request number.",
    "",
    "Your submitted summary:",
    "",
    buildRequestSummaryText(data, {
      requestNumber: meta.requestNumber,
      submittedAt: meta.submittedAtIso,
    }),
    "",
    "Never send passwords, PINs, encryption keys, or financial information by email or with a device.",
    "",
    "Questions about this request? Reply to this email and include your request number.",
    "— Open Mirror LLC",
  ].join("\n");
}

// ── The request pipeline ─────────────────────────────────────────────────────

export type ProcessContext = {
  now: () => Date;
  ip: string;
  config: DeviceRequestConfig;
  sender: Sender;
  store: RateStore;
};

export type ProcessResult = {
  status: number;
  body:
    | {
        ok: true;
        requestNumber: string;
        submittedAt: string;
        termsVersion: string;
        customerEmailSent: boolean;
      }
    | {
        ok: false;
        error: {
          code:
            | "unconfigured"
            | "too_large"
            | "bad_request"
            | "validation"
            | "rate_limited"
            | "duplicate"
            | "delivery_failed";
          message: string;
          fieldErrors?: Record<string, string>;
        };
      };
};

const fail = (
  status: number,
  code: Extract<ProcessResult["body"], { ok: false }>["error"]["code"],
  message: string,
  fieldErrors?: Record<string, string>
): ProcessResult => ({
  status,
  body: { ok: false, error: { code, message, ...(fieldErrors ? { fieldErrors } : {}) } },
});

export async function processDeviceRequest(
  raw: string,
  ctx: ProcessContext
): Promise<ProcessResult> {
  const { config } = ctx;

  if (!config.formEnabled || missingConfig(config).length > 0) {
    // The route logs the missing variable names; the public error stays generic.
    return fail(
      503,
      "unconfigured",
      "Online submission is not available right now. Your answers were not lost — please email them instead."
    );
  }

  if (raw.length > LIMITS.maxBodyBytes) {
    return fail(413, "too_large", "The request is too large.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fail(400, "bad_request", "The request could not be read.");
  }
  const body =
    typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};

  const now = ctx.now();
  const nowMs = now.getTime();

  // Honeypot: humans never see the "website" field. A filled value means a
  // bot — acknowledge and discard so the bot learns nothing. No email is
  // sent and nothing is recorded.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return {
      status: 200,
      body: {
        ok: true,
        requestNumber: makeRequestNumber(),
        submittedAt: now.toISOString(),
        termsVersion: TERMS_VERSION,
        customerEmailSent: false,
      },
    };
  }

  const ipKey = `ip:${ctx.ip}`;
  if (ctx.store.count(ipKey, nowMs - RATE_WINDOW_MS) >= RATE_MAX_PER_WINDOW) {
    return fail(
      429,
      "rate_limited",
      "Too many requests from this connection. Please wait a while and try again."
    );
  }

  const validated = validateDeviceRequest(body);
  if (!validated.ok) {
    return fail(
      422,
      "validation",
      "Some answers need attention.",
      validated.fieldErrors
    );
  }
  const data = validated.data;

  const dupKey = `dup:${data.email.toLowerCase()}:${data.deviceType}`;
  if (ctx.store.count(dupKey, nowMs - DUPLICATE_WINDOW_MS) > 0) {
    return fail(
      409,
      "duplicate",
      "A request with this email was just submitted. If that was you, it is already in — no need to resend."
    );
  }

  ctx.store.add(ipKey, nowMs);
  ctx.store.add(dupKey, nowMs);

  // Server-generated identity — any client-supplied number or timestamp in
  // the body was never read.
  const meta: RequestMeta = {
    requestNumber: makeRequestNumber(),
    submittedAtIso: now.toISOString(),
  };

  const ownerSend = await ctx.sender({
    from: config.fromEmail!,
    to: config.notifyEmail!,
    replyTo: data.email,
    subject: `[Device request] ${meta.requestNumber} — ${data.deviceType} — ${data.manufacturer}${
      data.model ? ` ${data.model}` : ""
    }`,
    text: buildOwnerEmailText(data, meta),
  });

  if (!ownerSend.ok) {
    return fail(
      502,
      "delivery_failed",
      "The request could not be delivered. Your answers were not lost — please try again or email them instead."
    );
  }

  // Customer confirmation is best-effort: the request already reached the
  // owner, so a bounce here must not turn success into failure.
  const customerSend = await ctx
    .sender({
      from: config.fromEmail!,
      to: data.email,
      subject: `Open Mirror request ${meta.requestNumber} received — do not ship yet`,
      text: buildCustomerEmailText(data, meta),
    })
    .catch(() => ({ ok: false }));

  return {
    status: 200,
    body: {
      ok: true,
      requestNumber: meta.requestNumber,
      submittedAt: meta.submittedAtIso,
      termsVersion: TERMS_VERSION,
      customerEmailSent: customerSend.ok,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Partnership inquiry — server core.
//
// Everything /api/partnership does, with the outside world injected (clock,
// sender, rate store, config) so tests can run every path without sending a
// real email. The route file is a thin wrapper.
//
// How verification works — no database, nothing stored about visitors:
//   1. "start": the server validates the answers, emails a six-digit code to
//      the address given, and returns a signed token. The token carries the
//      email, an expiry, a nonce, and an HMAC of the code — never the code.
//   2. "verify": the browser sends the answers, the token, and the code the
//      person typed. Only when the signature, expiry, email, and code all
//      match does the inquiry go to the owner's inbox.
//   The owner never receives an inquiry from an address that was not proven
//   to belong to the sender. There is no "skip" path and no test bypass.
//
// Safety rules this module enforces:
//   - The owner's inbox address lives in server config only. It is never in a
//     response, and never in page source.
//   - Delivery failure is reported honestly — never a false success.
//   - Missing configuration disables online sending with a structured error;
//     the exact missing variable names go to server logs only.
//   - Form contents and codes are never logged.
// ─────────────────────────────────────────────────────────────────────────────

import { createHmac, hkdfSync, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

import { RateStore, type OutboundEmail, type Sender } from "./deviceRequestServer.ts";
import {
  buildInquirySummaryText,
  PARTNERSHIP_LIMITS,
  PARTNERSHIP_PATH,
  validatePartnershipInquiry,
  type PartnershipData,
  type PartnershipField,
} from "./partnership.ts";
import { STUDIO } from "./products.ts";

export { RateStore };
export type { OutboundEmail, Sender };

// ── Config ───────────────────────────────────────────────────────────────────

export type PartnershipConfig = {
  /** Verified sender identity, e.g. "Open Mirror <hello@openmirrorllc.com>". */
  fromEmail?: string;
  /** Owner inbox for inquiries. Server-only; defaults to the public contact address. */
  notifyEmail: string;
  /** Whether the email provider credential is present (never the credential itself). */
  providerKeyPresent: boolean;
  /** HMAC key for codes, tokens, and form stamps — derived, never exposed. */
  tokenKey: Buffer | null;
  /** Kill switch — PARTNERSHIP_FORM_ENABLED=0 turns online sending off. */
  formEnabled: boolean;
};

// The signing key: PARTNERSHIP_TOKEN_SECRET when set, otherwise derived from
// the email provider key with HKDF. Derivation is one-way and domain-separated,
// so tokens reveal nothing about the provider key, and the form needs no extra
// secret to be configured. Rotating either secret only expires codes in flight.
function deriveKey(secret: string): Buffer {
  return Buffer.from(hkdfSync("sha256", secret, "open-mirror", "partnership-verification-v1", 32));
}

export function readPartnershipConfig(
  env: Record<string, string | undefined> = process.env
): PartnershipConfig {
  const providerKey = env.RESEND_API_KEY?.trim();
  const secret = env.PARTNERSHIP_TOKEN_SECRET?.trim() || providerKey;
  return {
    fromEmail: env.PARTNERSHIP_FROM_EMAIL?.trim() || env.DEVICE_REQUEST_FROM_EMAIL?.trim() || undefined,
    notifyEmail:
      env.PARTNERSHIP_NOTIFY_EMAIL?.trim() || env.DEVICE_REQUEST_NOTIFY_EMAIL?.trim() || STUDIO.email,
    providerKeyPresent: Boolean(providerKey),
    tokenKey: secret ? deriveKey(secret) : null,
    formEnabled: env.PARTNERSHIP_FORM_ENABLED !== "0",
  };
}

/** Names of the config pieces still missing — for server logs, never responses. */
export function missingPartnershipConfig(config: PartnershipConfig): string[] {
  const missing: string[] = [];
  if (!config.providerKeyPresent) missing.push("RESEND_API_KEY");
  if (!config.fromEmail) missing.push("PARTNERSHIP_FROM_EMAIL");
  return missing;
}

export function partnershipConfigured(
  env: Record<string, string | undefined> = process.env
): boolean {
  const config = readPartnershipConfig(env);
  return config.formEnabled && missingPartnershipConfig(config).length === 0;
}

// ── Limits ───────────────────────────────────────────────────────────────────
// Best-effort and in-memory, like the device request form: on serverless they
// protect each warm instance. The real gate is the emailed code — a bot that
// cannot read the inbox cannot send an inquiry.

const HOUR = 60 * 60 * 1000;
export const CODE_TTL_MS = 15 * 60 * 1000;
export const RESEND_COOLDOWN_MS = 30 * 1000;
export const MIN_FILL_MS = 6 * 1000;
const STAMP_MAX_AGE_MS = 7 * 24 * HOUR;
const MAX_STARTS_PER_IP = 6;
const MAX_CODES_PER_EMAIL = 3;
const MAX_VERIFY_PER_IP = 20;
export const MAX_ATTEMPTS_PER_CODE = 5;
const MAX_SENT_PER_IP = 3;

// ── Signing helpers ──────────────────────────────────────────────────────────

const b64 = (buf: Buffer | string) => Buffer.from(buf).toString("base64url");
const mac = (key: Buffer, label: string, value: string) =>
  createHmac("sha256", key).update(`${label}\n${value}`).digest();

function sameBytes(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * The form stamp: a signed "this page was opened at" time. Fetched when the
 * form loads; a code request made seconds later is not a person.
 */
export function makeFormStamp(key: Buffer, nowMs: number): string {
  const ts = String(nowMs);
  return `${ts}.${b64(mac(key, "stamp", ts))}`;
}

export function readFormStamp(key: Buffer, stamp: unknown): number | null {
  if (typeof stamp !== "string" || stamp.length > 80) return null;
  const [ts, sig] = stamp.split(".");
  if (!ts || !sig || !/^\d{10,16}$/.test(ts)) return null;
  if (!sameBytes(Buffer.from(sig, "base64url"), mac(key, "stamp", ts))) return null;
  return Number(ts);
}

type TokenPayload = { v: 1; e: string; n: string; x: number; c: string };

const codeMac = (key: Buffer, nonce: string, code: string) => b64(mac(key, "code", `${nonce}:${code}`));

export function makeVerificationToken(
  key: Buffer,
  email: string,
  code: string,
  nowMs: number,
  nonce: string = b64(randomBytes(12))
): string {
  const payload: TokenPayload = {
    v: 1,
    e: email.toLowerCase(),
    n: nonce,
    x: nowMs + CODE_TTL_MS,
    c: codeMac(key, nonce, code),
  };
  const body = b64(JSON.stringify(payload));
  return `${body}.${b64(mac(key, "token", body))}`;
}

export function readVerificationToken(key: Buffer, token: unknown): TokenPayload | null {
  if (typeof token !== "string" || token.length > 600) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  if (!sameBytes(Buffer.from(sig, "base64url"), mac(key, "token", body))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as TokenPayload;
    if (p.v !== 1 || typeof p.e !== "string" || typeof p.n !== "string" || typeof p.x !== "number" || typeof p.c !== "string")
      return null;
    return p;
  } catch {
    return null;
  }
}

export function makeCode(rand: (max: number) => number = randomInt): string {
  return String(rand(1_000_000)).padStart(PARTNERSHIP_LIMITS.codeLength, "0");
}

// Readable, non-sequential reference. No I/L/O/0/1 so it reads cleanly aloud.
const ID_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const REFERENCE_RE = /^OM-PTR-[A-HJ-NP-Z2-9]{6}$/;

export function makeReference(rand: (max: number) => number = randomInt): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += ID_ALPHABET[rand(ID_ALPHABET.length)];
  return `OM-PTR-${suffix}`;
}

// ── Emails ───────────────────────────────────────────────────────────────────
// Plain text only, so nothing a visitor typed can render or execute.

export function buildCodeEmailText(code: string): string {
  return [
    "Your Open Mirror confirmation code is:",
    "",
    code,
    "",
    "Enter it on the partnership page to send your note. It works for 15 minutes.",
    "",
    "If you didn't ask for this, you can ignore this email. Nothing is sent without the code.",
    "",
    "— Open Mirror LLC",
    STUDIO.url,
  ].join("\n");
}

export function buildOwnerInquiryText(
  data: PartnershipData,
  meta: { reference: string; receivedAtIso: string }
): string {
  return [
    `New partnership inquiry ${meta.reference}`,
    `Received: ${meta.receivedAtIso}`,
    "Email verified: yes — the sender entered the one-time code sent to this address.",
    `Source page: ${STUDIO.url}${PARTNERSHIP_PATH}`,
    "",
    buildInquirySummaryText(data),
    "",
    "Reply to this email to answer them directly.",
  ].join("\n");
}

// ── The pipeline ─────────────────────────────────────────────────────────────

export type PartnershipContext = {
  now: () => Date;
  ip: string;
  config: PartnershipConfig;
  sender: Sender;
  store: RateStore;
};

export type PartnershipErrorCode =
  | "unconfigured"
  | "too_large"
  | "bad_request"
  | "validation"
  | "stale_page"
  | "too_fast"
  | "rate_limited"
  | "cooldown"
  | "delivery_failed"
  | "code_expired"
  | "email_changed"
  | "wrong_code"
  | "too_many_attempts"
  | "already_sent";

export type PartnershipResult = {
  status: number;
  body:
    | { ok: true; stage: "code_sent"; token: string; sentTo: string; expiresAt: string }
    | { ok: true; stage: "sent"; reference: string; receivedAt: string }
    | {
        ok: false;
        error: {
          code: PartnershipErrorCode;
          message: string;
          fieldErrors?: Partial<Record<PartnershipField | "form", string>>;
          attemptsLeft?: number;
        };
      };
};

const fail = (
  status: number,
  code: PartnershipErrorCode,
  message: string,
  extra: { fieldErrors?: Partial<Record<PartnershipField | "form", string>>; attemptsLeft?: number } = {}
): PartnershipResult => ({ status, body: { ok: false, error: { code, message, ...extra } } });

const UNCONFIGURED_MESSAGE =
  "Online sending isn't switched on yet. Your answers are still here — you can send them from your own email instead.";

function parseBody(raw: string): Record<string, unknown> | PartnershipResult {
  if (raw.length > PARTNERSHIP_LIMITS.maxBodyBytes) return fail(413, "too_large", "That's more than this form can take.");
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed))
      return parsed as Record<string, unknown>;
  } catch {
    // fall through
  }
  return fail(400, "bad_request", "The request could not be read.");
}

const isResult = (x: unknown): x is PartnershipResult =>
  typeof x === "object" && x !== null && "status" in x && "body" in x;

/** A new form stamp for GET /api/partnership, or null when sending is off. */
export function issueFormStamp(ctx: Pick<PartnershipContext, "now" | "config">): string | null {
  const { config } = ctx;
  if (!config.formEnabled || !config.tokenKey || missingPartnershipConfig(config).length > 0) return null;
  return makeFormStamp(config.tokenKey, ctx.now().getTime());
}

/** Step one: validate the answers and email a code to the address given. */
export async function startVerification(raw: string, ctx: PartnershipContext): Promise<PartnershipResult> {
  const { config } = ctx;
  if (!config.formEnabled || !config.tokenKey || missingPartnershipConfig(config).length > 0)
    return fail(503, "unconfigured", UNCONFIGURED_MESSAGE);
  const key = config.tokenKey;

  const body = parseBody(raw);
  if (isResult(body)) return body;

  const now = ctx.now();
  const nowMs = now.getTime();

  // Honeypot: answer like a success so a bot learns nothing. No email goes
  // anywhere and nothing is recorded.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return {
      status: 200,
      body: {
        ok: true,
        stage: "code_sent",
        token: makeVerificationToken(key, "discarded@invalid", makeCode(), nowMs),
        sentTo: typeof body.email === "string" ? body.email.slice(0, 254) : "",
        expiresAt: new Date(nowMs + CODE_TTL_MS).toISOString(),
      },
    };
  }
  const stampedAt = readFormStamp(key, body.stamp);
  if (stampedAt === null || nowMs - stampedAt > STAMP_MAX_AGE_MS || stampedAt > nowMs + 60_000) {
    return fail(400, "stale_page", "This page has been open a long while. Please try again in a few seconds — your answers are kept.");
  }
  // Three steps cannot be finished in a few seconds. Honest, not silent: the
  // only person who sees this has just refreshed an old page.
  if (nowMs - stampedAt < MIN_FILL_MS) {
    return fail(429, "too_fast", "One moment — please try again in a few seconds.");
  }

  const ipKey = `pstart:ip:${ctx.ip}`;
  if (ctx.store.count(ipKey, nowMs - HOUR) >= MAX_STARTS_PER_IP)
    return fail(429, "rate_limited", "Too many tries from this connection. Please wait a while and try again.");

  const validated = validatePartnershipInquiry(body);
  if (!validated.ok)
    return fail(422, "validation", "A few answers need another look.", { fieldErrors: validated.fieldErrors });
  const data = validated.data;

  const emailKey = `pstart:em:${data.email.toLowerCase()}`;
  if (ctx.store.count(emailKey, nowMs - RESEND_COOLDOWN_MS) > 0)
    return fail(429, "cooldown", "A code was just sent. Please give it a few seconds before asking for another.");
  if (ctx.store.count(emailKey, nowMs - HOUR) >= MAX_CODES_PER_EMAIL)
    return fail(429, "rate_limited", "Several codes have gone to this address already. Please wait a while and try again.");

  ctx.store.add(ipKey, nowMs);
  ctx.store.add(emailKey, nowMs);

  const code = makeCode();
  const sent = await ctx
    .sender({
      from: config.fromEmail!,
      to: data.email,
      subject: `Your Open Mirror code: ${code}`,
      text: buildCodeEmailText(code),
    })
    .catch(() => ({ ok: false }));
  if (!sent.ok)
    return fail(502, "delivery_failed", "A code couldn't be sent to that address. Please check it and try again.");

  return {
    status: 200,
    body: {
      ok: true,
      stage: "code_sent",
      token: makeVerificationToken(key, data.email, code, nowMs),
      sentTo: data.email,
      expiresAt: new Date(nowMs + CODE_TTL_MS).toISOString(),
    },
  };
}

/** Step two: check the code, then — and only then — email the owner. */
export async function confirmAndSend(raw: string, ctx: PartnershipContext): Promise<PartnershipResult> {
  const { config } = ctx;
  if (!config.formEnabled || !config.tokenKey || missingPartnershipConfig(config).length > 0)
    return fail(503, "unconfigured", UNCONFIGURED_MESSAGE);
  const key = config.tokenKey;

  const body = parseBody(raw);
  if (isResult(body)) return body;

  const now = ctx.now();
  const nowMs = now.getTime();

  const ipKey = `pverify:ip:${ctx.ip}`;
  if (ctx.store.count(ipKey, nowMs - HOUR) >= MAX_VERIFY_PER_IP)
    return fail(429, "rate_limited", "Too many tries from this connection. Please wait a while and try again.");
  ctx.store.add(ipKey, nowMs);

  const validated = validatePartnershipInquiry(body);
  if (!validated.ok)
    return fail(422, "validation", "A few answers need another look.", { fieldErrors: validated.fieldErrors });
  const data = validated.data;

  const token = readVerificationToken(key, body.token);
  if (!token || token.x <= nowMs)
    return fail(410, "code_expired", "That code has expired. Please ask for a new one.");
  if (token.e !== data.email.toLowerCase())
    return fail(409, "email_changed", "The email changed after the code was sent. Please ask for a new code.");

  if (ctx.store.count(`pused:${token.n}`, nowMs - HOUR) > 0)
    return fail(409, "already_sent", "This note has already been sent. There's no need to send it again.");

  const attemptsKey = `pattempt:${token.n}`;
  const attempts = ctx.store.count(attemptsKey, nowMs - HOUR);
  if (attempts >= MAX_ATTEMPTS_PER_CODE)
    return fail(429, "too_many_attempts", "That code has been tried too many times. Please ask for a new one.");

  const code = typeof body.code === "string" ? body.code.replace(/\D/g, "") : "";
  const matches =
    code.length === PARTNERSHIP_LIMITS.codeLength &&
    sameBytes(Buffer.from(codeMac(key, token.n, code)), Buffer.from(token.c));
  if (!matches) {
    ctx.store.add(attemptsKey, nowMs);
    const attemptsLeft = MAX_ATTEMPTS_PER_CODE - attempts - 1;
    return fail(
      422,
      "wrong_code",
      attemptsLeft > 0 ? "That code doesn't match. Please check the email and try again." : "That code doesn't match, and it can't be tried again. Please ask for a new one.",
      { attemptsLeft }
    );
  }

  const sentKey = `psent:ip:${ctx.ip}`;
  if (ctx.store.count(sentKey, nowMs - HOUR) >= MAX_SENT_PER_IP)
    return fail(429, "rate_limited", "Several notes have been sent from this connection. Please wait a while and try again.");

  const meta = { reference: makeReference(), receivedAtIso: now.toISOString() };
  const delivered = await ctx
    .sender({
      from: config.fromEmail!,
      to: config.notifyEmail,
      replyTo: data.email,
      subject: `[Partnership] ${meta.reference} — ${data.name}, ${data.firm}`,
      text: buildOwnerInquiryText(data, meta),
    })
    .catch(() => ({ ok: false }));

  if (!delivered.ok)
    return fail(502, "delivery_failed", "Your note couldn't be delivered just now. Your answers are still here — please try again in a moment.");

  // Spent only after delivery, so a provider hiccup never burns a good code.
  ctx.store.add(`pused:${token.n}`, nowMs);
  ctx.store.add(sentKey, nowMs);

  return { status: 200, body: { ok: true, stage: "sent", reference: meta.reference, receivedAt: meta.receivedAtIso } };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/device-request — Build Machine intake endpoint.
//
// Thin wrapper: env config + Resend sender + the shared in-memory rate store,
// with all real logic (validation, honeypot, rate limits, request numbers,
// email building) in src/lib/deviceRequestServer.ts where tests exercise it.
//
// This endpoint never handles payment, payment credentials, or passwords.
// Approved requests are invoiced manually through Novo — outside this site.
// ─────────────────────────────────────────────────────────────────────────────

import { Resend } from "resend";

import { LIMITS } from "../../../lib/deviceRequest";
import {
  missingConfig,
  processDeviceRequest,
  RateStore,
  readDeviceRequestConfig,
  type OutboundEmail,
} from "../../../lib/deviceRequestServer";

export const runtime = "nodejs";

const store = new RateStore();

let resend: Resend | null = null;

async function sendWithResend(email: OutboundEmail): Promise<{ ok: boolean }> {
  try {
    resend ??= new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: email.from,
      to: email.to,
      ...(email.replyTo ? { replyTo: email.replyTo } : {}),
      subject: email.subject,
      text: email.text,
    });
    if (error) {
      // Provider error names only — never form contents.
      console.error(`device-request: delivery error (${error.name})`);
      return { ok: false };
    }
    return { ok: true };
  } catch {
    console.error("device-request: delivery threw");
    return { ok: false };
  }
}

export async function POST(req: Request): Promise<Response> {
  const config = readDeviceRequestConfig();
  const missing = missingConfig(config);
  if (!config.formEnabled || missing.length > 0) {
    if (missing.length > 0) {
      console.error(
        `device-request: submission disabled — missing env: ${missing.join(", ")}`
      );
    }
  }

  const declaredLength = Number(req.headers.get("content-length") ?? "0");
  const raw =
    declaredLength > LIMITS.maxBodyBytes
      ? "x".repeat(LIMITS.maxBodyBytes + 1) // triggers the structured too-large error without reading the body
      : await req.text();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const result = await processDeviceRequest(raw, {
    now: () => new Date(),
    ip,
    config,
    sender: sendWithResend,
    store,
  });

  return Response.json(result.body, { status: result.status });
}

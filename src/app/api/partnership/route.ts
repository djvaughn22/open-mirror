// ─────────────────────────────────────────────────────────────────────────────
// /api/partnership — the partnership intake endpoint.
//
//   GET                      → { enabled, stamp } — a signed page-opened time
//   POST { action: "start" }  → validates, emails a one-time code to the sender
//   POST { action: "verify" } → checks the code, then emails the owner
//
// Thin wrapper: env config + Resend sender + one in-memory rate store, with
// all real logic in src/lib/partnershipServer.ts where tests exercise it.
// Never logs form contents, codes, or addresses.
// ─────────────────────────────────────────────────────────────────────────────

import { Resend } from "resend";

import { PARTNERSHIP_LIMITS } from "../../../lib/partnership";
import {
  confirmAndSend,
  issueFormStamp,
  missingPartnershipConfig,
  RateStore,
  readPartnershipConfig,
  startVerification,
  type OutboundEmail,
} from "../../../lib/partnershipServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
      console.error(`partnership: delivery error (${error.name})`);
      return { ok: false };
    }
    return { ok: true };
  } catch {
    console.error("partnership: delivery threw");
    return { ok: false };
  }
}

function logMissing(config: ReturnType<typeof readPartnershipConfig>) {
  const missing = missingPartnershipConfig(config);
  if (missing.length > 0) {
    console.error(`partnership: online sending disabled — missing env: ${missing.join(", ")}`);
  }
}

const noStore = { "Cache-Control": "no-store" };

export async function GET(): Promise<Response> {
  const config = readPartnershipConfig();
  const stamp = issueFormStamp({ now: () => new Date(), config });
  return Response.json({ enabled: Boolean(stamp), stamp }, { headers: noStore });
}

export async function POST(req: Request): Promise<Response> {
  const config = readPartnershipConfig();
  logMissing(config);

  const declaredLength = Number(req.headers.get("content-length") ?? "0");
  const raw =
    declaredLength > PARTNERSHIP_LIMITS.maxBodyBytes
      ? "x".repeat(PARTNERSHIP_LIMITS.maxBodyBytes + 1) // structured too-large error without reading the body
      : await req.text();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ctx = { now: () => new Date(), ip, config, sender: sendWithResend, store };

  let action: unknown;
  try {
    action = (JSON.parse(raw) as { action?: unknown })?.action;
  } catch {
    action = undefined;
  }

  const result =
    action === "verify" ? await confirmAndSend(raw, ctx) : await startVerification(raw, ctx);
  return Response.json(result.body, { status: result.status, headers: noStore });
}

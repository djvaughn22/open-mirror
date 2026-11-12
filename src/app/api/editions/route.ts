// POST /api/editions — request a customer edition. Nothing is approved here.
// Answers { ok: true } ONLY after the request is saved or emailed to the owner.
// GET returns { stamp } (page-opened time) for the anti-bot timing check.
// Never logs what people typed.

import { NextRequest, NextResponse } from "next/server";
import { checkEdition, looksAutomated, type EditionInput } from "../../../lib/editions";
import { deliver, deliveryConfigured } from "../../../lib/editionsServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hits = new Map<string, number[]>();
function allow(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}

const FALLBACK = "Email ask@openmirrorllc.com instead and we will reply there.";

export async function GET() {
  const c = deliveryConfigured();
  return NextResponse.json({ stamp: Date.now(), online: c.db || c.email }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(`any:${ip}`, 20, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "That is several requests at once. Try again in a few minutes." }, { status: 429 });
  }
  let body: EditionInput;
  try {
    body = (await req.json()) as EditionInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  if (looksAutomated(body, Date.now())) {
    return NextResponse.json({ ok: false, error: `That was sent too quickly. Wait a moment and try again. ${FALLBACK}` }, { status: 400 });
  }
  const check = checkEdition(body);
  if (!check.ok) {
    return NextResponse.json({ ok: false, error: "A few things need a look.", fields: check.fields }, { status: 422 });
  }
  // Only valid requests count toward the tighter limit, so fixing typos never locks anyone out.
  if (!allow(`send:${ip}`, 3, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "That is several requests at once. Try again in a few minutes." }, { status: 429 });
  }
  const result = await deliver(check.value);
  if (!result.accepted) {
    return NextResponse.json({ ok: false, error: `Requests cannot be received online right now. ${FALLBACK}` }, { status: 503 });
  }
  return NextResponse.json({ ok: true, ref: result.ref });
}

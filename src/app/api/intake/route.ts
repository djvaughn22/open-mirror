import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SERVICE_EMAIL } from "../../../lib/services";

// Delivers the /contact intake to the studio address via Resend.
//
// Honesty contract with the form:
//   - 200 { ok: true }  → the message was actually sent (or was spam we
//     silently dropped). Only this makes the form show "Sent."
//   - 503               → email delivery isn't configured on the server.
//     The form falls back to the visitor's own email app, so the inquiry
//     is never lost and the user is never shown a fake success.
//   - 429               → too many submissions from one client; the form
//     also falls back to the email app.
//   - 400 / 502         → bad input or a send failure; form falls back too.
//
// The one thing this route must never do is report success it didn't earn.

const FIELD_LABELS: Record<string, string> = {
  creating: "What are you trying to create?",
  done: "What have you already done?",
  stuck: "Where are you stuck?",
  help: "What kind of help would be useful?",
};

// Best-effort in-memory rate limit. Serverless instances don't share memory,
// so this throttles per warm instance rather than globally — enough to blunt
// a naive flood without a external store. Tightens nothing legitimate: a real
// person sending a handful of messages stays well under the limit.
const RATE_LIMIT = 5; // submissions per window per client (per instance)
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const hits = new Map<string, number[]>();

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : "").trim() || "unknown";
}

function rateLimited(req: Request): boolean {
  const keyId = clientKey(req);
  const now = Date.now();
  const recent = (hits.get(keyId) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(keyId, recent);
  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > RATE_LIMIT;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const field = (key: string, max: number) =>
    typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "";

  // Honeypot: a hidden field real users never see or fill. If it has a value,
  // it's a bot — accept quietly (so the bot moves on) but send nothing.
  if (field("company", 200)) {
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(req)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const name = field("name", 200);
  const email = field("email", 200);
  const creating = field("creating", 5000);

  if (!name || !creating || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Email sending not configured" }, { status: 503 });
  }

  const text = [
    `Name:\n${name}`,
    `Email:\n${email}`,
    `${FIELD_LABELS.creating}\n${creating}`,
    ...Object.entries(FIELD_LABELS)
      .filter(([k]) => k !== "creating")
      .map(([k, label]) => {
        const v = field(k, 5000);
        return v ? `${label}\n${v}` : "";
      })
      .filter(Boolean),
  ].join("\n\n");

  // The from address must be on a domain verified in Resend; override via env.
  const from = process.env.INTAKE_FROM_EMAIL ?? `Open Mirror LLC <${SERVICE_EMAIL}>`;
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: [SERVICE_EMAIL],
    replyTo: email,
    subject: `Open Mirror — ${name}`,
    text,
  });

  if (error) {
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SERVICE_EMAIL } from "../../../lib/services";

// Sends the /talk-with-the-owner intake to the studio address via Resend.
// Returns 503 when RESEND_API_KEY isn't configured — the form then falls
// back to opening the visitor's own email app, so nothing is lost.

export async function POST(req: Request) {
  let body: { name?: string; email?: string; creating?: string; link?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 200);
  const email = (body.email ?? "").trim().slice(0, 200);
  const creating = (body.creating ?? "").trim().slice(0, 5000);
  const link = (body.link ?? "").trim().slice(0, 500);

  if (!name || !creating || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Email sending not configured" }, { status: 503 });
  }

  // The from address must be on a domain verified in Resend; override via env.
  const from = process.env.INTAKE_FROM_EMAIL ?? `Open Mirror LLC <${SERVICE_EMAIL}>`;
  const text = [
    `Name:\n${name}`,
    `Email:\n${email}`,
    `What are you trying to create or improve?\n${creating}`,
    link ? `Link:\n${link}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: [SERVICE_EMAIL],
    replyTo: email,
    subject: `Talk with the Owner — ${name}`,
    text,
  });

  if (error) {
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

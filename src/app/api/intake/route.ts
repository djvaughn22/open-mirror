import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SERVICE_EMAIL } from "../../../lib/services";

// Sends the /talk-with-the-owner intake to the studio address via Resend.
// Returns 503 when RESEND_API_KEY isn't configured — the form then falls
// back to opening the visitor's own email app, so nothing is lost.

const FIELD_LABELS: Record<string, string> = {
  building: "What are you building?",
  done: "What have you already done?",
  stuck: "Where are you stuck?",
  link: "Link",
  helpType: "Type of help",
  budget: "Budget range",
  notes: "Anything else",
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const field = (key: string, max: number) =>
    typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "";

  const name = field("name", 200);
  const email = field("email", 200);
  const building = field("building", 5000);

  if (!name || !building || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Email sending not configured" }, { status: 503 });
  }

  const text = [
    `Name:\n${name}`,
    `Email:\n${email}`,
    `${FIELD_LABELS.building}\n${building}`,
    ...Object.entries(FIELD_LABELS)
      .filter(([k]) => k !== "building")
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
    subject: `Talk with the Owner — ${name}`,
    text,
  });

  if (error) {
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

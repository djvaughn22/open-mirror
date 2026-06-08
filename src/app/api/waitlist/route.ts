import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  console.log("OPEN_MIRROR_EMAIL_SIGNUP", {
    email,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

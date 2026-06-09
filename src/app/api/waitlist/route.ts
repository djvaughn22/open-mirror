import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const createdAt = new Date().toISOString();

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    console.log("OPEN_MIRROR_EMAIL_SIGNUP", {
      email,
      createdAt,
      ip,
    });

    if (!process.env.RESEND_API_KEY) {
      console.warn("Missing RESEND_API_KEY; signup logged only.", {
        email,
        createdAt,
      });

      return NextResponse.json({
        ok: true,
        emailSent: false,
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "Open Mirror <onboarding@resend.dev>",
      to: ["ask@openmirrorllc.com"],
      subject: "New Open Mirror email signup",
      text: `New Open Mirror signup:\n\nEmail: ${email}\nTime: ${createdAt}\nIP: ${ip}`,
    });

    if (error) {
      console.error("RESEND_EMAIL_ERROR", error);
      return NextResponse.json(
        { error: "Could not send signup email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("WAITLIST_ERROR", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
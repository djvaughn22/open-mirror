import { NextResponse } from "next/server";

function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return realIp || "unknown";
}

export async function POST(request: Request) {
  const createdAt = new Date().toISOString();
  const ip = getRequestIp(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  const referer = request.headers.get("referer") || "direct";

  console.info("CrossHeartPray site entry", {
    createdAt,
    ip,
    userAgent,
    referer,
  });

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";

export async function GET() {
  const appKey = process.env.YVP_APP_KEY;

  if (!appKey) {
    return NextResponse.json(
      { error: "Missing YVP_APP_KEY environment variable." },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.youversion.com/v1/languages", {
    headers: {
      "X-YVP-App-Key": appKey,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "YouVersion request failed.",
        status: response.status,
        details: data,
      },
      { status: response.status }
    );
  }

  return NextResponse.json({
    ok: true,
    total_size: data.total_size,
    sample: data.data?.slice?.(0, 5) ?? [],
  });
}

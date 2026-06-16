import { NextResponse } from "next/server";

type GoogleTranslateResponse = {
  data?: {
    translations?: Array<{
      translatedText?: string;
    }>;
  };
  error?: {
    message?: string;
  };
};

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { status: "error", message: "Google Translate API key is not configured." },
      { status: 500 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid JSON request." },
      { status: 400 },
    );
  }

  const input = body as { text?: unknown };
  const text = typeof input.text === "string" ? input.text.trim() : "";

  if (!text) {
    return NextResponse.json(
      { status: "error", message: "Enter a word to translate." },
      { status: 400 },
    );
  }

  if (text.length > 80) {
    return NextResponse.json(
      { status: "error", message: "Please enter one short word or phrase." },
      { status: 400 },
    );
  }

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: "el",
        format: "text",
      }),
    },
  );

  const data = (await response.json()) as GoogleTranslateResponse;

  if (!response.ok) {
    return NextResponse.json(
      {
        status: "error",
        message: data.error?.message ?? "Google Translate request failed.",
      },
      { status: response.status },
    );
  }

  const greek = data.data?.translations?.[0]?.translatedText;

  if (!greek) {
    return NextResponse.json(
      { status: "error", message: "No Greek translation returned." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    status: "translated",
    input: text,
    greek,
  });
}

import { NextResponse } from "next/server";
import { lookupOriginalWord } from "../../../lib/originalWordStudy";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid JSON request." },
      { status: 400 },
    );
  }

  const input = body as { reference?: unknown; word?: unknown };

  const reference = typeof input.reference === "string" ? input.reference : "";
  const word = typeof input.word === "string" ? input.word : "";

  const result = lookupOriginalWord(reference, word);

  return NextResponse.json(result);
}

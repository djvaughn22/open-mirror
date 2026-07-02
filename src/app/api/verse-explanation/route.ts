import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_ADMIN_KEY;

  if (!apiKey) {
    return null;
  }

  return new OpenAI({ apiKey });
}

export async function POST(request: Request) {
  try {
    const { problem, verse } = await request.json();

    if (!problem || typeof problem !== "string") {
      return NextResponse.json(
        { error: "Please share the original reflection." },
        { status: 400 }
      );
    }

    if (!verse || typeof verse !== "string") {
      return NextResponse.json(
        { error: "Please select a Bible verse." },
        { status: 400 }
      );
    }

    if (problem.length > 250) {
      return NextResponse.json(
        { error: "Please keep your reflection to 250 characters or less." },
        { status: 400 }
      );
    }

    if (verse.length > 80) {
      return NextResponse.json(
        { error: "Please select a shorter Bible reference." },
        { status: 400 }
      );
    }

    const client = getOpenAIClient();

    if (!client) {
      return NextResponse.json(
        { error: "OpenAI API key is missing on the server." },
        { status: 503 }
      );
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 140,
      messages: [
        {
          role: "system",
          content: `
You write short Open Mirror transparency notes for Bible references.

Scripture is primary. AI is only showing why a selected passage was matched to the user's reflection.

Rules:
- Use exactly this format:

Reflection themes: [1-3 short themes from the user's reflection]

Verse themes: [1-3 short themes from the selected Bible reference]

Open Mirror matched these related themes.

- Maximum 35 words total.
- No advice.
- No counseling language.
- No interpretation of the user's heart, motives, future, or spiritual condition.
- Do not repeat the user's full reflection.
- Do not say "may connect," "could resonate," or "seemed related."
- Do not say "God told me."
- Do not claim divine authority.
- Do not add another Bible verse.
          `,
        },
        {
          role: "user",
          content: `Original reflection: ${problem}

Selected Bible reference: ${verse}`,
        },
      ],
    });

    const explanation = response.choices[0]?.message?.content?.trim();

    if (!explanation) {
      return NextResponse.json(
        { error: "Unable to explain this verse right now." },
        { status: 500 }
      );
    }

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Verse explanation error:", error);

    return NextResponse.json(
      { error: "Unable to explain this verse right now." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

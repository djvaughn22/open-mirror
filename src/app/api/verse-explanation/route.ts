import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is missing on the server." },
        { status: 500 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      max_output_tokens: 140,
      input: [
        {
          role: "system",
          content: `
You write short Open Mirror transparency notes for Bible references.

Scripture is primary. AI is only explaining why a selected passage may have seemed related to the user's reflection.

Rules:
- Write 2 to 4 short sentences.
- Use humble language such as "may connect," "seemed related to," and "your reflection mentioned."
- Do not say "God told me."
- Do not say "the AI knows."
- Do not diagnose the user.
- Do not claim divine authority.
- Do not rate Scripture.
- Do not add another Bible verse.
- Mention the user's reflection generally and respectfully.
- Explain why the selected reference may connect to what the user wrote.
          `,
        },
        {
          role: "user",
          content: `Original reflection: ${problem}

Selected Bible reference: ${verse}`,
        },
      ],
    });

    const explanation = response.output_text?.trim();

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

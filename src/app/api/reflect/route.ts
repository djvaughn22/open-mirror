import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { problem } = await request.json();

    const response = await client.responses.create({
      model: "gpt-5.5-mini",
      input: [
        {
          role: "system",
          content:
            "You are Open Mirror. Respond with Reflection, Cross, Heart, Scripture, Prayer, and Next Faithful Step.",
        },
        {
          role: "user",
          content: problem,
        },
      ],
    });

    return NextResponse.json({
      reflection: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to generate reflection." },
      { status: 500 }
    );
  }
}

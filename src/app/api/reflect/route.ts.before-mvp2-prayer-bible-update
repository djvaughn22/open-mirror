import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { problem } = await request.json();

    if (!problem || typeof problem !== "string") {
      return NextResponse.json(
        { error: "Please share what you are carrying." },
        { status: 400 }
      );
    }

    if (problem.length > 250) {
      return NextResponse.json(
        { error: "Please keep your reflection to 250 characters or less." },
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
      max_output_tokens: 500,
      input: [
        {
          role: "system",
          content: `
You are Open Mirror, a Christian biblical reflection guide.

Respond to the user's real situation with compassion, truth, Scripture, prayer, and one next faithful step.

The reflection input is almost always the user describing themselves. If they write phrases like "a person," "someone," or "the person," treat that as self-reflection unless they clearly say they are asking about another person. Respond directly to the user using "you," not as if discussing a third party.

Do not use the same Scripture every time.
Choose Scripture that fits the user's actual situation.

The response must follow this exact format and order:

## Reflection
A short, compassionate reflection on what the user shared.

## Cross
Help the user bring this situation to Jesus. Invite surrender, repentance where appropriate, forgiveness, freedom, and truth.

## Heart
Help the user receive God's love, grace, mercy, and truth in this situation.

## Pray
Write a prayer using the ACTS model:
Adoration: Praise God for who He is in this situation.
Confession: Honestly confess fear, sin, weakness, control, anger, shame, doubt, or need where appropriate.
Thanksgiving: Thank God for His grace, mercy, love, forgiveness, presence, or promises.
Supplication: Ask God for help, wisdom, strength, peace, courage, repentance, forgiveness, or next steps.

Make the prayer specific to the user's situation.

## Scripture
Provide one Bible verse that fits the situation.
Include the verse text and reference.
Do not always use Matthew 11:28.

## Next Faithful Step
Give one simple, practical, faithful next step.

Keep the tone warm, honest, hopeful, and grounded in Scripture.
Do not sound preachy, harsh, generic, or robotic.
          `,
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
  } catch (error: any) {
    console.error(error);

    if (
      error?.status === 429 ||
      error?.code === "insufficient_quota" ||
      error?.type === "insufficient_quota"
    ) {
      return NextResponse.json(
        {
          error:
            "Open Mirror is connected, but the AI account needs API billing or quota added before reflections can be generated.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Unable to generate reflection." },
      { status: 500 }
    );
  }
}

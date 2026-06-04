import OpenAI from "openai";
import { NextResponse } from "next/server";

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

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `
You are Open Mirror, a Christian biblical reflection guide.

Respond to the user's real situation with compassion, truth, Scripture, prayer, and one next faithful step.

Do not use the same Scripture every time.
Choose Scripture that fits the user's actual situation.

The response must follow this exact format:

## Reflection
A short, compassionate reflection on what the user shared.

## Cross
Help the user bring this situation to Jesus. Invite surrender, repentance where appropriate, forgiveness, freedom, and truth.

## Heart
Help the user receive God's love, grace, mercy, and truth in this situation.

## Scripture
Provide one Bible verse that fits the situation.
Include the verse text and reference.
Do not always use Matthew 11:28.

## Prayer
Write a prayer using the ACTS model:
Adoration: Praise God for who He is in this situation.
Confession: Honestly confess fear, sin, weakness, control, anger, shame, doubt, or need where appropriate.
Thanksgiving: Thank God for His grace, mercy, love, forgiveness, presence, or promises.
Supplication: Ask God for help, wisdom, strength, peace, courage, repentance, forgiveness, or next steps.

Make the prayer specific to the user's situation.

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
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to generate reflection." },
      { status: 500 }
    );
  }
}
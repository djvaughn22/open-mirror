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
        { error: "Please share a reflection." },
        { status: 400 }
      );
    }

    if (problem.length > 250) {
      return NextResponse.json(
        { error: "Please keep your reflection to 250 characters or less." },
        { status: 400 }
      );
    }

    const normalizedProblem = problem.trim().toLowerCase();

    const immediateSafetyPattern =
      /\b(suicid(?:e|al)|kill myself|end my life|take my life|hurt myself|harm myself|self[- ]?harm|don['’]?t want to live|do not want to live|better off dead|wish i were dead|wish i was dead|hurt someone|kill someone|violence|violent|abuse|abused|emergency|immediate danger)\b/i;

    if (immediateSafetyPattern.test(normalizedProblem)) {
      const safetyReflection = `## Please pause here

You matter. Your life has value.

If you may hurt yourself, want to die, may hurt someone else, or are in immediate danger, please contact emergency services now.

In the United States, call or text 988 for the Suicide & Crisis Lifeline. If you are in immediate danger, call 911 or go to the nearest emergency department.

Please reach out right now to a trusted family member, friend, pastor, counselor, clinician, or someone who can be with you.

---

## Scripture

"The Lord is close to the brokenhearted and saves those who are crushed in spirit." — Psalm 34:18

---

## Jesus Loves You

Ephesians 3:17–19`;

      return NextResponse.json({
        reflection: safetyReflection,
        safety: true,
      });
    }

    const vulnerableEmotionPattern =
      /\b(sad|sadness|grief|grieving|heartbroken|mourning|depressed|depression|hopeless|lonely|alone|afraid|scared|anxious|overwhelmed|exhausted|tired|down|empty|numb|lost|broken)\b/i;

    if (vulnerableEmotionPattern.test(normalizedProblem)) {
      const safeReflection = `✝️ ❤️ 🙏

## What We Heard

${problem.trim()}

## Scripture To Explore

### 1. John 1

"In him was life, and that life was the light of all mankind." — John 1:4

Start reading:
John 1

### 2. Romans 8

"For I am convinced that neither death nor life... will be able to separate us from the love of God that is in Christ Jesus our Lord." — Romans 8:38-39

Start reading:
Romans 8

### 3. Ephesians 3

"And I pray that you, being rooted and established in love..." — Ephesians 3:17-19

Start reading:
Ephesians 3`;

      return NextResponse.json({
        reflection: safeReflection,
        safety: true,
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is missing on the server." },
        { status: 500 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      max_output_tokens: 700,
      input: [
        {
          role: "system",
          content: `
You are a careful Scripture discovery facilitator.

Your role is narrow:
- Read the user's reflection.
- Understand the user's reflection as their honest answer to: "Describe how you picture yourself. What do you see?"
- Identify only what is reasonably present: self-picture, strengths, struggles, questions, fears, hopes, habits, gratitude, burdens, temptations, pain, and possible biblical themes.
- Summarize only what the user wrote or clearly implied.
- Select exactly 3 potentially relevant Bible passages.
- Prefer chapter-level exploration.
- Prefer passages that remain helpful when the whole chapter is read.
- Avoid shallow keyword matching.
- Avoid random selection.
- Avoid isolated proof-texts.
- Do not explain Scripture.
- Do not tell the user what the passage means.
- Do not tell the user what God is saying to them.
- Do not give advice.
- Do not diagnose.
- Do not assume motives, sin, guilt, trauma, or hidden meaning.

Return only structured data.

For each Scripture item:
- chapter should be like "John 1" or "Romans 5".
- reference should be the selected verse or short passage reference.
- text should be the selected Bible text only.

Do not include "why this connects."
Do not include Bible context.
Do not include commentary.
          `,
        },
        {
          role: "user",
          content: problem,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "scripture_explore_reflection",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              heard: { type: "string" },
              passages: {
                type: "array",
                minItems: 3,
                maxItems: 3,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    chapter: { type: "string" },
                    reference: { type: "string" },
                    text: { type: "string" }
                  },
                  required: ["chapter", "reference", "text"]
                }
              }
            },
            required: ["heard", "passages"]
          }
        }
      }
    });

    let result: {
      heard: string;
      passages: {
        chapter: string;
        reference: string;
        text: string;
      }[];
    };

    try {
      result = JSON.parse(response.output_text);
    } catch {
      throw new Error("Structured reflection response could not be parsed.");
    }

    const verse = (text: string, reference: string) =>
      `"${text.trim()}" — ${reference.trim()}`;

    const formattedPassages = result.passages
      .map(
        (passage, index) => `### ${index + 1}. ${passage.chapter.trim()}

${verse(passage.text, passage.reference)}

Start reading:
${passage.chapter.trim()}`
      )
      .join("\n\n---\n\n");

    const formattedReflection = `✝️ ❤️ 🙏

## What We Heard

${result.heard.trim()}

---

## Scripture To Explore

${formattedPassages}

`;

    return NextResponse.json({
      reflection: formattedReflection,
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

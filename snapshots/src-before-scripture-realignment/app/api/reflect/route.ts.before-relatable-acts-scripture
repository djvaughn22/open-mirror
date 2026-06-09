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
      max_output_tokens: 850,
      input: [
        {
          role: "system",
          content: `
You select biblically relevant Scripture for Open Mirror.

Open Mirror reflects only what the user states. It is not Jesus, Scripture, a pastor, therapist, counselor, or authority. God's Word is the authority. Jesus alone saves.

Return only the requested structured data.

Rules:
- reflection must be one short, maximally literal restatement of only what the user said.
- Never invent concern, feelings, motives, shame, guilt, insecurity, body image, trauma, diagnosis, sin, or meaning.
- Cross, Heart, Pray, and Scripture each need one distinct and directly relevant Bible verse or short passage.
- For those four sections, return the complete selected Bible text and its reference.
- Understand meaning rather than matching keywords or metaphors.
- Body weight or the word "fat" must never trigger verses about burdens, heaviness, weariness, loads, eating, drinking, food, appearance, body image, exercise, discipline, health, or self-control unless the user explicitly mentions those things.
- When the user gives only a physical observation without stating an emotion, cause, behavior, desire, or question, do not guess what the observation means. Choose passages about honestly coming to Jesus, grace, wisdom, prayer, and self-examination instead of passages about the physical topic itself.
- Reject generic comfort verses and literal keyword matches that do not address what the user actually stated.
- ACTS contains canonical Bible references only, never verse text.
- Each ACTS item must look only like "Psalm 34:1", "1 John 1:9", or "Romans 12:1-2".
- Do not put quotations, sentences, verse wording, explanations, or punctuation around ACTS references.
- Return 2 or 3 distinct and relevant references per ACTS category.
- Adoration references concern loving, praising, worshiping, or honoring God or Jesus.
- Confession references concern confession, repentance, forgiveness, or honest examination. Do not invent guilt.
- Thanksgiving references concern gratitude, grace, mercy, provision, forgiveness, or God's faithfulness.
- Supplication references concern asking God for help, wisdom, strength, forgiveness, direction, healing, or faithfulness.
- Do not repeat a reference anywhere in the response.
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
          name: "open_mirror_reflection",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              reflection: {
                type: "string",
              },
              cross: {
                type: "object",
                additionalProperties: false,
                properties: {
                  text: { type: "string" },
                  reference: { type: "string" },
                },
                required: ["text", "reference"],
              },
              heart: {
                type: "object",
                additionalProperties: false,
                properties: {
                  text: { type: "string" },
                  reference: { type: "string" },
                },
                required: ["text", "reference"],
              },
              pray: {
                type: "object",
                additionalProperties: false,
                properties: {
                  text: { type: "string" },
                  reference: { type: "string" },
                },
                required: ["text", "reference"],
              },
              scripture: {
                type: "object",
                additionalProperties: false,
                properties: {
                  text: { type: "string" },
                  reference: { type: "string" },
                },
                required: ["text", "reference"],
              },
              acts: {
                type: "object",
                additionalProperties: false,
                properties: {
                  adoration: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 2,
                    maxItems: 3,
                  },
                  confession: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 2,
                    maxItems: 3,
                  },
                  thanksgiving: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 2,
                    maxItems: 3,
                  },
                  supplication: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 2,
                    maxItems: 3,
                  },
                },
                required: [
                  "adoration",
                  "confession",
                  "thanksgiving",
                  "supplication",
                ],
              },
            },
            required: [
              "reflection",
              "cross",
              "heart",
              "pray",
              "scripture",
              "acts",
            ],
          },
        },
      },
    });

    let result: {
      reflection: string;
      cross: { text: string; reference: string };
      heart: { text: string; reference: string };
      pray: { text: string; reference: string };
      scripture: { text: string; reference: string };
      acts: {
        adoration: string[];
        confession: string[];
        thanksgiving: string[];
        supplication: string[];
      };
    };

    try {
      result = JSON.parse(response.output_text);
    } catch {
      throw new Error("Structured reflection response could not be parsed.");
    }

    const verse = (text: string, reference: string) =>
      `"${text.trim()}" — ${reference.trim()}`;

    const references = (items: string[]) => {
      const bibleReferencePattern =
        /\b(?:[1-3]\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)*\s+\d{1,3}:\d{1,3}(?:-\d{1,3})?\b/g;

      return items
        .flatMap((item) => item.match(bibleReferencePattern) ?? [])
        .map((reference) => reference.trim())
        .slice(0, 3)
        .join(", ");
    };

    const formattedReflection = `## Reflection

${result.reflection.trim()}

## ✝️ Cross

${verse(result.cross.text, result.cross.reference)}

## ❤️ Heart

${verse(result.heart.text, result.heart.reference)}

## 🙏 Pray

${verse(result.pray.text, result.pray.reference)}

## 📖 Scripture

${verse(result.scripture.text, result.scripture.reference)}

Click any Bible reference to open the passage in the Bible app. Read it in context, meditate on God's Word, and pray honestly in your own words. Open Mirror only points you toward Scripture; God's Word is the authority.

## Optional ACTS Scripture Guide

Talk to God in prayer in whatever way feels natural to you. If you would like a simple structure, use the ACTS passages below as a guide.

**Adoration**

${references(result.acts.adoration)}

**Confession**

${references(result.acts.confession)}

**Thanksgiving**

${references(result.acts.thanksgiving)}

**Supplication**

${references(result.acts.supplication)}`;

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

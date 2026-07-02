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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is missing on the server." },
        { status: 500 }
      );
    }

    const client = getOpenAIClient();

    if (!client) {
      return NextResponse.json(
        { error: "OpenAI API key is missing on the server." },
        { status: 503 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1200,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a careful Scripture discovery facilitator for Open Mirror.

Mission:
- Open Mirror helps users honestly reflect, engage with Scripture, deepen prayer, and take a faithful next step toward Jesus.
- AI is the facilitator only.
- Scripture is the authority.
- Jesus is the destination.
- Open Mirror is for everyone: Christians, seekers, skeptics, doubters, people thriving, people struggling, people celebrating, people questioning, and people growing.

Your role:
- Read the user's actual reflection.
- Identify what is reasonably present: circumstances, decisions, relationships, responsibilities, opportunities, strengths, weaknesses, fears, hopes, doubts, gratitude, success, failure, habits, character, spiritual questions, and biblical themes.
- Do not reduce the reflection to one emotion.
- Do not assume crisis unless the user clearly indicates immediate danger.
- Do not diagnose.
- Do not invent hidden motives, trauma, guilt, sin, or meaning.
- Summarize only what the user wrote or clearly implied.
- Tone ambiguity rule: if the user's tone could be sarcastic, humorous, serious, painful, casual, angry, or unclear, do not guess.
- Reflect only the plain meaning of the user's words.
- Use neutral phrases like "You described..." or "You used direct words about..."
- Do not call the user whimsical, humorous, joking, sarcastic, insecure, prideful, depressed, anxious, dramatic, or anything similar unless the user directly says so.
- Do not infer tone, motive, mood, diagnosis, spiritual condition, or intent.
- If the user describes appearance, state that plainly and gently, then point toward Scripture's truth that God sees the whole person, not only outward appearance.
- The mirror reflects what was written; it does not pretend to know the heart. God knows the heart.
- Select exactly 3 relevant Bible passages.

Scripture selection:
- The goal is Scripture discovery, not a generic comforting response.
- Match the user's deeper themes, not just emotional keywords.
- Use the full breadth of Scripture.
- Consider Torah, historical books, Psalms, wisdom literature, major prophets, minor prophets, Gospels, Acts, and Epistles.
- Consider narrative passages, biblical characters, prayers, wisdom, parables, prophecy, teaching, and direct instruction when appropriate.
- Favor relevance over popularity.
- Favor discovery over familiarity.
- Favor biblical depth over predictable responses.
- Avoid repeatedly selecting the same small group of commonly cited comfort passages.
- Do not automatically map sadness, fear, loneliness, anxiety, or uncertainty to John 1, Romans 8, Ephesians 3, Matthew 11, Philippians 4, Isaiah 41, Jeremiah 29, or Psalm 23 unless that passage is truly the strongest fit.
- Do not use Matthew 11:28-30 for general sadness, loneliness, anxiety, insecurity, or discouragement unless the user specifically describes being weary, burdened, exhausted, heavy-laden, or needing rest.
- For sadness or loneliness, consider chapter-level Scripture discovery from prayers, laments, stories, and encounters where God meets isolated, grieving, overlooked, afraid, or honestly searching people.
- Examples to consider when actually relevant include Psalm 13, Psalm 42, Psalm 139, Genesis 16, Ruth 1, 1 Kings 19, Isaiah 43, John 4, and Luke 7. Do not force these; choose what best fits the user's actual words.
- Prefer passages that remain helpful when the whole chapter is read.
- Prefer chapter-level exploration.
- Avoid shallow keyword matching.
- Avoid random selection.
- Avoid isolated proof-texts.
- Encourage the user toward Scripture by choosing passages worth reading in context.
- Use short focused Scripture quotations only.
- Do not quote an entire long passage.
- If a long passage is relevant, choose one representative verse or short excerpt from it.
- Keep selected Bible text concise enough that the structured JSON response can complete without truncation.

Safety boundary:
- Ordinary human experiences should stay in the normal reflection flow, including joy, gratitude, success, uncertainty, loneliness, fear, doubt, relationships, work, purpose, growth, temptation, failure, and spiritual questions.
- Only immediate self-harm, suicide, violence, or serious harm to others should leave the normal flow.
- If the server has already allowed the reflection through, continue normal Scripture discovery.

Return only structured data.

For each Scripture item:
- chapter should be like "Genesis 16", "Psalm 142", "Habakkuk 3", "Luke 15", or "James 1".
- reference should be the selected verse or short passage reference.
- text should be the selected Bible text only.

Do not include "why this connects."
Do not include Bible context.
Do not include commentary.
          `,
        },
        {
          role: "user",
          content: `${problem}

Return ONLY a JSON object shaped exactly like this, with exactly 3 passages:
{"heard": "<=320 chars summarizing what you heard, in the second person", "passages": [{"chapter": "e.g. Psalm 42", "reference": "e.g. Psalm 42:11", "text": "the verse text"}, {"chapter": "", "reference": "", "text": ""}, {"chapter": "", "reference": "", "text": ""}]}`,
        },
      ],
    });

    let result: {
      heard: string;
      passages: {
        chapter: string;
        reference: string;
        text: string;
      }[];
    };

    const raw = completion.choices[0]?.message?.content ?? "";

    try {
      result = JSON.parse(raw);
    } catch (parseError) {
      console.error("OPEN MIRROR PARSE ERROR:", parseError);
      console.error("OPEN MIRROR RAW OUTPUT:", raw);
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

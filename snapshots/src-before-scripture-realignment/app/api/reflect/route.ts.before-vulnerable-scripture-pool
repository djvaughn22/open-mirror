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

    const normalizedProblem = problem.trim().toLowerCase();

    const immediateSafetyPattern =
      /\b(suicid(?:e|al)|kill myself|end my life|take my life|hurt myself|harm myself|self[- ]?harm|don['’]?t want to live|do not want to live|better off dead|wish i were dead|wish i was dead)\b/i;

    const depressionPattern =
      /\b(depressed|depression|hopeless|no hope|can['’]?t go on|cannot go on)\b/i;

    if (immediateSafetyPattern.test(normalizedProblem)) {
      const safetyReflection = `## Please pause here

What you shared may involve your immediate safety. Open Mirror should not try to handle this with an ordinary reflection or a list of Bible verses.

Please contact someone who can be with you now: a trusted family member, friend, pastor, clinician, or emergency service.

In the United States, call or text 988 to reach the Suicide & Crisis Lifeline. If you may act on these thoughts or are in immediate danger, call 911 or go to the nearest emergency department.

You do not need to face this moment alone.

## 📖 Scripture

"The Lord is near to all who call on him, to all who call on him in truth." — Psalm 145:18

Open the passage in your Bible, but please seek immediate human support first. Scripture and prayer matter deeply, and urgent real-life help matters too.`;

      return NextResponse.json({
        reflection: safetyReflection,
        safety: true,
      });
    }

    if (depressionPattern.test(normalizedProblem)) {
      const supportReflection = `## Reflection

You said that you are feeling depressed or hopeless.

## Please reach out

Please tell a trusted person today—a family member, friend, pastor, or qualified mental-health professional. Open Mirror cannot determine how serious this is, and you should not have to carry it alone.

If you are thinking about harming yourself, do not want to live, or feel unsafe, call or text 988 in the United States. If you are in immediate danger, call 911 or go to the nearest emergency department.

## ✝️ Cross

"I have come that they may have life, and have it to the full." — John 10:10

## ❤️ Heart

"May the God of hope fill you with all joy and peace as you trust in him." — Romans 15:13

## 🙏 Pray

"Cast all your anxiety on him because he cares for you." — 1 Peter 5:7

## 📖 Scripture

"The light shines in the darkness, and the darkness has not overcome it." — John 1:5

Click a Bible reference to read it in context. Pray in your own words, and please also reach out to a real person who can support you.`;

      return NextResponse.json({
        reflection: supportReflection,
        safety: true,
      });
    }

    const reviewedEmotionalResponses = [
      {
        pattern:
          /^(?:(?:i am|i['’]?m|im|i feel|feeling)\s+)?(?:very\s+|really\s+)?(?:sad|unhappy|down|discouraged)(?:\s+today)?[.!]?$/i,
        reflection: "You said that you are sad.",
        cross: {
          text: "Peace I leave with you; my peace I give you.",
          reference: "John 14:27",
        },
        heart: {
          text: "May the God of hope fill you with all joy and peace as you trust in him.",
          reference: "Romans 15:13",
        },
        pray: {
          text: "Trust in him at all times, you people; pour out your hearts to him, for God is our refuge.",
          reference: "Psalm 62:8",
        },
        scripture: {
          text: "The Lord is good to all; he has compassion on all he has made.",
          reference: "Psalm 145:9",
        },
      },
      {
        pattern:
          /^(?:(?:i am|i['’]?m|im|i feel|feeling)\s+)?(?:very\s+|really\s+)?(?:lonely|alone|isolated)[.!]?$/i,
        reflection: "You said that you feel alone.",
        cross: {
          text: "Surely I am with you always, to the very end of the age.",
          reference: "Matthew 28:20",
        },
        heart: {
          text: "See what great love the Father has lavished on us, that we should be called children of God.",
          reference: "1 John 3:1",
        },
        pray: {
          text: "You will seek me and find me when you seek me with all your heart.",
          reference: "Jeremiah 29:13",
        },
        scripture: {
          text: "God is faithful, who has called you into fellowship with his Son, Jesus Christ our Lord.",
          reference: "1 Corinthians 1:9",
        },
      },
      {
        pattern:
          /^(?:(?:i am|i['’]?m|im|i feel|feeling)\s+)?(?:very\s+|really\s+)?(?:afraid|scared|fearful|worried|anxious)[.!]?$/i,
        reflection: "You said that you feel afraid or worried.",
        cross: {
          text: "Peace I leave with you; my peace I give you.",
          reference: "John 14:27",
        },
        heart: {
          text: "God is love. Whoever lives in love lives in God, and God in them.",
          reference: "1 John 4:16",
        },
        pray: {
          text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault.",
          reference: "James 1:5",
        },
        scripture: {
          text: "Now may the Lord of peace himself give you peace at all times and in every way.",
          reference: "2 Thessalonians 3:16",
        },
      },
      {
        pattern:
          /^(?:(?:i am|i['’]?m|im|i feel|feeling)\s+)?(?:very\s+|really\s+)?(?:overwhelmed|stressed|exhausted|tired)[.!]?$/i,
        reflection: "You said that you feel overwhelmed or tired.",
        cross: {
          text: "My grace is sufficient for you, for my power is made perfect in weakness.",
          reference: "2 Corinthians 12:9",
        },
        heart: {
          text: "The Lord is gracious and compassionate, slow to anger and rich in love.",
          reference: "Psalm 145:8",
        },
        pray: {
          text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault.",
          reference: "James 1:5",
        },
        scripture: {
          text: "Be still, and know that I am God.",
          reference: "Psalm 46:10",
        },
      },
      {
        pattern:
          /^(?:(?:i am|i['’]?m|im|i feel|feeling)\s+)?(?:very\s+|really\s+)?(?:grieving|heartbroken|mourning)|(?:i miss .+)[.!]?$/i,
        reflection: "You shared that you are grieving or missing someone.",
        cross: {
          text: "Jesus Christ is the same yesterday and today and forever.",
          reference: "Hebrews 13:8",
        },
        heart: {
          text: "The Lord is gracious and compassionate, slow to anger and rich in love.",
          reference: "Psalm 145:8",
        },
        pray: {
          text: "Trust in him at all times, you people; pour out your hearts to him, for God is our refuge.",
          reference: "Psalm 62:8",
        },
        scripture: {
          text: "May the God of hope fill you with all joy and peace as you trust in him.",
          reference: "Romans 15:13",
        },
      },
    ];

    const reviewedResponse = reviewedEmotionalResponses.find(({ pattern }) =>
      pattern.test(normalizedProblem)
    );

    if (reviewedResponse) {
      const safeReflection = `## Reflection

${reviewedResponse.reflection}

## ✝️ Cross

"${reviewedResponse.cross.text}" — ${reviewedResponse.cross.reference}

## ❤️ Heart

"${reviewedResponse.heart.text}" — ${reviewedResponse.heart.reference}

## 🙏 Pray

"${reviewedResponse.pray.text}" — ${reviewedResponse.pray.reference}

## 📖 Scripture

"${reviewedResponse.scripture.text}" — ${reviewedResponse.scripture.reference}

Click any Bible reference to open the passage in the Bible app. Read it in context, meditate on God's Word, and talk with God in your own words.

If what you are feeling continues, becomes overwhelming, or makes you feel unsafe, please tell someone you trust—a family member, friend, pastor, or qualified professional.`;

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

Cross selection rules:
- The Cross section does not always mean surrender, repentance, or confession.
- Never imply that sadness, depression, grief, fear, loneliness, pain, illness, weakness, or emotional distress is itself a sin, spiritual failure, lack of faith, or something the user caused.
- For vulnerable emotional states, choose Scripture about Jesus' presence, love, grace, sacrifice, life, compassion, peace, hope, or faithfulness.
- Use surrender passages only when the user explicitly describes control, resistance, pride, resentment, disobedience, or something they want to release.
- Use repentance, confession, and forgiveness passages only when the user explicitly states wrongdoing, sin, guilt, or a harmful choice.
- For gratitude, joy, love, or blessing, choose Scripture that praises Jesus or remembers what He has done.
- When the user's meaning is unclear, choose a gentle Christ-centered passage without assigning guilt, failure, burden, or required surrender.
- Reject Cross passages that could make a vulnerable person feel blamed, condemned, hopeless, spiritually defective, or pressured to solve emotional distress through surrender alone.
- Understand meaning rather than matching keywords or metaphors.
- Body weight or the word "fat" must never trigger verses about burdens, heaviness, weariness, loads, eating, drinking, food, appearance, body image, exercise, discipline, health, or self-control unless the user explicitly mentions those things.
- When the user gives only a physical observation without stating an emotion, cause, behavior, desire, or question, do not guess what the observation means. Choose passages about honestly coming to Jesus, grace, wisdom, prayer, and self-examination instead of passages about the physical topic itself.
- Reject generic comfort verses and literal keyword matches that do not address what the user actually stated.
- For ordinary sadness, disappointment, loneliness, or discouragement, use gentle passages about God's presence, care, peace, hope, love, and faithfulness.
- For ordinary sadness, do not choose passages centered on death, dying, being crushed, brokenheartedness, heavy burdens, condemnation, destruction, despair, punishment, or suffering unless the user explicitly names those themes.
- Never diagnose sadness as depression or assume danger that the user did not state.
- ACTS contains canonical Bible references only, never verse text.
- Each ACTS item must look only like "Psalm 34:1", "1 John 1:9", or "Romans 12:1-2".
- Do not put quotations, sentences, verse wording, explanations, or punctuation around ACTS references.
- Return 2 or 3 distinct and relevant references per ACTS category.
- Adoration references must help the user praise God for who He is in a way that meaningfully fits the situation they entered.
- Confession references must relate to confession, repentance, forgiveness, or honest self-examination while fitting the situation. Never invent guilt or claim a sin the user did not state.
- Thanksgiving references must help the user thank God for grace, mercy, provision, forgiveness, love, or faithfulness that meaningfully connects to the situation.
- Supplication references must help the user ask God for wisdom, strength, healing, direction, forgiveness, courage, or help that meaningfully connects to the situation.
- Reject ACTS references that fit the category generally but have no meaningful connection to the user's actual input.
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

**A — Adoration**

*Scripture to help you praise God for who He is.*

${references(result.acts.adoration)}

**C — Confession**

*Scripture to help you bring sin and truth before God without assuming guilt.*

${references(result.acts.confession)}

**T — Thanksgiving**

*Scripture to help you thank God for His grace and faithfulness.*

${references(result.acts.thanksgiving)}

**S — Supplication**

*Scripture to help you ask God for help, wisdom, and direction.*

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

// ─────────────────────────────────────────────────────────────────────────────
// The write endpoint. This is the one door the internet can push data through,
// so it is deliberately narrow.
//
//   · body size is capped before parsing
//   · every field is validated server-side; nothing the client claims about
//     trust, school scope, or status is believed
//   · the school is taken from the CREDENTIAL, never from the payload, so a
//     valid MICDS link cannot report a Kirkwood game
//   · rate limited per client, in memory, best-effort
//   · no token, credential id, or connection string ever reaches a response
//     or a log line
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

import { sportsRepository } from "@/lib/sports/repo";
import { noteCredentialUse, verifyToken } from "@/lib/sports/submit/credentials";
import { submitResult } from "@/lib/sports/submit/submit";
import { SPORTS } from "@/lib/sports/graph/sports";
import type { HomeAway, SportId } from "@/lib/sports/graph/types";
import type { SubmissionInput } from "@/lib/sports/submit/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4_000;
const SPORT_IDS = new Set(SPORTS.map((s) => s.id));
const HOME_AWAY = new Set<HomeAway>(["home", "away", "neutral", "unknown"]);

// Best-effort in-memory limiter. A serverless instance may be recycled, so this
// is a speed bump against accidental floods, not a security boundary.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;

function rateLimited(key: string, now: number): boolean {
  const recent = (HITS.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(key, recent);
  if (HITS.size > 5_000) HITS.clear();
  return recent.length > MAX_PER_WINDOW;
}

/** Coarse client identity for rate limiting only. Never published or stored raw. */
function clientKeyOf(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0].trim() || "unknown";
  return ip.slice(0, 64);
}

const str = (v: unknown, max: number): string => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const repo = sportsRepository();
  const clientKey = clientKeyOf(request);

  if (rateLimited(clientKey, Date.now())) {
    return NextResponse.json({ error: "Too many reports from here. Try again shortly." }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "That report is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw || "{}") as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Could not read that report." }, { status: 400 });
  }

  // ── Who is reporting ──────────────────────────────────────────────────────
  const token = str(body.token, 200);
  let origin: "authorized" | "public" = "public";
  let credentialId: string | undefined;
  let schoolId = str(body.schoolId, 80);

  if (token) {
    const check = await verifyToken(repo, token);
    if (!check.ok) {
      // One message for unknown and revoked alike: a probe must not be able to
      // learn which schools have ever held a link.
      return NextResponse.json({ error: "This reporting link is not active." }, { status: 401 });
    }
    origin = "authorized";
    credentialId = check.credential.id;
    // The credential decides the school. The payload does not get a vote.
    schoolId = check.credential.schoolId;
    await noteCredentialUse(repo, check.credential, new Date().toISOString());
  }

  const sport = str(body.sport, 40) as SportId;
  if (!SPORT_IDS.has(sport)) {
    return NextResponse.json({ error: "Pick a sport." }, { status: 422 });
  }
  const homeAway = str(body.homeAway, 12) as HomeAway;

  const input: SubmissionInput = {
    schoolId,
    sport,
    opponentName: str(body.opponentName, 80),
    ourScore: Number(body.ourScore),
    theirScore: Number(body.theirScore),
    date: str(body.date, 10),
    homeAway: HOME_AWAY.has(homeAway) ? homeAway : "unknown",
    note: str(body.note, 240) || undefined,
    reporterName: str(body.reporterName, 80) || undefined,
  };

  if (!input.schoolId) {
    return NextResponse.json({ error: "Pick your team." }, { status: 422 });
  }

  try {
    const outcome = await submitResult({ repo, input, origin, credentialId, clientKey });
    return NextResponse.json(
      {
        status: outcome.status,
        message: outcome.message,
        duplicate: outcome.duplicate,
        // Only ever a public URL — never an internal id the reader cannot use.
        eventUrl: outcome.status === "published" && outcome.event ? `/sports/${outcome.event.id}` : undefined,
        schoolUrl: `/sports/schools/${input.schoolId}`,
      },
      { status: outcome.status === "rejected" ? 422 : 200 },
    );
  } catch {
    // The underlying error may name the store or its connection. It goes
    // nowhere near the client.
    return NextResponse.json({ error: "We could not save that right now. Please try again." }, { status: 503 });
  }
}

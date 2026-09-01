// Sports Desk — the archive.
//
// GET  lists stored games.
// POST approves a verified game and writes it. A game with no final score, no
//      opponent, or an unverified stat is refused, with the reason returned.

import { NextResponse } from "next/server";

import { approveGame, type ApprovedCandidate } from "@/lib/sports/approve";
import { store } from "@/lib/sports/store";
import { currentSeasonId, TEAM } from "@/lib/sports/team";
import type { EvidenceItem } from "@/lib/sports/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const games = store.list();
  return NextResponse.json({
    writable: store.writable(),
    games: games.map((g) => ({
      id: g.id,
      date: g.date,
      opponent: g.opponent,
      result: g.result,
      teamScore: g.teamScore,
      opponentScore: g.opponentScore,
      demo: g.demo === true,
    })),
  });
}

export async function POST(request: Request) {
  if (!store.writable()) {
    return NextResponse.json(
      {
        error:
          "This deployment cannot write to the archive. Run the Sports Desk on your own machine, then commit the new game file to publish it.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read the request." }, { status: 400 });
  }

  const { candidates, evidence, demo } = (body ?? {}) as {
    candidates?: ApprovedCandidate[];
    evidence?: EvidenceItem[];
    demo?: boolean;
  };

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return NextResponse.json({ error: "Nothing was approved, so nothing was saved." }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const result = approveGame({
    candidates,
    evidence: Array.isArray(evidence) ? evidence : [],
    team: { name: TEAM.name },
    seasonId: currentSeasonId(),
    today,
    demo: demo === true ? true : undefined,
  });

  if (!result.ok) return NextResponse.json({ error: result.errors.join(" "), errors: result.errors }, { status: 422 });

  store.save(result.value);
  return NextResponse.json({ ok: true, id: result.value.id });
}

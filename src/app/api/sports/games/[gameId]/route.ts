// Sports Desk — corrections and removal.
//
// The desk covers high-school athletes, so a wrong stat has to be fixable and a
// game has to be removable in one step, by the operator, without a support
// ticket. Corrections re-run validation: a bad edit is refused, not stored.

import { NextResponse } from "next/server";

import { store } from "@/lib/sports/store";
import { validateGame } from "@/lib/sports/validate";
import type { GameRecord, StatValue } from "@/lib/sports/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ gameId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { gameId } = await params;
  const game = store.get(gameId);
  if (!game) return NextResponse.json({ error: "No game with that id." }, { status: 404 });
  return NextResponse.json({ game });
}

export async function PATCH(request: Request, { params }: Params) {
  if (!store.writable()) {
    return NextResponse.json({ error: "This deployment cannot write to the archive." }, { status: 503 });
  }
  const { gameId } = await params;
  const existing = store.get(gameId);
  if (!existing) return NextResponse.json({ error: "No game with that id." }, { status: 404 });

  let patch: Record<string, unknown>;
  try {
    patch = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Could not read the request." }, { status: 400 });
  }

  // A corrected value is the operator's own word, so its provenance says so.
  const players = Array.isArray(patch.players)
    ? (patch.players as Array<{ name?: string; stats?: Record<string, number> }>).flatMap((p) => {
        if (typeof p?.name !== "string" || !p.name.trim()) return [];
        const stats: Record<string, StatValue> = {};
        for (const [id, amount] of Object.entries(p.stats ?? {})) {
          if (typeof amount !== "number") continue;
          stats[id] = { amount, provenance: { kind: "operator", approvedByOperator: true } };
        }
        return [{ name: p.name.trim(), stats }];
      })
    : existing.players;

  const merged: GameRecord = {
    ...existing,
    teamScore: typeof patch.teamScore === "number" ? patch.teamScore : existing.teamScore,
    opponentScore: typeof patch.opponentScore === "number" ? patch.opponentScore : existing.opponentScore,
    opponent: typeof patch.opponent === "string" && patch.opponent.trim() ? patch.opponent.trim() : existing.opponent,
    players,
    scoreProvenance:
      typeof patch.teamScore === "number" || typeof patch.opponentScore === "number"
        ? { kind: "operator", approvedByOperator: true }
        : existing.scoreProvenance,
    updatedAt: new Date().toISOString(),
  };

  const result = validateGame(merged);
  if (!result.ok) return NextResponse.json({ error: result.errors.join(" "), errors: result.errors }, { status: 422 });

  store.save(result.value);
  return NextResponse.json({ ok: true, game: result.value });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!store.writable()) {
    return NextResponse.json({ error: "This deployment cannot write to the archive." }, { status: 503 });
  }
  const { gameId } = await params;
  const removed = store.remove(gameId);
  if (!removed) return NextResponse.json({ error: "No game with that id." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

// Sports Desk — read candidate facts out of supplied evidence.
//
// Nothing here is saved and nothing here is trusted: the response is what the
// verification screen shows the operator. Runs with no model and no network.

import { NextResponse } from "next/server";

import { extractCandidates } from "@/lib/sports/extract";
import { TEAM } from "@/lib/sports/team";
import type { EvidenceItem } from "@/lib/sports/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CHARS = 20000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read the request." }, { status: 400 });
  }

  const raw = (body as { evidence?: unknown })?.evidence;
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json({ error: "Paste something about the game first." }, { status: 400 });
  }

  const evidence: EvidenceItem[] = [];
  raw.forEach((item, i) => {
    const e = item as { text?: unknown; label?: unknown; kind?: unknown };
    if (typeof e?.text !== "string" || e.text.trim().length === 0) return;
    evidence.push({
      id: `e${i + 1}`,
      kind: e.kind === "stat-export" || e.kind === "typed-notes" ? e.kind : "pasted-text",
      text: e.text.slice(0, MAX_CHARS),
      label: typeof e.label === "string" ? e.label.slice(0, 80) : undefined,
    });
  });

  if (evidence.length === 0) {
    return NextResponse.json({ error: "Paste something about the game first." }, { status: 400 });
  }

  const result = extractCandidates(evidence, TEAM);
  return NextResponse.json({ ...result, evidence, team: { name: TEAM.name, mascot: TEAM.mascot } });
}

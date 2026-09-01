// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — schema validation, hand-rolled so no dependency is added.
//
// This is the gate between "some JSON arrived" and "this is a stored fact".
// It rejects rather than repairs: a game that fails here is never saved, and
// the caller is told exactly what was wrong.
// ─────────────────────────────────────────────────────────────────────────────

import { statDef } from "./football.ts";
import type { GameRecord, PlayerLine, Provenance, StatValue } from "./types.ts";

export type Valid<T> = { ok: true; value: T } | { ok: false; errors: string[] };

const rec = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

const isInt = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && Number.isInteger(v);
const isStr = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

function validProvenance(v: unknown, path: string, errors: string[]): Provenance {
  const p = rec(v);
  switch (p.kind) {
    case "evidence":
      if (!isStr(p.quote)) errors.push(`${path}: evidence provenance needs the quote it came from`);
      if (p.approvedByOperator !== true) errors.push(`${path}: evidence facts must be operator-approved`);
      return { kind: "evidence", quote: String(p.quote ?? ""), approvedByOperator: true };
    case "operator":
      return { kind: "operator", approvedByOperator: true };
    case "calculated":
      if (!isStr(p.method)) errors.push(`${path}: calculated facts must name their method`);
      return {
        kind: "calculated",
        method: String(p.method ?? ""),
        fromGameIds: Array.isArray(p.fromGameIds) ? p.fromGameIds.filter(isStr) : [],
      };
    case "interpretation":
      return { kind: "interpretation", basis: String(p.basis ?? "") };
    default:
      errors.push(`${path}: every stored fact needs provenance — none was supplied`);
      return { kind: "operator", approvedByOperator: true };
  }
}

function validPlayers(v: unknown, errors: string[]): PlayerLine[] {
  if (!Array.isArray(v)) return [];
  const out: PlayerLine[] = [];
  v.forEach((raw, i) => {
    const p = rec(raw);
    if (!isStr(p.name)) {
      errors.push(`players[${i}]: a performance needs a player name`);
      return;
    }
    const stats: Record<string, StatValue> = {};
    for (const [statId, sv] of Object.entries(rec(p.stats))) {
      if (!statDef(statId)) {
        errors.push(`players[${i}].stats.${statId}: not a football stat this desk records`);
        continue;
      }
      const s = rec(sv);
      if (typeof s.amount !== "number" || !Number.isFinite(s.amount) || s.amount < 0) {
        errors.push(`players[${i}].stats.${statId}: needs a number that is zero or more`);
        continue;
      }
      stats[statId] = { amount: s.amount, provenance: validProvenance(s.provenance, `players[${i}].stats.${statId}`, errors) };
    }
    if (Object.keys(stats).length === 0) {
      errors.push(`players[${i}] (${p.name}): no verified stats, so there is nothing to publish`);
      return;
    }
    out.push({ name: String(p.name).trim(), stats });
  });
  return out;
}

export function validateGame(input: unknown): Valid<GameRecord> {
  const errors: string[] = [];
  const g = rec(input);

  if (!isStr(g.id)) errors.push("id: missing");
  if (!isStr(g.team)) errors.push("team: missing");
  if (!isStr(g.opponent)) errors.push("opponent: a game cannot be published without naming the opponent");
  if (!isInt(g.teamScore) || (g.teamScore as number) < 0) errors.push("teamScore: needs a whole number");
  if (!isInt(g.opponentScore) || (g.opponentScore as number) < 0) errors.push("opponentScore: needs a whole number");
  if (!isStr(g.date) || !/^\d{4}-\d{2}-\d{2}$/.test(String(g.date))) errors.push("date: needs to be YYYY-MM-DD");
  if (g.sport !== "football") errors.push("sport: this desk covers football only");

  const teamScore = isInt(g.teamScore) ? (g.teamScore as number) : 0;
  const opponentScore = isInt(g.opponentScore) ? (g.opponentScore as number) : 0;
  const players = validPlayers(g.players, errors);

  const narrative = (Array.isArray(g.narrative) ? g.narrative : []).flatMap((raw, i) => {
    const n = rec(raw);
    if (!isStr(n.text)) {
      errors.push(`narrative[${i}]: empty`);
      return [];
    }
    const d = rec(n.deficit);
    return [{
      text: String(n.text).trim(),
      provenance: validProvenance(n.provenance, `narrative[${i}]`, errors),
      deficit: isInt(d.us) && isInt(d.them) ? { us: d.us as number, them: d.them as number } : undefined,
    }];
  });

  const recAfter = rec(g.recordAfter);
  const recordAfter = isInt(recAfter.wins) && isInt(recAfter.losses)
    ? { wins: recAfter.wins as number, losses: recAfter.losses as number, ties: isInt(recAfter.ties) ? (recAfter.ties as number) : 0 }
    : undefined;

  const nextRaw = rec(g.next);
  const next = isStr(nextRaw.opponent)
    ? {
        opponent: String(nextRaw.opponent).trim(),
        when: isStr(nextRaw.when) ? String(nextRaw.when).trim() : "",
        provenance: validProvenance(nextRaw.provenance, "next", errors),
      }
    : undefined;

  if (errors.length > 0) return { ok: false, errors };

  const value: GameRecord = {
    id: String(g.id),
    version: 1,
    sport: "football",
    seasonId: isStr(g.seasonId) ? String(g.seasonId) : String(g.date).slice(0, 4),
    date: String(g.date),
    team: String(g.team).trim(),
    opponent: String(g.opponent).trim(),
    homeAway: ["home", "away", "neutral"].includes(String(g.homeAway)) ? (g.homeAway as GameRecord["homeAway"]) : "unknown",
    teamScore,
    opponentScore,
    result: teamScore > opponentScore ? "W" : teamScore < opponentScore ? "L" : "T",
    recordAfter,
    players,
    narrative,
    next,
    scoreProvenance: validProvenance(g.scoreProvenance, "scoreProvenance", errors),
    evidence: (Array.isArray(g.evidence) ? g.evidence : []).flatMap((raw) => {
      const e = rec(raw);
      return isStr(e.text)
        ? [{ id: isStr(e.id) ? String(e.id) : "e1", kind: "pasted-text" as const, text: String(e.text), label: isStr(e.label) ? String(e.label) : undefined }]
        : [];
    }),
    demo: g.demo === true ? true : undefined,
    createdAt: isStr(g.createdAt) ? String(g.createdAt) : new Date().toISOString(),
    updatedAt: isStr(g.updatedAt) ? String(g.updatedAt) : undefined,
  };

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value };
}

/** URL-safe, human-readable, stable per date + opponent. */
export function gameId(date: string, opponent: string): string {
  const slug = opponent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${date}-${slug || "opponent"}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — the writer.
//
// Deterministic prose assembled from approved facts and ranked discoveries. It
// reads like a local reporter filing on deadline: specific, short, no filler.
// If the evidence is thin the story is short. It is never padded.
//
// A model may rewrite this text (see ./modelWriter.ts) but only from the same
// approved facts, and only if the result passes the fact guard. The sentences
// below are the floor no vendor outage can drop below.
// ─────────────────────────────────────────────────────────────────────────────

import { statDef, statShort } from "./football.ts";
import { headlineStats, leadPerformer } from "./storyFinder.ts";
import type { Discovery, GameRecord, PlayerLine } from "./types.ts";

const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Weekday from a verified ISO date. Parsed as UTC so it never drifts a day. */
export function weekdayOf(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return WEEKDAY[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

const amount = (line: PlayerLine, id: string) => line.stats[id]?.amount;

/** One clause per verified stat, in the order a reporter would say them. */
function clausesFor(line: PlayerLine): string[] {
  const out: string[] = [];
  const rushY = amount(line, "rushingYards");
  const carries = amount(line, "rushingAttempts");
  const rushTd = amount(line, "rushingTd");
  const passY = amount(line, "passingYards");
  const passTd = amount(line, "passingTd");
  const recY = amount(line, "receivingYards");
  const catches = amount(line, "receptions");
  const recTd = amount(line, "receivingTd");
  const td = amount(line, "touchdowns");
  const ints = amount(line, "interceptions");
  const sacks = amount(line, "sacks");
  const tackles = amount(line, "tackles");
  const fumbles = amount(line, "fumblesRecovered");
  const fgs = amount(line, "fieldGoals");

  // Carries only appear when they were actually verified. This is the exact
  // sentence the fact guard exists to protect.
  if (rushY !== undefined && carries !== undefined) out.push(`ran ${carries} times for ${rushY} yards`);
  else if (rushY !== undefined) out.push(`ran for ${rushY} yards`);
  else if (carries !== undefined) out.push(`carried ${carries} times`);

  if (rushTd !== undefined) out.push(rushTd === 1 ? "scored a rushing touchdown" : `scored ${rushTd} rushing touchdowns`);
  if (passY !== undefined) out.push(`threw for ${passY} yards`);
  if (passTd !== undefined) out.push(passTd === 1 ? "threw a touchdown pass" : `threw ${passTd} touchdown passes`);

  if (recY !== undefined && catches !== undefined) out.push(`caught ${catches} passes for ${recY} yards`);
  else if (recY !== undefined) out.push(`had ${recY} receiving yards`);
  else if (catches !== undefined) out.push(catches === 1 ? "made a catch" : `caught ${catches} passes`);
  if (recTd !== undefined) out.push(recTd === 1 ? "caught a touchdown pass" : `caught ${recTd} touchdown passes`);

  if (td !== undefined) out.push(td === 1 ? "scored a touchdown" : `scored ${td} touchdowns`);
  if (fgs !== undefined) out.push(fgs === 1 ? "made a field goal" : `made ${fgs} field goals`);
  if (tackles !== undefined) out.push(`made ${tackles} tackles`);
  if (sacks !== undefined) out.push(sacks === 1 ? "had a sack" : `had ${sacks} sacks`);
  if (ints !== undefined) out.push(ints === 1 ? "intercepted a pass" : `had ${ints} interceptions`);
  if (fumbles !== undefined) out.push(fumbles === 1 ? "recovered a fumble" : `recovered ${fumbles} fumbles`);

  return out;
}

function joinClauses(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

export function describePerformance(line: PlayerLine): string {
  const parts = clausesFor(line);
  if (parts.length === 0) return "";
  return `${line.name} ${joinClauses(parts)}.`;
}

// ── Headline ────────────────────────────────────────────────────────────────

export function buildHeadline(game: GameRecord, discoveries: Discovery[], mascot: string): string {
  const comeback = discoveries.find((d) => d.kind === "comeback");
  const deficit = game.narrative.find((n) => n.deficit)?.deficit;
  const score = `${game.teamScore}-${game.opponentScore}`;
  const verb = game.result === "W" ? "WIN" : game.result === "L" ? "FALL" : "TIE";

  if (comeback && deficit && game.result === "W") {
    return `${mascot.toUpperCase()} RALLY FROM ${deficit.them - deficit.us} DOWN, WIN ${score}`;
  }
  const lead = leadPerformer(game);
  const big = discoveries.find((d) => d.kind === "player-season-high" || d.kind === "player-streak");
  if (lead && big && big.subject) {
    const stats = headlineStats(game, big.subject, 1);
    if (stats.length > 0) {
      return `${big.subject.toUpperCase()}'S ${statShort(stats[0].statId, stats[0].amount)}, ${mascot.toUpperCase()} ${verb} ${score}`;
    }
  }
  if (game.result === "W") return `${mascot.toUpperCase()} BEAT ${game.opponent.toUpperCase()} ${score}`;
  if (game.result === "L") return `${mascot.toUpperCase()} FALL TO ${game.opponent.toUpperCase()} ${score}`;
  return `${mascot.toUpperCase()} AND ${game.opponent.toUpperCase()} TIE ${score}`;
}

// ── The 20-second version ───────────────────────────────────────────────────

export function buildSummary(game: GameRecord, discoveries: Discovery[]): string {
  const day = weekdayOf(game.date);
  const deficit = game.narrative.find((n) => n.deficit)?.deficit;
  const lines: string[] = [];

  if (game.result === "W" && deficit && deficit.them > deficit.us) {
    lines.push(`${game.team} erased a ${deficit.them}-${deficit.us} deficit and beat ${game.opponent} ${game.teamScore}-${game.opponentScore} on ${day}.`);
  } else if (game.result === "W") {
    lines.push(`${game.team} beat ${game.opponent} ${game.teamScore}-${game.opponentScore} on ${day}.`);
  } else if (game.result === "L") {
    lines.push(`${game.team} lost to ${game.opponent} ${game.opponentScore}-${game.teamScore} on ${day}.`);
  } else {
    lines.push(`${game.team} and ${game.opponent} finished ${game.teamScore}-${game.opponentScore} on ${day}.`);
  }

  const lead = leadPerformer(game);
  const line = lead ? game.players.find((p) => p.name === lead.name) : undefined;
  if (line) {
    const sentence = describePerformance(line);
    if (sentence) lines.push(sentence);
  }

  const strongest = discoveries.find((d) => d.kind !== "record-change" && d.kind !== "comeback");
  if (strongest) lines.push(strongest.text);

  return lines.join(" ");
}

// ── The story ───────────────────────────────────────────────────────────────

/**
 * Paragraphs, longest-supported first. Sparse evidence produces a short story
 * on purpose — there is no filler paragraph to fall back on.
 */
export function buildStory(game: GameRecord, discoveries: Discovery[]): string[] {
  const paragraphs: string[] = [];
  const day = weekdayOf(game.date);
  const where = game.homeAway === "home" ? " at home" : game.homeAway === "away" ? ` at ${game.opponent}` : "";
  const deficit = game.narrative.find((n) => n.deficit)?.deficit;

  // 1. What happened.
  const opening: string[] = [];
  if (game.result === "W") {
    opening.push(
      deficit && deficit.them > deficit.us
        ? `${game.team} trailed ${deficit.them}-${deficit.us} and beat ${game.opponent} ${game.teamScore}-${game.opponentScore} on ${day}${where}.`
        : `${game.team} beat ${game.opponent} ${game.teamScore}-${game.opponentScore} on ${day}${where}.`,
    );
  } else if (game.result === "L") {
    opening.push(`${game.team} lost to ${game.opponent} ${game.opponentScore}-${game.teamScore} on ${day}${where}.`);
    if (deficit && deficit.them > deficit.us) opening.push(`${game.team} trailed ${deficit.them}-${deficit.us}.`);
  } else {
    opening.push(`${game.team} and ${game.opponent} tied ${game.teamScore}-${game.opponentScore} on ${day}${where}.`);
  }
  // The comeback discovery says the same thing as the opening sentence when a
  // deficit was verified, so it is only added when the opening could not say it.
  const comeback = discoveries.find((d) => d.kind === "comeback");
  if (comeback && game.result === "W" && !deficit) opening.push(comeback.text);
  paragraphs.push(opening.join(" "));

  // 2. Who did it. The lead performer, then one more if there is one.
  const ranked = [...game.players].sort((a, b) => {
    const s = (p: PlayerLine) => Object.entries(p.stats).reduce((t, [id, v]) => t + (statDef(id)?.weight ?? 0) * v.amount, 0);
    return s(b) - s(a);
  });
  const performance = ranked.slice(0, 2).map(describePerformance).filter(Boolean);
  if (performance.length > 0) {
    const leadDiscovery = discoveries.find(
      (d) => d.subject && d.subject === ranked[0]?.name && d.kind !== "record-when-player-threshold",
    );
    paragraphs.push([performance[0], leadDiscovery?.text, performance[1]].filter(Boolean).join(" "));
  }

  // 3. Anything else the archive turned up, minus what has already been said.
  const rest = discoveries.filter(
    (d) => d.kind !== "comeback" && d.kind !== "record-change" && !paragraphs.some((p) => p.includes(d.text)),
  );
  if (rest.length > 0) paragraphs.push(rest.slice(0, 2).map((d) => d.text).join(" "));

  // 4. Standing, then what is next — only if verified.
  const closing: string[] = [];
  // The record comes straight from the verified game, not from the ranked list,
  // so a crowded discovery board can never drop the team's standing.
  const record = game.recordAfter ?? undefined;
  if (record) {
    closing.push(`${game.team} is ${record.ties > 0 ? `${record.wins}-${record.losses}-${record.ties}` : `${record.wins}-${record.losses}`}.`);
  } else {
    const counted = discoveries.find((d) => d.kind === "record-change");
    if (counted) closing.push(counted.text);
  }
  if (game.next?.opponent) {
    closing.push(game.next.when ? `${game.opponent === game.next.opponent ? "A rematch with" : "Next up:"} ${game.next.opponent}, ${game.next.when}.` : `Next up: ${game.next.opponent}.`);
  }
  if (closing.length > 0) paragraphs.push(closing.join(" "));

  return paragraphs.filter((p) => p.trim().length > 0);
}

// ── The numbers block ───────────────────────────────────────────────────────

export interface NumberRow {
  label: string;
  value: string;
}

export function buildNumbers(game: GameRecord): NumberRow[] {
  const rows: NumberRow[] = [
    { label: "Final", value: `${game.team} ${game.teamScore}, ${game.opponent} ${game.opponentScore}` },
  ];
  if (game.recordAfter) {
    rows.push({
      label: "Record",
      value: game.recordAfter.ties > 0
        ? `${game.recordAfter.wins}-${game.recordAfter.losses}-${game.recordAfter.ties}`
        : `${game.recordAfter.wins}-${game.recordAfter.losses}`,
    });
  }
  for (const p of game.players) {
    const parts = Object.entries(p.stats)
      .sort(([a], [b]) => (statDef(b)?.weight ?? 0) - (statDef(a)?.weight ?? 0))
      .map(([id, v]) => statShort(id, v.amount));
    if (parts.length > 0) rows.push({ label: p.name, value: parts.join(" · ") });
  }
  return rows;
}

// ── The whole edition ───────────────────────────────────────────────────────

export interface Edition {
  headline: string;
  summary: string;
  story: string[];
  numbers: NumberRow[];
  discoveries: Discovery[];
  /** Set when a model rewrote the story and the rewrite was accepted. */
  writtenBy: "engine" | "model";
  /** Set when a model rewrite was rejected, so the failure is never silent. */
  guardNote?: string;
}

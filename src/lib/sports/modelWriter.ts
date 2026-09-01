// ─────────────────────────────────────────────────────────────────────────────
// Sports Desk — the optional model boundary.
//
// The engine does not need this file to work. It exists so a model can improve
// the PROSE, never the facts, and so no vendor is structurally required:
// anything speaking the OpenAI chat-completions shape works, including a local
// Ollama server (set SPORTS_DESK_MODEL_BASE_URL=http://localhost:11434/v1).
//
// Rules enforced by construction:
//   • the model receives ONLY approved facts and calculated discoveries
//   • the model is told it may not add a number or a name
//   • whatever comes back still goes through the fact guard in ./edition.ts
//   • no key, no model, no problem — the deterministic writer is the default
// ─────────────────────────────────────────────────────────────────────────────

import { statPhrase } from "./football.ts";
import type { Discovery, GameRecord } from "./types.ts";

export interface ModelWriter {
  name: string;
  write(prompt: string): Promise<string>;
}

export function configuredWriter(): ModelWriter | null {
  const apiKey = process.env.SPORTS_DESK_MODEL_API_KEY ?? process.env.OPENAI_API_KEY;
  const baseURL = process.env.SPORTS_DESK_MODEL_BASE_URL;
  const model = process.env.SPORTS_DESK_MODEL;
  // Opt-in only: writing stays deterministic until a model is named on purpose.
  if (!model || (!apiKey && !baseURL)) return null;

  return {
    name: model,
    async write(prompt: string) {
      const url = `${(baseURL ?? "https://api.openai.com/v1").replace(/\/$/, "")}/chat/completions`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (!res.ok) throw new Error(`model writer returned ${res.status}`);
      const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      return data.choices?.[0]?.message?.content ?? "";
    },
  };
}

const SYSTEM = [
  "You are a local high-school sports reporter writing a short game recap.",
  "You may only use the facts given to you. You may not add a number, a name, a statistic, a quote, or any detail that is not in the list — not carries, not attempts, not weather, not crowd, not injuries, not anything about a player's personal life.",
  "If a detail is missing, leave it out and write a shorter story. Never pad.",
  "Write plainly. No stock phrases like 'thrilling matchup', 'showcased their resilience', 'proved too much to handle'. Let the facts carry it.",
  "Two or three short paragraphs, separated by a blank line. No headline, no bullet points, no labels.",
].join(" ");

/** The only thing a model is ever shown: approved facts and counted discoveries. */
export function buildPrompt(game: GameRecord, discoveries: Discovery[]): string {
  const lines: string[] = [
    `Final: ${game.team} ${game.teamScore}, ${game.opponent} ${game.opponentScore}`,
    `Date: ${game.date}`,
  ];
  if (game.homeAway !== "unknown") lines.push(`Location: ${game.homeAway}`);
  if (game.recordAfter) lines.push(`${game.team} record after this game: ${game.recordAfter.wins}-${game.recordAfter.losses}${game.recordAfter.ties ? `-${game.recordAfter.ties}` : ""}`);
  for (const n of game.narrative) lines.push(`Verified detail: ${n.text}`);
  for (const p of game.players) {
    const parts = Object.entries(p.stats).map(([id, v]) => statPhrase(id, v.amount));
    lines.push(`${p.name}: ${parts.join(", ")}`);
  }
  for (const d of discoveries) lines.push(`Checked against the archive: ${d.text}`);
  if (game.next?.opponent) lines.push(`Next game: ${game.next.opponent}${game.next.when ? ` on ${game.next.when}` : ""}`);

  return `Write the recap using only these facts.\n\n${lines.join("\n")}`;
}

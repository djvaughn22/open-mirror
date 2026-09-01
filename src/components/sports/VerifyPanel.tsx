"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE 2 — verify.
//
// The operator is asked about UNCERTAINTY, not about everything. Confident
// reads sit quietly in their groups; anything the extractor had to guess at
// carries a plain sentence saying what was guessed and why, so the fix takes a
// second. Nothing on this screen is stored until Approve is pressed.
// ─────────────────────────────────────────────────────────────────────────────

import { FOOTBALL_STATS } from "@/lib/sports/football";
import type { CandidateFact, CandidateValue } from "@/lib/sports/types";

export interface Row extends CandidateFact {
  kept: boolean;
  edited?: boolean;
}

const GROUPS: Array<{ key: string; label: string; kinds: CandidateFact["kind"][] }> = [
  { key: "game", label: "Game", kinds: ["score", "game-date"] },
  { key: "team", label: "Team", kinds: ["record"] },
  { key: "performance", label: "Performance", kinds: ["player-stat"] },
  { key: "narrative", label: "What happened", kinds: ["narrative"] },
  { key: "next", label: "Next", kinds: ["next-game"] },
];

const input =
  "min-h-11 rounded-xl border border-[#26324c] bg-[#1c2740] px-3 text-sm font-bold text-[#e8edf5] outline-none focus:border-[#38bdf8]";

export default function VerifyPanel({
  rows,
  onChange,
  onAddStat,
}: {
  rows: Row[];
  onChange: (next: Row[]) => void;
  onAddStat: () => void;
}) {
  const update = (id: string, value: CandidateValue) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, value, edited: true, confidence: "high", uncertainty: undefined } : r)));
  const toggle = (id: string) => onChange(rows.map((r) => (r.id === id ? { ...r, kept: !r.kept } : r)));

  const unsure = rows.filter((r) => r.kept && r.uncertainty);

  return (
    <div>
      <p className="m-0 text-sm font-semibold leading-7 text-[#94a3b8]">
        {unsure.length === 0
          ? "Everything below was read cleanly. Check it, then approve."
          : `${unsure.length} ${unsure.length === 1 ? "thing needs" : "things need"} a look. The rest was read cleanly.`}
      </p>

      {GROUPS.map((group) => {
        const groupRows = rows.filter((r) => group.kinds.includes(r.kind));
        if (groupRows.length === 0) return null;
        return (
          <section key={group.key} className="mt-7">
            <h3 className="mb-3 border-b border-[#26324c] pb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
              {group.label}
            </h3>
            <div className="flex flex-col gap-3">
              {groupRows.map((row) => (
                <div
                  key={row.id}
                  className={`rounded-2xl border bg-[#141d2e] p-4 ${row.uncertainty && row.kept ? "border-[#38bdf8]" : "border-[#26324c]"} ${row.kept ? "" : "opacity-50"}`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="text-sm font-black">{row.label}</span>
                    <button
                      type="button"
                      onClick={() => toggle(row.id)}
                      className="shrink-0 rounded-full border border-[#26324c] bg-[#1c2740] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#94a3b8]"
                    >
                      {row.kept ? "Remove" : "Put back"}
                    </button>
                  </div>

                  <Fields value={row.value} onChange={(v) => update(row.id, v)} />

                  {row.uncertainty && row.kept ? (
                    <p className="mb-0 mt-3 text-xs font-bold leading-5 text-[#38bdf8]">{row.uncertainty}</p>
                  ) : null}
                  {row.quote ? (
                    <p className="mb-0 mt-2 text-xs font-medium italic leading-5 text-[#94a3b8]">
                      From your notes: &ldquo;{row.quote}&rdquo;
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            {group.key === "performance" ? (
              <button
                type="button"
                onClick={onAddStat}
                className="mt-3 min-h-11 rounded-full border border-[#26324c] bg-[#1c2740] px-4 text-sm font-black text-[#e8edf5]"
              >
                + Add a stat by hand
              </button>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function Fields({ value, onChange }: { value: CandidateValue; onChange: (v: CandidateValue) => void }) {
  switch (value.type) {
    case "score":
      return (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="w-24 shrink-0 truncate text-sm font-black">{value.team}</span>
            <input
              type="number" inputMode="numeric" className={`${input} w-20`} value={value.teamScore}
              onChange={(e) => onChange({ ...value, teamScore: Number(e.target.value) })}
              aria-label={`${value.team} score`}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <input
              className={`${input} w-24 shrink-0`} value={value.opponent} placeholder="Opponent"
              onChange={(e) => onChange({ ...value, opponent: e.target.value })}
              aria-label="Opponent"
            />
            <input
              type="number" inputMode="numeric" className={`${input} w-20`} value={value.opponentScore}
              onChange={(e) => onChange({ ...value, opponentScore: Number(e.target.value) })}
              aria-label="Opponent score"
            />
          </div>
          <select
            className={input} value={value.homeAway} aria-label="Home or away"
            onChange={(e) => onChange({ ...value, homeAway: e.target.value as typeof value.homeAway })}
          >
            <option value="unknown">Not recorded</option>
            <option value="home">Home</option>
            <option value="away">Away</option>
            <option value="neutral">Neutral site</option>
          </select>
        </div>
      );

    case "record":
      return (
        <div className="flex items-center gap-2.5">
          <input type="number" inputMode="numeric" className={`${input} w-20`} value={value.wins} aria-label="Wins"
            onChange={(e) => onChange({ ...value, wins: Number(e.target.value) })} />
          <span className="text-sm font-black text-[#94a3b8]">wins</span>
          <input type="number" inputMode="numeric" className={`${input} w-20`} value={value.losses} aria-label="Losses"
            onChange={(e) => onChange({ ...value, losses: Number(e.target.value) })} />
          <span className="text-sm font-black text-[#94a3b8]">losses</span>
        </div>
      );

    case "player-stat":
      return (
        <div className="flex flex-wrap items-center gap-2.5">
          <input className={`${input} w-32`} value={value.player} placeholder="Player" aria-label="Player"
            onChange={(e) => onChange({ ...value, player: e.target.value })} />
          <select className={`${input} flex-1`} value={value.stat} aria-label="Stat"
            onChange={(e) => onChange({ ...value, stat: e.target.value })}>
            {FOOTBALL_STATS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <input type="number" inputMode="numeric" className={`${input} w-24`} value={value.amount} aria-label="Amount"
            onChange={(e) => onChange({ ...value, amount: Number(e.target.value) })} />
        </div>
      );

    case "narrative":
      return (
        <div className="flex flex-col gap-2.5">
          <input className={input} value={value.text} aria-label="What happened"
            onChange={(e) => onChange({ ...value, text: e.target.value })} />
          {value.deficit ? (
            <button
              type="button"
              onClick={() => onChange({
                ...value,
                deficit: { us: value.deficit!.them, them: value.deficit!.us },
                text: value.text.replace(/(\d+)-(\d+)/, `${value.deficit!.us}-${value.deficit!.them}`),
              })}
              className="self-start rounded-full border border-[#26324c] bg-[#1c2740] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#e8edf5]"
            >
              Flip the score around
            </button>
          ) : null}
        </div>
      );

    case "next-game":
      return (
        <div className="flex flex-wrap items-center gap-2.5">
          <input className={`${input} flex-1`} value={value.opponent} placeholder="Opponent" aria-label="Next opponent"
            onChange={(e) => onChange({ ...value, opponent: e.target.value })} />
          <input className={`${input} w-32`} value={value.when} placeholder="When" aria-label="When"
            onChange={(e) => onChange({ ...value, when: e.target.value })} />
        </div>
      );

    case "game-date":
      return (
        <input type="date" className={input} value={value.date} aria-label="Game date"
          onChange={(e) => onChange({ ...value, date: e.target.value })} />
      );
  }
}

"use client";

// ─────────────────────────────────────────────────────────────────────────────
// THE SPORTS DESK — the operator's whole job, in one screen.
//
//   paste whatever you have  →  fix only what's wrong  →  approve
//
// There is no stat-entry form to fill out before anything useful happens, and
// nothing reaches the archive without a person pressing Approve.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { useRef, useState } from "react";

import VerifyPanel, { type Row } from "./VerifyPanel";
import type { CandidateFact, EvidenceItem } from "@/lib/sports/types";

export interface ArchiveRow {
  id: string;
  date: string;
  opponent: string;
  result: string;
  teamScore: number;
  opponentScore: number;
  demo: boolean;
}

type Step = "evidence" | "verify" | "saved";

const EXAMPLE =
  "Won 42-35 over Lafayette. We were down 21-7. Mason had 186 rushing and 3 TD. Eli had a late pick. We're 5-2 now and Eureka is Friday.";

export default function Desk({
  team,
  writable,
  archive,
}: {
  team: { name: string; mascot: string; level: string };
  writable: boolean;
  archive: ArchiveRow[];
}) {
  const [step, setStep] = useState<Step>("evidence");
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [savedId, setSavedId] = useState("");
  const [games, setGames] = useState(archive);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const read = async () => {
    if (!text.trim()) {
      setError("Paste something about the game first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/sports/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidence: [{ text, kind: "pasted-text", label: "Your notes" }] }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "The notes could not be read.");
        return;
      }
      setRows((data.candidates as CandidateFact[]).map((c) => ({ ...c, kept: true })));
      setEvidence(data.evidence as EvidenceItem[]);
      setNotes(data.notes as string[]);
      setStep("verify");
    } catch {
      setError("The desk could not be reached. Nothing was saved.");
    } finally {
      setBusy(false);
    }
  };

  const loadFile = async (file: File) => {
    // Text is what we can read honestly today: notes, exports, pasted stat
    // lines. Anything else is refused out loud rather than half-parsed.
    if (file.size > 1_000_000) {
      setError("That file is too large. Paste the part about the game instead.");
      return;
    }
    const content = await file.text();
    if (!content.trim()) {
      setError("That file had no text in it.");
      return;
    }
    setText((t) => (t.trim() ? `${t}\n\n${content}` : content));
    setError("");
  };

  const addStat = () =>
    setRows((r) => [
      ...r,
      {
        id: `manual-${r.length + 1}-${Date.now()}`,
        kind: "player-stat",
        label: "Added by hand",
        value: { type: "player-stat", player: "", stat: "rushingYards", amount: 0 },
        confidence: "high",
        quote: "",
        evidenceId: "operator",
        kept: true,
        edited: true,
      },
    ]);

  const approve = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/sports/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidates: rows, evidence }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "This game could not be saved.");
        return;
      }
      setSavedId(data.id);
      setStep("saved");
    } catch {
      setError("The desk could not be reached. Nothing was saved.");
    } finally {
      setBusy(false);
    }
  };

  const removeGame = async (id: string) => {
    if (!window.confirm(`Remove ${id} from the archive? Every calculation that used it changes.`)) return;
    const res = await fetch(`/api/sports/games/${id}`, { method: "DELETE" });
    if (res.ok) setGames((g) => g.filter((x) => x.id !== id));
    else setError("That game could not be removed.");
  };

  const startOver = () => {
    setStep("evidence");
    setText("");
    setRows([]);
    setEvidence([]);
    setNotes([]);
    setSavedId("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-[42rem] px-5 pb-24 pt-10">

        <p className="m-0 text-[11px] font-black uppercase tracking-[0.18em] text-[#38bdf8]">Sports Desk</p>
        <h1 className="mb-2 mt-2 text-3xl font-black leading-none tracking-tight sm:text-4xl">
          {team.name} {team.mascot}
        </h1>
        <p className="m-0 text-sm font-bold text-[#94a3b8]">{team.level}</p>

        {!writable ? (
          <p className="mt-5 rounded-xl border border-[#26324c] bg-[#141d2e] px-3.5 py-3 text-xs font-bold leading-5 text-[#94a3b8]">
            This copy of the desk cannot write to the archive. Run it on your own machine to record a game, then commit
            the new file to publish it.
          </p>
        ) : null}

        {/* ── Step 1: evidence ───────────────────────────────────────────── */}
        {step === "evidence" ? (
          <section className="mt-8">
            <h2 className="m-0 text-xl font-black">What happened?</h2>
            <p className="mb-4 mt-2 text-sm font-semibold leading-6 text-[#94a3b8]">
              Give it whatever you&rsquo;ve got — a sentence, a scorebook line, a stat export. You don&rsquo;t have to
              type it up first.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              placeholder="Paste anything about the game…"
              className="w-full rounded-2xl border border-[#26324c] bg-[#141d2e] p-4 text-base font-medium leading-7 text-[#e8edf5] outline-none focus:border-[#38bdf8]"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <button
                type="button" onClick={read} disabled={busy}
                className="min-h-11 rounded-full bg-[#38bdf8] px-5 text-sm font-black text-[#0b1220] disabled:opacity-60"
              >
                {busy ? "Reading…" : "Read the notes"}
              </button>
              <button
                type="button" onClick={() => fileRef.current?.click()}
                className="min-h-11 rounded-full border border-[#26324c] bg-[#1c2740] px-5 text-sm font-black text-[#e8edf5]"
              >
                Add a file
              </button>
              <button
                type="button" onClick={() => setText(EXAMPLE)}
                className="min-h-11 px-2 text-sm font-bold text-[#94a3b8] underline underline-offset-4"
              >
                Use an example
              </button>
              <input
                ref={fileRef} type="file" accept=".txt,.csv,.tsv,.md,text/plain,text/csv" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) void loadFile(f); e.target.value = ""; }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-[#94a3b8]">Text files for now — notes, CSV, or a stat export.</p>
          </section>
        ) : null}

        {/* ── Step 2: verify ─────────────────────────────────────────────── */}
        {step === "verify" ? (
          <section className="mt-8">
            <h2 className="m-0 text-xl font-black">Check the facts</h2>
            {notes.length > 0 ? (
              <ul className="mb-4 mt-3 flex list-none flex-col gap-2 p-0">
                {notes.map((n) => (
                  <li key={n} className="rounded-xl border border-[#26324c] bg-[#141d2e] px-3.5 py-2.5 text-xs font-bold leading-5 text-[#94a3b8]">
                    {n}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-3">
              <VerifyPanel rows={rows} onChange={setRows} onAddStat={addStat} />
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <button
                type="button" onClick={approve} disabled={busy || !writable}
                className="min-h-11 rounded-full bg-[#38bdf8] px-5 text-sm font-black text-[#0b1220] disabled:opacity-60"
              >
                {busy ? "Saving…" : "Approve and remember this game"}
              </button>
              <button
                type="button" onClick={() => setStep("evidence")}
                className="min-h-11 rounded-full border border-[#26324c] bg-[#1c2740] px-5 text-sm font-black text-[#e8edf5]"
              >
                Back to the notes
              </button>
            </div>
          </section>
        ) : null}

        {/* ── Step 3: saved ──────────────────────────────────────────────── */}
        {step === "saved" ? (
          <section className="mt-8">
            <h2 className="m-0 text-xl font-black">Saved.</h2>
            <p className="mb-5 mt-2 text-sm font-semibold leading-6 text-[#94a3b8]">
              The game is in the archive, and every game after it will be compared against it.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href={`/sports/${savedId}`}
                className="min-h-11 rounded-full bg-[#38bdf8] px-5 pt-2.5 text-sm font-black text-[#0b1220]"
              >
                Open the Game Edition
              </Link>
              <Link
                href={`/sports/${savedId}/card`}
                className="min-h-11 rounded-full border border-[#26324c] bg-[#1c2740] px-5 pt-2.5 text-sm font-black text-[#e8edf5]"
              >
                Get the card
              </Link>
              <button
                type="button" onClick={startOver}
                className="min-h-11 rounded-full border border-[#26324c] bg-[#1c2740] px-5 text-sm font-black text-[#e8edf5]"
              >
                Record another game
              </button>
            </div>
          </section>
        ) : null}

        {error ? (
          <p role="alert" className="mt-5 rounded-xl border border-[#38bdf8] bg-[#141d2e] px-3.5 py-3 text-sm font-bold leading-6 text-[#e8edf5]">
            {error}
          </p>
        ) : null}

        {/* ── The archive ────────────────────────────────────────────────── */}
        {step !== "verify" ? (
          <section className="mt-14">
            <h2 className="mb-3 border-b border-[#26324c] pb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
              The archive · {games.length} games
            </h2>
            <p className="mb-4 mt-0 text-xs font-semibold leading-5 text-[#94a3b8]">
              These are the games every comparison is measured against. Remove one and the streaks, season highs, and
              records recalculate.
            </p>
            <ul className="flex list-none flex-col gap-2 p-0">
              {games.map((g) => (
                <li key={g.id} className="flex items-center gap-3 rounded-xl border border-[#26324c] bg-[#141d2e] px-3.5 py-3">
                  <Link href={`/sports/${g.id}`} className="min-w-0 flex-1 text-sm font-bold">
                    <span className="text-[#94a3b8]">{g.date}</span>{" "}
                    {g.result} {g.teamScore}-{g.opponentScore} · {g.opponent}
                    {g.demo ? <span className="text-[#94a3b8]"> · Demo</span> : null}
                  </Link>
                  <button
                    type="button" onClick={() => void removeGame(g.id)} disabled={!writable}
                    className="shrink-0 rounded-full border border-[#26324c] bg-[#1c2740] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#94a3b8] disabled:opacity-40"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <Link href="/sports" className="mt-4 inline-block text-sm font-black text-[#38bdf8]">
              See what readers see →
            </Link>
          </section>
        ) : null}
      </div>
    </main>
  );
}

"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Report a final.
//
// The target is fifteen seconds on a phone in a parking lot. Everything that
// can be decided for the reporter is decided for them: their team is fixed,
// the date defaults to today, the sport list is only sports their school
// actually plays. What is left is three taps and two numbers.
//
// Nothing here computes a record, a headline, a caption or a stat line. The
// engine does all of that from the score. Asking a coach for it would be asking
// them to do our job.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState } from "react";

export interface ReportOption {
  id: string;
  label: string;
}

export interface ReportFinalProps {
  /** Present for an authorized link; absent on the public form. */
  token?: string;
  /** Fixed for authorized reporters, chosen on the public form. */
  school?: ReportOption;
  schoolChoices?: ReportOption[];
  sports: ReportOption[];
  opponents: ReportOption[];
  today: string;
  /** Public submissions are told plainly that they go to review. */
  publicMode: boolean;
}

type Outcome = { status: string; message: string; eventUrl?: string; schoolUrl?: string; duplicate?: boolean };

const FIELD =
  "w-full rounded-xl border border-[#2a3242] bg-[#12161f] px-4 py-3.5 text-[1rem] font-semibold text-[#e8edf5] outline-none focus:border-[#7dd3fc]";
const LABEL = "mb-1.5 block text-[11px] font-black uppercase tracking-[0.16em] text-[#7dd3fc]";

export default function ReportFinal(props: ReportFinalProps) {
  const { token, school, schoolChoices, sports, opponents, today, publicMode } = props;

  const [schoolId, setSchoolId] = useState(school?.id ?? schoolChoices?.[0]?.id ?? "");
  const [sport, setSport] = useState(sports[0]?.id ?? "");
  const [opponentName, setOpponentName] = useState("");
  const [ourScore, setOurScore] = useState("");
  const [theirScore, setTheirScore] = useState("");
  const [date, setDate] = useState(today);
  const [homeAway, setHomeAway] = useState<"home" | "away" | "unknown">("home");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | undefined>();
  const [error, setError] = useState<string | undefined>();

  const teamName = useMemo(
    () => school?.label ?? schoolChoices?.find((s) => s.id === schoolId)?.label ?? "your team",
    [school, schoolChoices, schoolId],
  );

  const ready = schoolId && sport && opponentName.trim() && ourScore !== "" && theirScore !== "" && date;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError(undefined);
    try {
      const response = await fetch("/api/sports/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          schoolId,
          sport,
          opponentName,
          ourScore: Number(ourScore),
          theirScore: Number(theirScore),
          date,
          homeAway,
          note: note.trim() || undefined,
        }),
      });
      const data = (await response.json()) as Outcome & { error?: string };
      if (!response.ok) setError(data.error ?? "That did not go through.");
      else setOutcome(data);
    } catch {
      setError("No connection. Your score was not sent — try again.");
    } finally {
      setBusy(false);
    }
  }

  if (outcome) return <Done outcome={outcome} teamName={teamName} />;

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {schoolChoices ? (
        <div>
          <label className={LABEL} htmlFor="school">Your team</label>
          <select id="school" className={FIELD} value={schoolId} onChange={(e) => setSchoolId(e.target.value)}>
            {schoolChoices.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      ) : (
        <p className="m-0 text-[1.05rem] font-black text-[#e8edf5]">
          Reporting for <span className="text-[#7dd3fc]">{teamName}</span>
        </p>
      )}

      <div>
        <label className={LABEL} htmlFor="sport">Sport</label>
        <select id="sport" className={FIELD} value={sport} onChange={(e) => setSport(e.target.value)}>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={LABEL} htmlFor="opponent">Opponent</label>
        <input
          id="opponent"
          className={FIELD}
          list="opponent-list"
          value={opponentName}
          onChange={(e) => setOpponentName(e.target.value)}
          placeholder="Start typing a school"
          autoComplete="off"
        />
        <datalist id="opponent-list">
          {opponents.map((o) => (
            <option key={o.id} value={o.label} />
          ))}
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL} htmlFor="ours">Our score</label>
          <input
            id="ours"
            className={`${FIELD} text-center text-[1.6rem] font-black`}
            inputMode="numeric"
            pattern="[0-9]*"
            value={ourScore}
            onChange={(e) => setOurScore(e.target.value.replace(/\D/g, "").slice(0, 3))}
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="theirs">Their score</label>
          <input
            id="theirs"
            className={`${FIELD} text-center text-[1.6rem] font-black`}
            inputMode="numeric"
            pattern="[0-9]*"
            value={theirScore}
            onChange={(e) => setTheirScore(e.target.value.replace(/\D/g, "").slice(0, 3))}
          />
        </div>
      </div>

      <div>
        <span className={LABEL}>Where</span>
        <div className="grid grid-cols-3 gap-2">
          {(["home", "away", "unknown"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setHomeAway(v)}
              className={`rounded-xl border px-3 py-3 text-[13px] font-bold capitalize transition ${
                homeAway === v
                  ? "border-[#7dd3fc] bg-[#7dd3fc] text-[#0b0e14]"
                  : "border-[#2a3242] text-[#94a3b8]"
              }`}
            >
              {v === "unknown" ? "Neutral" : v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="date">Date</label>
        <input id="date" type="date" className={FIELD} value={date} max={today} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div>
        <label className={LABEL} htmlFor="note">Anything worth noting (optional)</label>
        <textarea
          id="note"
          className={`${FIELD} min-h-[76px]`}
          maxLength={240}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="One line. Only if you want to."
        />
      </div>

      {error ? (
        <p className="m-0 rounded-xl border border-[#3a1d1d] bg-[#160f0f] px-4 py-3 text-[0.9rem] font-semibold text-[#fca5a5]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!ready || busy}
        className="rounded-2xl bg-[#7dd3fc] px-5 py-4 text-[1.05rem] font-black text-[#0b0e14] transition disabled:opacity-40"
      >
        {busy ? "Sending…" : "Report final"}
      </button>

      <p className="m-0 text-center text-[12px] font-semibold leading-5 text-[#64748b]">
        {publicMode
          ? "Community reports are checked by a person before they publish."
          : "We write the story, the graphic and the archive. You just send the score."}
      </p>
    </form>
  );
}

function Done({ outcome, teamName }: { outcome: Outcome; teamName: string }) {
  const published = outcome.status === "published";
  return (
    <div className="flex flex-col gap-5">
      <div
        className={`rounded-2xl px-5 py-5 ${published ? "bg-[#14331f] text-[#86efac]" : "bg-[#1c2331] text-[#cbd5e1]"}`}
      >
        <p className="m-0 text-[11px] font-black uppercase tracking-[0.16em]">
          {published ? "Published" : "Thanks — with our desk"}
        </p>
        <p className="m-0 mt-2 text-[1.05rem] font-bold leading-6">{outcome.message}</p>
      </div>

      {published && outcome.eventUrl ? (
        <>
          <a
            href={outcome.eventUrl}
            className="rounded-2xl bg-[#7dd3fc] px-5 py-4 text-center text-[1.05rem] font-black text-[#0b0e14]"
          >
            See your game story
          </a>
          <ShareButton url={outcome.eventUrl} teamName={teamName} />
        </>
      ) : null}

      {outcome.schoolUrl ? (
        <a
          href={outcome.schoolUrl}
          className="rounded-2xl border border-[#2a3242] px-5 py-4 text-center text-[1rem] font-bold text-[#e8edf5]"
        >
          Your school&rsquo;s sports page
        </a>
      ) : null}
    </div>
  );
}

/** Native share where the phone offers it, clipboard everywhere else. */
function ShareButton({ url, teamName }: { url: string; teamName: string }) {
  const [copied, setCopied] = useState(false);
  const full = typeof window === "undefined" ? url : new URL(url, window.location.origin).toString();

  async function share() {
    const text = `${teamName} result — Open Mirror St. Louis`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: text, url: full });
        return;
      } catch {
        // The reader dismissed the sheet. Fall through to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="rounded-2xl border border-[#7dd3fc] px-5 py-4 text-[1rem] font-black text-[#7dd3fc]"
    >
      {copied ? "Link copied" : "Send it to the team"}
    </button>
  );
}

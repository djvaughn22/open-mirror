// ─────────────────────────────────────────────────────────────────────────────
// The review queue — what the wire could not settle on its own.
//
// The whole design is that the wire fails closed, which means it deliberately
// produces a pile of "I don't know" every night. This is that pile, and working
// it is the operator's real job now: approve an alias, settle a disagreement.
// Every alias added here makes the next run resolve more on its own, which is
// how the school registry compounds into something nobody else has.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

import { longDateOf } from "@/lib/sports/brief";
import { sportLabel } from "@/lib/sports/graph/sports";
import type { CanonicalEvent, School } from "@/lib/sports/graph/types";

export interface PendingSubmission {
  id: string;
  origin: string;
  schoolName: string;
  opponentName: string;
  sport: string;
  scoreline: string;
  date: string;
  reason?: string;
  receivedAt: string;
  note?: string;
}

export interface ReviewQueueProps {
  conflicted: CanonicalEvent[];
  unresolved: CanonicalEvent[];
  /** Distinct names that need an alias, most frequent first. */
  unresolvedNames: Array<{ name: string; count: number }>;
  schools: Map<string, School>;
  publishedCount: number;
  /** Reports waiting on a person — public ones and anything that conflicted. */
  pendingSubmissions: PendingSubmission[];
  /** Authorized reports that published without anyone touching them. */
  autoPublishedCount: number;
  /** What this deployment writes to, so the desk knows if writes are durable. */
  storage: string;
  storageWritable: boolean;
}

export default function ReviewQueue({
  conflicted,
  unresolved,
  unresolvedNames,
  schools,
  publishedCount,
  pendingSubmissions,
  autoPublishedCount,
  storage,
  storageWritable,
}: ReviewQueueProps) {
  const nameOf = (id: string) => schools.get(id)?.shortName ?? id.replace(/^unresolved:/, "");
  const nothingPending = conflicted.length === 0 && unresolved.length === 0 && pendingSubmissions.length === 0;

  return (
    <section className="mx-auto w-full max-w-[46rem] px-4 pb-10 pt-8 sm:px-6">
      <p className="m-0 text-[10px] font-black uppercase tracking-[0.22em] text-[#7dd3fc]">Review queue</p>
      <h2 className="m-0 mt-2 text-[1.6rem] font-black leading-tight tracking-tight text-[#f1f5f9]">
        What the wire held back
      </h2>
      <p className="m-0 mt-2.5 text-[0.9rem] font-medium leading-6 text-[#94a3b8]">
        The wire published {publishedCount} {publishedCount === 1 ? "game" : "games"} on its own, {autoPublishedCount}{" "}
        of them straight from a school&rsquo;s own report with nobody touching it. Below are only the ones that need a
        person: a community report, two sources disagreeing, or a school name we have never seen.
      </p>

      <p className="m-0 mt-3 text-[12px] font-semibold text-[#64748b]">
        Writes go to <span className="text-[#cbd5e1]">{storage}</span>
        {storageWritable ? "" : " — which is read-only here, so submissions cannot be saved"}.
      </p>

      {nothingPending ? (
        <p className="mt-6 rounded-xl border border-[#232a38] bg-[#12161f] px-4 py-3 text-[0.9rem] font-semibold text-[#86efac]">
          Nothing is waiting. Every game the wire found either published or is still scheduled.
        </p>
      ) : null}

      {pendingSubmissions.length > 0 ? (
        <div className="mt-7">
          <h3 className="m-0 mb-2.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#7dd3fc]">
            Reports waiting on you ({pendingSubmissions.length})
          </h3>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {pendingSubmissions.map((s) => (
              <li key={s.id} className="rounded-xl border border-[#232a38] bg-[#12161f] p-4">
                <p className="m-0 text-[0.95rem] font-black text-[#f1f5f9]">{s.scoreline}</p>
                <p className="m-0 mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#94a3b8]">
                  {s.sport} · {s.date} · {s.origin === "authorized" ? "school report" : "community report"}
                </p>
                {s.reason ? (
                  <p className="m-0 mt-2 text-[0.85rem] font-semibold text-[#fcd34d]">{s.reason}</p>
                ) : null}
                {s.note ? (
                  <p className="m-0 mt-2 text-[0.85rem] font-medium italic text-[#cbd5e1]">&ldquo;{s.note}&rdquo;</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {conflicted.length > 0 ? (
        <div className="mt-7">
          <h3 className="m-0 mb-2.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#fca5a5]">
            Sources disagree ({conflicted.length})
          </h3>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {conflicted.map((e) => (
              <li key={e.id} className="rounded-xl border border-[#3a1d1d] bg-[#160f0f] p-4">
                <p className="m-0 text-[0.95rem] font-black text-[#f1f5f9]">
                  {nameOf(e.sides[0].schoolId)} vs. {nameOf(e.sides[1].schoolId)}
                </p>
                <p className="m-0 mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#94a3b8]">
                  {sportLabel(e.sport)} · {longDateOf(e.date)}
                </p>
                {e.conflicts.map((c) => (
                  <p key={c.field} className="m-0 mt-2 text-[0.85rem] font-semibold text-[#e2e8f0]">
                    <span className="uppercase text-[#fca5a5]">{c.field}:</span>{" "}
                    {c.accounts.map((a) => `${a.value} (${a.sourceIds.join(", ")})`).join("  vs.  ")}
                  </p>
                ))}
                <Link href={`/sports/${e.id}`} className="mt-2 inline-block text-[11px] font-bold text-[#7dd3fc] hover:underline">
                  Open the receipts →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {unresolvedNames.length > 0 ? (
        <div className="mt-7">
          <h3 className="m-0 mb-2.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#fcd34d]">
            Names needing an alias ({unresolvedNames.length})
          </h3>
          <p className="m-0 mb-3 text-[0.85rem] font-medium leading-5 text-[#94a3b8]">
            Add the ones that are St. Louis schools to{" "}
            <code className="rounded bg-[#1c2331] px-1.5 py-0.5 text-[0.8rem] text-[#e2e8f0]">
              src/lib/sports/metros/stLouisSchools.ts
            </code>
            . Leave out-of-metro opponents alone — they are correctly unresolved.
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {unresolvedNames.map(({ name, count }) => (
              <li
                key={name}
                className="rounded-full border border-[#33291a] bg-[#161208] px-3 py-1.5 text-[12px] font-bold text-[#fcd34d]"
              >
                {name}
                {count > 1 ? <span className="ml-1.5 text-[#a16207]">×{count}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {unresolved.length > 0 ? (
        <p className="mt-5 text-[0.85rem] font-semibold text-[#64748b]">
          {unresolved.length} {unresolved.length === 1 ? "game is" : "games are"} unpublished because one team could not
          be identified.
        </p>
      ) : null}
    </section>
  );
}

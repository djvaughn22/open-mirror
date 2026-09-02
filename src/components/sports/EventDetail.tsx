// ─────────────────────────────────────────────────────────────────────────────
// One canonical event, with its receipts.
//
// The feed is the product; this page is the proof behind one card. It shows the
// brief, then every account we have of the game, then what we could not settle.
// A conflicted game is the most important thing this page renders: it says out
// loud that two schools disagree, shows both numbers, and publishes neither as
// the result.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

import { longDateOf, weekdayOf } from "@/lib/sports/brief";
import { sportLabel } from "@/lib/sports/graph/sports";
import { buildSocialPost } from "@/lib/sports/social";
import { STUDIO } from "@/lib/products";
import type { Brief } from "@/lib/sports/brief";
import type { CanonicalEvent, School } from "@/lib/sports/graph/types";

const CONFIDENCE_COPY: Record<CanonicalEvent["confidence"], { label: string; detail: string; tone: string }> = {
  confirmed: {
    label: "Confirmed",
    detail: "More than one school reported this game and their accounts agree.",
    tone: "bg-[#14331f] text-[#86efac]",
  },
  "single-source": {
    label: "One source",
    detail: "One school reported this game. Nothing contradicts it, and nothing corroborates it yet.",
    tone: "bg-[#1c2331] text-[#94a3b8]",
  },
  conflicted: {
    label: "Conflicting reports",
    detail:
      "Sources disagree about this game, so the score is withheld. We would rather publish less than pick whichever number looks right.",
    tone: "bg-[#3a1d1d] text-[#fca5a5]",
  },
  unresolved: {
    label: "School not identified",
    detail:
      "One of the teams could not be matched to a school we know, so this game is not published. It is waiting on the review desk.",
    tone: "bg-[#33291a] text-[#fcd34d]",
  },
};

export default function EventDetail({
  event,
  brief,
  schools,
}: {
  event: CanonicalEvent;
  brief: Brief;
  schools: Map<string, School>;
}) {
  const confidence = CONFIDENCE_COPY[event.confidence];
  const nameOf = (id: string) => schools.get(id)?.name ?? id.replace(/^unresolved:/, "");
  // The same verified facts every channel would get. One fact set, many renders.
  const social = event.publishable ? buildSocialPost(event, brief, schools, STUDIO.url) : undefined;

  return (
    <main className="min-h-screen bg-[#0b0e14] text-[#e8edf5]">
      <div className="mx-auto w-full max-w-[42rem] px-4 pb-24 pt-8 sm:px-6">
        <Link href="/sports" className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7dd3fc] hover:underline">
          ← St. Louis sports
        </Link>

        <p className="m-0 mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
          {sportLabel(event.sport)} · {weekdayOf(event.date)}, {longDateOf(event.date)}
        </p>

        <h1 className="m-0 mt-2 text-[2rem] font-black leading-[1.08] tracking-tight sm:text-[2.4rem]">
          {brief.scoreline}
        </h1>

        <p className="m-0 mt-4 text-[1.05rem] font-medium leading-7 text-[#cbd5e1]">{brief.body}</p>

        <div className={`mt-6 rounded-2xl px-4 py-3 ${confidence.tone}`}>
          <p className="m-0 text-[11px] font-black uppercase tracking-[0.14em]">{confidence.label}</p>
          <p className="m-0 mt-1.5 text-[0.85rem] font-semibold leading-5 opacity-90">{confidence.detail}</p>
        </div>

        {/* Conflicts, spelled out. This is the page's most important section. */}
        {event.conflicts.length > 0 ? (
          <section className="mt-8">
            <h2 className="m-0 mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">
              What the sources disagree about
            </h2>
            {event.conflicts.map((c) => (
              <div key={c.field} className="mb-3 rounded-xl border border-[#3a1d1d] bg-[#160f0f] p-4">
                <p className="m-0 text-[11px] font-black uppercase tracking-[0.12em] text-[#fca5a5]">{c.field}</p>
                <ul className="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
                  {c.accounts.map((a) => (
                    <li key={a.value} className="text-[0.85rem] font-semibold text-[#e2e8f0]">
                      <span className="font-mono">{a.value}</span>
                      <span className="ml-2 text-[#94a3b8]">— {a.sourceIds.join(", ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ) : null}

        {/* Provenance: every account, linked. */}
        <section className="mt-8">
          <h2 className="m-0 mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">
            Where this came from
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {event.observations.map((o) => (
              <li key={o.id} className="rounded-xl border border-[#232a38] bg-[#12161f] p-4">
                <p className="m-0 text-[0.9rem] font-bold text-[#e2e8f0]">
                  {nameOf(o.reporter.schoolId)} reported{" "}
                  {o.scoreFor !== undefined && o.scoreAgainst !== undefined
                    ? `${o.scoreFor}-${o.scoreAgainst}`
                    : "a scheduled game"}{" "}
                  {o.homeAway === "away" ? "away at" : o.homeAway === "home" ? "at home against" : "against"}{" "}
                  {o.unresolvedOpponent ?? nameOf(o.opponent?.schoolId ?? "")}
                </p>
                <a
                  href={o.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1.5 inline-block break-all text-[11px] font-semibold text-[#7dd3fc] underline underline-offset-2"
                >
                  {o.sourceUrl}
                </a>
                <p className="m-0 mt-1.5 text-[11px] font-semibold text-[#475569]">
                  Read {new Date(o.fetchedAt).toLocaleString("en-US", { timeZone: "America/Chicago" })} Central
                </p>
              </li>
            ))}
          </ul>
        </section>

        {social ? (
          <section className="mt-8">
            <h2 className="m-0 mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">
              Ready to share
            </h2>
            <div className="rounded-2xl border border-[#232a38] bg-[#12161f] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#1c2331] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#7dd3fc]">
                  {social.card.kicker}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#64748b]">
                  {social.card.sport} · {social.card.dateLabel}
                </span>
              </div>
              <p className="m-0 mt-3 whitespace-pre-line text-[0.88rem] font-medium leading-6 text-[#cbd5e1]">
                {social.caption}
              </p>
              <p className="m-0 mt-3 text-[11px] font-bold text-[#7dd3fc]">{social.hashtags.join(" ")}</p>
              <p className="m-0 mt-3 text-[11px] font-semibold text-[#475569]">
                Every channel sends these exact facts. There is no separate version for anywhere.
              </p>
            </div>
          </section>
        ) : null}

        {event.unresolvedNames.length > 0 ? (
          <p className="mt-6 rounded-xl border border-[#33291a] bg-[#161208] px-4 py-3 text-[0.85rem] font-semibold text-[#fcd34d]">
            Not yet matched to a school we know: {event.unresolvedNames.join(", ")}.
          </p>
        ) : null}

        <p className="mt-10 text-[0.8rem] font-semibold leading-5 text-[#475569]">
          Facts on this page come from the schools&rsquo; own published results. Scores, dates and opponents are
          reported as found; no statistic here was generated.
        </p>
      </div>
    </main>
  );
}

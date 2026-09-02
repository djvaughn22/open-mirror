// A school's automatic sports desk — the page a coach gets for sending a score.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { longDateOf, weekdayOf } from "@/lib/sports/brief";
import { sportsRepository } from "@/lib/sports/repo";
import { buildSchoolPage, schoolById } from "@/lib/sports/schoolPage";
import { sportLabel } from "@/lib/sports/graph/sports";
import { ST_LOUIS } from "@/lib/sports/metros/stLouis";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ schoolSlug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { schoolSlug } = await params;
  const school = schoolById(schoolSlug);
  if (!school) return { title: "School not found" };
  return {
    title: `${school.name} — Sports`,
    description: `Results and short briefs for ${school.name}, from the Open Mirror St. Louis sports wire.`,
    alternates: { canonical: `/sports/schools/${school.id}` },
  };
}

export default async function SchoolPage({ params }: Params) {
  const { schoolSlug } = await params;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: ST_LOUIS.timezone, dateStyle: "short" }).format(new Date());
  const data = buildSchoolPage(schoolSlug, await sportsRepository().listEvents(), today);
  if (!data) notFound();

  const { school, results, upcoming, sports, totalTracked } = data;

  return (
    <main className="min-h-screen bg-[#0b0e14] text-[#e8edf5]">
      <div className="mx-auto w-full max-w-[46rem] px-4 pb-24 pt-8 sm:px-6">
        <Link href="/sports" className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7dd3fc] hover:underline">
          ← St. Louis sports
        </Link>

        <header className="mt-6 border-b border-[#232a38] pb-5">
          <p className="m-0 text-[10px] font-black uppercase tracking-[0.22em] text-[#7dd3fc]">
            {school.city}, {school.state}
          </p>
          <h1 className="m-0 mt-2 text-[2.1rem] font-black leading-[1.05] tracking-tight sm:text-[2.5rem]">
            {school.name}
          </h1>
          {school.nickname ? (
            <p className="m-0 mt-1.5 text-[0.95rem] font-bold text-[#94a3b8]">{school.nickname}</p>
          ) : null}
        </header>

        {sports.length > 0 ? (
          <section className="mt-6">
            <div className="flex flex-wrap gap-2">
              {sports.map((s) => (
                <span
                  key={s.sport}
                  className="rounded-full border border-[#2a3242] px-3.5 py-1.5 text-[12px] font-bold text-[#cbd5e1]"
                >
                  {s.label}{" "}
                  <span className="text-[#7dd3fc]">
                    {s.wins}-{s.losses}
                    {s.ties > 0 ? `-${s.ties}` : ""}
                  </span>
                </span>
              ))}
            </div>
            {/* The honest caveat, in the same breath as the numbers. */}
            <p className="m-0 mt-3 text-[12px] font-semibold leading-5 text-[#64748b]">
              Counted from the {totalTracked} {totalTracked === 1 ? "game" : "games"} we have tracked, not a full season
              record.
            </p>
          </section>
        ) : null}

        {results.length === 0 ? (
          <section className="mt-10 rounded-2xl border border-[#232a38] bg-[#101520] p-5">
            <h2 className="m-0 text-[1.1rem] font-black">No results here yet.</h2>
            <p className="m-0 mt-2.5 text-[0.9rem] font-medium leading-6 text-[#94a3b8]">
              We have not seen a final for {school.shortName} yet. If you are with the program, you can send us one and
              it will appear here within seconds.
            </p>
            <Link
              href="/sports/for-schools"
              className="mt-4 inline-block rounded-xl bg-[#7dd3fc] px-4 py-2.5 text-[0.9rem] font-black text-[#0b0e14]"
            >
              Get your team a reporting link
            </Link>
          </section>
        ) : (
          <section className="mt-8">
            <h2 className="m-0 mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">Results</h2>
            <div className="flex flex-col gap-3">
              {results.map(({ event, brief, outcome, credits }) => (
                <article key={event.id} className="rounded-2xl border border-[#232a38] bg-[#12161f] p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-black ${
                        outcome === "W" ? "bg-[#14331f] text-[#86efac]" : outcome === "L" ? "bg-[#1c2331] text-[#94a3b8]" : "bg-[#1b2a3a] text-[#7dd3fc]"
                      }`}
                    >
                      {outcome}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7dd3fc]">
                      {sportLabel(event.sport)}
                    </span>
                    <span className="text-[11px] font-semibold text-[#64748b]">
                      {weekdayOf(event.date)}, {longDateOf(event.date)}
                    </span>
                  </div>

                  <Link href={`/sports/${event.id}`} className="mt-2 block">
                    <h3 className="m-0 text-[1.25rem] font-black leading-tight tracking-tight text-[#f1f5f9]">
                      {brief.scoreline}
                    </h3>
                  </Link>
                  <p className="m-0 mt-2 text-[0.92rem] font-medium leading-6 text-[#cbd5e1]">{brief.body}</p>
                  <p className="m-0 mt-2.5 text-[11px] font-semibold text-[#64748b]">
                    Reported by {credits.join(", ")}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {upcoming.length > 0 ? (
          <section className="mt-10">
            <h2 className="m-0 mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">Next up</h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {upcoming.map(({ event, opponentName, date }) => (
                <li
                  key={event.id}
                  className="flex items-baseline gap-3 rounded-xl border border-[#1c2331] px-4 py-2.5 text-sm"
                >
                  <span className="font-bold text-[#cbd5e1]">
                    {sportLabel(event.sport)} vs. {opponentName}
                  </span>
                  <span className="ml-auto shrink-0 text-[11px] font-semibold text-[#64748b]">
                    {weekdayOf(date)}, {longDateOf(date)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-12 rounded-2xl border border-[#232a38] bg-[#101520] p-5">
          <h2 className="m-0 text-[11px] font-black uppercase tracking-[0.18em] text-[#7dd3fc]">
            Is this your program?
          </h2>
          <p className="m-0 mt-2.5 text-[0.9rem] font-medium leading-6 text-[#94a3b8]">
            Send us your final after the game and this page updates itself — with the story, the share graphic and a
            place on the St. Louis feed. Free, and there is nothing to learn.
          </p>
          <Link
            href="/sports/for-schools"
            className="mt-4 inline-block rounded-xl bg-[#7dd3fc] px-4 py-2.5 text-[0.9rem] font-black text-[#0b0e14]"
          >
            Get your team link
          </Link>
        </section>
      </div>
    </main>
  );
}

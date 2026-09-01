// The season index. A list of games, newest first, and nothing else — the
// editions are the product, this is just the way in.

import type { Metadata } from "next";
import Link from "next/link";

import { computedRecord, formatRecord } from "@/lib/sports/history";
import { store } from "@/lib/sports/store";
import { TEAM } from "@/lib/sports/team";
import { buildHeadline } from "@/lib/sports/writer";
import { findStories } from "@/lib/sports/storyFinder";

export const metadata: Metadata = {
  title: `${TEAM.name} ${TEAM.mascot} — Game Editions`,
  description: `${TEAM.level} coverage for ${TEAM.name}. Every game, written from verified facts.`,
  alternates: { canonical: "/sports" },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const shortDate = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}`;
};

export default function SportsIndexPage() {
  const games = store.list();
  const newestFirst = [...games].reverse();
  const record = computedRecord(games);
  const anyDemo = games.some((g) => g.demo);

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-[42rem] px-5 pb-24 pt-10">

        <p className="m-0 text-[11px] font-black uppercase tracking-[0.18em] text-[#38bdf8]">{TEAM.level}</p>
        <h1 className="mb-2 mt-2 text-4xl font-black leading-none tracking-tight">
          {TEAM.name} {TEAM.mascot}
        </h1>
        <p className="m-0 text-sm font-bold text-[#94a3b8]">
          {games.length === 0 ? "No games recorded yet." : `${formatRecord(record)} · ${games.length} games on file`}
        </p>

        {anyDemo ? (
          <p className="mt-5 rounded-xl border border-[#26324c] bg-[#141d2e] px-3.5 py-2.5 text-xs font-bold text-[#94a3b8]">
            Games marked <span className="text-[#e8edf5]">Demo</span> were seeded to show how the desk works. They are not
            reported results.
          </p>
        ) : null}

        {games.length === 0 ? (
          <p className="mt-10 text-base font-semibold leading-7 text-[#94a3b8]">
            Nothing has been published yet. Open the Sports Desk, paste whatever you have from a game, and the first
            edition appears here.
          </p>
        ) : (
          <ul className="mt-8 flex list-none flex-col gap-3 p-0">
            {newestFirst.map((g) => {
              const headline = buildHeadline(g, findStories(g, games), TEAM.mascot);
              return (
                <li key={g.id}>
                  <Link
                    href={`/sports/${g.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] px-4 py-4 transition hover:brightness-125"
                  >
                    <span
                      aria-hidden
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black ${
                        g.result === "W" ? "bg-[#38bdf8] text-[#0b1220]" : "bg-[#1c2740] text-[#94a3b8]"
                      }`}
                    >
                      {g.result}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.95rem] font-black leading-snug">{headline}</span>
                      <span className="mt-1 block text-xs font-bold text-[#94a3b8]">
                        {shortDate(g.date)} · {g.homeAway === "away" ? "at " : g.homeAway === "home" ? "vs " : ""}
                        {g.opponent}
                        {g.demo ? " · Demo" : ""}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}

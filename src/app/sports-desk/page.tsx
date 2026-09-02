// ─────────────────────────────────────────────────────────────────────────────
// The Sports Desk — no longer the way games get in.
//
// Sprint 1 built this as the product: an operator pastes notes from one game
// and a story comes out. The wire now does that job for the whole city without
// anyone typing anything, so the desk has been repositioned rather than
// removed. It is two things now, in this order:
//
//   1. the REVIEW QUEUE — what the wire deliberately refused to publish
//   2. the MANUAL PATH — still the right tool for a game no source carries
//
// The product works when nobody ever opens this page. That is the point.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";

import Desk from "@/components/sports/Desk";
import ReviewQueue from "@/components/sports/ReviewQueue";
import { eventStore } from "@/lib/sports/graph/eventStore";
import { ST_LOUIS } from "@/lib/sports/metros/stLouis";
import { store } from "@/lib/sports/store";
import { TEAM } from "@/lib/sports/team";
import type { School } from "@/lib/sports/graph/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sports Desk",
  description: "Review what the St. Louis wire held back, and file a game by hand when no source carries it.",
  robots: { index: false, follow: false },
};

export default function SportsDeskPage() {
  const games = store.list();
  const events = eventStore.list();
  const schools = new Map<string, School>(ST_LOUIS.schools.map((s) => [s.id, s]));

  const conflicted = events.filter((e) => e.confidence === "conflicted");
  const unresolved = events.filter((e) => e.confidence === "unresolved");

  const nameCounts = new Map<string, number>();
  for (const e of events) {
    for (const n of e.unresolvedNames) nameCounts.set(n, (nameCounts.get(n) ?? 0) + 1);
  }
  const unresolvedNames = [...nameCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#e8edf5]">
      <div className="mx-auto w-full max-w-[46rem] px-4 pt-8 sm:px-6">
        <Link href="/sports" className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7dd3fc] hover:underline">
          ← St. Louis sports
        </Link>
      </div>

      <ReviewQueue
        conflicted={conflicted}
        unresolved={unresolved}
        unresolvedNames={unresolvedNames}
        schools={schools}
        publishedCount={events.filter((e) => e.publishable).length}
      />

      <div className="mx-auto w-full max-w-[46rem] px-4 pb-4 sm:px-6">
        <hr className="border-[#232a38]" />
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.22em] text-[#7dd3fc]">Manual entry</p>
        <p className="m-0 mt-2 text-[0.9rem] font-medium leading-6 text-[#94a3b8]">
          For a game no source carries — a first-party report, or a correction. This is the fallback path, not the way
          the wire runs.
        </p>
      </div>

      <Desk
        team={{ name: TEAM.name, mascot: TEAM.mascot, level: TEAM.level }}
        writable={store.writable()}
        archive={games.map((g) => ({
          id: g.id,
          date: g.date,
          opponent: g.opponent,
          result: g.result,
          teamScore: g.teamScore,
          opponentScore: g.opponentScore,
          demo: g.demo === true,
        }))}
      />
    </div>
  );
}

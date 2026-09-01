// EXPERIENCE 1 — the operator's way in. Server-side only for reading the
// archive; the desk itself is a client component.

import type { Metadata } from "next";

import Desk from "@/components/sports/Desk";
import { store } from "@/lib/sports/store";
import { TEAM } from "@/lib/sports/team";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sports Desk",
  description: "Turn notes from a game into verified local coverage.",
  robots: { index: false, follow: false },
};

export default function SportsDeskPage() {
  const games = store.list();
  return (
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
  );
}

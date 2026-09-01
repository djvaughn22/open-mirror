// The share card on its own, sized for a screenshot or a PNG export.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ShareActions from "@/components/sports/ShareActions";
import ShareCard from "@/components/sports/ShareCard";
import { findStories } from "@/lib/sports/storyFinder";
import { shareCardData } from "@/lib/sports/share";
import { store } from "@/lib/sports/store";
import { STUDIO } from "@/lib/products";

type Params = { params: Promise<{ gameId: string }> };

export function generateStaticParams() {
  return store.list().map((g) => ({ gameId: g.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { gameId } = await params;
  const game = store.get(gameId);
  return { title: game ? `${game.team} ${game.teamScore}, ${game.opponent} ${game.opponentScore}` : "Game card" };
}

export default async function ShareCardPage({ params }: Params) {
  const { gameId } = await params;
  const game = store.get(gameId);
  if (!game) notFound();

  const card = shareCardData(game, findStories(game, store.list()));
  const url = `${STUDIO.url.replace(/\/$/, "")}/sports/${game.id}`;

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-[26rem] px-5 pb-20 pt-10">
        <Link href={`/sports/${game.id}`} className="text-[11px] font-black uppercase tracking-[0.18em] text-[#38bdf8]">
          ← Back to the edition
        </Link>
        <div className="mb-6 mt-5">
          <ShareCard data={card} href="openmirrorllc.com" />
        </div>
        <ShareActions url={url} title={`${game.team} ${game.teamScore}, ${game.opponent} ${game.opponentScore}`} fileName={game.id} />
      </div>
    </main>
  );
}

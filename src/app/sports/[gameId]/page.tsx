// ─────────────────────────────────────────────────────────────────────────────
// One game, in detail.
//
// Two kinds of thing live at this URL, and the id says which:
//
//   · a CANONICAL EVENT from the automated wire — the common case now, and what
//     every card in the city feed links to. Rendered with its full provenance.
//   · a GAME EDITION from the manual desk — the long-form single-team story
//     Sprint 1 built. Still reachable, still correct, no longer the centre.
//
// The wire is checked first because it is the product; the desk is the
// fallback path for a game the wire could not get.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import EventDetail from "@/components/sports/EventDetail";
import ShareActions from "@/components/sports/ShareActions";
import ShareCard from "@/components/sports/ShareCard";
import { buildBrief } from "@/lib/sports/brief";
import { buildEdition } from "@/lib/sports/edition";
import { eventStore } from "@/lib/sports/graph/eventStore";
import { findMetroStories } from "@/lib/sports/metroStories";
import { ST_LOUIS } from "@/lib/sports/metros/stLouis";
import { shareCardData } from "@/lib/sports/share";
import { store } from "@/lib/sports/store";
import { TEAM } from "@/lib/sports/team";
import { weekdayOf } from "@/lib/sports/writer";
import { STUDIO } from "@/lib/products";

type Params = { params: Promise<{ gameId: string }> };

export const dynamic = "force-dynamic";

/** The schools map and brief for one wire event, or undefined if the id is a desk game. */
function wireEvent(gameId: string) {
  const event = eventStore.get(gameId);
  if (!event) return undefined;
  const schools = new Map(ST_LOUIS.schools.map((s) => [s.id, s]));
  const archive = eventStore.list();
  const today = new Date().toISOString().slice(0, 10);
  const brief = buildBrief({
    event,
    schools,
    discoveries: findMetroStories({ event, archive, schools }),
    today,
  });
  return { event, brief, schools };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { gameId } = await params;

  const wire = wireEvent(gameId);
  if (wire) {
    return {
      title: wire.brief.headline,
      description: wire.brief.body,
      alternates: { canonical: `/sports/${gameId}` },
      openGraph: { title: wire.brief.headline, description: wire.brief.body, type: "article" },
    };
  }

  const game = store.get(gameId);
  if (!game) return { title: "Game not found" };
  const edition = buildEdition({ game, archive: store.list(), mascot: TEAM.mascot });
  return {
    title: edition.headline,
    description: edition.summary,
    alternates: { canonical: `/sports/${game.id}` },
    openGraph: { title: edition.headline, description: edition.summary, type: "article" },
  };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-[#26324c] pb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
      {children}
    </h2>
  );
}

export default async function GameEditionPage({ params }: Params) {
  const { gameId } = await params;

  // The wire first: this is where the city feed sends every reader.
  const wire = wireEvent(gameId);
  if (wire) return <EventDetail event={wire.event} brief={wire.brief} schools={wire.schools} />;

  const game = store.get(gameId);
  if (!game) notFound();

  const archive = store.list();
  const edition = buildEdition({ game, archive, mascot: TEAM.mascot });
  const card = shareCardData(game, edition.discoveries);
  const url = `${STUDIO.url.replace(/\/$/, "")}/sports/${game.id}`;
  const won = game.result === "W";

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <article className="mx-auto max-w-[42rem] px-5 pb-24 pt-8 sm:pt-12">

        <Link href="/sports" className="text-[11px] font-black uppercase tracking-[0.18em] text-[#38bdf8]">
          {TEAM.level} · {TEAM.name}
        </Link>

        <h1 className="mb-3 mt-3 text-[2rem] font-black leading-[1.05] tracking-tight sm:text-[2.7rem]">
          {edition.headline}
        </h1>
        <p className="m-0 text-sm font-semibold text-[#94a3b8]">
          {weekdayOf(game.date)}, {longDate(game.date)}
          {game.homeAway === "home" ? " · Home" : game.homeAway === "away" ? " · Away" : ""}
        </p>
        {/* Comparisons are only as trustworthy as the archive behind them, so a
            seeded archive is disclosed even when this game itself is real. */}
        {game.demo || archive.some((g) => g.demo) ? (
          <p className="mt-3 rounded-xl border border-[#26324c] bg-[#141d2e] px-3.5 py-2.5 text-xs font-bold leading-5 text-[#94a3b8]">
            {game.demo
              ? "Demo season. This game was seeded to show how the desk works — it is not a reported result."
              : "Demo season. The season comparisons on this page are measured against seeded demo games, not reported results."}
          </p>
        ) : null}

        {/* ── The scoreline ─────────────────────────────────────────────── */}
        <section className="mt-7 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5">
          <ScoreRow name={game.team} score={game.teamScore} strong={won} />
          <div className="my-3 w-full border-t border-[#26324c]" />
          <ScoreRow name={game.opponent} score={game.opponentScore} strong={!won && game.result === "L"} />
        </section>

        {/* ── The 20-second version ─────────────────────────────────────── */}
        <section className="mt-10">
          <Eyebrow>The 20-second version</Eyebrow>
          <p className="m-0 text-lg font-semibold leading-8">{edition.summary}</p>
        </section>

        {/* ── The numbers ───────────────────────────────────────────────── */}
        <section className="mt-10">
          <Eyebrow>The numbers</Eyebrow>
          <dl className="m-0 overflow-hidden rounded-2xl border border-[#26324c] bg-[#141d2e]">
            {edition.numbers.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 border-t border-[#26324c] px-4 py-3 first:border-t-0"
              >
                <dt className="m-0 text-sm font-black">{row.label}</dt>
                <dd className="m-0 text-right text-sm font-bold tabular-nums text-[#94a3b8]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── What stood out ────────────────────────────────────────────── */}
        {edition.discoveries.length > 0 ? (
          <section className="mt-10">
            <Eyebrow>What stood out</Eyebrow>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {edition.discoveries.map((d) => (
                <li key={d.id} className="flex gap-3 rounded-2xl border border-[#26324c] bg-[#141d2e] px-4 py-3.5">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38bdf8]" />
                  <span className="text-[0.95rem] font-semibold leading-7">{d.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs font-semibold text-[#94a3b8]">
              Each of these was counted from the {archive.length} games stored on this desk, not written by a model.
            </p>
          </section>
        ) : null}

        {/* ── The story ─────────────────────────────────────────────────── */}
        <section className="mt-10">
          <Eyebrow>The story</Eyebrow>
          {edition.story.map((p, i) => (
            <p key={i} className="mb-5 text-[1.05rem] font-medium leading-8 last:mb-0">
              {p}
            </p>
          ))}
        </section>

        {/* ── What's next ───────────────────────────────────────────────── */}
        {game.next?.opponent ? (
          <section className="mt-10">
            <Eyebrow>What&rsquo;s next</Eyebrow>
            <p className="m-0 text-lg font-black">
              {game.next.opponent}
              {game.next.when ? <span className="font-bold text-[#94a3b8]"> · {game.next.when}</span> : null}
            </p>
          </section>
        ) : null}

        {/* ── Share ─────────────────────────────────────────────────────── */}
        <section className="mt-12">
          <Eyebrow>Share the game</Eyebrow>
          <div className="mx-auto mb-5 max-w-[20rem]">
            <ShareCard data={card} href="openmirrorllc.com" />
          </div>
          <ShareActions url={url} title={edition.headline} fileName={game.id} />
        </section>

        {edition.guardNote ? (
          <p className="mt-10 rounded-xl border border-[#26324c] bg-[#141d2e] px-3.5 py-3 text-xs font-semibold text-[#94a3b8]">
            {edition.guardNote}
          </p>
        ) : null}

        <p className="mt-10 text-xs font-semibold leading-6 text-[#94a3b8]">
          Every score, statistic, streak, and record on this page was entered or approved by a person and checked against
          this desk&rsquo;s own archive before it was published. Nothing here was invented by a language model.
        </p>
      </article>
    </main>
  );
}

function ScoreRow({ name, score, strong }: { name: string; score: number; strong: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className={`min-w-0 flex-1 truncate text-xl font-black uppercase tracking-tight sm:text-2xl ${strong ? "text-[#e8edf5]" : "text-[#94a3b8]"}`}
      >
        {name}
      </span>
      <span
        className={`shrink-0 text-4xl font-black tabular-nums sm:text-5xl ${strong ? "text-[#38bdf8]" : "text-[#94a3b8]"}`}
      >
        {score}
      </span>
    </div>
  );
}

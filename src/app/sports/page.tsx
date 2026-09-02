// ─────────────────────────────────────────────────────────────────────────────
// ST. LOUIS HIGH SCHOOL SPORTS — the city feed.
//
// This page answers one question in the first screenful: what happened last
// night? Scores first, brief second, everything else after that. Filtering is a
// plain link with a query string rather than client state, so the feed works
// with no JavaScript and every filtered view is a shareable URL.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";

import { longDateOf, weekdayOf } from "@/lib/sports/brief";
import { buildCityFeed, loadFeedEvents, type FeedStory } from "@/lib/sports/feed";
import { sportLabel } from "@/lib/sports/graph/sports";
import { ST_LOUIS } from "@/lib/sports/metros/stLouis";
import type { SportId } from "@/lib/sports/graph/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "St. Louis High School Sports",
  description:
    "Scores and short factual briefs from St. Louis area high school sports, gathered from schools' own published results.",
  alternates: { canonical: "/sports" },
};

const SHELL = "mx-auto w-full max-w-[46rem] px-4 sm:px-6";

const SCHOOL_NAMES = new Map(ST_LOUIS.schools.map((s) => [s.id, s.shortName]));
const schoolShortName = (id: string) => SCHOOL_NAMES.get(id) ?? id.replace(/^unresolved:/, "");

function StoryCard({ story }: { story: FeedStory }) {
  const { event, brief, sources } = story;
  // Two kinds of corroboration, and the badge must not blur them: a second
  // school agreeing on the SCORE is a much stronger claim than a calendar
  // confirming the game happened.
  const scoreConfirmed = event.scoreSourceIds.length >= 2;
  const fixtureConfirmed = !scoreConfirmed && event.sourceIds.length >= 2;

  return (
    <article className="rounded-2xl border border-[#232a38] bg-[#12161f] p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7dd3fc]">
          {sportLabel(event.sport)}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
            scoreConfirmed
              ? "bg-[#14331f] text-[#86efac]"
              : fixtureConfirmed
                ? "bg-[#1b2a3a] text-[#7dd3fc]"
                : "bg-[#1c2331] text-[#94a3b8]"
          }`}
          title={
            scoreConfirmed
              ? "Two schools reported this score and they agree."
              : fixtureConfirmed
                ? "A second school's calendar confirms this game was played, but only one school reported the score."
                : "Reported by one school. We show it, and we say so."
          }
        >
          {scoreConfirmed
            ? `${event.scoreSourceIds.length} sources agree`
            : fixtureConfirmed
              ? "Game confirmed · 1 score"
              : "1 source"}
        </span>
      </div>

      <Link href={`/sports/${event.id}`} className="mt-2 block">
        <h3 className="m-0 text-[1.35rem] font-black leading-[1.15] tracking-tight text-[#f1f5f9]">
          {brief.scoreline}
        </h3>
      </Link>

      <p className="m-0 mt-2 text-[0.95rem] font-medium leading-6 text-[#cbd5e1]">{brief.body}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[#64748b]">
        {event.sides.map((side) => (
          <Link
            key={side.schoolId}
            href={`/sports/schools/${side.schoolId}`}
            className="text-[#94a3b8] underline underline-offset-2 hover:text-[#e2e8f0]"
          >
            {schoolShortName(side.schoolId)}
          </Link>
        ))}
        <span>·</span>
        <span>Reported by</span>
        {sources.map((s) => (
          <a key={s.url} href={s.url} rel="noreferrer noopener" target="_blank" className="underline underline-offset-2 hover:text-[#94a3b8]">
            {s.label}
          </a>
        ))}
        <Link href={`/sports/${event.id}`} className="ml-auto text-[#7dd3fc] hover:underline">
          How we know →
        </Link>
      </div>
    </article>
  );
}

export default async function SportsFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const params = await searchParams;
  const feed = buildCityFeed({ sport: params.sport as SportId | undefined, events: await loadFeedEvents() });
  const active = params.sport;

  return (
    <main className="min-h-screen bg-[#0b0e14] text-[#e8edf5]">
      <div className={`${SHELL} pb-24 pt-8`}>
        {/* Masthead */}
        <header className="border-b border-[#232a38] pb-5">
          <p className="m-0 text-[10px] font-black uppercase tracking-[0.24em] text-[#7dd3fc]">The morning run</p>
          <h1 className="m-0 mt-2 text-[2.1rem] font-black leading-[1.03] tracking-tight sm:text-[2.6rem]">
            St. Louis
            <br />
            High School Sports
          </h1>
          <p className="m-0 mt-3 text-[0.9rem] font-semibold leading-6 text-[#94a3b8]">
            Scores and short briefs, gathered automatically from what schools publish themselves. Every number links
            back to the page it came from.
          </p>
        </header>

        {/* The way in for anyone holding a score we do not have yet. */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/sports/report"
            className="rounded-full bg-[#7dd3fc] px-4 py-2 text-[12px] font-black text-[#0b0e14]"
          >
            Report a score
          </Link>
          <Link
            href="/sports/for-schools"
            className="rounded-full border border-[#2a3242] px-4 py-2 text-[12px] font-bold text-[#94a3b8] hover:text-[#e2e8f0]"
          >
            Coaches: get your team link
          </Link>
        </div>

        {/* Sport filters — only sports we actually have */}
        {feed.sports.length > 0 ? (
          <nav className="mt-5 flex flex-wrap gap-2" aria-label="Filter by sport">
            <FilterPill href="/sports" label="All" count={feed.sports.reduce((n, s) => n + s.count, 0)} active={!active} />
            {feed.sports.map((s) => (
              <FilterPill
                key={s.id}
                href={`/sports?sport=${s.id}`}
                label={s.label}
                count={s.count}
                active={active === s.id}
              />
            ))}
          </nav>
        ) : null}

        {/* The feed */}
        {feed.days.length === 0 ? (
          <p className="mt-10 text-base font-semibold leading-7 text-[#94a3b8]">
            No results yet for this filter. The wire publishes a game once a school posts it and the result checks out.
          </p>
        ) : (
          feed.days.map((day) => (
            <section key={day.date} className="mt-8">
              <h2 className="m-0 mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">
                {weekdayOf(day.date)}, {longDateOf(day.date)}
              </h2>
              <div className="flex flex-col gap-3">
                {day.stories.map((story) => (
                  <StoryCard key={story.event.id} story={story} />
                ))}
              </div>
            </section>
          ))
        )}

        {/* Closest games — only when there are enough games for it to mean something */}
        {feed.closest.length > 0 ? (
          <section className="mt-10">
            <h2 className="m-0 mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">Closest games</h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {feed.closest.map((s) => (
                <li key={s.event.id}>
                  <Link
                    href={`/sports/${s.event.id}`}
                    className="flex items-baseline gap-3 rounded-xl border border-[#232a38] bg-[#12161f] px-4 py-3 hover:brightness-125"
                  >
                    <span className="text-sm font-black text-[#f1f5f9]">{s.brief.scoreline}</span>
                    <span className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7dd3fc]">
                      {sportLabel(s.event.sport)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Next up */}
        {feed.upcoming.length > 0 ? (
          <section className="mt-10">
            <h2 className="m-0 mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">Next up</h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {feed.upcoming.map(({ event, label }) => (
                <li
                  key={event.id}
                  className="flex items-baseline gap-3 rounded-xl border border-[#1c2331] px-4 py-2.5 text-sm"
                >
                  <span className="font-bold text-[#cbd5e1]">{label}</span>
                  <span className="ml-auto shrink-0 text-[11px] font-semibold text-[#64748b]">
                    {weekdayOf(event.date)}, {longDateOf(event.date)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* How this works — the trust line, stated plainly rather than implied */}
        <section className="mt-12 rounded-2xl border border-[#232a38] bg-[#101520] p-5">
          <h2 className="m-0 text-[11px] font-black uppercase tracking-[0.18em] text-[#7dd3fc]">How this page works</h2>
          <p className="m-0 mt-2.5 text-[0.9rem] font-medium leading-6 text-[#94a3b8]">
            Results are read from {ST_LOUIS.schools.length > 0 ? "St. Louis area schools' own athletics pages" : "school athletics pages"}, matched
            up across schools, and published only when they hold together. When two schools report the same game
            differently, we withhold the score and mark the game for review rather than guess which one is right.
            Statistics are never invented, and no story here is written from anything but a verified fact.
          </p>
          {feed.withheld.conflicted > 0 || feed.withheld.unresolved > 0 ? (
            <p className="m-0 mt-3 text-[0.85rem] font-semibold text-[#64748b]">
              Currently held back: {feed.withheld.conflicted} with conflicting reports,{" "}
              {feed.withheld.unresolved} where a school could not be identified.
            </p>
          ) : null}
          {feed.lastUpdated ? (
            <p className="m-0 mt-3 text-[0.8rem] font-semibold text-[#475569]">
              Sources last read {new Date(feed.lastUpdated).toLocaleString("en-US", { timeZone: ST_LOUIS.timezone })} Central.
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function FilterPill({ href, label, count, active }: { href: string; label: string; count: number; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition ${
        active
          ? "border-[#7dd3fc] bg-[#7dd3fc] text-[#0b0e14]"
          : "border-[#2a3242] text-[#94a3b8] hover:border-[#3b475c] hover:text-[#e2e8f0]"
      }`}
    >
      {label}
      <span className={`ml-1.5 ${active ? "text-[#0b0e14]/60" : "text-[#475569]"}`}>{count}</span>
    </Link>
  );
}

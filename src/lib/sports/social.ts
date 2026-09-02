// ─────────────────────────────────────────────────────────────────────────────
// One verified event, many renders.
//
// The rule this file exists to enforce: every channel gets the SAME FACTS.
// There is no per-channel copywriting step, because two channels stating
// different things about one teenager's game is exactly how a local newsroom
// loses the only thing it has. Instagram, a share card and the feed all read
// from the object below.
//
// Nothing here posts anything. It produces the content object a future
// syndication step would send.
// ─────────────────────────────────────────────────────────────────────────────

import { longDateOf, weekdayOf, type Brief } from "./brief.ts";
import { sportLabel } from "./graph/sports.ts";
import { hasScore, type CanonicalEvent, type School } from "./graph/types.ts";

export interface SocialCard {
  /** Big line on the card. */
  scoreline: string;
  /** All-caps kicker, four words at most. Empty when nothing beyond the score is supported. */
  kicker: string;
  sport: string;
  dateLabel: string;
  /** Hosts that reported it. A card without a credit does not ship. */
  credits: string[];
  /** True when more than one school reported the SCORE and they agree. */
  corroborated: boolean;
}

export interface SocialPost {
  eventId: string;
  /** The caption every channel uses, unchanged. */
  caption: string;
  /** Deterministic, derived from the facts — never a topic guess. */
  hashtags: string[];
  card: SocialCard;
  /** Canonical permalink for the event. */
  url: string;
}

/** Four words at most, and only ever from something we actually verified. */
export function cardKicker(event: CanonicalEvent): string {
  if (!hasScore(event)) return "SCHEDULED";
  const [a, b] = event.sides;
  if (a.score === b.score) return "DRAW";
  const margin = Math.abs(a.score! - b.score!);
  const loser = a.score! < b.score! ? a : b;
  if (loser.score === 0) return "SHUTOUT";
  if (margin === 1) return "ONE-SCORE GAME";
  // "Confirmed" has to mean two sources agreed on THIS SCORE. A calendar that
  // confirms the game was played says nothing about the number on the card.
  if (event.scoreSourceIds.length >= 2) return "CONFIRMED FINAL";
  return "FINAL";
}

function slug(name: string): string {
  return name.replace(/[^A-Za-z0-9]+/g, "");
}

export function buildSocialPost(
  event: CanonicalEvent,
  brief: Brief,
  schools: Map<string, School>,
  siteUrl: string,
): SocialPost {
  // Credit the schools that published, not the platforms they run on.
  const credits = [
    ...new Set(
      event.observations.map(
        (o) => schools.get(o.reporter.schoolId)?.shortName ?? new URL(o.sourceUrl).host.replace(/^www\./, ""),
      ),
    ),
  ];
  const names = event.sides.map((s) => schools.get(s.schoolId)?.shortName ?? s.schoolId);

  const caption = [
    `${sportLabel(event.sport).toUpperCase()} · ${brief.scoreline}`,
    "",
    brief.body,
    "",
    `Reported by ${credits.join(", ")}.`,
  ].join("\n");

  return {
    eventId: event.id,
    caption,
    // Derived from the two schools and the sport, so the tags can never drift
    // from what the post actually says.
    hashtags: ["#stlhssports", ...names.map((n) => `#${slug(n)}`), `#${slug(sportLabel(event.sport))}`],
    card: {
      scoreline: brief.scoreline,
      kicker: cardKicker(event),
      sport: sportLabel(event.sport).toUpperCase(),
      dateLabel: `${weekdayOf(event.date)}, ${longDateOf(event.date)}`,
      credits,
      // Corroborated means two sources agreed on the SCORE, nothing weaker.
      corroborated: event.scoreSourceIds.length >= 2,
    },
    url: `${siteUrl.replace(/\/$/, "")}/sports/${event.id}`,
  };
}

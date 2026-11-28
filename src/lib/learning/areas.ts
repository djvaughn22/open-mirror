// ─────────────────────────────────────────────────────────────────────────────
// Open Mirror Learning: broad areas (owner direction, Nov 27-28 2026: "an
// organized subject architecture that can eventually support thousands of
// subjects without becoming overwhelming").
//
// Three levels: area → discipline (CIP 2020 families, taxonomy.ts) → subject.
// A phone shows nine areas; each opens to its disciplines and subjects. Adding
// a subject never makes the first screen longer. Every discipline belongs to
// exactly one area (a test checks).
// ─────────────────────────────────────────────────────────────────────────────

import { DISCIPLINES, type Discipline } from "./taxonomy.ts";

export type Area = {
  slug: string;
  name: string;
  /** A small icon, shown in a neutral tile. */
  icon: string;
  /** What's in it, in a few plain words. */
  line: string;
  disciplines: string[];
};

export const AREAS: Area[] = [
  { slug: "hands-on", name: "Trades and repair", icon: "🔧", line: "Cars, engines, wiring, plumbing, wood, metal", disciplines: ["trades", "engineering"] },
  { slug: "tech", name: "Computers and technology", icon: "💻", line: "Computer basics, repair, Linux, code, AI", disciplines: ["computing"] },
  { slug: "home-food", name: "Home, food and garden", icon: "🌱", line: "Cooking, growing and keeping food, running a home", disciplines: ["home", "culinary", "agriculture"] },
  { slug: "work-money", name: "Business, money and work", icon: "💼", line: "Starting a business, money, finding work", disciplines: ["business", "money", "life"] },
  { slug: "science-math", name: "Math, science and nature", icon: "🔭", line: "Algebra to calculus, biology, physics, the outdoors", disciplines: ["math", "science", "environment"] },
  { slug: "health-people", name: "Health, care and teaching", icon: "🩺", line: "The body, nursing, first aid, psychology, teaching", disciplines: ["health", "people", "education"] },
  { slug: "arts", name: "Music, art and writing", icon: "🎨", line: "Piano, guitar, drawing, photography, writing", disciplines: ["music", "art", "media", "communication"] },
  { slug: "society", name: "History, faith and society", icon: "📜", line: "History, government, law, the Bible, languages", disciplines: ["history", "law", "philosophy", "languages"] },
  { slug: "sports", name: "Sports and the outdoors", icon: "⛰️", line: "Fitness, coaching, recreation, games", disciplines: ["sports"] },
];

export function areaBySlug(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

/** The area a discipline belongs to. */
export function areaOfDiscipline(discipline: string): Area | undefined {
  return AREAS.find((a) => a.disciplines.includes(discipline));
}

/** An area's disciplines, in the order the area lists them. */
export function areaDisciplines(area: Area): Discipline[] {
  return area.disciplines.map((slug) => DISCIPLINES.find((d) => d.slug === slug)).filter((d): d is Discipline => !!d);
}

export function areaSubjectCount(area: Area): number {
  return areaDisciplines(area).reduce((n, d) => n + d.subjects.length, 0);
}

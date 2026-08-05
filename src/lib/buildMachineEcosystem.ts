// ─────────────────────────────────────────────────────────────────────────────
// Build Machine ecosystem — the verified iDontCry experiences and
// Step In The Ring engines the Learn More page features.
//
// Everything here was audited against the real repositories and curl-verified
// live on 2026-08-04. Rules (test-locked):
//   - Feature ONLY experiences and engines that exist and are publicly
//     reachable. Owner-only engines (Game Engine, Story Partner) are never
//     advertised as available.
//   - Engine statuses mirror the SITR registry's honest activation labels
//     ("Works" / "Beta") — never inflate a beta to done.
//   - Links go to the real product domains, never to copies inside the hub.
//   - No automatic project synchronization is claimed anywhere: the handoff
//     between products is the customer's own idea, typed in — that's the
//     honest bridge until a real integration ships.
// ─────────────────────────────────────────────────────────────────────────────

import { IDONTCRY_ROUTES, SITR_ROUTES } from "./buildMachineSoftware.ts";

export type FeaturedExperience = {
  name: string;
  url: string;
  category: string;
  blurb: string;
};

// The starting playground. Selected for play, curiosity, creativity, idea
// generation, and family participation — not a directory of every route.
export const FEATURED_IDONTCRY: FeaturedExperience[] = [
  {
    name: "The Games arcade",
    url: IDONTCRY_ROUTES.games,
    category: "Games",
    blurb:
      "Original games built by Open Mirror — play them, then realize someone made them, and you could too.",
  },
  {
    name: "Circuit",
    url: IDONTCRY_ROUTES.circuit,
    category: "Games",
    blurb:
      "A collection of mission-based sports games — football, baseball, skiing, pole vault — deep enough to keep a family competing.",
  },
  {
    name: "Dream Shop",
    url: IDONTCRY_ROUTES.dreamShop,
    category: "Creative tools",
    blurb:
      "Dream up artwork and product ideas. A natural first stop when 'what if…' strikes.",
  },
  {
    name: "Piano",
    url: IDONTCRY_ROUTES.piano,
    category: "Music",
    blurb:
      "Real piano lessons in the browser — a doorway into the music side of building.",
  },
  {
    name: "The Family Welcome",
    url: IDONTCRY_ROUTES.welcome,
    category: "Family",
    blurb:
      "What iDontCry is for a family — play together, make things together, and practice taking a dream all the way to a real build.",
  },
];

export type FeaturedEngine = {
  /** Must match the id in SITR's engine registry. */
  id: string;
  name: string;
  /** SITR's own honest activation label. */
  status: "Works" | "Beta";
  helpsWith: string;
  url: string;
};

// Verified against step-in-the-ring/app/engines/engines.ts (2026-08-04).
// Game Engine (owner-only) and Story Partner (private) are deliberately
// absent.
export const FEATURED_ENGINES: FeaturedEngine[] = [
  {
    id: "idea",
    name: "Idea Engine",
    status: "Works",
    helpsWith: "Clarify a raw idea into something buildable",
    url: SITR_ROUTES.engine("idea"),
  },
  {
    id: "build",
    name: "Build Engine",
    status: "Beta",
    helpsWith: "Turn a chosen idea into a real first-build brief",
    url: SITR_ROUTES.engine("build"),
  },
  {
    id: "plan",
    name: "Plan Engine",
    status: "Beta",
    helpsWith: "Lay out the structured steps from here to version one",
    url: SITR_ROUTES.engine("plan"),
  },
  {
    id: "sell",
    name: "Sell Engine",
    status: "Beta",
    helpsWith: "Shape an idea into an offer someone could actually buy",
    url: SITR_ROUTES.engine("sell"),
  },
  {
    id: "music",
    name: "Music Engine",
    status: "Beta",
    helpsWith: "Develop a song or music idea into a real project",
    url: SITR_ROUTES.engine("music"),
  },
  {
    id: "howto",
    name: "How to Anything Engine",
    status: "Beta",
    helpsWith: "Turn something you know into a useful guide or product",
    url: SITR_ROUTES.engine("howto"),
  },
  {
    id: "design-shop",
    name: "Design Shop Engine",
    status: "Works",
    helpsWith: "Develop a sellable design concept, end to end",
    url: SITR_ROUTES.engine("design-shop"),
  },
];

// The six-step journey the whole page is built around.
export const JOURNEY_STEPS: { title: string; where: string; detail: string }[] = [
  {
    title: "Play and Create",
    where: "iDontCry",
    detail:
      "Play original games, try creative tools, and make things with your family. No account, no programming knowledge needed.",
  },
  {
    title: "Choose an Idea",
    where: "You decide",
    detail:
      "Somewhere in the playing, an idea shows up that deserves more. You pick the one worth a real build.",
  },
  {
    title: "Build It",
    where: "Step In The Ring",
    detail:
      "Bring the idea to the right engine and get back a concrete plan for a real first version.",
  },
  {
    title: "Work Locally",
    where: "Free software on your Build Machine",
    detail:
      "Open the plan and files in the included editor, and do the actual making on your own machine.",
  },
  {
    title: "Test and Improve",
    where: "Machine + engines together",
    detail:
      "Run it, see it working, make changes, and return to Step In The Ring for the next guided step.",
  },
  {
    title: "MVP1",
    where: "The outcome",
    detail:
      "A real first working version — not a promised business or a finished professional product. Something true you made.",
  },
];

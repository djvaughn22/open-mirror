// ─────────────────────────────────────────────────────────────────────────────
// Work-with-the-Founder service registry — single source of truth for /work-with-the-founder.
//
// Everything the service page shows (offers, prices, boundaries, process,
// proof picks) lives here. Edit ONLY this file to change the page's content.
//
// SETUP NOTE — activating payments and scheduling:
// Every offer has `paymentUrl` and `schedulingUrl` slots, currently null.
// When you create a real Stripe payment link or a real scheduling link,
// paste the URL into the offer below (or set the matching NEXT_PUBLIC_* env
// var in Vercel and redeploy). The page shows the button automatically once
// a link exists — until then it shows only the intake form, nothing fake.
//   NEXT_PUBLIC_PAY_STRATEGY_SESSION   → Strategy Session payment link
//   NEXT_PUBLIC_BOOK_STRATEGY_SESSION  → Strategy Session scheduling link
//   NEXT_PUBLIC_PAY_BLUEPRINT          → Blueprint payment link
// ─────────────────────────────────────────────────────────────────────────────

import { STUDIO } from "./products";

export type ServiceOffer = {
  /** stable id — used in the intake form, GA events, and anchors */
  id: string;
  name: string;
  price: string;
  /** small line above the name, e.g. "Application only" */
  kicker?: string;
  /** one-sentence summary under the name */
  summary: string;
  /** section label + bullets, e.g. "Right for you if" / "You leave with" */
  sections: { label: string; items: string[] }[];
  /** honest fine print for this offer, shown small at the card bottom */
  note?: string;
  accent: string;
  /** live payment link — null hides the pay button (see setup note above) */
  paymentUrl: string | null;
  /** live scheduling link — null hides the booking button */
  schedulingUrl: string | null;
};

export const SERVICE_EMAIL = STUDIO.email;

export const offers: ServiceOffer[] = [
  {
    id: "strategy-session",
    name: "Founder Strategy Session",
    price: "$250",
    summary: "A focused 60-minute working session, directly with the founder.",
    accent: "#38BDF8",
    sections: [
      {
        label: "Right for you if",
        items: [
          "You have an idea but can't define the right first version",
          "You have too many directions and need one",
          "You want an honest outside read — not encouragement, an answer",
          "Your existing site, business, ministry, or product feels unclear",
        ],
      },
      {
        label: "You leave with",
        items: [
          "A clearer definition of the idea",
          "The strongest practical first version",
          "What should wait",
          "Your next three concrete actions",
          "A concise written recap after the session",
        ],
      },
    ],
    note: "Payment is required before a session is confirmed.",
    paymentUrl: process.env.NEXT_PUBLIC_PAY_STRATEGY_SESSION || null,
    schedulingUrl: process.env.NEXT_PUBLIC_BOOK_STRATEGY_SESSION || null,
  },
  {
    id: "blueprint",
    name: "Open Mirror Blueprint",
    price: "$750",
    kicker: "Best low-meeting option",
    summary:
      "You send the idea and any materials. The founder reviews everything and returns a focused written blueprint — no meetings required.",
    accent: "#A78BFA",
    sections: [
      {
        label: "The blueprint covers",
        items: [
          "An honest assessment of the project",
          "The strongest audience and use case",
          "A clear product or site direction",
          "The recommended offer or structure",
          "Homepage and user-flow recommendations",
          "What to remove or postpone",
          "A prioritized roadmap and exact next build steps",
          "One reasonable follow-up revision",
        ],
      },
    ],
    note: "$750 is the introductory price for the first five completed Blueprints. Work begins after payment and complete intake materials.",
    paymentUrl: process.env.NEXT_PUBLIC_PAY_BLUEPRINT || null,
    schedulingUrl: null,
  },
  {
    id: "build-partnership",
    name: "Build Partnership",
    price: "from $3,000",
    kicker: "Application only",
    summary:
      "A defined project with a clearly scoped build objective — the founder provides the direction, you get something launched.",
    accent: "#34D399",
    sections: [
      {
        label: "Includes",
        items: [
          "Product and creative direction",
          "A clearly scoped build objective",
          "Implementation guidance and review checkpoints",
          "Up to two scheduled calls, unless the proposal says otherwise",
          "Async feedback within a defined project window",
          "Final launch and handoff direction",
        ],
      },
    ],
    note: "Not unlimited development, unlimited revisions, or an open-ended retainer. Starts with an accepted written proposal; larger engagements get a separate proposal.",
    paymentUrl: null,
    schedulingUrl: null,
  },
];

/** Intake current-stage choices — shared by the form and the email body. */
export const INTAKE_STAGES = [
  "Just an idea",
  "Started, but stuck",
  "Live, but unclear",
  "Live and growing — needs direction",
] as const;

/** Who this page is for — the qualifying list under the hero. */
export const FOR_LIST = [
  "An idea you keep describing but haven't started",
  "A half-built project that stalled",
  "A business, ministry, or product that works but feels unclear",
  "A website that doesn't say what it should",
  "A creative concept you want to see as a real first version",
];

/** How the process works, in order. */
export const PROCESS = [
  {
    title: "Send the intake",
    text: "The form below covers everything the founder needs to give you a straight first answer. No discovery call required.",
  },
  {
    title: "Get a direct reply",
    text: "The founder reads it and replies by email — whether it's a fit, which offer makes sense, and anything worth doing differently. If it's not a fit, you'll hear that plainly.",
  },
  {
    title: "Payment confirms the work",
    text: "Sessions are scheduled once paid. Blueprints start after payment and complete materials. Partnerships start with an accepted written proposal.",
  },
  {
    title: "The work happens as scoped",
    text: "Few meetings, clear deliverables, written follow-through. The process is built to avoid endless back-and-forth.",
  },
];

/** Quiet boundaries — short, plain, no legal wall. */
export const BOUNDARIES = [
  "Payment is required before a Strategy Session is confirmed.",
  "Blueprint work begins after payment and receipt of complete intake materials.",
  "Build Partnerships require an accepted scope and written proposal.",
  "Work outside an agreed scope may require a new proposal.",
  "Submitting the intake form starts a conversation — it doesn't create a client relationship by itself.",
];

/**
 * Portfolio proof — a selective set, not the whole registry.
 * `product` must match a `name` in src/lib/products.ts; the page joins them
 * so links, accents, and emoji stay in sync with the registry.
 */
export const PROOF: { product: string; proves: string }[] = [
  {
    product: "CrossHeartPray",
    proves:
      "Mission-driven product thinking — a daily faith routine built as one coherent product, not a pile of features.",
  },
  {
    product: "WatchedNotWatched",
    proves:
      "Consumer product design — a full watch-tracking product with ranking boards and personal picks, no account required.",
  },
  {
    product: "OpenDoku",
    proves:
      "Reusable engines — one puzzle engine shipping multiple games (SlopeDoku, SurfDoku, MineDoku) instead of one-off builds.",
  },
  {
    product: "StepInTheRing",
    proves:
      "Idea to first build — the exact process of turning a raw idea into a scoped, buildable plan, as a working product.",
  },
  {
    product: "DontCloneMeTom",
    proves:
      "Creative concept development — a rescue-dog campaign with real adoptable dogs on the page, from a single odd idea.",
  },
  {
    product: "TheDJCares",
    proves:
      "Curation as a product — hand-picked music, sermons, and encouragement, organized so people actually use it.",
  },
];

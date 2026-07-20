// ─────────────────────────────────────────────────────────────────────────────
// The owner's three mission haikus — LOCKED, word for word, heading for
// heading (2026-07-19). They render in the About page's "Built by starting"
// section (owner's brief, later 2026-07-19) and must always be imported from
// here — never copied inline. Never paraphrase, improve, retitle, or replace
// them. tests/hub.test.ts locks every line verbatim.
// ─────────────────────────────────────────────────────────────────────────────

export const MISSION_HAIKUS: { title: string; lines: string[] }[] = [
  {
    title: "Start",
    lines: ["Pick one thing to build", "Start before the plan is done", "Make the first version."],
  },
  {
    title: "Improve",
    lines: ["Build it, test it, learn", "Keep what works and cut the rest", "Then build it better."],
  },
  {
    title: "Get it live",
    lines: ["Bring me what you built", "I will find the real next step", "Then ship something real."],
  },
];

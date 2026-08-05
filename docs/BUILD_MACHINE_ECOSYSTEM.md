# Build Machine ↔ ecosystem integration audit (INTERNAL)

Audited 2026-08-04 against the real repositories (`~/idontcry`,
`~/StepInTheRing/step-in-the-ring`, hub) and curl-verified live routes.
This file records what actually connects, so public copy never overclaims.

## Verified live surfaces (2026-08-04)

**iDontCry** (free, no account system): `/games`, `/games/circuit` (+
football, baseball, classic, lab, pole-vault, skiing), `/piano`,
`/dream-shop`, `/fambookagram`, `/friendbookagram`. All 200.

**Step In The Ring**: `/engines` (picker; deep-link via
`/engines?engine=<id>` — the `/engines/<id>` sub-routes 404), `/build`
(beginner walkthrough), `/projects` (Project OS), `/how`. `/planner` is
GONE (404) — old memory notes are stale.

**Engine registry** (`app/engines/engines.ts`, honest activation labels):
working = idea, design-shop · beta = build, sell, launch, fix, grow, plan,
etsy, howto, music · owner-only = game, story. The page features only
working/beta engines and mirrors these labels.

## What already connects (real, today)

- iDontCry links out to SITR (`GameLab` → stepinthering.com/engines?engine=game).
- The hub registry's SITR copy references ideas "dreamed up on iDontCry".
- Both products share the family nav/footer architecture.

## What is manual (and must be described as manual)

- **Idea handoff iDontCry → SITR:** the customer types their idea into an
  engine. No project record moves automatically.
- **SITR → local machine:** engine output (briefs, packages, starter
  structures) is saved/copied/downloaded by the customer into a local
  folder, then opened in VS Code. No filesystem integration.
- **Local → SITR iteration:** the customer returns to their SITR project in
  the browser. No sync of local edits.

## Account/subscription reality (do not contradict publicly)

- NO public account system exists on either product today. iDontCry is
  free/anonymous. SITR's protected areas are owner-password gated
  (Game Engine 501s visitors; Story Partner private; store/Project OS
  builder assignment owner-gated).
- NO live subscription or checkout exists (Stripe work never shipped —
  local branch only). The $7.77/mo SITR direction is internal strategy,
  NOT public pricing. Public copy says only: "some tools may require an
  account or subscription as those services open; terms shown before
  signup."
- Therefore: no Build Machine may claim any included entitlement, and the
  first-run guide creates no Open Mirror account (there is nothing to
  create yet).

## Ready for first-run linking (safe now)

- Browser home/bookmarks pointing at idontcry.com, stepinthering.com/engines,
  stepinthering.com/build (plain links, no auth).
- The FIRST-RUN-GUIDE.md manual bridge (idea → engine → local folder →
  editor → local server → back to engine).

## Future integration that would improve subscription conversion (not promised)

1. SITR "download project as folder/zip" export tuned for the Build Machine
   editor layout.
2. An iDontCry "save this idea" → SITR engine prefill link
   (`/engines?engine=idea&idea=<text>` style) — cheap, honest, high-value.
3. Real Open Mirror accounts + saved-project persistence in SITR (the
   natural paid tier: reopen/continue/iterate).
4. First-run welcome app on the machine that deep-links the three doors.

## Cannot be promised publicly

Automatic transfer/sync between products; account persistence; any
subscription price; Game Engine or Story Partner availability; that every
engine is finished (beta labels stay visible).

## Subscription conversion points (implemented honestly)

On the page: after the engine lineup (account/subscription note), in the
accounts-and-subscriptions section, and at journey step 5 (guided
iteration). In product: prompts belong inside iDontCry/SITR at moments of
real value (idea chosen, plan wanted, project reopened) — never OS
notifications, recovery flows, or personal-file access. The machine stays
fully functional without subscribing.

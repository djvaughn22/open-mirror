@AGENTS.md

# Open Mirror LLC — hub (openmirrorllc.com)

This is the HUB of the Open Mirror family (11 sites, separate repos, all on
Vercel). DJ (djvaughn22) owns everything. Baseline tag: `mvp-1`.

## Family rules (apply to every Open Mirror repo)
- **Design:** flat + cool. bg `#0b1220`, surface `#141d2e`, border `#26324c`,
  text `#e8edf5`, muted `#94a3b8`. No glass/transparency, no gradients, **no red**.
- **Site accents** (the colored ".com" wherever a site name appears — master
  list in `src/app/page.tsx` Project arrays): CrossHeartPray #C4B5FD ·
  TheDJCares #A78BFA · WhatAmIAI #E879F9 · Reflect #93C5FD · DontCloneMeTom
  #2DD4BF · iDontCry #38BDF8 · StepInTheRing #60A5FA · Fambookagram #C084FC ·
  Friendbookagram #818CF8 · WatchedNotWatched #22D3EE · PleaseBeReady #34D399.
- **Shared chrome is canonical here:** `packages/openmirror-ui/`
  (OpenMirrorNav, OpenMirrorFooter, OpenMirrorTheme = ☀️/🌙 toggle + light CSS).
  Edit those files ONLY here, then run `./scripts/sync-ui.sh` to copy into
  every satellite, then build/commit/push each satellite.
- **Footer everywhere:** OPEN MIRROR LLC · ABOUT · ✝️ ❤️ 🙏 — the icons ARE
  the CrossHeartPray link. No word after About. That is the brand.
- **Copy style:** DJ's words. Short, plain, human. Never wordy or AI-sounding.
  Faith stays only on CrossHeartPray + TheDJCares; every other site is secular.
- **Deploys:** push to `main` = production deploy (Vercel, GitHub-connected).
  Batch related edits into one commit per repo. Exception: crossheartpray
  deploys by CLI (`npx vercel --prod`), not on push.

## Hub-specific
- Menu (`src/components/OpenMirrorNav.tsx`): live sites, divider, single
  "Coming Soon" heading over the in-progress sites, divider, About last.
  Bible Reading Plan PDF lives on the About page, not the menu.
- `/reflect` is a secular reflection tool. Its copy-to-AI prompt asks for
  "timeless, proverb-style wisdom … practical, not preachy" — keep that line.
- `src/app/api/reflect/route.ts` is the FAITH Scripture engine — do NOT
  secularize it. Reflect/WhatAmIAI bridge to CrossHeartPray instead.
- Legacy copies of some sites exist as hub routes (e.g. `/crossheartpray`);
  the live sites are the standalone repos — don't edit legacy routes.

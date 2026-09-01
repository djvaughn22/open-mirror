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
  #2DD4BF · iDontCry #38BDF8 · StepInTheRing #60A5FA · WatchedNotWatched
  #22D3EE · PleaseBeReady #34D399.
- **Shared chrome is canonical here:** `packages/openmirror-ui/`
  (OpenMirrorNav, OpenMirrorFooter, OpenMirrorTheme = ☀️/🌙 toggle + light CSS).
  Edit those files ONLY here, then run `./scripts/sync-ui.sh` to copy into
  every satellite, then build/commit/push each satellite.
- **Footer everywhere:** OPEN MIRROR LLC · ABOUT · ✝️ ❤️ 🙏 — the icons ARE
  the CrossHeartPray link. No word after About. That is the brand.
- **Copy style:** DJ's words. Short, plain, human. Never wordy or AI-sounding.
  Faith stays only on CrossHeartPray + TheDJCares; every other site is secular.
- **Mission (background, not copy):** Open Mirror helps people create — look at
  yourself, ask "what do I want to create?", sit down, start building. Keep it
  subtle and in-flow: never write mirror/mission language onto pages, and never
  tell readers what they're thinking or feeling.
- **Mission haikus (First / More / Keep going — owner-replaced Jul 15 2026):**
  the origin-first sequence ("Cross Heart Pray came first…") is verbatim in
  `OPEN_MIRROR_PORTFOLIO_DOCTRINE.md`, verified 5-7-5. It appears ONLY on the
  hub's `/about-open-mirror`, as verse with no explanatory paragraph. The old
  Start/Improve/Get-it-live sequence is RETIRED — don't restore it. SITR's
  result page still shows the retired third haiku (separate repo; fix on the
  next SITR pass). Never paste haikus onto other sites.
- **"Owner," never "founder":** DJ is "the owner of Open Mirror LLC." No
  founder/visionary/CEO framing in public copy, and no personal name on public
  pages. (Strong's dictionary data is exempt external content.)
- **Contact Open Mirror (Jul 15 2026 — was "Talk with the Owner"):** the one
  consulting surface is the hub's `/contact` (old `/talk-with-the-owner` and
  `/work-with-the-founder` URLs permanently redirect there). Faceless page —
  no name, photo, bio, employer, or job title; "owner" isn't repeated as a
  framing device. Entry points: hub nav ("Contact"), one hub About line, and
  one quiet line on Step In The Ring's fight-plan result. Satellites connect
  back only via the shared quiet footer + family menu. Never popups,
  countdowns, repeated CTAs, or pricing outside that page. StepInTheRing's
  free output stays complete — reaching out is optional, not required.
- **Protected sites:** CrossHeartPray gets NO commercial or consulting
  language, ever — its only Open Mirror connection is the quiet footer link,
  and nothing sales-shaped goes near Scripture, prayer, or memorial content.
  TheDJCares stays gospel-first (Open Mirror links in footer/About only).
  DontCloneMeTom stays dog-first. iDontCry stays family-first — any
  owner-contact path must be adult-facing.
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

## Open Mirror Shop

**Route:** `/shop`

**Purpose:** Single page listing all Open Mirror brand product categories. Placeholder for products as they go live on Etsy.

**Sections:** 6 brand cards:
- CrossHeartPray (#C4B5FD): Prayer cards, Bible aids, printables
- TheDJCares (#A78BFA): Encouragement cards, playlists, downloads
- DontCloneMeTom (#2DD4BF): Dog rescue merchandise, adoption apparel
- iDontCry (#38BDF8): Dad jokes, stickers, funny items
- StepInTheRing (#60A5FA): Build guides, templates, tools
- Digital Downloads (#7DD3FC): Printables, wallpapers, journals

**Copy:** "Shop links will appear as products go live." Honest placeholder — no fake inventory, no fake Etsy URLs, no fake reviews.

**Config:** `src/app/shop/page.tsx` defines brand cards. Update the array to add/reorder brands or change taglines.

**Etsy integration:** When products ship, update brand taglines and add Etsy links (currently placeholders).

**Documentation:** `OPEN_MIRROR_ETSY_FIRST_STORE_BATCH.md` at repo root contains 25 product ideas, 5 complete listing drafts, and social launch strategy.

**Next work:** Implement Etsy API sync or manual product updates to shop. Route is ready to extend.

## Sports Desk (MVP 1 — 2026-09-01)

An AI-powered local high-school sports desk living inside the hub. One sport
(football), one team, one operator, many games, public readers. The product is
the pipeline, not the model:

**messy evidence → structured facts → human verification → archive → Story
Finder → Game Edition → share card**

**Routes** (deliberately outside the nav, like `/reflect`):
- `/sports-desk` — operator: paste evidence, verify, approve, correct, remove.
- `/sports` — public season index.
- `/sports/[gameId]` — the **Game Edition**, the public product.
- `/sports/[gameId]/card` — the one shareable card, exportable as PNG in-browser.
- `/api/sports/extract`, `/api/sports/games`, `/api/sports/games/[gameId]`.

**Engine** (`src/lib/sports/`, presentation-free):
`types` · `football` (the only sport adapter) · `extract` (deterministic, no
model) · `validate` · `approve` · `store` (SportsStore seam) · `history` ·
`storyFinder` · `writer` · `factGuard` · `edition` · `share` · `modelWriter`.

**Non-negotiables — do not weaken these:**
- **AI can write, AI cannot make facts.** Every published number and name goes
  through `factGuard.ts` against the approved fact set. Unknown token, no
  publish. It fails closed, and a rejected model rewrite is *reported*, never
  swallowed.
- Every stored stat carries `provenance` (evidence / operator / calculated /
  interpretation). `validate.ts` refuses a stat without one.
- The Story Finder counts; it never asks a model whether something is a season
  high. Discoveries are written by TypeScript.
- Extraction runs with **no model, no network, no cost**. A model is optional
  (`SPORTS_DESK_MODEL*`), narrow (prose only), vendor-neutral (any
  OpenAI-shaped endpoint, including a local Ollama), and off by default.
- Minors: store only sports facts. Never infer or accept medical, personal,
  disciplinary, or contact information. Corrections and removal are one step.

**Storage:** approved games are JSON at `data/sports/games/*.json` — a
git-backed archive, $0, no database. Record locally, commit the file, push to
publish. `SportsStore` in `store.ts` is the seam if that ever needs Postgres.

**Demo season:** `scripts/seed-sports-desk.ts` writes seven seeded games flagged
`demo: true`. Editions disclose a seeded archive. Delete `data/sports/games/`
and change `src/lib/sports/team.ts` to cover a real team.

**Tests:** `tests/sportsDesk.test.ts` locks the arithmetic and the
hallucination boundary (including the spec's own case: "186 rushing yards"
must never become "186 rushing yards on 24 carries").

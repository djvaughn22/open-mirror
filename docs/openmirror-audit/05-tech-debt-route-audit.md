# Open Mirror LLC — Tech Debt & Route Audit (Phase 5)

_Env var **names only** below — no secret values were read or printed._

## 🔴 High priority
1. **Secret hygiene — `OPENAI_ADMIN_KEY` referenced in app code.**
   Admin-scoped OpenAI keys can manage billing/keys for the whole account. They must **never** live in frontend or serverless app code. → Rotate it, and in code use only a **restricted project API key** (`OPENAI_API_KEY`) scoped to the one project. _(Owner action — I did not touch keys.)_
   - Also referenced: `OPENAI_API_KEY`, `PETFINDER_KEY`, `PETFINDER_SECRET`, `YVP_APP_KEY`. Confirm each is set as a **Vercel env var** and never committed. `.env*` is gitignored (verified on CHP) — verify on all repos.
2. **Repo bloat — hub `.microsurgery-backups/` = 40,657 files.**
   Massive working-tree clutter (CHP 3, DJCares 4 — fine; hub is the problem). Add `.microsurgery-backups/` to `.gitignore` everywhere and remove from the working tree. If already committed, that's real repo weight — clean in a dedicated PR.

## 🟠 Medium priority
3. **Duplicated `OpenMirrorNav`** across all 11 repos → 8 sites on the stale menu/order/style. Single source of truth needed (doc 04).
4. **No shared footer** — each site hand-rolls its own; wording/colors drift.
5. **Framework drift** — Next `16.2.9` / `16.2.6` / `15.3.3` (DJCares, WhatAmIAI on 15). Converge on one 16.2.x line to avoid subtle build differences.
6. **Palette debt** — warm hexes (`#FB923C/#FBBF24/#FB7185`), cream text, gradients, and `backdrop-blur` still on ~8 sites (see doc 02 table).
7. **Deploy-model split** — 9 sites deploy by **Vercel CLI**, 2 (hub, iDontCry) by **GitHub push**. This is why "following deploys in the Vercel dashboard" feels broken: CLI deploys show as source "CLI", not per-commit. → Recommend connecting each Vercel project to its GitHub repo so **git push = a visible, per-commit production deploy** (owner action in Vercel UI; free).

## 🟡 Low priority / hygiene
8. **8 TODO/FIXME** in app code — triage into issues.
9. **Route audit:** hub has 19 routes incl. placeholder site pages + `/reflect` + `/about-open-mirror` + `/heart` etc. CHP `/reflect` was correctly removed this session — grep for any remaining links to `crossheartpray.com/reflect` (should point to `openmirrorllc.com/reflect`). ✅ none found in family navs.
10. **`package.json` scripts** — standardize `dev/build/start/lint` across all repos (mostly consistent already).
11. **`.microsurgery-backups` + `.vercel` + `.env*`** should be uniformly gitignored in every repo.

## Route inventory (high level)
- **Hub (19):** `/`, `/about-open-mirror`, `/reflect`, `/heart`, `/explorebible`, `/daily-hope`, `/bible-reading-plan`, plus per-site placeholder/coming-soon routes. (Some CHP-style routes exist in the hub as legacy — candidate for cleanup once standalone sites are canonical.)
- **CrossHeartPray (10):** `/`, `/about`, `/daily-hope`, `/bible-reading-plan`, `/explorebible`, `/gene-getz`, `/cross`, `/heart`, `/pray`, `/bible-bingo/[boardId]`. Clean.
- **Single-page products:** DJCares (tabbed SPA), DontCloneMeTom (+`/api/dogs`), PleaseBeReady, StepInTheRing, WhatAmIAI, Fambook, Friendbook — one route each. iDontCry, WatchedNotWatched — two.

## Build health
All 11 build with Next (spot-built CHP, DJCares, DontCloneMeTom, hub this session — green). No blocking type/lint errors observed in the sites touched.

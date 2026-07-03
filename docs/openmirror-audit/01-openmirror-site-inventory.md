# Open Mirror LLC — Site Inventory (Phase 1)

_Audit date: 2026-07-02 · Discovered from local repos, package.json, `.vercel/project.json`, git remotes, and `OpenMirrorNav` domain lists. Not assumed — verified locally._

## Summary
- **11 sites + 1 embedded tool (Reflect)** — all Next.js, all owned by `djvaughn22`, all under Open Mirror LLC.
- Hosting: **Vercel** (domains registered at **GoDaddy**, pointed via `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`).
- Deploy model: **9 via Vercel CLI** (`.vercel/project.json` present), **2 via GitHub auto-deploy** (hub + iDontCry — no `.vercel` link).
- Framework drift: Next **16.2.9** (3), **16.2.6** (5), **15.3.3** (2). Should converge.

## Inventory

| # | Product | Domain(s) | Path | Framework | Deploy | Status | Belongs to OM | Shares shell? |
|---|---------|-----------|------|-----------|--------|--------|:---:|:---:|
| 1 | **Open Mirror LLC** (hub) | openmirrorllc.com | `~/OpenMirror/open-mirror` | Next 16.2.6 | GitHub-auto (`open-mirror`) | LIVE | ✅ owner | is the shell |
| 2 | **CrossHeartPray** | crossheartpray.com | `~/OpenMirror/crossheartpray` | Next 16.2.6 | CLI `crossheartpray` | LIVE | ✅ | own sacred shell + family footer |
| 3 | **TheDJCares** | thedjcares.com | `~/TheDJCares/thedjcares` | Next 15.3.3 | CLI `thedjcares` | LIVE | ✅ | ✅ |
| 4 | **PleaseBeReady** | pleasebeready.com/.net/.org | `~/PleaseBeReady/pleasebeready` | Next 16.2.6 | CLI `pleasebeready` | LIVE | ✅ | ✅ |
| 5 | **DontCloneMeTom** | dontclonemetom.com | `~/DontCloneMeTom/dont-clone-me-tom` | Next 16.2.6 | CLI `dont-clone-me-tom` | LIVE | ✅ | ✅ |
| 6 | **iDontCry** | idontcry.com | `~/idontcry` | Next 16.2.9 | GitHub-auto (`idontcry`) | LIVE | ✅ | ✅ |
| 7 | **StepInTheRing** | stepinthering.com/.org | `~/StepInTheRing/step-in-the-ring` | Next 16.2.9 | CLI `step-in-the-ring` | LIVE | ✅ | ✅ |
| 8 | **WatchedNotWatched** | watchednotwatched.com | `~/WatchedNotWatched/watched-not-watched` | Next 16.2.9 | CLI `watched-not-watched` | IN DEV | ✅ | ✅ |
| 9 | **WhatAmIAI** | whatamiai.com | `~/WhatAmIAI/whatamiai` | Next 15.3.3 | CLI `whatamiai` | LIVE | ✅ | ✅ |
| 10 | **Fambookagram** | fambookagram.com | `~/Fambookagram/fambookagram` | Next 16.2.6 | CLI `fambookagram` | COMING SOON (waitlist) | ✅ | ✅ |
| 11 | **Friendbookagram** | friendbookagram.com | `~/Friendbookagram/friendbookagram` | Next 16.2.6 | CLI `friendbookagram` | COMING SOON (waitlist) | ✅ | ✅ |
| — | **Reflect** | openmirrorllc.com/reflect | route in hub | — | with hub | LIVE | ✅ | is in hub |

## Risk levels
- **Low risk to touch:** hub, TheDJCares, DontCloneMeTom, PleaseBeReady, Fambook/Friendbook (simple, single-page, own repos).
- **Medium:** iDontCry, StepInTheRing, WhatAmIAI, WatchedNotWatched (real apps; verify before restyle).
- **Protected — do not alter doctrine/copy/flow:** **CrossHeartPray** (MVP1-locked, Bible-first). Consistency wrappers/bug fixes only.

## Notes
- The cross-site menu lives in a **duplicated** `app/OpenMirrorNav.tsx` (or `src/components/OpenMirrorNav.tsx`) in **every** repo. There is no shared package → drift. This is the core architecture debt (see docs 04–05).
- Emoji favicons (`icon.svg`) now present on all 11 (added 2026-07-02).
- Repos inspected: all 11 paths above + confirmed missing/none for any other home-level Next project.

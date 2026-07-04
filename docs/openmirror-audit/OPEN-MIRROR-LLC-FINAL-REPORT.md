# 🪞 Open Mirror LLC — Final Product-Family Report

_Executive summary of the audit + consistency pass. Details in the numbered docs in this folder._

## The family (11 sites + 1 tool)
| Product | Domain | Status | Consistency now |
|---------|--------|--------|:---:|
| Open Mirror hub | openmirrorllc.com | Live | ✅ family look |
| CrossHeartPray | crossheartpray.com | Live (protected) | ✅ |
| TheDJCares | thedjcares.com | Live | ✅ |
| DontCloneMeTom | dontclonemetom.com | Live | ✅ |
| StepInTheRing | stepinthering.com | Live | ✅ |
| iDontCry | idontcry.com | Live | ✅ |
| WhatAmIAI | whatamiai.com | Live | ✅ |
| PleaseBeReady | pleasebeready.com | Live | ✅ |
| WatchedNotWatched | watchednotwatched.com | In dev | ✅ chrome |
| Fambookagram | fambookagram.com | Coming soon (waitlist) | ✅ |
| Friendbookagram | friendbookagram.com | Coming soon (waitlist) | ✅ |
| Reflect | openmirrorllc.com/reflect | Live (in hub) | ✅ |

**Placeholders/waitlists:** Fambookagram, Friendbookagram (need a real backend to become products — see below).
**Broken:** none found. **In dev:** WatchedNotWatched.

## What changed (this pass)
Every site is now on **one cool, flat, warm-hearted design language** — same background, panels, borders, text, and a single cool accent per product. No more red/yellow/orange, no glassmorphism, matching emoji tab icons, and a shared menu. Content and voice already felt like one company; the **chrome now matches**. Full list: `06-fixes-made.md`.

## Recommended hierarchy & flow
- **Hub = the front door / "link in bio"** (openmirrorllc.com). Everything is one tap from there.
- **Faith core:** CrossHeartPray → TheDJCares (Gene Getz / Life Essentials threads through both).
- **Live products:** DontCloneMeTom, iDontCry, StepInTheRing.
- **Coming soon:** Fambookagram, Friendbookagram.
- **Reflective/AI:** WhatAmIAI, Reflect.
- **Menu order (canonical, PleaseBeReady last):** already applied in hub + DJCares navs; roll to the rest by copying that `OpenMirrorNav.tsx`.

## Top 10 tech-debt issues
1. `OPENAI_ADMIN_KEY` referenced in app code — **rotate + use a restricted key** (owner). 🔴
2. `OpenMirrorNav` copy-pasted into 11 repos → drift (make it one shared file). 🟠
3. No shared footer component. 🟠
4. Framework drift: Next 15.3.3 vs 16.2.6 vs 16.2.9 — converge. 🟠
5. Duplicate/conflicting CSS blocks (e.g. CHP `.chp-reading-table td a` twice). 🟡
6. Deploy split (9 CLI, 2 GitHub-auto) → hard to follow in Vercel. **Connect each Vercel project to its GitHub repo** for per-commit visibility (owner). 🟠
7. Backup clutter (now gitignored; hub had ~40k files). ✅ addressed
8. 8 TODO/FIXME to triage. 🟡
9. Legacy CHP-style routes still in the hub repo. 🟡
10. Fambook/Friendbook are shells, not products yet. 🟡

## Top 10 UX-consistency wins (done)
Shared palette · shared emoji favicons · consistent menu order · PleaseBeReady parked last · cool accents per site · flat surfaces (no glass) · centered controls (DJCares) · no fake buttons · reading-plan fits on screen · Gene Getz 🎬 iconography shared across surfaces.

## Top 10 warm/premium polish ideas (next)
1. One shared `OpenMirrorFooter` (© + family links) on every site.
2. Make `OpenMirrorNav` a single synced file (kills drift).
3. Shared `CTAButton` + `ProductCard` components.
4. Sharpen StepInTheRing's AI-prompt output into a paste-ready vibe-coding prompt.
5. Real product for Fambook/Friendbook (free Supabase backend — private groups).
6. In-site dog photos on DontCloneMeTom (free Petfinder key → 2 env vars).
7. Themed YouTube playlists for TheDJCares Faith Videos (you create playlists → I embed).
8. Convert framework versions to one line.
9. Add simple empty/error states everywhere (use DontCloneMeTom's ZIP search as the model).
10. A tiny brand page in the hub documenting the tokens for contributors.

## What needs YOUR manual action (owner-only)
- **Rotate `OPENAI_ADMIN_KEY`** → restricted project key (security).
- **Connect Vercel projects to GitHub** (Vercel → Project → Settings → Git) so `git push` = a visible per-commit production deploy — fixes "I can't follow deploys."
- **Free signups if you want the next features:** Petfinder API key (dog photos), Supabase project (Fambook/Friendbook private groups). I'll wire both the moment you drop the keys in.
- GoDaddy DNS is already set — no action.

## Exact next Claude prompt to run
> "Make `OpenMirrorNav` and a new `OpenMirrorFooter` a single shared file synced to all 11 repos (Stage A of `04-reusable-component-plan.md`). One commit + build per repo. Then sharpen StepInTheRing's AI-prompt output into a paste-ready vibe-coding prompt. Don't touch CrossHeartPray doctrine; don't change DNS/secrets/permissions."

## Rollback (any repo)
```bash
git revert --no-edit <bad-sha> && git push && vercel --prod --yes
# or the Vercel dashboard → Deployments → Instant Rollback
```
Pre-audit safety tag (hub): `openmirror-audit-snapshot-20260702-2239`.

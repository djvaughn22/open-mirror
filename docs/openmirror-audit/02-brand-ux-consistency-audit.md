# Open Mirror LLC — Brand & UX Consistency Audit (Phase 2)

_Score: 5 = consistent + warm · 4 = minor polish · 3 = usable but inconsistent · 2 = off-brand/confusing · 1 = broken/placeholder._

## Scores at a glance

| Site | Score | Palette | Nav | Glass | One-line verdict |
|------|:---:|--------|-----|:---:|------------------|
| CrossHeartPray | **5** | cool flat ✅ | own SiteHeader (correct) | fixed | Harmonized this session; light theme bug fixed; Bible-first tone intact |
| TheDJCares | **5** | cool flat + royal purple ✅ | new OpenMirrorNav ✅ | none | Warm, personal, curated; Faith Videos + Gene Getz added |
| Open Mirror hub | **4** | cool flat ✅ (home) | canonical nav ✅ | none | Home harmonized; `about-open-mirror` still has warm accents |
| DontCloneMeTom | **4** | cool teal ✅ (page) | **stale warm nav** ❌ | nav glass | Page recolored + live dog search; nav not yet updated |
| StepInTheRing | **3** | old | **stale nav** ❌ | yes | Real app, off the new palette |
| WhatAmIAI | **3** | old | **stale nav** ❌ | yes | Introspective tool, needs warm-cool shell |
| PleaseBeReady | **3** | old warm | **stale nav** ❌ | yes | Solid content, off-brand chrome |
| Fambookagram | **2** | old | **stale nav** ❌ | yes | Waitlist landing; off-brand + no real product yet |
| Friendbookagram | **2** | old | **stale nav** ❌ | yes | Same as Fambook |
| iDontCry | **2** | old warm | **stale nav** ❌ | yes | Vaughn name removed; still old warm/glass style |
| WatchedNotWatched | **2** | old, heavy glass | **stale nav** ❌ | 3 files | In-dev; most glassmorphism of any site |

**Family average ≈ 3.2.** The three flagships (CHP, DJCares, hub) are 4–5; the other eight are 2–3 and drag the average down. Fixing the **shared nav + palette** lifts everyone at once.

## Per-dimension findings (cross-site)

- **Header/menu:** `OpenMirrorNav` is duplicated; only DJCares + hub carry the correct 2026-07 order (PleaseBeReady last) and cool flat styling. The other 8 show the **old order** (PleaseBeReady mid-list) and **glass blur + warm cream text**. → biggest single inconsistency.
- **Footer:** No shared footer component. Each site hand-rolls a "back to Open Mirror" line with different wording/colors.
- **Logo/brand:** 🪞 + "Open Mirror" is consistent in the nav; individual site wordmarks vary (some `.com` chips, some not).
- **Buttons:** Every site defines its own pill styles inline. No shared variants. Warm accent buttons (orange/yellow) still on 7 sites.
- **Cards:** Hub card (`borderLeft: 5px accent`, emoji chip, status pill, CTA) is the strongest pattern — should become the family `ProductCard`.
- **Typography:** All use system-ui/Geist; sizes ad hoc. No shared scale.
- **Backgrounds:** Split between old warm `#0C0C0C`/gradients and new cool `#0b1220`. Target: cool flat everywhere.
- **Mobile:** Generally OK (max-width containers), but glass blur + some fixed widths hurt small screens.
- **CTA wording:** Inconsistent ("Open X", "Meet Dogs", "Take the Challenge"). Needs a shared voice.
- **Back/Home/Next:** CHP has good flow; most single-page sites only have "← Back to Open Mirror". No consistent family-nav footer.
- **Error/empty states:** Mostly absent (DontCloneMeTom's new ZIP search has a good empty state — use as the model).
- **Warmth/human tone:** Strong on CHP/DJCares/DontCloneMeTom copy; chrome (nav/footer/buttons) reads colder/older on the un-migrated sites.

## Verdict
The **content and voice** already feel like one warm company. The **chrome** (nav, footer, buttons, palette) is where it fractures — and it's almost entirely fixable by replacing the copy-pasted nav/footer with shared components and finishing the cool-flat palette migration. No page needs a ground-up redesign.

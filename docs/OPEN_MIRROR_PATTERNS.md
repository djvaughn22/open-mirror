# Open Mirror — Pattern Library (internal)

_What the strongest current implementation of each shared pattern is, where it lives, and how to reuse it without breaking the product it came from. Describes the code as it exists on 2026-07-14. Not a public design system._

## How sharing works here

Three chrome components are **canonical in this repo** and copied byte-for-byte into every satellite by `scripts/sync-ui.sh`:

| Component | Canonical file | What it owns |
|---|---|---|
| Family header | `packages/openmirror-ui/OpenMirrorNav.tsx` | "Open Mirror LLC" bar, site label, ☰ family menu (hub homepage order, PleaseBeReady pinned last), menu close-on-Escape/outside-click |
| Theme toggle | `packages/openmirror-ui/OpenMirrorTheme.tsx` | ☀️/🌙 toggle, `om-theme` localStorage key, pre-paint theme init, the entire shared light-mode CSS, reload scroll-to-top clamp |
| Family footer | `packages/openmirror-ui/OpenMirrorFooter.tsx` | © line with per-site name/tagline/accent, Open Mirror LLC + About + CHP links |

**Never edit the copies in site repos.** Edit here, run `./scripts/sync-ui.sh`, then build + commit + push each satellite.

Everything else is **per-site by design** — colors, fonts, heroes, cards, voice. Sites are allowed to look different; they must *behave* the same.

## Theme mechanics (all 12 sites)

- One storage key everywhere: `om-theme` (`"light"` or absent/`"dark"`).
- `OpenMirrorTheme.tsx` SSRs an inline script that applies the saved theme **during HTML parse** — no dark flash for light-mode users. It defers to any head script that already set `data-om-theme` (CrossHeartPray's layout does this to also honor `?theme=` URL overrides).
- Light mode works by remapping the family dark hexes (`#0b1220`, `#141d2e`, `#1c2740`, `#26324c`, `#e8edf5`, `#94a3b8`, accent hues) via attribute selectors in `LIGHT_CSS`. **If you introduce a new hardcoded dark color, light mode won't know about it** — use the existing hexes or add a remap rule in the canonical file.
- Gotcha (from the light-mode rollout): client re-renders serialize inline colors as `rgb()` — `LIGHT_CSS` matches both hex and rgb forms. Keep both when adding rules.
- OpenDoku (static HTML) implements the same contract by hand: reads `om-theme`, sets `data-theme` on `<body>`, tokens via CSS variables.

## Scroll restoration (all 12 sites)

Reload always starts at the top. `history.scrollRestoration = "manual"` does **not** work for this (the flag is read from the history entry as the previous page left it), so `OpenMirrorTheme.tsx` ships a reload-only clamp that yields to real user input. Don't re-fix this per site; it's already family-wide.

## 404 pages

Every Next.js repo has `app/not-found.tsx` (or `src/app/not-found.tsx`) rendering inside the root layout, so the family bar, footer, and theme carry through. OpenDoku has a static `404.html`. Copy: "Page not found / That page doesn't exist here / Back to the home page." Keep it plain.

## Checklist + progress mechanics (reference implementation)

The CrossHeartPray Bible Reading Plan is the reference checklist. Its **generic mechanics** live in `crossheartpray/src/lib/checklistProgress.ts` (mirrored in this repo at `src/lib/checklistProgress.ts`), with vitest coverage in CHP:

- `loadChecklistProgress(storageKey)` — SSR-safe, corrupt-JSON-safe, accepts legacy shapes (array of ids, `{id: "true"}`, `{id: {read/done/completed}}`).
- `saveChecklistProgress(storageKey, progress, changeEventName?)` — swallows storage failures, optional window event for cross-component sync.
- `toggleChecklistItem(progress, id)` — unchecked items are *removed*, not set false.
- `checklistStats(itemIds, progress)` — done/total/remaining/percent.

**Reuse rules** (e.g. a future PleaseBeReady preparedness list):
1. Copy `checklistProgress.ts` into the product repo (or import the hub mirror if it's a hub page). Do not create a shared npm package for this yet.
2. Pass your own namespaced, versioned key — `pleasebeready:checklist:v1` style. Never reuse `crossheartpray:*` keys; a CHP checklist and a PBR checklist must never read each other's state.
3. Faith-specific parts stay in CHP: Scripture references, bible.com links, lanes/weeks, Gene Getz videos, reading-plan wording. Product-specific parts (Amazon links, prices, quantities, budgets) stay in that product.
4. The public CHP Reading Plan's behavior and visuals are locked — reuse the mechanics, never restyle the original.

## Storage key registry (avoid collisions)

| Key | Owner |
|---|---|
| `om-theme` | family theme toggle |
| `crossheartpray-visual-theme` | CHP visual theme (kept in sync by the toggle) |
| `crossheartpray:bible-reading-plan:v1` | CHP Reading Plan progress |
| `wnw.*.v1` / `wnw.library.v2` | WatchedNotWatched |
| `wai3-*` / `wai-*-v1` | WhatAmIAI |
| `sitr-*` / `creation-engine-projects-v1` | StepInTheRing |
| `dream-shop-saves-v1` | iDontCry Dream Shop |

New keys: `product:feature:vN` (or the site's existing prefix style), and add them here.

## Metadata

Every Next.js layout sets `metadataBase` to its canonical production domain. New site checklist: `metadataBase`, title, description, GA script (see memory/new-site checklist in `project_google_analytics`), family nav + footer + toggle via sync script.

## Known limitations / do-not-copy-blindly

- `LIGHT_CSS` attribute-selector remapping is deliberate brute force; it depends on sites using the family hexes. It is not a general theming system.
- `OpenMirrorNav` uses a `<details>` menu on purpose (zero hydration). Don't convert it to a React-state menu; the close behavior is handled by the inline script in the same file.
- The nav/footer render inline dark styles; the `.om-bar` / `.om-footer` light rules in `LIGHT_CSS` override them. Keep those class names.
- CHP keeps its own `SiteHeader` + `ChpProductNav` below the family bar; the family bar never replaces a product's own navigation.

# Open Mirror LLC — Shared Design System (Phase 3)

_Practical, zero-new-dependency. Implementable as a tiny set of tokens + components copied (or, better, packaged) across repos. Tailwind v4 + inline styles both supported._

## 1. Brand principles
Warm · simple · trustworthy · modern-not-cold · premium-not-corporate · encouraging-not-cheesy · clear next step · mobile-first · fast · low/no-cost · invite-ready.

**Rule of thumb:** one screen = one obvious next step. Never make something look tappable that isn't. Never a wall of options.

## 2. Color tokens (cool, flat, no red/yellow/orange)
```
--om-bg:        #0b1220   /* page background (flat, no gradient) */
--om-surface:   #141d2e   /* cards / panels */
--om-surface-2: #1c2740   /* raised / active */
--om-inset:     #0c1220   /* insets, code, wells */
--om-border:    #26324c   /* hairlines / card borders */
--om-text:      #e8edf5   /* primary text */
--om-sub:       #94a3b8   /* secondary text */
--om-ink:       #0b1220   /* text on bright accent buttons */
```
**Per-product accent** (each site keeps one cool accent for identity):
```
CrossHeartPray  #4ADE80 (emerald)     TheDJCares     #A78BFA (royal purple)
WhatAmIAI       #A78BFA               Reflect        #93C5FD
DontCloneMeTom  #2DD4BF (teal)        iDontCry       #38BDF8 (sky)
StepInTheRing   #60A5FA (blue)        WatchedNotWatched #22D3EE (cyan)
PleaseBeReady   #34D399 (green)       Fambookagram   #C084FC (violet)
Friendbookagram #818CF8 (indigo)      Hub/OM         #A78BFA
```
**Banned in chrome:** warm hexes `#FB923C`, `#FBBF24`, `#FB7185`, `#F472B6`, cream `#F5F0E8`, near-black `#0C0C0C`, gradients, `backdrop-blur`.

Light theme (CHP pattern): bg `#edf1f5`, text `#172033`, surface `#f8fafc`, border `#cfd8e3`.

## 3. Typography scale
System stack (`system-ui, -apple-system, Geist, sans-serif`). Weights 700/800/900 for headings, 600/700 for body.
```
Display  40–46 / 900     H2 22–26 / 900     Eyebrow 11–12 / 900 uppercase 0.2em
H1 (hero) 32–40 / 900    H3 18–20 / 900     Body 14–16 / 600–700   Meta 12–13 / 700
```
`text-wrap: balance` on headings. Line-height 1.5–1.7 for body.

## 4. Spacing & section rhythm
8-pt scale. Page container `max-width: 680–720px` (single-column products) or `1100px` (hub/grids), `padding: 36–44px 24px`. Section gap **40px**. Card padding **20–24px**. Radius **16–20px** (cards), **999px** (pills).

## 5. Shared components (see doc 04 for build plan)
- **OpenMirrorShell** — `<main>` bg + max-width container + `<OpenMirrorHeader/>` + slot + `<OpenMirrorFooter/>`.
- **OpenMirrorHeader** — 🪞 wordmark left, hamburger → **ProductFamilyNav** (the one canonical menu, PleaseBeReady last).
- **OpenMirrorFooter** — © line + "part of the Open Mirror family" + 3–5 sibling links + back-to-hub.
- **ProductHero** — eyebrow + H1 + subhead + 1 primary CTA (+ optional secondary). Centered, mobile-first.
- **ProductCard** — the hub card: `borderLeft: 5px var(accent)`, emoji chip, name(+`.com`), status pill, tagline, one CTA. This is the family's signature object.
- **CTAButton** — variants: `primary` (solid accent, ink text), `secondary` (surface + border), `ghost` (text + underline). One min-height 44px, centered label.
- **SectionHeader** — emoji + H2 + optional sub.
- **WarmNotice** — soft panel for reassurance/empty states (accent-tinted border, calm copy).
- **SourceTrustNote** — small, honest "here's where this comes from / links out to the real source" (CHP + Gene Getz + DontCloneMeTom already do this).

## 6. CTA language rules
- Verb-first, one action: "Open Daily Hope", "Meet real dogs near you", "Start reflecting".
- Encouraging, never hypey. No "Unlock", "Crush", "10x".
- Secondary actions use plain links, not competing buttons.
- External links always say where they go ("Open on YouTube", "See on Petfinder").

## 7. Product-family footer links
Every site footer carries: **Open Mirror Home** + 3–5 siblings + the current site's back link. Order follows the canonical family order (faith apps → live sites → soon → figure-out → PleaseBeReady last). One source of truth = `ProductFamilyNav` data.

## 8. Accessibility / mobile rules
- Tap targets ≥ 44px. Real `<button>`/`<a>` for actions (no fake buttons).
- Contrast: text on `--om-bg`/`--om-surface` meets AA (the cool tokens do).
- `target="_blank"` always paired with `rel="noopener noreferrer"`.
- Modals: close on overlay click + Escape; lock body scroll; `role="dialog" aria-modal`.
- No autoplay without user action.
- Mobile-first: single column, wrap chips, no fixed pixel widths that overflow < 360px.

## 9. Product-personality guardrails (tone, not chrome)
- **CrossHeartPray** — sacred, Bible-first; AI only facilitates; do not mansplain Scripture; keep its emerald/sacred identity, share only footer/family-nav + bug fixes.
- **WatchedNotWatched** — for-profit, product-focused, but same warm shell.
- **WhatAmIAI / Reflect** — introspective, warm, minimal.
- **TheDJCares** — personal, curated, encouraging, human.
- **DontCloneMeTom** — funny but credible and clean.
- **StepInTheRing** — builder/family/productive, never cringe.

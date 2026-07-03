# Open Mirror LLC — Reusable Component Architecture (Phase 4)

_Extract what already works. No big libraries. Staged migration. Routes must keep working. CHP MVP1 stays protected._

## The core problem
`OpenMirrorNav.tsx` is **copy-pasted into all 11 repos**. When the menu order or style changes, only the edited copy updates — which is exactly why 8 sites are on the stale nav today. Same story looming for footer/buttons/cards. We need **one source of truth** with a **low-friction distribution** method.

## Distribution options (pick one)
1. **Shared file, synced by script (recommended first step, zero cost):**
   Keep a canonical `packages/openmirror-ui/` folder in the hub repo. A tiny `scripts/sync-ui.sh` copies the canonical components into each sibling repo's `app/_openmirror/`. Commit per repo. Simple, no registry, no monorepo migration, works today.
2. **Local npm workspace / monorepo (later):** move all sites under one repo with `packages/openmirror-ui`. Cleanest long-term, but a big move — defer until collaboration ramps.
3. **Published private package (later, avoid for now):** needs npm registry/paid or GH Packages setup — skip until needed.

**Decision:** start with (1). It removes the drift immediately without risky restructuring.

## Components to standardize (priority order)

| Priority | Component | Source to extract from | Notes |
|:---:|-----------|------------------------|-------|
| P0 | **ProductFamilyNav** (data + `OpenMirrorNav`) | hub `src/components/OpenMirrorNav.tsx` (canonical) | One menu array (PleaseBeReady last), cool flat, no glass. Sync to all sites. |
| P0 | **OpenMirrorFooter** | best of existing footers | © + family links + back-to-hub. |
| P1 | **CTAButton** | hub card CTA + CHP buttons | `primary/secondary/ghost`, 44px, centered. |
| P1 | **ProductCard** | hub `Card` (`borderLeft` accent) | The signature object; reuse on hub + any "explore more" sections. |
| P1 | **ProductHero** | DontCloneMeTom / DJCares heroes | eyebrow + H1 + sub + 1 CTA. |
| P2 | **OpenMirrorShell** | wrap `<main>` + container | Opt-in wrapper; **do not force onto CHP pages** (keep its shell). |
| P2 | **SectionHeader / WarmNotice / SourceTrustNote** | CHP SourceBackedTrustNote, DontCloneMeTom empty state | Small, warm, honest. |
| P3 | **YouTubeModal / ShareButton** | CHP `YouTubeModal`, DJCares share, DontCloneMeTom share | Already near-duplicated 3×; unify. |

## Staged migration (safe order)
1. **Stage A — nav/footer only (highest ROI, lowest risk).** Sync the canonical `OpenMirrorNav` + a new `OpenMirrorFooter` into the 8 stale sites. Pure chrome; no content/route changes. Build each; commit; (push on your say-so).
2. **Stage B — palette pass.** Replace warm hexes/gradients/glass with cool tokens per site (mechanical sed, as already done for CHP/DJCares/hub/DontCloneMeTom). One site per commit.
3. **Stage C — buttons/cards.** Swap ad-hoc pills for `CTAButton`; adopt `ProductCard` where a site lists things.
4. **Stage D — hero/shell.** Only where it clearly helps; never on protected CHP flows.

## Guardrails
- **CrossHeartPray:** may adopt `OpenMirrorFooter` + `ProductFamilyNav` link data, but keeps its own `SiteHeader`, sacred hero, and locked copy. No shell wrapper over its MVP pages.
- One component change = one commit, one build, one site at a time. Never "rewrite every page at once."
- Keep every existing route working; components are additive/replacement-in-place, not re-routing.
- No new runtime dependencies. Tailwind classes or inline styles + the token list only.

# openmirror-ui — canonical shared components

One source of truth for the chrome that every Open Mirror satellite site shares.
This ends the copy-paste drift called out in
`docs/openmirror-audit/04-reusable-component-plan.md` (Stage A).

## How it works

1. Edit a component **here** (never the copies inside site repos).
2. Run `./scripts/sync-ui.sh` from the hub repo root — it copies the files in
   its `FILES` list into every satellite repo's app folder.
3. In each satellite repo: `npm run build`, commit, push.

## Components

| File | Status | Notes |
|------|--------|-------|
| `OpenMirrorNav.tsx` | **synced to all 9 satellites** | Minimal satellite header: Open Mirror LLC wordmark + ☰ menu (Open Mirror Home / About). Flat solid `#0b1220` — no glass. |
| `OpenMirrorFooter.tsx` | available, not yet adopted | Shared footer (`siteName`/`tagline` props). Sites keep their own footer copy for now; add to `FILES` in sync-ui.sh when adopted. |

## Not covered

- **Hub's own nav** (full family menu) is separate: `src/components/OpenMirrorNav.tsx`.
- **CrossHeartPray** keeps its own `SiteHeader`/`OpenMirrorBar` per the plan's guardrails — never synced.

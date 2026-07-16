# Open Mirror LLC — hub (openmirrorllc.com)

The company and portfolio doorway for Open Mirror LLC, an independent product
studio. This repo serves the hub homepage, the studio About page, and the
CrossHeartPray family of pages.

- Portfolio source of truth: `src/lib/products.ts` (homepage, About, and nav
  all read from it — edit ONLY that file to add, reorder, or restatus a product).
- Company direction: `OPEN_MIRROR_PORTFOLIO_DOCTRINE.md`.
- Push to `main` = production deploy (Vercel).

## Repo map

- **Production:** https://openmirrorllc.com — branch `main`, auto-deploys on push (Vercel).
- **Framework:** Next.js 16.2.6 (App Router). Build: `npm run build`.
- **Tests:** `npm test` — Node's built-in runner (`tests/hub.test.ts`), no framework.
  Locks the rules that are easy to break by accident: CrossHeartPray stays the
  Foundation and stays first, Old Laptop stays the featured product marked
  "Preparing for Release", every public project (incl. Fambookagram and
  Friendbookagram) stays public and in the nav, Reflect stays hidden, About keeps
  deriving from the registry, and no paid ZIP reappears under `public/`.
  Run it after touching `src/lib/products.ts`.
- **Routes:** `/` (portfolio), `/about-open-mirror`, `/contact`, `/reflect`, per-product pages (`/crossheartpray`, `/step-in-the-ring`, …), plus mirrored CHP pages (`/cross`, `/heart`, `/pray`, `/daily-hope`, `/bible-reading-plan`, `/bible-bingo/[boardId]`, `/explorebible`). `/talk-with-the-owner` and `/work-with-the-founder` permanently redirect to `/contact`.
- **Canonical family UI:** `packages/openmirror-ui/` (`OpenMirrorNav`, `OpenMirrorFooter`, `OpenMirrorTheme`). Edit ONLY there, then run `./scripts/sync-ui.sh` and build/commit/push each satellite. Pattern docs: `docs/OPEN_MIRROR_PATTERNS.md`.
- **Identity rules:** owner stays publicly anonymous — "the owner of Open Mirror LLC", never a name/photo/bio. `src/lib/owner.ts` is the only identity source. No public prices without DJ's explicit go.
- **Env vars (names only):** `RESEND_API_KEY`, `INTAKE_FROM_EMAIL`, `SITE_BASE_URL`, `SOCIAL_ADMIN_KEY`, `SOCIAL_HASHTAGS`, `CRON_SECRET`, `YVP_API_HOST`, `YVP_APP_KEY`, `OPENAI_API_KEY`.
- **Protected:** the three haikus (About page, verbatim), mission/positioning copy, product order in `src/lib/products.ts`, Talk-with-the-Owner unpriced tiers.

## Local dev

```bash
npm install
npm run dev
```

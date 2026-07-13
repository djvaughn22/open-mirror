# Daily Social Engine

One reusable daily-Instagram engine for every Open Mirror brand. Built to
scale to hundreds of brands: **adding a brand = one config + one content
adapter + one card design.** Nothing else is rewritten.

## What's canonical here (synced, never edited in satellites)

| File | Purpose |
| --- | --- |
| `dailySocialCore.ts` | America/Chicago date logic, brand config + post types, caption marker, UTMs, parity validation |
| `instagramPublisherCore.ts` | Official Meta Graph publish flow (container → status → publish), duplicate ledger via caption markers, sanitized errors |
| `publishRouteCore.ts` | `createDailyPublishHandler()` — the whole protected cron/admin publish endpoint as a factory |
| `AdminDailyPanel.tsx` | Client admin controls: regenerate, copy caption, download, status, dry run, publish now/retry |

Sync with `./sync-daily-engine.sh` (copies into each live site's lib).

## What each brand supplies (in its own repo)

1. **Brand config** — a `DailySocialBrandConfig` (name, siteUrl, markerPrefix,
   hashtags, startDate, version).
2. **Content adapter** — `buildPost(dateKey, …): DailySocialPost`. This is the
   single source of truth for the day's content; the /today page, the image
   route, the caption, and the publisher all consume the same object.
3. **Card design** — a `next/og` ImageResponse route at
   `/api/social/bible-bingo/<date>.png` style stable URL (brand look, 1080×1350).
4. **/today page(s)** + admin page wiring the shared panel.

## Live brands

- **crossheartpray** — Daily Bible Bingo (deterministic verse engine)
- **dontclonemetom** — Dog of the Day near 63040 (RescueGroups.org, verified before publish)
- **thedjcares** — Daily Encouragement from the curated library (deterministic rotation)

## Backlog

- **watchednotwatched** — placeholder config in `backlog/watchednotwatched.ts`.
  NOT wired to the daily engine yet: its first market test uses manual launch
  posts until the public product promise and destination are confirmed.

## Brand isolation

Each site is its own Vercel project with its own env vars
(`INSTAGRAM_ACCOUNT_ID`, `META_ACCESS_TOKEN`, `INSTAGRAM_AUTOPUBLISH_ENABLED`,
`CRON_SECRET`, `SOCIAL_ADMIN_KEY`). Pausing or a failure in one brand cannot
affect another. Per-brand ops guides live in each repo's docs/.

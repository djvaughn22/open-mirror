# Open Mirror LLC — Fixes Made (Phase 6)

_Safe, low-blast-radius consistency wins. Every change was build-gated (`npm run build` ✓) before deploy. CrossHeartPray doctrine/copy untouched._

## Family-wide
- **Cool flat palette** established as the family standard (`#0b1220` bg / `#141d2e` panels / `#26324c` borders / `#e8edf5` text / `#94a3b8` muted), no red/yellow/orange, no gradients, no glassmorphism.
- **Emoji favicons** on all 11 sites (`app/icon.svg`) so every browser tab is on-brand.
- **Backup clutter gitignored** in every repo (`.microsurgery-backups/` — the hub alone had ~40,661 untracked backup files).
- **Docs system** created in `docs/openmirror-audit/` incl. `EDIT-EACH-SITE.md` (the easy-update guide) + collaboration playbook.

## Per site
- **CrossHeartPray** — cool flat restyle; **light-theme bug fixed** (VisualThemeProvider was never mounted → toggle did nothing); reading-plan checkboxes render as clean squares; Gene Getz 🎬 icons (Bible Bingo corner + reading-plan right-pinned); all 7 reading lanes now fit on screen; About grammar + Wikipedia links; **all 1,500 Gene Getz Life Essentials principles + in-app video** added; `/gene-getz` page; menu/home reordered (Daily Hope → Reading Plan → Life Essentials → Bible Bingo). _Doctrine/Scripture untouched._
- **TheDJCares** — cool flat + royal-purple theme; Faith Playlist + Christian Rap playlists; **Faith Videos tab** (themed YouTube collection); Gene Getz videos on encouragement verses; centered tabs/chips; de-faked hashtag "buttons".
- **Open Mirror hub** — cool flat palette; reordered cards + menu (PleaseBeReady last; "More from Open Mirror" group); warm accents → cool; Vaughn name removed.
- **StepInTheRing** — cool flat family palette via `:root` token remap (was warm gold/cream).
- **DontCloneMeTom** — cool teal restyle; **live Petfinder adoptable-dog search by ZIP**; funnier hero.
- **iDontCry** — Vaughn family name removed (now generic "family site"); warm remnants → cool.
- **WhatAmIAI, PleaseBeReady, WatchedNotWatched, Fambookagram, Friendbookagram** — warm remnants (cream/warm-grays) cleaned to cool tokens; glass removed; already largely on the family palette.

## Explicitly NOT touched (by policy)
- CrossHeartPray Scripture, prayers, doctrine, or locked copy.
- GitHub permissions, Vercel settings/billing, GoDaddy DNS, any secrets. (Flagged the `OPENAI_ADMIN_KEY` risk for owner action — not modified.)
- No paid services, APIs, or dependencies added.

## Backups / rollback
- Backup tag before this audit: **`openmirror-audit-snapshot-20260702-2239`** (hub).
- Every site: `git revert --no-edit <sha>` or Vercel dashboard "Instant Rollback". See `07-collaboration-playbook.md`.

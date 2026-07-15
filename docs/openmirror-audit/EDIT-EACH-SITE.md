# ✏️ How to Update Any Open Mirror Site (the easy way)

_Written so you can change anything, fast, without breaking a live site. Copy/paste friendly._

## The 3 golden rules
1. **Build before you deploy.** `npm run build` must say ✓ Compiled. If it errors, don't deploy — the live site stays safe.
2. **One change → one commit → one deploy.** Small steps are easy to undo.
3. **CrossHeartPray is protected.** Change bugs/styling only — never its Scripture, prayers, or wording.

## The 6-step loop (works for every site)
```bash
cd <repo path from the table below>
# 1. edit the one file you need (see "what to edit" column)
npm run build            # 2. must say: ✓ Compiled successfully
git add -A
git commit -m "what you changed"   # 3. save
git push                 # 4. save to GitHub — every site auto-deploys on push to main
                         #    (DJ confirmed Jul 2026; the old `vercel --prod` step is obsolete)
# 5. hard-refresh the live site: Ctrl+Shift+R
```

## Where each site lives + what to edit

| Site | Repo path | Edit this file for content | Deploy |
|------|-----------|----------------------------|--------|
| Open Mirror hub | `~/OpenMirror/open-mirror` | `src/app/page.tsx` (the cards) | push (auto) |
| CrossHeartPray | `~/OpenMirror/crossheartpray` | `src/app/page.tsx`, `src/app/about/page.tsx`, `src/lib/*.ts` | push (auto) |
| TheDJCares | `~/TheDJCares/thedjcares` | `app/lib/djCaresLibrary.ts` (playlists/videos), `app/lib/faithYouTube.ts` (faith themes) | push (auto) |
| DontCloneMeTom | `~/DontCloneMeTom/dont-clone-me-tom` | `app/page.tsx` | push (auto) |
| iDontCry | `~/idontcry` | `src/app/welcome/page.tsx` | push (auto) |
| StepInTheRing | `~/StepInTheRing/step-in-the-ring` | `app/page.tsx` (steps/examples) | push (auto) |
| WatchedNotWatched | `~/WatchedNotWatched/watched-not-watched` | `src/app/page.tsx` | push (auto) |
| WhatAmIAI | `~/WhatAmIAI/whatamiai` | `app/page.tsx` | push (auto) |
| PleaseBeReady | `~/PleaseBeReady/pleasebeready` | `app/page.tsx` | push (auto) |
| Fambookagram | `~/Fambookagram/fambookagram` | `app/page.tsx` | push (auto) |
| Friendbookagram | `~/Friendbookagram/friendbookagram` | `app/page.tsx` | push (auto) |

## The family colors (use these everywhere — cool, no red/yellow/orange)
```
Background   #0b1220      Panels/cards  #141d2e      Raised/active  #1c2740
Borders      #26324c      Text          #e8edf5      Muted text     #94a3b8
```
Per-site accent (one cool pop each): CHP `#4ADE80` · DJCares `#A78BFA` · DontCloneMeTom `#2DD4BF` · iDontCry `#38BDF8` · StepInTheRing `#60A5FA` · WatchedNotWatched `#22D3EE` · PleaseBeReady `#34D399` · WhatAmIAI `#A78BFA` · Fambook `#C084FC` · Friendbook `#818CF8`.

**To recolor a whole site fast** (it uses `:root` CSS variables like StepInTheRing, or inline hex): find/replace the old hex → the family hex, then `npm run build`.

## The cross-site menu (one list, same everywhere)
The canonical nav/footer/theme files live in **this repo → `packages/openmirror-ui/`**. Edit there, then run `./scripts/sync-ui.sh` to copy them into every satellite, then build + commit + push each satellite. Never edit a site's local copy. (Pattern details: `docs/OPEN_MIRROR_PATTERNS.md`.)

## Add a playlist / video to TheDJCares (one line)
`app/lib/djCaresLibrary.ts` → drop one line into the right group:
- Apple: `applePl("id","Title","Author","playlist-slug/pl.XXXX","Tag","blurb", true)`
- Spotify: `spot("id","Title","Author","playlist/XXXX","Tag","blurb")`
- YouTube: `v("id","Title","Author","YT_VIDEO_ID","Category","Tag","blurb")` — **verify the id is live first**:
  `curl -s -o /dev/null -w "%{http_code}" "https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DID&format=json"` (200 = good).

## If something breaks — roll back (safe)
```bash
git log --oneline -5          # find the last good commit
git revert --no-edit <bad-commit-sha>   # undo it as a new commit (safest)
git push && vercel --prod --yes
```
Or jump the whole repo back: `git reset --hard <good-sha> && git push --force-with-lease && vercel --prod`.

## Owner-only (never hand to a collaborator)
GoDaddy/DNS · Vercel billing & env secrets · GitHub permissions. See `07-collaboration-playbook.md`.

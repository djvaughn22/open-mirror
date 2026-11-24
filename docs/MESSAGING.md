# Messaging rules for every Open Mirror site

Owner direction, 2026-11-24. Read this before writing or changing any public
copy in any Open Mirror repo. Where older notes disagree, this wins.

## What each thing is

Open Mirror is an independent studio that turns ideas into useful websites and
apps. The things it makes stand on their own.

| Site | Its own purpose (direction, not hero copy) |
|---|---|
| openmirrorllc.com | The studio: who makes these sites, and the list of them |
| PleaseBeReady | Preparedness, emergency planning, supplies and shopping |
| WhatAmIAI | Family history, ancestry and personal discovery |
| Step In The Ring | Helping people turn ideas into websites and real businesses |
| iDontCry | Sports, games and family entertainment |
| TheDJCares | Encouragement, faith and giving |
| WatchedNotWatched | Finding and tracking movies, shows and books |
| OpenDoku | Sudoku and puzzles |
| DontCloneMeTom | Adoptable dogs near you, rescue first |
| CrossHeartPray | Protected. Never edited without the owner's explicit OK |

## Rules

1. **Say what it is.** A home page answers, in the fewest words: what is this,
   what can I do here, how do I start. If a page already does that, leave it.
2. **Preparedness stays on PleaseBeReady.** "Be ready", "getting ready",
   readiness, emergency planning and PleaseBeReady itself never appear in
   Open Mirror's identity lines or as a plug on another site.
3. **No cross-promotion on product pages.** No "sister site" lines, no Open
   Mirror family bands, no "part of the Open Mirror family" sections. The
   shared footer (Open Mirror LLC · About · ✝️ ❤️ 🙏) is the family tie. The
   hub directory is the one place that lists every site.
4. **Real handoffs stay.** A feature that hands work to another site, like
   iDontCry's Dream Lab or Dream a game opening Step In The Ring, keeps its
   link, described once, where the feature is.
5. **About pages explain the one product:** what it is, what you can do, your
   data, contact, disclaimer. One attribution line: "X is an Open Mirror LLC
   project." The company's story lives only on the hub's About.
6. **Metadata describes the product.** Titles, search descriptions, share
   text and share images say what the site is, not who owns it.
7. **No new umbrella story.** Don't replace the old narrative with another
   portfolio-wide one, a slogan, or an internal analogy. Each site sounds like
   itself, not like one marketing department.
8. **Legal and affiliate text stays as written.** Disclaimers, the employer
   line and the Amazon Associates notice are not messaging edits.
9. **Less is more.** Removing a line is usually better than replacing it.

## Pre-ship check

On any site other than PleaseBeReady, this should find nothing in page copy
(legal text and code comments aside):

```bash
grep -rniE "be ready|getting ready|readiness|preparedness|pleasebeready|sister site|open mirror family" app src --include=*.tsx --include=*.ts --include=*.html
```

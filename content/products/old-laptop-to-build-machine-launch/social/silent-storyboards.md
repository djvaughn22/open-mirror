# Silent 9:16 video storyboards — Old Laptop to Build Machine

Internal. Five reusable templates for Reels / YouTube Shorts / TikTok.

**Nobody appears on camera and nobody speaks.** Every video is screen
recordings, laptop footage, and short text overlays. Music is chosen later by
the owner — the text must carry the whole thing with the sound off (most
viewers watch muted anyway).

## Shared rules

- **Format:** 1080×1920, 9:16. Text lives in the middle ~70% (top and bottom
  get covered by platform UI).
- **Text style:** the guide's system — deep blue `#123049` on warm white for
  full-frame cards; white text with a soft dark scrim over footage. One idea
  per card, ≤ 8 words. Never more than two lines at once.
- **Pace:** a text card holds for ~1.5–2s; a screen action holds long enough
  to read the result. Cut on completion, not mid-action.
- **Honesty:** real screen recordings only. Leave in a small hesitation or an
  error being read — it builds trust. Never fake a result, a view count, or a
  testimonial. Never promise income or a job.
- **Ready-made frames:** the stills in `../launch-assets/vertical/` can be
  dropped in as opening or closing cards.
- **CTA rotation** (never the same one twice in a row):
  - **A) Free check** — "Free readiness check — link in bio"
  - **B) Full playbook** — "Full playbook at Open Mirror — link in bio"
    *(only once it's actually for sale; until then use A or C)*
  - **C) Explore free** — "Everything Open Mirror builds is free to explore —
    openmirrorllc.com"

---

## 1. "Can this old laptop still build something?"
**Length ~20s · CTA: A**

| # | Shot | Duration | On-screen text |
|---|---|---|---|
| 1 | Closed laptop on a desk, hand opens the lid | 2.0s | `This laptop has been in a drawer for 3 years.` |
| 2 | Old system booting — slow spinner, real time | 2.5s | `Still boots. Barely.` |
| 3 | Full-frame card | 1.5s | `Can it still build something?` |
| 4 | Card, items appearing one by one | 4.0s | `Powers on ✓` / `2 GB RAM ✓` / `20 GB free ✓` / `A USB stick ✓` |
| 5 | Full-frame card | 2.0s | `That's the whole bar.` |
| 6 | Screen recording: the readiness worksheet PDF scrolling | 3.0s | `There's a free 5-minute check.` |
| 7 | Closing card (use `vertical/01-cover`) | 3.0s | `Old Laptop to Build Machine` / **CTA A** |

**Screen capture needed:** old OS boot; `readiness-check.pdf` scrolling.

---

## 2. "Back it up before touching anything"
**Length ~22s · CTA: A**

| # | Shot | Duration | On-screen text |
|---|---|---|---|
| 1 | Full-frame warning card (use `vertical/09-safety-backup`) | 2.5s | `Installing Linux erases the laptop.` |
| 2 | Card | 1.5s | `Do this first.` |
| 3 | Screen recording: dragging a folder onto an external drive icon | 3.5s | `1. Copy what you'd miss` |
| 4 | Screen recording: a cloud-drive upload finishing | 3.0s | `2. Or upload it` |
| 5 | Hand writing on paper / notes app | 2.5s | `3. Write down the Wi-Fi password` |
| 6 | Screen recording: opening the backup folder, files visibly there | 3.5s | `4. Open it and check it's really there` |
| 7 | Card | 2.0s | `This step is the one people regret skipping.` |
| 8 | Closing card | 3.0s | **CTA A** |

**Screen capture needed:** file copy to external drive; cloud upload; opening the backup folder.

---

## 3. "Old laptop → Linux machine"
**Length ~28s · CTA: C**

| # | Shot | Duration | On-screen text |
|---|---|---|---|
| 1 | The dusty laptop, lid opening | 2.0s | `Same laptop. Watch.` |
| 2 | Screen recording: balenaEtcher writing the USB | 3.0s | `One USB stick.` |
| 3 | Laptop screen: boot menu, selecting the USB | 3.0s | `Boot from it.` |
| 4 | Installer: the "Erase disk and install" choice highlighted | 3.0s | `You choose this step. Nothing is automatic.` |
| 5 | Time-lapse: install progress bar | 3.5s | `~20 minutes.` |
| 6 | Laptop restarting into the Linux desktop | 3.0s | `Same laptop.` |
| 7 | Desktop, snappy — open a menu, move a window | 3.0s | `New life.` |
| 8 | Split: old boot time vs new boot time (real numbers you measured) | 3.5s | `Faster than it's been in years.` |
| 9 | Closing card | 3.0s | **CTA C** |

**Screen capture needed:** balenaEtcher write; boot menu; installer disk step; install progress; first Linux desktop. *(Show the real timings you actually measured — don't invent them.)*

---

## 4. "First terminal command → first website"
**Length ~30s · CTA: B (or C until release)**

| # | Shot | Duration | On-screen text |
|---|---|---|---|
| 1 | Full-frame card | 1.5s | `The terminal isn't scary.` |
| 2 | Screen recording: typing `sudo apt update`, output scrolling | 3.5s | `It just means: check for updates.` |
| 3 | Screen recording: setup script printing its plan, typing `yes` | 3.5s | `It asks before it changes anything.` |
| 4 | Screen recording: `verify-setup.sh` — tools ticking green | 3.0s | `Git. Editor. Python. Node.` |
| 5 | Screen recording: VS Code — typing an `<h1>` into `index.html` | 3.5s | `Write one line.` |
| 6 | Screen recording: browser refresh — the heading appears | 2.5s | `It's real.` |
| 7 | Screen recording: `git add . / commit / push` | 3.5s | `Save it. Send it.` |
| 8 | Screen recording: the live `github.io` URL opening | 3.0s | `Now it's on the internet.` |
| 9 | Closing card (use `vertical/08-build-log-website`) | 3.0s | **CTA B/C** |

**Screen capture needed:** `sudo apt update`; setup script confirm prompt; verify script; VS Code edit; browser refresh; git push; live URL load.

---

## 5. "The final live website"
**Length ~18s · CTA: A**

| # | Shot | Duration | On-screen text |
|---|---|---|---|
| 1 | Phone in hand, loading the `github.io` URL | 3.0s | `This is on my phone.` |
| 2 | Phone: the Build Log, adding an entry | 3.0s | `It works.` |
| 3 | Pan to the old laptop beside it, lid open | 2.5s | `Built on that.` |
| 4 | Card | 2.0s | `A laptop that was in a drawer.` |
| 5 | Screen recording: editing a line, `git push` | 3.0s | `Change it → push → it's live.` |
| 6 | Closing card (use `vertical/03-finish-with`) | 3.5s | `Linux · dev tools · GitHub · a live site` / **CTA A** |

**Screen capture needed:** phone loading the live URL; phone interaction; laptop beside phone; edit + push.

---

## Reusable closing card

Any video can end on: `vertical/01-cover.png` (2.5s) with the rotating CTA
line laid over the lower third. Keeping one consistent closing frame makes the
account read as one brand.

## What NOT to do

- No talking head, no voiceover — these are built to work silently.
- No countdown timers, "link expires," or scarcity language.
- No fabricated engagement, follower counts, or customer results.
- No claim that any of this earns money on Instagram or YouTube.

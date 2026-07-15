# Launch assets — Old Laptop to Build Machine

Internal only. Real, ready-to-upload image files for the Etsy listing and
social posts. **Never part of the customer ZIP.**

Everything here is built from **original Open Mirror graphics** (CSS device
frames, diagrams, type) and **real product materials** (screenshots of the
actual guide, worksheet, and first project). No stock photography, no laptop
brands or logos, no fabricated reviews, results, or sales numbers.

## Folders

| Folder | What's in it | Size |
|---|---|---|
| `etsy/` | The ten listing images, in order | 2000×2000 PNG |
| `instagram/` | Same ten, square for IG feed | 1080×1080 PNG |
| `vertical/` | The five that work vertically, for Reels / Shorts | 1080×1920 PNG |
| `_captures/` | Raw screenshots of real product materials, used as source | various |
| `_html/` | Generated HTML for each composition (build artifact) | — |

## The ten images (upload to Etsy in this order)

1. `01-cover` — main product cover. **This is the thumbnail — it must win the grid.**
2. `02-transformation` — old laptop → build machine (dead screen vs. the real Build Log running)
3. `03-finish-with` — what the customer finishes with
4. `04-included` — what's included
5. `05-worksheet-preview` — the real printable readiness worksheet
6. `06-guide-interior` — a real guide page showing command blocks + "What this does"
7. `07-terminal-git-reference` — terminal and Git reference
8. `08-build-log-website` — the first Build Log site in a browser frame
9. `09-safety-backup` — the backup warning
10. `10-download-requirements` — how the download works + requirements

Thumbnail hierarchy: 1 leads; 2, 3, 8 are the strongest supporting sells
(transformation, payoff, the real finished site); 4–7 and 10 answer
objections; 9 sets expectations honestly.

## Regenerating

```bash
python3 scripts/build-launch-images.py
```

Renders every composition with headless Chrome at all sizes. Requires the
`_captures/` screenshots to exist. To refresh those from the current product
materials:

```bash
BUNDLE=content/products/old-laptop-to-build-machine
CAP=content/products/old-laptop-to-build-machine-launch/launch-assets/_captures
python3 scripts/html-to-image.py "$CAP/buildlog-demo.html" "$CAP/buildlog.png" 820 700 2
python3 scripts/html-to-image.py "$BUNDLE/printables/laptop-readiness-worksheet.html" "$CAP/worksheet.png" 760 1000 2
python3 scripts/html-to-image.py "$CAP/guide-off7000.html" "$CAP/guide.png" 860 1080 2
```

Notes on the two helper files in `_captures/`:

- `buildlog-demo.html` — the real first project's markup and CSS with example
  entries filled in, so the marketing shot shows the app in use rather than an
  empty state. The entries describe the real journey; they are not customer
  testimonials.
- `guide-off7000.html` — the real guide HTML, shifted up so the Chapter 5
  command blocks are in frame. Same file, same styling, just scrolled.

Compositions are laid out in `scripts/build-launch-images.py`. Root font size
is `vmin`-based, so one composition renders identically at every output size.

## Rules

- No price, no fake purchase button, no "bestseller"/rating/review claims.
- No guaranteed results, income, or job outcomes.
- The URL shown in image 8 is the honest placeholder
  `your-username.github.io/build-log`, not a real person's site.
- Keep the design system consistent with the guide (deep blue `#123049`,
  teal `#0b6a80`, warm white).

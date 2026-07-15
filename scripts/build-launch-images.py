#!/usr/bin/env python3
"""Generate the Etsy/social launch images for "Old Laptop to Build Machine".

Everything is drawn from original Open Mirror graphics (CSS device frames,
diagrams) and real product materials (screenshots of the actual guide,
worksheet, and first project captured into _captures/). No stock photography,
no brand logos, no fabricated reviews/results/sales numbers.

Renders each composition with headless Chrome via html-to-image.py:
  - square   1000x1000 @2x -> 2000x2000  (Etsy primary; also fine for IG)
  - ig       540x540   @2x -> 1080x1080  (Instagram square)
  - vertical 540x960   @2x -> 1080x1920  (Reels / YouTube Shorts)

Usage:  python3 scripts/build-launch-images.py
"""
import os
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "content/products/old-laptop-to-build-machine-launch/launch-assets"
CAP = OUT / "_captures"
TMP = OUT / "_html"

CAPTURES = {
    "buildlog": CAP / "buildlog.png",
    "worksheet": CAP / "worksheet.png",
    "guide": CAP / "guide.png",
}

CSS = """
:root{
  --ink:#1b2a38; --head:#123049; --accent:#0b6a80; --muted:#5a6b7a;
  --rule:#d3dce4; --paper:#fdfdfb;
  --warn-ink:#8f2f16; --warn-bg:#fbeee9; --warn-edge:#e0a48f;
  --ok-ink:#0a5e46; --ok-bg:#eaf5ef; --ok-edge:#a6d3bf;
  --deep:#0f2233;
}
*{box-sizing:border-box;margin:0;padding:0}
/* Root size is viewport-relative so one composition renders identically at any
   output size (2000x2000 Etsy, 1080x1080 IG, 1080x1920 vertical). vmin ties
   the scale to the frame's short edge, which is what the eye reads. */
html{font-size:2.9vmin}
body{
  width:100vw;height:100vh;overflow:hidden;
  font-family:"DejaVu Sans","Segoe UI",Helvetica,Arial,sans-serif;
  color:var(--ink);
  background:
    radial-gradient(120% 80% at 50% -20%, #ffffff 0%, var(--paper) 55%, #f2f5f8 100%);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:3.2rem;text-align:center;gap:1.1rem;
}
body.v{padding:2.6rem 2rem}
body.dark{background:linear-gradient(160deg,#122c42 0%,#0b1a27 100%);color:#eaf1f7}
.serif{font-family:"DejaVu Serif",Georgia,serif}
.eyebrow{font-size:.8rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--accent)}
.dark .eyebrow{color:#7fd3e6}
h1{font-size:3.1rem;line-height:1.05;color:var(--head);letter-spacing:-.02em;max-width:14em}
.dark h1{color:#fff}
h2{font-size:2.1rem;line-height:1.1;color:var(--head);letter-spacing:-.01em}
.dark h2{color:#fff}
.promise{font-size:1.15rem;line-height:1.45;color:var(--muted);max-width:24em}
.dark .promise{color:#b9cbd8}
.cap{font-size:.95rem;color:var(--muted);max-width:26em;line-height:1.4}
.brand{position:absolute;bottom:1.6rem;left:0;right:0;font-size:.72rem;
  letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:700}
.dark .brand{color:#8fa9bd}

/* flow — sized so all five nodes stay on one line (a wrapped flow leaves a
   dangling arrow, which reads as a mistake) */
.flow{display:flex;align-items:center;justify-content:center;gap:.3rem;flex-wrap:nowrap;max-width:100%}
.node{border:1.5px solid var(--rule);border-radius:.45rem;padding:.4rem .45rem;
  font-size:.56rem;font-weight:800;color:var(--head);background:#fff;white-space:nowrap}
.dark .node{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.25);color:#fff}
.arr{color:var(--accent);font-weight:900;font-size:.7rem}
.dark .arr{color:#7fd3e6}

/* ribbon */
.ribbon{display:inline-block;background:var(--accent);color:#fff;border-radius:2rem;
  padding:.5rem 1.1rem;font-size:.8rem;font-weight:800;letter-spacing:.05em}

/* check list */
.checks{display:flex;flex-direction:column;gap:.7rem;width:100%;max-width:22em;text-align:left}
.check{display:flex;align-items:center;gap:.7rem;background:#fff;border:1.5px solid var(--rule);
  border-radius:.7rem;padding:.75rem .9rem;font-size:1rem;font-weight:700;color:var(--head)}
.tick{flex:none;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--ok-ink);color:#fff;
  display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:900}

/* tiles */
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;width:100%;max-width:30em}
body.v .tiles{grid-template-columns:1fr}
.tile{background:#fff;border:1.5px solid var(--rule);border-radius:.7rem;padding:.7rem .8rem;
  font-size:.82rem;font-weight:700;color:var(--head);text-align:left;line-height:1.3}

/* device frames (original CSS art — no stock photos, no brands) */
.laptop{width:100%;max-width:26em}
.laptop .screen{border:.55rem solid #2b3d4d;border-radius:.8rem;background:#0b1a27;
  overflow:hidden;aspect-ratio:16/10;display:flex;align-items:center;justify-content:center}
.laptop .base{height:.55rem;background:#2b3d4d;border-radius:0 0 .7rem .7rem;margin:0 auto;width:112%;
  max-width:none;transform:translateX(-5.4%)}
.laptop .screen img{width:100%;height:100%;object-fit:cover;object-position:top center}
.dead{color:#4a6274;font-size:.9rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}

.browser{width:100%;max-width:30em;border-radius:.7rem;overflow:hidden;border:1.5px solid var(--rule);
  background:#fff;box-shadow:0 1.2rem 2.6rem -1.2rem rgba(9,25,40,.45)}
.bar{display:flex;align-items:center;gap:.4rem;background:#e9eef3;padding:.5rem .6rem;border-bottom:1px solid var(--rule)}
.dot{width:.6rem;height:.6rem;border-radius:50%;background:#c6d2dc}
.url{flex:1;background:#fff;border:1px solid var(--rule);border-radius:1rem;font-size:.62rem;
  color:var(--muted);padding:.22rem .6rem;text-align:left;font-weight:700;overflow:hidden;white-space:nowrap}
.browser img{width:100%;display:block}

.paper{width:100%;max-width:20em;border:1px solid var(--rule);border-radius:.35rem;overflow:hidden;
  background:#fff;box-shadow:0 1.2rem 2.6rem -1.2rem rgba(9,25,40,.4)}
.paper img{width:100%;display:block}
.papers{display:flex;gap:1rem;align-items:flex-start;justify-content:center;width:100%}

.term{width:100%;max-width:28em;border-radius:.6rem;overflow:hidden;background:#0d1f2d;
  border:1px solid #22384a;box-shadow:0 1.2rem 2.6rem -1.2rem rgba(0,0,0,.6);text-align:left}
.term .bar{background:#16293a;border-bottom:1px solid #22384a}
.term .dot{background:#3c5568}
.term pre{padding:.9rem 1rem;color:#d7e6f2;font-family:"DejaVu Sans Mono",Consolas,monospace;
  font-size:.72rem;line-height:1.7;white-space:pre-wrap}
.term .p{color:#6fd3a8}
.term .c{color:#8fb6d1}

.card{background:#fff;border:1.5px solid var(--rule);border-radius:.7rem;padding:.9rem 1rem;
  text-align:left;width:100%;max-width:28em}
.card h3{font-size:.85rem;color:var(--accent);letter-spacing:.1em;text-transform:uppercase;margin-bottom:.45rem}
.card .row{display:flex;justify-content:space-between;gap:1rem;font-size:.78rem;padding:.22rem 0;
  border-bottom:1px dotted var(--rule);color:var(--head);font-weight:700}
.card .row span:last-child{color:var(--muted);font-weight:600}

/* warn */
.warnbox{background:var(--warn-bg);border:2px solid var(--warn-edge);border-radius:.9rem;
  padding:1.4rem 1.5rem;max-width:26em;color:var(--warn-ink)}
.warnbox .big{font-size:1.35rem;font-weight:900;line-height:1.25;margin-bottom:.5rem}
.warnbox p{font-size:.95rem;line-height:1.45}
.shield{font-size:2.4rem;margin-bottom:.4rem}

/* steps */
.steps{display:flex;flex-direction:column;gap:.6rem;width:100%;max-width:24em;text-align:left}
.step{display:flex;align-items:center;gap:.8rem;background:#fff;border:1.5px solid var(--rule);
  border-radius:.7rem;padding:.7rem .9rem}
.num{flex:none;width:1.7rem;height:1.7rem;border-radius:50%;background:var(--accent);color:#fff;
  display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:900}
.step div{font-size:.9rem;font-weight:700;color:var(--head)}
.chips{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center;max-width:26em}
.chip{border:1.5px solid var(--rule);background:#fff;border-radius:2rem;padding:.35rem .7rem;
  font-size:.72rem;font-weight:800;color:var(--muted)}
.pill{display:inline-block;border:2px solid var(--ok-edge);background:var(--ok-bg);color:var(--ok-ink);
  border-radius:2rem;padding:.4rem 1rem;font-size:.8rem;font-weight:900}
"""


def page(body: str, dark: bool = False, vertical: bool = False) -> str:
    cls = " ".join(c for c in [("dark" if dark else ""), ("v" if vertical else "")] if c)
    return (
        '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
        f"<style>{CSS}</style></head><body class=\"{cls}\">{body}"
        "</body></html>"
    )


def img(key: str) -> str:
    return CAPTURES[key].as_uri()


BRAND = '<div class="brand">openmirrorllc.com</div>'


def flow(dark=False):
    nodes = ["Old laptop", "Linux", "Dev tools", "First site", "Live online"]
    inner = '<span class="arr">&#8594;</span>'.join(f'<span class="node">{n}</span>' for n in nodes)
    return f'<div class="flow">{inner}</div>'


# ── the ten compositions ────────────────────────────────────────────────────
def i01_cover(v=False):
    return page(
        f"""
        <div class="eyebrow">An Open Mirror Playbook</div>
        <h1 class="serif">Old Laptop to Build Machine</h1>
        <p class="promise">Turn an unused laptop into a simple Linux development
        machine — and publish your first website.</p>
        {flow()}
        <div class="ribbon">Instant digital download</div>
        {BRAND}""",
        vertical=v,
    )


def i02_transform(v=False):
    arrow = "&#8595;" if v else "&#8594;"
    layout = "column" if v else "row"
    return page(
        f"""
        <div class="eyebrow">The transformation</div>
        <h2 class="serif">Old laptop &rarr; build machine</h2>
        <div style="display:flex;flex-direction:{layout};align-items:center;gap:1.2rem;width:100%;justify-content:center">
          <div class="laptop" style="max-width:{'18em' if v else '15em'}">
            <div class="screen"><span class="dead">Unused</span></div><div class="base"></div>
          </div>
          <span class="arr" style="font-size:2rem">{arrow}</span>
          <div class="laptop" style="max-width:{'18em' if v else '15em'}">
            <div class="screen"><img src="{img('buildlog')}" alt=""></div><div class="base"></div>
          </div>
        </div>
        <p class="cap">Same laptop. Linux, real developer tools, and your own
        website — live on the internet.</p>
        {BRAND}""",
        vertical=v,
    )


def i03_finish(v=False):
    items = [
        "Linux installed",
        "Development tools working",
        "GitHub connected",
        "First website built",
        "First website live",
    ]
    checks = "".join(
        f'<div class="check"><span class="tick">&#10003;</span>{t}</div>' for t in items
    )
    return page(
        f"""
        <div class="eyebrow">What you finish with</div>
        <h2 class="serif">You end up here</h2>
        <div class="checks">{checks}</div>
        {BRAND}""",
        vertical=v,
    )


def i04_included(v=False):
    items = [
        "Illustrated guide — PDF, HTML &amp; Markdown",
        "Printable readiness worksheet",
        "Printable master checklist",
        "Terminal reference card",
        "Git &amp; GitHub reference card",
        "Troubleshooting &amp; recovery guide",
        "Safe setup script + check script",
        "Finished first-project files",
    ]
    tiles = "".join(f'<div class="tile">{t}</div>' for t in items)
    return page(
        f"""
        <div class="eyebrow">What&rsquo;s inside</div>
        <h2 class="serif">Everything you get</h2>
        <div class="tiles">{tiles}</div>
        <p class="cap">Instant download. Opens on Windows, Mac, Linux, phones
        and tablets.</p>
        {BRAND}""",
        vertical=v,
    )


def i05_worksheet(v=False):
    return page(
        f"""
        <div class="eyebrow">Printable</div>
        <h2 class="serif">Laptop readiness worksheet</h2>
        <div class="paper" style="max-width:{'17em' if v else '16em'}">
          <img src="{img('worksheet')}" alt="">
        </div>
        <p class="cap">Work out whether your laptop is up to it — before you
        touch anything.</p>
        {BRAND}""",
        vertical=v,
    )


def i06_guide(v=False):
    return page(
        f"""
        <div class="eyebrow">Inside the guide</div>
        <h2 class="serif">Every command explained</h2>
        <div class="paper" style="max-width:{'18em' if v else '17em'}">
          <img src="{img('guide')}" alt="">
        </div>
        <p class="cap">A real, page-numbered guide — plain language, numbered
        chapters, checkpoints as you go.</p>
        {BRAND}""",
        vertical=v,
    )


def i07_reference(v=False):
    return page(
        f"""
        <div class="eyebrow">Reference cards</div>
        <h2 class="serif">Terminal &amp; Git, demystified</h2>
        <div class="term">
          <div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
          <pre><span class="p">$</span> sudo apt update        <span class="c"># refresh software list</span>
<span class="p">$</span> git status              <span class="c"># see what changed</span>
<span class="p">$</span> git add .               <span class="c"># stage your changes</span>
<span class="p">$</span> git commit -m "First"   <span class="c"># save a snapshot</span>
<span class="p">$</span> git push                <span class="c"># send it to GitHub</span></pre>
        </div>
        <div class="card">
          <h3>Words, plainly</h3>
          <div class="row"><span>Repository</span><span>a folder Git is tracking</span></div>
          <div class="row"><span>Commit</span><span>a saved snapshot</span></div>
          <div class="row"><span>Push</span><span>send commits to GitHub</span></div>
        </div>
        {BRAND}""",
        vertical=v,
    )


def i08_buildlog(v=False):
    return page(
        f"""
        <div class="eyebrow">Your first website</div>
        <h2 class="serif">You build this — and ship it</h2>
        <div class="browser" style="max-width:{'19em' if v else '28em'}">
          <div class="bar">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="url">your-username.github.io/build-log</span>
          </div>
          <img src="{img('buildlog')}" alt="">
        </div>
        <p class="cap">A small, real site — built by hand, then live at an
        address you can share.</p>
        {BRAND}""",
        vertical=v,
    )


def i09_safety(v=False):
    return page(
        f"""
        <div class="eyebrow">Read this first</div>
        <div class="warnbox">
          <div class="shield">&#9888;</div>
          <div class="big">Installing Linux erases the laptop.</div>
          <p>Back up anything you want to keep first — the guide shows exactly
          how. Nothing erases a drive automatically; the one destructive step is
          yours to choose.</p>
        </div>
        <p class="cap">Use a laptop you&rsquo;re willing to wipe.</p>
        {BRAND}""",
        vertical=v,
    )


def i10_download(v=False):
    reqs = ["2 GB RAM", "20 GB storage", "USB stick (8 GB+)", "Internet", "~2–4 hours", "Linux Mint 22"]
    chips = "".join(f'<span class="chip">{r}</span>' for r in reqs)
    return page(
        f"""
        <div class="eyebrow">How it works</div>
        <h2 class="serif">Instant digital download</h2>
        <div class="steps">
          <div class="step"><span class="num">1</span><div>Buy &rarr; download right away</div></div>
          <div class="step"><span class="num">2</span><div>Unzip the bundle</div></div>
          <div class="step"><span class="num">3</span><div>Open START-HERE and begin</div></div>
        </div>
        <div class="eyebrow" style="margin-top:.4rem">What you need</div>
        <div class="chips">{chips}</div>
        <span class="pill">No subscription &middot; every tool is free</span>
        {BRAND}""",
        vertical=v,
    )


IMAGES = [
    ("01-cover", i01_cover, True),
    ("02-transformation", i02_transform, True),
    ("03-finish-with", i03_finish, True),
    ("04-included", i04_included, False),
    ("05-worksheet-preview", i05_worksheet, False),
    ("06-guide-interior", i06_guide, False),
    ("07-terminal-git-reference", i07_reference, False),
    ("08-build-log-website", i08_buildlog, True),
    ("09-safety-backup", i09_safety, True),
    ("10-download-requirements", i10_download, False),
]


def render(html_path: pathlib.Path, out_png: pathlib.Path, w: int, h: int, scale: int = 2):
    subprocess.run(
        [sys.executable, str(ROOT / "scripts/html-to-image.py"), str(html_path),
         str(out_png), str(w), str(h), str(scale)],
        check=True, stdout=subprocess.DEVNULL,
    )


def main():
    for missing in [k for k, p in CAPTURES.items() if not p.exists()]:
        sys.exit(f"Missing capture: {missing} — see launch-assets/README.md")
    for d in (OUT / "etsy", OUT / "instagram", OUT / "vertical", TMP):
        d.mkdir(parents=True, exist_ok=True)

    made = []
    for name, fn, do_vertical in IMAGES:
        # Etsy primary + Instagram square (same composition, two sizes)
        sq = TMP / f"{name}-square.html"
        sq.write_text(fn(False))
        render(sq, OUT / "etsy" / f"{name}.png", 1000, 1000, 2)          # 2000x2000
        render(sq, OUT / "instagram" / f"{name}-1080.png", 540, 540, 2)  # 1080x1080
        made.append(f"etsy/{name}.png (2000x2000), instagram/{name}-1080.png (1080x1080)")
        if do_vertical:
            vt = TMP / f"{name}-vertical.html"
            vt.write_text(fn(True))
            render(vt, OUT / "vertical" / f"{name}-1080x1920.png", 540, 960, 2)
            made.append(f"vertical/{name}-1080x1920.png (1080x1920)")

    print("\n".join(made))
    print(f"\n{len(IMAGES)} compositions rendered into {OUT}")


if __name__ == "__main__":
    main()

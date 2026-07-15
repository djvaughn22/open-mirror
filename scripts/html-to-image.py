#!/usr/bin/env python3
"""Render a local HTML file to a PNG using headless Google Chrome.

Designed for producing marketing/launch images at exact pixel sizes. The page
is laid out at `width x height` CSS pixels and captured at `scale`x, so a
1000x1000 design rendered at scale 2 yields a crisp 2000x2000 PNG.

Only the Python standard library is used (this box has no pip).

Usage:
    python3 html-to-image.py input.html output.png WIDTH HEIGHT [SCALE]
"""
import os
import subprocess
import sys
import tempfile


def render(in_html: str, out_png: str, width: int, height: int, scale: int = 2) -> None:
    in_html = os.path.abspath(in_html)
    out_png = os.path.abspath(out_png)
    profile = tempfile.mkdtemp(prefix="chrome-img-")
    cmd = [
        "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
        "--hide-scrollbars", "--default-background-color=00000000",
        f"--user-data-dir={profile}",
        f"--window-size={width},{height}",
        f"--force-device-scale-factor={scale}",
        f"--screenshot={out_png}",
        "file://" + in_html,
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["rm", "-rf", profile], check=False)
    if not os.path.exists(out_png):
        raise RuntimeError(f"Chrome did not produce {out_png}")


def main():
    if len(sys.argv) < 5:
        print(__doc__)
        sys.exit(2)
    in_html, out_png = sys.argv[1], sys.argv[2]
    width, height = int(sys.argv[3]), int(sys.argv[4])
    scale = int(sys.argv[5]) if len(sys.argv) > 5 else 2
    render(in_html, out_png, width, height, scale)
    size = os.path.getsize(out_png)
    print(f"Wrote {out_png} ({width*scale}x{height*scale}, {size} bytes)")


if __name__ == "__main__":
    main()

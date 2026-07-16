#!/usr/bin/env bash
# Rebuilds the paid bundle from content/products/old-laptop-to-build-machine/
# into dist/ — which is git-ignored and NOT served by Next.js.
#
# The bundle must never live under public/: everything in public/ is served
# at a guessable URL, which would give the paid product away for free.
# When checkout and delivery exist, the ZIP gets handed out from there.

set -euo pipefail
cd "$(dirname "$0")/.."

SRC_DIR="content/products/old-laptop-to-build-machine"
OUT="dist/old-laptop-to-build-machine.zip"

if [ ! -d "$SRC_DIR" ]; then
  echo "Source folder not found: $SRC_DIR" >&2
  exit 1
fi

mkdir -p dist
rm -f "$OUT"
(cd content/products && zip -rq "../../$OUT" "$(basename "$SRC_DIR")" -x "*.DS_Store")

echo "Rebuilt $OUT"
unzip -l "$OUT" | tail -n 1

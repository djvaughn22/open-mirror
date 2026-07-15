#!/usr/bin/env bash
# Rebuilds public/downloads/old-laptop-to-build-machine.zip from
# content/products/old-laptop-to-build-machine/. Run this after editing any
# file in that source folder, then commit the regenerated zip.

set -euo pipefail
cd "$(dirname "$0")/.."

SRC_DIR="content/products/old-laptop-to-build-machine"
OUT="public/downloads/old-laptop-to-build-machine.zip"

if [ ! -d "$SRC_DIR" ]; then
  echo "Source folder not found: $SRC_DIR" >&2
  exit 1
fi

rm -f "$OUT"
(cd content/products && zip -rq "../../$OUT" "$(basename "$SRC_DIR")" -x "*.DS_Store")

echo "Rebuilt $OUT"
unzip -l "$OUT" | tail -n 1

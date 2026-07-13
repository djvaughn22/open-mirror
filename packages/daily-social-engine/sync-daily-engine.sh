#!/usr/bin/env bash
# Sync the canonical Daily Social Engine core into each live brand's repo.
# Run from this directory after editing any canonical file, then rebuild,
# test, and commit each satellite.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"

# repo:libdir:componentsdir
TARGETS=(
  "$HOME/OpenMirror/crossheartpray:src/lib:src/components"
  "$HOME/DontCloneMeTom/dont-clone-me-tom:app/lib:app/components"
  "$HOME/TheDJCares/thedjcares:app/lib:app/components"
)

for target in "${TARGETS[@]}"; do
  IFS=":" read -r repo libdir compdir <<<"$target"
  mkdir -p "$repo/$libdir" "$repo/$compdir"
  cp "$HERE/dailySocialCore.ts" "$repo/$libdir/dailySocialCore.ts"
  cp "$HERE/instagramPublisherCore.ts" "$repo/$libdir/instagramPublisherCore.ts"
  cp "$HERE/publishRouteCore.ts" "$repo/$libdir/publishRouteCore.ts"
  cp "$HERE/AdminDailyPanel.tsx" "$repo/$compdir/AdminDailyPanel.tsx"
  echo "synced → $repo"
done

#!/usr/bin/env bash
# Sync canonical Open Mirror UI components into every satellite repo.
# Canonical source: packages/openmirror-ui/ (this hub repo).
#
# Usage:
#   ./scripts/sync-ui.sh          # copy components into all satellites
# Then, per satellite repo: npm run build, commit, push.
#
# Stage A of docs/openmirror-audit/04-reusable-component-plan.md.
set -euo pipefail

HUB="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$HUB/packages/openmirror-ui"

# Components that get synced into every satellite.
FILES=(OpenMirrorNav.tsx OpenMirrorFooter.tsx OpenMirrorTheme.tsx)

# Where each satellite keeps its copy (the dir the site imports it from).
TARGETS=(
  "$HOME/StepInTheRing/step-in-the-ring/app"
  "$HOME/TheDJCares/thedjcares/app"
  "$HOME/DontCloneMeTom/dont-clone-me-tom/app"
  "$HOME/PleaseBeReady/pleasebeready/app"
  "$HOME/Fambookagram/fambookagram/app"
  "$HOME/Friendbookagram/friendbookagram/app"
  "$HOME/WhatAmIAI/whatamiai/app"
  "$HOME/idontcry/src/app"
  "$HOME/WatchedNotWatched/watched-not-watched/src/app"
)
# CrossHeartPray (corrected 2026-07-16, commit 3491570): it keeps its OWN
# single header — no OpenMirrorNav/OpenMirrorFooter. Only the shared theme
# machinery stays in sync there (its ChpProductNav imports OpenMirrorTheme).
CHP_COMPONENTS="$HOME/OpenMirror/crossheartpray/src/components"

for t in "${TARGETS[@]}"; do
  if [ ! -d "$t" ]; then
    echo "SKIP (missing): $t" >&2
    continue
  fi
  for f in "${FILES[@]}"; do
    cp "$SRC/$f" "$t/$f"
  done
  echo "synced -> $t"
done

if [ -d "$CHP_COMPONENTS" ]; then
  cp "$SRC/OpenMirrorTheme.tsx" "$CHP_COMPONENTS/OpenMirrorTheme.tsx"
  echo "synced (theme only) -> $CHP_COMPONENTS"
fi

echo
echo "Done. Now build + commit + push each satellite repo."

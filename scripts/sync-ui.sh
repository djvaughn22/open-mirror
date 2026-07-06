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

# Components that get synced. Add OpenMirrorFooter.tsx once sites adopt it.
FILES=(OpenMirrorNav.tsx)

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
# CrossHeartPray is intentionally absent — it keeps its own SiteHeader
# (see guardrails in 04-reusable-component-plan.md).

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

echo
echo "Done. Now build + commit + push each satellite repo."

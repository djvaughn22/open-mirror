#!/usr/bin/env bash
#
# verify-setup.sh — Old Laptop to Build Machine
#
# Checks which development tools are installed and prints a plain report.
# This script only reads information (version numbers) — it does not
# install, change, or delete anything. Safe to run at any time, as many
# times as you want, before or after setup-dev-machine.sh.

set +e  # keep checking every tool even if one command fails

echo "Old Laptop to Build Machine — setup check"
echo "-------------------------------------------------------"

check() {
  local label="$1"
  local cmd="$2"
  local version_flag="${3:---version}"
  if command -v "$cmd" >/dev/null 2>&1; then
    local version
    version=$("$cmd" "$version_flag" 2>&1 | head -n 1)
    printf "✓ %-16s %s\n" "$label" "$version"
  else
    printf "✗ %-16s not found\n" "$label"
  fi
}

check "Git"        git
check "Python 3"   python3
check "pip"        pip3
check "Node.js"    node
check "npm"        npm
check "GitHub CLI" gh
check "VS Code"    code

echo "-------------------------------------------------------"
if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    echo "✓ GitHub CLI is signed in"
  else
    echo "✗ GitHub CLI is installed but not signed in — run: gh auth login"
  fi
fi

echo
echo "Anything marked ✗ can be installed with ./setup-dev-machine.sh,"
echo "or by hand — see 06-development-machine-setup.md."

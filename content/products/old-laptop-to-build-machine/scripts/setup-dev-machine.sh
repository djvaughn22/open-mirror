#!/usr/bin/env bash
#
# setup-dev-machine.sh — Old Laptop to Build Machine
#
# Installs the development tools described in 06-development-machine-setup.md:
# Git, build-essential, Python 3, Node.js + npm, VS Code, and the GitHub CLI.
#
# Supported on: Ubuntu, Linux Mint, Pop!_OS, and other Debian/Ubuntu-family
# Linux distributions (anything with `apt`). It will refuse to run anywhere
# else rather than guess.
#
# What this script will NOT do:
#   - It will not touch disk partitions, filesystems, or any file outside
#     the software it installs via apt/snap.
#   - It will not delete or overwrite any existing file.
#   - It will not download and execute an unreviewed remote script. The one
#     step that uses curl (the GitHub CLI key) only downloads a public GPG
#     signing key file — it does not pipe anything into a shell.
#   - It asks for your sudo password once, the normal way apt/snap do —
#     it does not store or transmit it anywhere.
#
# Safe to stop: press Ctrl+C at any point. Safe to re-run: every step below
# checks whether its tool is already installed before installing it, so
# running this script twice does not reinstall or duplicate anything.

set -euo pipefail

echo "Old Laptop to Build Machine — development tools setup"
echo "-------------------------------------------------------"

# --- Confirm this is a supported distribution -------------------------------
if ! command -v apt >/dev/null 2>&1; then
  echo "This script only supports Debian/Ubuntu-family Linux (needs 'apt')."
  echo "See 06-development-machine-setup.md to install these tools by hand"
  echo "using your distribution's own package manager instead."
  exit 1
fi

# --- Helper: install an apt package only if its command isn't already there -
install_apt_if_missing() {
  local check_cmd="$1"
  local package="$2"
  if command -v "$check_cmd" >/dev/null 2>&1; then
    echo "✓ $package already installed (found '$check_cmd')"
  else
    echo "→ Installing $package ..."
    sudo apt install -y "$package"
  fi
}

echo
echo "Step 1/6 — Refreshing the package list (sudo apt update)"
sudo apt update

echo
echo "Step 2/6 — Git, build tools, Python, curl"
install_apt_if_missing git git
install_apt_if_missing gcc build-essential
install_apt_if_missing python3 python3
install_apt_if_missing pip3 python3-pip
install_apt_if_missing curl curl
# python3-venv has no standalone command; check the module instead.
if python3 -c "import venv" >/dev/null 2>&1; then
  echo "✓ python3-venv already available"
else
  echo "→ Installing python3-venv ..."
  sudo apt install -y python3-venv
fi

echo
echo "Step 3/6 — Node.js and npm"
install_apt_if_missing node nodejs
install_apt_if_missing npm npm

echo
echo "Step 4/6 — VS Code (via Snap, Ubuntu/Mint's app package system)"
if command -v code >/dev/null 2>&1; then
  echo "✓ VS Code already installed"
elif command -v snap >/dev/null 2>&1; then
  echo "→ Installing VS Code ..."
  sudo snap install code --classic
else
  echo "! snap isn't available on this system — install VS Code manually"
  echo "  from the official https://code.visualstudio.com/ download page."
fi

echo
echo "Step 5/6 — GitHub CLI (gh)"
if command -v gh >/dev/null 2>&1; then
  echo "✓ GitHub CLI already installed"
else
  echo "→ Adding GitHub's official package repository ..."
  # Official method from https://cli.github.com/ — downloads GitHub's public
  # signing key (a key file, not a script) and registers their apt repo.
  sudo mkdir -p -m 755 /usr/share/keyrings
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
    | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
  sudo apt update
  sudo apt install -y gh
fi

echo
echo "Step 6/6 — Done"
echo "-------------------------------------------------------"
echo "Run ./verify-setup.sh to confirm everything installed correctly."

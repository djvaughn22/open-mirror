#!/usr/bin/env bash
#
# setup-dev-machine.sh — Old Laptop to Build Machine (Chapter 5)
#
# Installs a focused beginner development toolset on Linux Mint / Ubuntu:
#   Git, build tools, Python 3, VS Code, Node.js 22 LTS (+ npm), GitHub CLI.
#
# It uses current OFFICIAL software sources for each tool, added the safe way
# (download the vendor's signing key, register their apt repository, install
# from it). It does NOT use snap — Linux Mint blocks snapd by default, so the
# VS Code and Node.js instructions here avoid it entirely.
#
# SAFETY, in plain terms:
#   - Refuses to run on anything that isn't a Debian/Ubuntu-family system.
#   - Prints exactly what it will install, then asks you to type "yes".
#   - Checks whether each tool is already installed before installing it, so
#     it's safe to run more than once (idempotent).
#   - Never touches disk partitions, never erases anything, never deletes or
#     overwrites files it didn't create.
#   - Never pipes an unknown internet script into a shell. The only downloads
#     are official signing KEYS (data, not programs).
#   - Writes a log to /tmp so you can see what happened if a step fails.
#   - Press Ctrl+C at any time to stop safely.

set -euo pipefail

LOG="/tmp/old-laptop-setup-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$LOG") 2>&1

say()  { printf '\n\033[1;36m%s\033[0m\n' "$*"; }
info() { printf '  %s\n' "$*"; }
warn() { printf '\033[1;33m%s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m%s\033[0m\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# 1. Refuse unsupported systems rather than guessing.
# ---------------------------------------------------------------------------
[ -r /etc/os-release ] || die "Can't read /etc/os-release — unsupported system."
# shellcheck disable=SC1091
. /etc/os-release
SUPPORTED=0
case " ${ID:-} ${ID_LIKE:-} " in
  *" debian "*|*" ubuntu "*) SUPPORTED=1 ;;
esac
if [ "$SUPPORTED" -ne 1 ]; then
  die "This script supports Debian/Ubuntu-family Linux only (Linux Mint,
Ubuntu, Pop!_OS, ...). Detected: ${PRETTY_NAME:-unknown}.
Install the tools by hand instead — see Chapter 5 of the guide."
fi
command -v apt-get >/dev/null 2>&1 || die "'apt-get' not found — unsupported system."

# ---------------------------------------------------------------------------
# 2. Tell the user exactly what will happen, then ask permission.
# ---------------------------------------------------------------------------
say "Old Laptop to Build Machine — development tools setup"
info "System : ${PRETTY_NAME:-unknown}"
info "Log    : $LOG"
cat <<'PLAN'

This script will install, only if not already present:

  - git, build-essential, python3, python3-pip, python3-venv
  - curl, ca-certificates, gnupg, wget  (used to add trusted sources)
  - Visual Studio Code   (from Microsoft's official apt repository)
  - Node.js 22 LTS + npm (from NodeSource's official apt repository)
  - GitHub CLI (gh)      (from GitHub's official apt repository)

It will run "sudo apt" commands, so you'll be asked for your password.
It will NOT erase anything, change disk partitions, or delete your files.

PLAN
printf 'Type "yes" to continue (anything else cancels): '
read -r REPLY
[ "$REPLY" = "yes" ] || die "Cancelled. Nothing was changed."

# ---------------------------------------------------------------------------
# Helpers.
# ---------------------------------------------------------------------------
have() { command -v "$1" >/dev/null 2>&1; }

apt_install() {
  # apt_install <friendly name> <pkg...>
  local name="$1"; shift
  say "Installing: $name"
  sudo apt-get install -y "$@"
}

say "Refreshing the package list (sudo apt-get update)"
sudo apt-get update

# ---------------------------------------------------------------------------
# 3. Base tools (idempotent: apt itself skips already-installed packages).
# ---------------------------------------------------------------------------
apt_install "Git, build tools, Python, and helpers" \
  git build-essential python3 python3-pip python3-venv \
  curl ca-certificates gnupg wget

# ---------------------------------------------------------------------------
# 4. VS Code — Microsoft's official apt repository (NOT snap).
# ---------------------------------------------------------------------------
if have code; then
  info "VS Code already installed — skipping."
else
  say "Adding Microsoft's VS Code repository and installing VS Code"
  tmpkey="$(mktemp)"
  wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > "$tmpkey"
  sudo install -D -o root -g root -m 644 "$tmpkey" /usr/share/keyrings/microsoft.gpg
  rm -f "$tmpkey"
  echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/code stable main" \
    | sudo tee /etc/apt/sources.list.d/vscode.list > /dev/null
  sudo apt-get update
  apt_install "VS Code" code
fi

# ---------------------------------------------------------------------------
# 5. Node.js 22 LTS — NodeSource's official apt repository.
# ---------------------------------------------------------------------------
if have node; then
  info "Node.js already installed ($(node --version)) — skipping."
else
  say "Adding NodeSource's Node.js 22 repository and installing Node.js"
  sudo mkdir -p /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" \
    | sudo tee /etc/apt/sources.list.d/nodesource.list > /dev/null
  sudo apt-get update
  apt_install "Node.js 22 + npm" nodejs
fi

# ---------------------------------------------------------------------------
# 6. GitHub CLI — GitHub's official apt repository.
# ---------------------------------------------------------------------------
if have gh; then
  info "GitHub CLI already installed — skipping."
else
  say "Adding GitHub's CLI repository and installing gh"
  sudo mkdir -p -m 755 /etc/apt/keyrings
  wget -nv -O- https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null
  sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
    | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
  sudo apt-get update
  apt_install "GitHub CLI" gh
fi

# ---------------------------------------------------------------------------
# 7. Done. Point at the verify script.
# ---------------------------------------------------------------------------
say "Done."
info "Log saved to: $LOG"
info "Run ./verify-setup.sh to confirm everything installed correctly."

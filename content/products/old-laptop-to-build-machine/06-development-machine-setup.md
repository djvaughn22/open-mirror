# Development Machine Setup

This installs the tools you'll actually build with. Every tool here is free.
You can install them by hand (below), or run
`scripts/setup-dev-machine.sh`, which does the same steps automatically.
Either way, read this first so you know what's happening on your machine.

## Open a terminal

The terminal is a text-based way to talk to your computer. On Linux Mint,
click the terminal icon in the taskbar, or press `Ctrl+Alt+T`. You'll see a
blinking cursor waiting for a command. `07-terminal-command-reference.md`
explains how to read and type commands if this is new to you.

## What you're about to install, and why

| Tool | What it's for |
|---|---|
| **Git** | Tracks changes to your code over time, so you never lose work and can undo mistakes. Required for GitHub. |
| **A code editor** (VS Code) | Where you'll write and read code. Far more capable than a plain text editor — syntax highlighting, built-in terminal, extensions. |
| **Python** | A beginner-friendly programming language, useful for scripts, automation, and backend work. |
| **Node.js and npm** | Node.js runs JavaScript outside a browser; npm is the tool that installs JavaScript packages and libraries. Most modern web projects need both. |
| **GitHub CLI (`gh`)** | Lets you create and manage GitHub repositories from the terminal, without switching to a browser for every step. |
| **build-essential** | A bundle of underlying tools (compilers, etc.) that other software quietly depends on. You won't use it directly, but plenty of things won't install without it. |

This is a focused starter set, not everything available for Linux
development. It's enough to build and deploy the first project in this
bundle, and most things you'd build after it.

## Installing by hand

Open a terminal and run these one at a time. You'll be asked for your
password when a command starts with `sudo` — that's normal; it means "run
this as an administrator." Typing your password won't show any characters
on screen, which is expected.

```bash
# Update the list of available software
sudo apt update

# Install Git, build tools, and Python
sudo apt install -y git build-essential python3 python3-pip python3-venv curl

# Install Node.js and npm
sudo apt install -y nodejs npm

# Install VS Code (a code editor) via Snap, Ubuntu/Mint's app package system
sudo snap install code --classic

# Install the GitHub CLI (official method — adds GitHub's own repository)
type -p curl >/dev/null || sudo apt install curl -y
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install -y gh
```

Each command downloads and installs one thing, from your Linux
distribution's own trusted software sources (or, for the GitHub CLI step,
from a public key and repository published directly by GitHub — the
official installation method from cli.github.com). Nothing here runs a
script you can't read first.

## Installing automatically

If you'd rather not type each command:

```bash
cd path/to/this-bundle/scripts
chmod +x setup-dev-machine.sh
./setup-dev-machine.sh
```

Read `scripts/setup-dev-machine.sh` in a text editor first — it's commented
so you can see exactly what it does before running it. It runs the same
commands shown above, checks whether each tool is already installed before
installing it, and never deletes or overwrites anything.

## Confirm everything installed

Run:

```bash
cd path/to/this-bundle/scripts
chmod +x verify-setup.sh
./verify-setup.sh
```

This checks each tool and prints what's installed and what's missing. It
doesn't change anything on your computer — safe to run as many times as you
want.

## A note on Node.js versions

The `apt install nodejs` command above installs the Node.js version your
Linux distribution currently ships, which is a genuinely current,
officially supported release — not a special "latest and greatest" build.
That's the right choice for this bundle: it comes from a trusted source
with no extra setup. If a later project specifically needs a newer Node.js
version, look up **nvm (Node Version Manager)** at that point — it lets you
install and switch between multiple Node.js versions per-user, without
touching your system-wide installation.

## Next

Continue to `08-git-and-github-starter.md` to set up Git with your name and
connect it to a GitHub account.

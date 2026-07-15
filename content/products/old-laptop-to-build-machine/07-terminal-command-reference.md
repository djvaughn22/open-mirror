# Terminal Command Reference

The terminal is a text-based way to give your computer instructions. This
page explains the commands used throughout this bundle, in plain language.
Keep it open in a tab while you work.

## How to read a command

`sudo apt install -y git` breaks down as:

- `sudo` — "do this as an administrator." You'll be asked for your
  password. Needed for anything that installs software or changes system
  settings.
- `apt` — the program being run (Linux Mint/Ubuntu's software installer)
- `install` — what to tell that program to do
- `-y` — a "flag" that means "yes, don't ask me to confirm"
- `git` — what to install

Type the command exactly, then press **Enter** to run it.

## Moving around

| Command | What it does |
|---|---|
| `pwd` | Print Working Directory — shows the folder you're currently in |
| `ls` | List — shows the files and folders in the current folder |
| `cd folder-name` | Change Directory — moves into a folder |
| `cd ..` | Moves up one folder (to the parent) |
| `cd ~` | Jumps straight to your home folder |
| `mkdir folder-name` | Make Directory — creates a new folder |

## Working with files

| Command | What it does |
|---|---|
| `touch filename.txt` | Creates a new, empty file |
| `cat filename.txt` | Prints a file's contents to the screen |
| `rm filename.txt` | Removes (deletes) a file — permanent, no trash bin |
| `code .` | Opens the current folder in VS Code |

## Software

| Command | What it does |
|---|---|
| `sudo apt update` | Refreshes the list of available software versions (doesn't install anything by itself) |
| `sudo apt install -y package-name` | Installs a piece of software |
| `sudo apt upgrade -y` | Updates already-installed software to newer versions |

## Checking versions

Useful for confirming something installed correctly:

```bash
git --version
python3 --version
node --version
npm --version
gh --version
code --version
```

## Git (covered fully in 08-git-and-github-starter.md)

| Command | What it does |
|---|---|
| `git init` | Turns the current folder into a Git repository |
| `git status` | Shows what's changed since your last save point |
| `git add .` | Stages all changed files to be saved |
| `git commit -m "message"` | Saves a snapshot of the staged changes, with a note describing it |
| `git push` | Sends your saved snapshots to GitHub |
| `git log` | Shows the history of saved snapshots |

## Reading errors

Terminal error messages usually tell you exactly what went wrong, even if
they look intimidating. Two common patterns:

- `command not found` — the tool isn't installed, or isn't on your `PATH`
  (the list of places your computer looks for programs). Usually means the
  install step didn't finish — see `11-troubleshooting.md`.
- `Permission denied` — you likely need `sudo` in front of the command, or
  don't have rights to that file/folder.

## Habits worth building

- Read the command before you press Enter — don't paste things you don't
  understand.
- `Ctrl+C` cancels whatever is currently running in the terminal.
- The up arrow key cycles through your recent commands, so you don't have
  to retype them.
- Tab press auto-completes file and folder names — start typing a name and
  press Tab.

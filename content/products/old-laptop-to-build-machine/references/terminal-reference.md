# Terminal Reference

A plain-language lookup for the terminal commands used in this bundle. Keep it
open beside the main guide.

## How to read a command

`sudo apt install -y git` breaks down as:

- `sudo` — "do this as an administrator." You'll be asked for your password
  (the characters won't show as you type — that's normal).
- `apt` — the program being run (Linux Mint / Ubuntu's software installer).
- `install` — what to tell it to do.
- `-y` — a flag meaning "yes, don't ask me to confirm each package."
- `git` — what to install.

Type the command, then press **Enter** to run it.

## Moving around

| Command | What it does |
|---|---|
| `pwd` | Prints the folder you're currently in |
| `ls` | Lists files and folders here |
| `cd folder` | Moves into a folder |
| `cd ..` | Moves up one folder |
| `cd ~` | Jumps to your home folder |
| `mkdir folder` | Makes a new folder |

## Working with files

| Command | What it does |
|---|---|
| `touch file.txt` | Creates a new empty file |
| `cat file.txt` | Prints a file's contents |
| `rm file.txt` | Deletes a file (permanent — no trash bin) |
| `code .` | Opens the current folder in VS Code |
| `xdg-open file.html` | Opens a file in its default app (e.g. a browser) |

## Software (needs `sudo`)

| Command | What it does |
|---|---|
| `sudo apt update` | Refreshes the list of available software (installs nothing by itself) |
| `sudo apt install -y name` | Installs a package |
| `sudo apt upgrade -y` | Updates installed software to newer versions |

## Checking versions

```bash
git --version
python3 --version
node --version
npm --version
gh --version
code --version
```

## Habits worth building

- Read a command before pressing Enter — don't paste what you don't understand.
- `Ctrl+C` cancels whatever is currently running.
- The **up arrow** cycles through recent commands, so you don't retype them.
- **Tab** auto-completes file and folder names — start typing and press Tab.

## Two common errors

- `command not found` — the tool isn't installed, or the terminal can't find
  it. Usually means an install step didn't finish. Run `verify-setup.sh`.
- `Permission denied` — you likely need `sudo` in front, or don't have rights
  to that file or folder.

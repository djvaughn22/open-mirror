# README — Old Laptop to Build Machine

This file explains what every file in this bundle is for. You don't need the
Open Mirror website or any account to use anything in this folder — it's all
plain text and HTML you can read in any browser or text editor.

## Guides (read in order)

| File | What it covers |
|---|---|
| `01-start-here.md` | The overview and the order to read everything in |
| `02-printable-checklist.md` | The whole process as one checklist |
| `03-laptop-readiness-worksheet.md` | Decide if your laptop can do this |
| `04-backup-and-safety.md` | Protect what's currently on the laptop |
| `05-linux-installation.md` | Install Linux on the machine |
| `06-development-machine-setup.md` | Install the development tools |
| `07-terminal-command-reference.md` | Plain-language reference for terminal commands used in this bundle |
| `08-git-and-github-starter.md` | What Git and GitHub are, and how to use them |
| `09-first-project-walkthrough.md` | Build one small real project by hand |
| `10-deployment-walkthrough.md` | Put that project live on the internet |
| `11-troubleshooting.md` | Fixes for the problems people hit most often |
| `12-if-something-goes-wrong.md` | What to do if a step fails badly, or you want to start over |
| `13-open-mirror-tools-guide.md` | How Open Mirror's own tools can help you decide what to build next |

## Printable versions

`printable/checklist.html` and `printable/worksheet.html` are the same
content as the matching Markdown files, formatted to print cleanly (open in
any browser and use its Print or "Save as PDF" option).

## Scripts

`scripts/setup-dev-machine.sh` installs the development tools described in
`06-development-machine-setup.md`, automatically. It is optional — the guide
also shows how to install everything by hand. Read
`06-development-machine-setup.md` before running it. It only works on
Ubuntu, Linux Mint, Pop!_OS, or another Debian/Ubuntu-family Linux
distribution.

`scripts/verify-setup.sh` checks what's installed and prints a plain report.
It changes nothing on your computer — safe to run any time, including before
the setup script, to see where you're starting from.

Both scripts are plain shell scripts. Open them in any text editor and read
them before running them — they are commented so you can see exactly what
each part does.

## first-project/

The finished version of the small project built in
`09-first-project-walkthrough.md`. If you get stuck following the
walkthrough, compare your files to these.

## What this bundle does not include

- No paid tools, services, or API keys
- No account creation on your behalf — you create your own free GitHub
  account
- No automatic disk partitioning, erasing, or system changes — every
  destructive step is manual and clearly marked
- No tracking, telemetry, or phone-home behavior in any script

## Where this came from

This bundle is an early product from **Open Mirror LLC**, an independent
studio. See `13-open-mirror-tools-guide.md` for how Open Mirror's other free
tools connect to what you build here.

# Troubleshooting & Recovery

Problems people hit most often, and how to recover at each stage. Nothing here
is designed to be a one-shot, no-mistakes process — you can almost always back
up and try a step again.

## Installing Linux

**The laptop won't boot from the USB stick.**
- Press the boot-menu key (`F12`, `F2`, `Esc`, or `Del`) immediately and
  repeatedly as the laptop starts, before the old system loads.
- In the BIOS/UEFI settings, temporarily disable **Secure Boot** (and
  **Fast Boot** if present), then try again.
- Re-create the USB stick — an incomplete or corrupted write is common.
  Re-download the `.iso` if you're unsure the first download finished.

**The installer fails or freezes.** Restart and boot from the USB stick again.
Until you confirm the "erase disk and install" step, nothing on the laptop's
internal drive has changed. If it fails partway through an actual install,
boot from the USB again and re-run the installer — it's built to be re-run.

**After install, Linux won't boot.** Boot from the USB stick again and choose
"Try Linux Mint" to reach a working desktop, from which you can re-run the
installer. Because you backed up in Chapter 2, a fresh reinstall is always a
safe fallback — you lose nothing you already copied elsewhere.

## After install

**No Wi-Fi.** Some laptops need an extra driver. During install there's an
option to install third-party drivers — say yes if you see it. If you missed
it, connect once by ethernet cable, then open **Driver Manager** from the
menu.

**`command not found` in the terminal.** The tool isn't installed or isn't on
your `PATH`. Run `verify-setup.sh` to see what's missing, re-run that tool's
install block from Chapter 5, and close/reopen the terminal (some installs
only take effect in a new window).

**`sudo` password not accepted.** Type your own account password (set during
install), not a blank line. The cursor won't move as you type — it's hidden on
purpose.

## Git and GitHub

**`git push` asks for a username and password, and rejects them.** GitHub no
longer accepts plain passwords here. Run `gh auth login` again and make sure it
completes.

**`gh repo create` says the repo already exists.** You (or an earlier attempt)
already made one with that name. Delete it on GitHub (Settings → bottom →
Delete this repository) or choose a different name.

## The first website

**The page loads but the button does nothing.** Open the browser's developer
console (`F12` → Console) and read the red error — it names the line and
mistake. Compare your `index.html`, `style.css`, and `script.js` against the
files in `first-project/`. Common causes: the `<script src="script.js">` name
not matching the real file, or a missing `}` in `script.js`.

**GitHub Pages shows a 404 instead of my site.**
- Confirm Settings → Pages shows "Your site is live" (it can take a couple of
  minutes after enabling).
- Confirm the branch and folder in Pages settings match where `index.html`
  actually lives (the repository root, on your default branch).
- Make sure the file is named exactly `index.html`, lowercase.

## Recovering a Git mistake

Git rarely loses real work.

- **Undo uncommitted changes to a file:** `git checkout -- filename` reverts it
  to the last committed state.
- **See your history:** `git log` — every commit is still there.
- **Bad commit, not yet pushed:** `git reset --soft HEAD~1` undoes the last
  commit but keeps your file changes so you can fix and recommit.
- **Genuinely stuck on a small project:** delete the local folder, run
  `gh repo clone your-username/build-log` to download a fresh copy of what's on
  GitHub, and continue. This works because you pushed earlier — another reason
  to commit and push often.

## Starting the project over

Completely normal, and cheap: delete the local folder, delete the GitHub
repository (Settings → bottom → Delete this repository), and start again from
Chapter 7. Nothing about your Linux install or tools needs to change.

## What this bundle will never do to you

- No step and no script erases your laptop's drive without you choosing that
  option inside the Linux installer itself.
- No script deletes files it didn't create, or changes files outside the
  project folder you're working in.
- If you're ever unsure what a command does, that's a good reason to stop and
  look it up first — nothing here is timed or urgent.

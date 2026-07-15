# Troubleshooting

Problems people hit most often, in the order they tend to come up.

## The laptop won't boot from the USB drive

- Make sure you're pressing the boot-menu key (often `F12`, `F2`, `Esc`, or
  `Del`) immediately and repeatedly as the laptop starts, before the normal
  operating system begins loading.
- Some laptops have "Secure Boot" or "Fast Boot" enabled in their BIOS/UEFI
  settings, which can block booting from USB. Look for a BIOS/UEFI setting
  called Secure Boot and temporarily disable it, or look for a "boot from
  USB" / "legacy boot" option.
- Try re-creating the USB drive — an incomplete or corrupted write is a
  common cause. Re-download the `.iso` if you're not sure the first
  download finished cleanly.

## No Wi-Fi after installing Linux

- Some laptops use Wi-Fi hardware that needs an extra driver. During the
  Linux Mint installer, there's an option to install third-party drivers —
  say yes to that if you saw it. If you missed it, connect via a wired
  ethernet cable once, then look for "Driver Manager" in the Linux Mint
  menu.

## `command not found` in the terminal

This means the tool isn't installed, or the terminal doesn't know where to
find it.

- Run `scripts/verify-setup.sh` to see exactly what's missing.
- Try the specific install command again from
  `06-development-machine-setup.md` — copy it exactly.
- If you just installed something, close and reopen the terminal — some
  installs only take effect in a new terminal window.

## `sudo: command not found` or password not accepted

- Make sure you're typing your own account password (the one you set
  during Linux installation), not a blank line. The cursor won't move as
  you type — that's normal, it's hidden on purpose.

## `git push` asks for a username and password, and rejects them

GitHub no longer accepts plain passwords for this. Run `gh auth login`
again (see `08-git-and-github-starter.md`) and make sure it completes
successfully — it sets up the right kind of access automatically.

## `gh repo create` fails with "already exists"

You (or a previous attempt) already created a repository with that name on
GitHub. Either delete it from GitHub's website first (Settings → scroll to
the bottom → Delete this repository), or choose a different name.

## The Build Log page loads but the button doesn't work

- Open the browser's developer console (usually `F12` or right-click →
  Inspect → Console tab) and look for a red error message — it usually
  names the exact line and mistake.
- Compare your `index.html`, `style.css`, and `script.js` against the
  matching files in this bundle's `first-project/` folder, line by line.
- A common mistake: the `<script src="script.js">` tag not matching the
  actual filename, or a missing closing bracket `}` in `script.js`.

## GitHub Pages shows a 404 page instead of my site

- Double-check Settings → Pages shows "Your site is live" — it can take a
  couple of minutes after first enabling it.
- Confirm the branch and folder selected in Pages settings match where
  your `index.html` actually lives (should be the repository root, on your
  default branch).
- Make sure the file is named exactly `index.html`, lowercase.

## Still stuck

See `12-if-something-goes-wrong.md` for how to back up and start a step
over safely, without losing earlier progress.

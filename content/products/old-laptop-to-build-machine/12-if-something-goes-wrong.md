# If Something Goes Wrong

Nothing in this bundle is designed to be a one-shot, no-mistakes-allowed
process. Here's how to recover at each stage.

## During Linux installation

If the installer fails, freezes, or you change your mind partway through:
you can safely restart the laptop and boot from the USB drive again. Until
you confirm the "erase disk and install" step, nothing on the laptop's
internal drive has been changed. If it fails partway through an actual
install, boot from the USB again and re-run the installer — it's designed
to be re-run.

## After installing Linux, if it won't boot

Boot from the USB drive again (same key as before: `F12`, `F2`, `Esc`, or
`Del`) and choose "Try Linux Mint" to get a working environment, from which
you can access files or re-run the installer. If you backed up your data
per `04-backup-and-safety.md`, a fresh reinstall is always a safe fallback
— you lose nothing you didn't already keep a copy of.

## If the setup script partway fails

`scripts/setup-dev-machine.sh` is written so each step checks whether it's
already done before doing it (see the script's comments). That means it's
safe to simply run it again after fixing whatever caused the failure — it
won't redo completed steps or duplicate anything. Read the error message it
printed; it names the specific command that failed.

## If you make a mess of a Git repository

Git rarely loses real work — almost everything is recoverable.

- **Undo uncommitted changes to a file:** `git checkout -- filename`
  reverts a file back to its last committed state.
- **See your commit history:** `git log` — every commit you've made is
  still there.
- **Made a bad commit but haven't pushed yet:** `git reset --soft HEAD~1`
  undoes the last commit, but keeps your file changes so you can fix and
  recommit.
- **Genuinely stuck:** as a last resort for a small project like the one in
  this bundle, you can delete the local folder, run `gh repo clone
  your-username/build-log` to download a fresh copy of whatever's saved on
  GitHub, and continue from there. This only works because you pushed
  earlier — another reason to commit and push often.

## If you want to start the whole project over

That's a completely normal thing to do, and cheap: delete the local
project folder, delete the GitHub repository (Settings → bottom of page →
Delete this repository), and start again from
`09-first-project-walkthrough.md`. Nothing about your Linux install or
development tools needs to change.

## What this bundle will never do to you

- No step in this guide, and no script in this bundle, will erase your
  laptop's drive without you explicitly choosing that option inside the
  Linux installer itself.
- No script deletes files it didn't create, or modifies files outside the
  project folder you're working in.
- If you ever aren't sure what a command does before running it, that's a
  reasonable reason to stop and look it up first — nothing here is timed
  or urgent.

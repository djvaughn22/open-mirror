# OLD LAPTOP TO BUILD MACHINE

### A Beginner's Guide to Installing Linux, Setting Up Developer Tools, and Publishing Your First Website

**Open Mirror**

---

<!-- ============================= FRONT MATTER ============================= -->

*Old Laptop to Build Machine*

Published by Open Mirror LLC · openmirrorllc.com

Copyright © 2026 Open Mirror LLC. All rights reserved. No part of this book may
be reproduced or distributed in any form without prior written permission,
except brief quotations in a review.

First edition, 2026.

The instructions in this book involve installing an operating system, which
erases the target computer's existing data. The reader is responsible for
backing up anything important beforehand, as described in Chapter 2. This book
is provided for educational purposes without warranty of any kind; the
publisher is not liable for data loss, hardware issues, or other outcomes.
Product and company names mentioned herein — Linux Mint, Microsoft, Visual
Studio Code, Node.js, Git, GitHub, and others — are the property of their
respective owners and are referenced for identification only; this book is not
affiliated with or endorsed by them.

Results depend on the reader's hardware and effort. This book provides the
steps, not a guarantee of any particular outcome, income, or employment.

*Companion resources — printable checklists, reference cards, and ready-to-run
setup scripts — are available as a free download. See "Your Companion
Downloads" at the front of this book.*

---

## Your Companion Downloads

This book has a free companion file bundle so you don't have to type long
setup commands from a printed page. It contains printable worksheets and
checklists, quick-reference cards, a safe setup script, and the finished
example-project files.

Get it at: **openmirrorllc.com/products/old-laptop-to-build-machine**

Whenever this book says *"see the companion setup script,"* it means that
download. Everything essential is also explained in these pages — the
companion files just save you typing.

---

## Contents

- Introduction: What This Book Does
- Chapter 1 — Is Your Laptop Up to This?
- Chapter 2 — Back Up Anything You Want to Keep
- Chapter 3 — Install Linux
- Chapter 4 — First Boot: Update and Secure It
- Chapter 5 — Set Up Your Development Tools
- Chapter 6 — Git and GitHub: Save Your Work
- Chapter 7 — Build Your First Website
- Chapter 8 — Put It on the Internet
- Chapter 9 — Change It, and Find It Later
- Chapter 10 — What to Build Next
- Completion Checklist
- Troubleshooting & Recovery
- About the Publisher

---

## Introduction: What This Book Does

You have an old laptop — slow, or just sitting in a drawer. This book turns it
into a real computer for building things: writing code, making small projects,
and putting real, working websites on the internet. It is written for someone
who has never used Linux, a terminal, Git, or any of this before. Every term is
explained the first time it appears.

By the end, you will have a laptop running Linux with the tools developers
actually use, one small website you built by hand, and that website live on the
internet at a real address you can share.

**A warning to read now, not later.** Installing Linux the way this book
recommends erases everything currently on the laptop — its old operating
system, programs, photos, and files. Chapter 2 walks through backing up
anything you want to keep. Do not skip it. Nothing in this book erases a drive
automatically; the one destructive step happens inside the Linux installer, and
you choose it deliberately.

**What you'll need:** a laptop that powers on reliably; at least 2 GB of RAM (4
GB or more is much more comfortable) and about 20 GB of free storage; a USB
flash drive of 8 GB or larger that you don't mind erasing; an internet
connection; and a few hours you can split across sittings.

**One supported path.** To keep every instruction exact, this book follows a
single setup: Linux Mint 22, the Cinnamon edition (or the lighter Xfce edition
for older or low-memory laptops — every command is identical). It's built on
Ubuntu 24.04 and supported for years. It installs on laptops that start in
either modern UEFI or older legacy BIOS mode.

---

## Chapter 1 — Is Your Laptop Up to This?

Linux runs on a much wider range of hardware than current Windows or macOS,
including machines those systems have left behind. Before installing anything,
check a few things so you know what to expect. (There's a printable version of
this check in your companion downloads.)

**Memory.** 8 GB or more is comfortable for everyday building. 4 GB works well
with the lighter Xfce edition. 2 GB is usable for the terminal-based parts, but
an editor and browser together will feel slow — choose Xfce. Not sure how much
you have? On Windows, look under Settings → System → About; on a Mac, the Apple
menu → About This Mac; or search your laptop's model number online.

**Storage.** You need about 20 GB free. A solid-state drive (SSD) feels fast; an
older spinning hard drive still works, just slower. Neither stops you.

**The basics.** If the laptop powers on, holds a charge, and the screen,
keyboard, and trackpad work, it's ready. If a part is physically broken, Linux
inherits that same problem — this book can't fix hardware faults, though you can
plug in an external keyboard, mouse, or monitor.

> **Checkpoint 1.** The laptop powers on reliably, has at least 2 GB of RAM and
> ~20 GB free, and its core parts work. You've chosen Cinnamon (capable laptop)
> or Xfce (older / 4 GB or less).

---

## Chapter 2 — Back Up Anything You Want to Keep

This is the step people regret skipping. Installing Linux will erase the
laptop's internal drive, so anything you want to keep must be copied elsewhere
first.

Start by deciding what's actually on the laptop: photos and videos, documents,
files you use, passwords saved in a browser — anything you'd be upset to lose.
If the honest answer is "nothing I care about," you can move on. Otherwise, copy
it somewhere that isn't this laptop: an external USB drive, a cloud account you
already use, or another computer. Pick at least one; two is safer.

Write down anything you'll need again — your Wi-Fi password especially, plus any
logins tied only to this laptop. Then do the one step that prevents almost every
regret: open the backup and confirm the files are really there. Don't just trust
that the copy finished.

> **Checkpoint 2.** Everything you want to keep is copied elsewhere and you've
> opened it there to confirm. Your Wi-Fi password is written down.

---

## Chapter 3 — Install Linux

Linux is a free operating system — the same kind of software as Windows or
macOS, with no cost and no license key. Linux Mint is a version that looks
familiar and is friendly to newcomers. You'll put it on a USB stick, start the
laptop from that stick, and install.

**Download the installer.** On any working computer, go to the official Linux
Mint website and download the Cinnamon edition (or Xfce for older hardware).
You'll get one large file ending in `.iso`. Always download from the project's
own official site.

**Make a bootable USB stick.** Download balenaEtcher — a free tool for Windows,
macOS, and Linux — from its official site. Open it, select the `.iso`, select
your USB drive, and start. Everything on the USB drive is erased, so before you
confirm, make sure the selected drive is the USB stick and not your computer's
main drive. This is the one moment in the whole process to slow down and read
the screen.

**Start the laptop from the stick.** Plug it into the laptop you're converting,
restart, and repeatedly press the boot-menu key as it powers on — usually F12,
F2, Esc, or Del, depending on the maker. Choose to boot from the USB drive.
You'll land in a "live" Linux Mint desktop running from the stick; nothing on
the laptop's own drive has changed yet. If the stick won't boot, look in the
boot or BIOS menu for a setting called Secure Boot and turn it off, then try
again — Mint supports Secure Boot, but turning it off avoids the most common
first-time snag.

**Install, and choose the erase option deliberately.** Double-click *Install
Linux Mint* and follow the prompts for language, keyboard, and time zone. When
it asks how to use the drive, the clean choice for a dedicated build machine is
*Erase disk and install Linux Mint* — pick this only after finishing Chapter 2,
because it erases the old system. If you're not ready to commit the laptop
fully, *Install alongside* (dual-boot) keeps the old system too and lets you
choose at startup, though it leaves less room for your work. Set your name, a
username, and a password you'll remember — you'll type it often.

When prompted, remove the USB stick and let the laptop restart. It should boot
straight into Linux Mint.

> **Checkpoint 3.** The laptop restarts into Linux Mint on its own, without the
> USB stick. You can log in with your password.

---

## Chapter 4 — First Boot: Update and Secure It

Connect to the internet by clicking the network icon at the bottom-right and
joining your Wi-Fi, or by plugging in an ethernet cable.

Then open **Update Manager** from the menu and install everything it offers. A
fresh system usually has a lot; let it finish and restart once more. This is the
single most important thing you can do for the machine's security — it patches
known problems.

Now meet the **terminal**, a text way to give the computer instructions. Open it
from the menu or press Ctrl+Alt+T. You type a command and press Enter to run it.
When a command starts with `sudo` — meaning "do this as an administrator" —
you'll be asked for your password, and the characters won't appear as you type,
which is normal. For example, in `sudo apt update`, `sudo` means run as admin,
`apt` is Mint's software installer, and `update` refreshes the list of available
software. (The companion downloads include a one-page terminal reference.)

Finally, confirm the screen locks automatically under Menu → Screensaver.
Combined with your login password, that keeps the machine yours.

> **Checkpoint 4.** You're online, every update is installed, you've restarted,
> and you can open a terminal.

---

## Chapter 5 — Set Up Your Development Tools

Now you install the tools you'll build with. Every one is free. Here's what each
is for: **Git** tracks changes to your work so you never lose it and can undo
mistakes; **Visual Studio Code** is the editor where you write and read code;
**Python** is a friendly programming language; **Node.js and npm** let you run
JavaScript outside a browser and install its packages, which most modern web
tools need; and the **GitHub CLI** (`gh`) connects you to GitHub from the
terminal. This is a focused starter set — just what you need to build and ship
the project ahead, and most things after it.

**The easy way.** The free companion download includes a setup script that
installs all of these safely. It first prints exactly what it will install and
asks you to confirm, checks whether each tool is already present before
installing it, and never touches your files or your disk's partitions. Open a
terminal in the script's folder and run `./setup-dev-machine.sh`. When it
finishes, run `./verify-setup.sh` to confirm everything installed. Because
printed pages are a poor place for long commands, this book points you to that
script rather than reproducing it in full here.

**The manual way, in brief.** If you'd rather install by hand, the pattern is
the same for each tool: update the software list with `sudo apt update`, then
install. The base tools come straight from Linux Mint's own software:

```
sudo apt install -y git build-essential python3 python3-pip python3-venv curl ca-certificates gnupg
```

The editor, Node.js, and the GitHub CLI each come from their vendor's official
software source, which you add by downloading the vendor's signing key and
registering their repository — a standard, safe step (you're downloading a key,
not running an unknown program). The exact commands for VS Code (from
Microsoft's repository — not "snap," which Linux Mint blocks by default),
Node.js 22 (from NodeSource), and the GitHub CLI (from GitHub) are in the
companion setup script, fully commented, so you can read and run them without
retyping. When you're done, confirm each tool prints a version number:

```
git --version
python3 --version
node --version
npm --version
gh --version
code --version
```

> **Checkpoint 5.** Git, VS Code, Python, Node.js, npm, and `gh` all print
> version numbers. Your machine is now a development machine.

---

## Chapter 6 — Git and GitHub: Save Your Work

**Git** is a program on your computer that saves snapshots of your work over
time. **GitHub** is a website that stores copies of those snapshots online — for
backup, sharing, and, in Chapter 8, publishing your site for free. Git is the
tool; GitHub is one place to keep what it tracks.

First, tell Git who you are (this just labels your snapshots):

```
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Create a free account at github.com — it's free for public and private projects
— then sign in from the terminal with `gh auth login`, choosing GitHub.com and
HTTPS and letting it open your browser to finish. That's a one-time setup per
machine, and it replaces the old username-and-password method GitHub no longer
accepts.

From here on, the everyday loop is four commands: `git status` shows what
changed, `git add .` stages your changes to save, `git commit -m "a note"` saves
a snapshot with a description, and `git push` sends your snapshots up to GitHub.
(The companion downloads include a one-page Git & GitHub reference.)

> **Checkpoint 6.** Git knows your name and email, you have a GitHub account, and
> `gh auth login` finished successfully.

---

## Chapter 7 — Build Your First Website

You'll build a small, real site: a **Build Log** — one page where you type a note
and a button adds it to a running list, saved right in your browser. It's small
on purpose. The point isn't the project; it's finishing the whole loop: write
code, run it, save it, publish it. The finished files are in your companion
downloads, so you can compare if something misbehaves.

Start by making a project folder and opening it in your editor:

```
cd ~
mkdir build-log
cd build-log
code .
```

Inside, you'll create three files. `index.html` holds the page's structure — a
heading, a form with a text box and a button, and an empty list. `style.css`
controls how it looks. `script.js` makes it work: when you submit the form, it
adds your entry to the list and saves it in the browser so it's still there next
time. The full contents of all three are in the companion project files; type
them yourself first, since that's where the learning happens.

To run it, no server is needed for a page this simple — open the folder in your
file manager and double-click `index.html`, or run `xdg-open index.html`. Type
something, press the button, and watch it appear. If nothing happens, open the
browser's developer console (press F12, then Console) and read the red error; it
names the line and mistake, usually a filename that doesn't match or a missing
bracket.

Now make it yours: change the big heading in `index.html`, save, reload, and
confirm your change shows. Then save your work and put it on GitHub:

```
git init
git add .
git commit -m "First commit: build log page"
gh repo create build-log --public --source=. --push
```

That last command creates a matching GitHub repository and uploads your code in
one step. (Use `--private` instead of `--public` to keep it hidden.)

> **Checkpoint 7.** Your Build Log works in a browser, you've made it your own,
> and the code is on GitHub.

---

## Chapter 8 — Put It on the Internet

"Deploying" means putting your project where anyone can reach it. You'll use
**GitHub Pages** — the simplest free option for a site like this, with no extra
account and no configuration file. It publishes straight from the repository you
just created.

In a browser, open your repository at github.com, click **Settings**, then
**Pages** in the sidebar. Under "Build and deployment," set the source to
"Deploy from a branch," choose the `main` branch and the `/ (root)` folder, and
save. Give it a minute or two, then refresh — it will show "Your site is live
at" an address ending in `github.io`. Open that address: your Build Log is now
on the internet, reachable by anyone with the link.

> **Checkpoint 8.** Your site loads at its `github.io` address in a normal
> browser. You can send that link to someone.

---

## Chapter 9 — Change It, and Find It Later

Here's the loop that makes it feel real. In your editor, change something — a
line of text, a color in `style.css` — and save. Then, in the terminal inside
your project folder, run the everyday loop:

```
git add .
git commit -m "Update the heading"
git push
```

Wait a minute, refresh your live address, and your change is there. That loop —
edit, commit, push, see it live — is exactly how real projects update, at any
size.

Your live address is always `https://your-username.github.io/build-log/`, and
you can find it again any time under the repository's Settings → Pages. Your code
lives at github.com under your username, and on your laptop in the `build-log`
folder in your home directory. One note on scope: GitHub Pages serves static
files — HTML, CSS, and JavaScript — which is perfect here; it doesn't run a live
backend or database. When a later idea needs those, you'll use a different kind
of host.

> **Checkpoint 9.** You changed the site, pushed the change, and saw it go live.
> You know where to find the code, the folder, and the live URL again.

---

## Chapter 10 — What to Build Next

You now have a working development machine and one live project. The hardest
part — finishing the whole loop once — is behind you.

A good second project is usually smaller than you think. Take one idea, write
down the smallest version of it that would truly work from start to a live
result, and build that using the same loop you just used. If you'd like help
shaping that smallest version, Open Mirror publishes a free tool called
StepInTheRing that turns a rough idea into a concrete first build plan by asking
a short series of questions; you can find it, and other free Open Mirror tools,
at openmirrorllc.com. None of it is required — it's simply a place to start.

---

## Completion Checklist

You've finished the journey when all of these are true: the laptop runs Linux
Mint, fully updated, with a lock screen; Git, VS Code, Python, Node.js, npm, and
`gh` all work; Git knows your name and email and you're signed in to GitHub; you
built the Build Log and made it your own; the code is on GitHub; the site is live
at its `github.io` address; you changed it, pushed, and watched the live site
update; and you know where to find the code, the folder, and the live URL again.

---

## Troubleshooting & Recovery

Nothing here is a one-shot, no-mistakes process — you can almost always back up
and try a step again.

If the laptop won't boot from the USB stick, press the boot-menu key immediately
and repeatedly as it starts, and try disabling Secure Boot in the BIOS/UEFI
settings; if that fails, re-create the stick, as an incomplete write is common.
If the installer fails partway, restart and boot from the stick again — until you
confirm the erase step, nothing on the internal drive has changed. If Linux won't
boot after installing, boot from the stick again, choose "Try Linux Mint" to
reach a working desktop, and re-run the installer; because you backed up in
Chapter 2, a fresh reinstall is always a safe fallback.

If a command reports "command not found," the tool isn't installed or isn't
found yet — re-run its install step and open a fresh terminal. If `sudo` won't
accept your password, remember it's your own account password and the characters
stay hidden as you type. If `git push` asks for a password and rejects it, run
`gh auth login` again and let it finish. If GitHub Pages shows a 404 instead of
your site, confirm the Pages settings show "live," that the branch and folder
match where your `index.html` lives, and that the file is named exactly
`index.html` in lowercase.

Git rarely loses real work: `git checkout -- filename` reverts a file to its
last saved state, `git log` shows your history, and — because you pushed to
GitHub — you can always download a fresh copy of your project with `gh repo
clone`. If you'd like to start the project over, that's completely normal and
cheap: delete the folder, delete the GitHub repository in its settings, and begin
again from Chapter 7. (A fuller troubleshooting reference is in your companion
downloads.)

---

## About the Publisher

Open Mirror is a small independent studio that builds useful, original products
— websites, games, tools, and guides like this one — and shares many of them
free. It also makes practical playbooks, of which this book is one, designed to
help someone finish a specific, real result. Everything it publishes is made and
used by the same hands that wrote it.

You can find its free tools and projects at **openmirrorllc.com**. Questions
about this book are welcome at **ask@openmirrorllc.com**.

*Old Laptop to Build Machine · An Open Mirror Playbook*

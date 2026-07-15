# Linux Installation

## What Linux is, in plain terms

Linux is a free, open operating system — the same category of software as
Windows or macOS. It's what runs most of the internet's servers, and it's a
genuinely good, free way to bring an old laptop back to life. You don't pay
for it, and there's no license key.

There are many "distributions" (versions) of Linux, built by different
groups, with different looks and defaults underneath the same core. This
guide recommends one, on purpose, instead of listing every option.

## The distribution this guide recommends

**Linux Mint** — a free, beginner-friendly Linux distribution built on
Ubuntu. It looks familiar to anyone who has used Windows, includes the
software you need to get started out of the box, and is one of the most
widely recommended distributions for a first Linux install.

If your laptop is older or has 4 GB of RAM or less, choose the **Xfce**
edition of Linux Mint when you download it — it's the lightest-weight
version and runs comfortably on modest hardware.

This bundle's setup script (`scripts/setup-dev-machine.sh`) is written for
Linux Mint, Ubuntu, Pop!_OS, and other Debian/Ubuntu-family distributions.
If you pick a different distribution, the guide still applies, but the
script won't run — you'd install the tools by hand using
`06-development-machine-setup.md` instead.

## Step 1: Check how much RAM your current laptop has

- **Windows:** Settings → System → About, look for "Installed RAM"
- **macOS:** Apple menu → About This Mac
- **Already on Linux:** open a terminal and run `free -h`

Use this to decide between the standard edition and the Xfce (lightweight)
edition.

## Step 2: Download the installer image

Go to the official Linux Mint website's download page and choose the Xfce
or Cinnamon edition (Cinnamon if your laptop is reasonably capable,
otherwise Xfce). This downloads one large file — an `.iso` image.

Always download from the distribution's own official website, not a
third-party mirror or search-result link you don't recognize.

## Step 3: Create a bootable USB drive

You need a spare USB flash drive, 8 GB or larger. Everything on it will be
erased.

1. Download and install **balenaEtcher** or **Rufus** (Rufus is
   Windows-only; balenaEtcher works on Windows, macOS, and Linux) — both
   are free, widely used tools for writing an `.iso` image to a USB drive.
2. Open the tool, select the Linux Mint `.iso` file you downloaded, select
   your USB drive, and start the write process.
3. Double-check you've selected the USB drive and not your computer's main
   hard drive before confirming — this is the one step in this whole guide
   worth being extra careful about.

## Step 4: Boot the laptop from the USB drive

1. Plug the USB drive into the laptop you're converting.
2. Restart it, and as it powers on, repeatedly press the key that opens the
   boot menu or BIOS/UEFI settings. This is usually `F12`, `F2`, `Esc`, or
   `Del` — it varies by manufacturer and often flashes briefly on screen
   during startup.
3. Choose to boot from the USB drive.

You'll land in a "live" Linux Mint environment — running entirely from the
USB drive, not yet installed. Nothing on the laptop's internal drive has
been touched yet.

## Step 5: Try it, then install

Linux Mint lets you try the desktop before installing anything. When ready,
double-click **Install Linux Mint** on the desktop.

The installer will ask how to use the laptop's drive:

- **Erase disk and install Linux Mint** — the straightforward option this
  guide recommends for a dedicated build machine. Only choose this after
  completing `04-backup-and-safety.md`.
- **Install alongside** (dual-boot) — keeps your existing operating system
  and lets you choose which to start at boot. A safer option if you're not
  ready to fully commit the laptop.

Follow the installer's prompts: time zone, keyboard layout, your name, a
username, and a password. Choose a password you'll remember — you'll use it
often, including for installing software later.

## Step 6: First boot

Remove the USB drive when prompted, and let the laptop restart. It should
boot directly into Linux Mint.

1. Connect to Wi-Fi (top-right menu) or plug in an ethernet cable.
2. Open the **Update Manager** and install all available updates. This can
   take a while on a fresh install — let it finish.
3. Restart once more after updates finish.

You now have a working Linux machine. Continue to
`06-development-machine-setup.md`.

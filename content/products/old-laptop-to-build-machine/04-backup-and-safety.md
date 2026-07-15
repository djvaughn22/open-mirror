# Backup and Safety

Read this before installing anything. Installing Linux normally **erases
everything currently on the laptop's hard drive** — the existing operating
system, programs, photos, and documents. This section makes sure nothing
important is lost.

## Step 1: Decide what's on this laptop

Think through:

- Photos or videos
- Documents, spreadsheets, or files you use
- Saved passwords in a browser
- Anything you'd be upset to lose permanently

If the honest answer is "nothing I care about," you can skip to
`05-linux-installation.md`. If there's anything at all, back it up first.

## Step 2: Back it up somewhere that isn't this laptop

Any of these work:

- **An external USB drive.** Plug it in, copy your files over by hand.
- **A cloud service you already use** (Google Drive, iCloud, OneDrive,
  Dropbox). Upload the files while the laptop still has its current system.
- **Another computer.** Copy files over a home network or a USB drive.
- **Email yourself** individual important documents, if there aren't many.

Pick at least one. Two is safer than one.

## Step 3: Write down anything you'll need again

- Wi-Fi password (check your router, or your phone's saved network settings)
- Any license keys or account logins tied only to this laptop
- Browser bookmarks, if they matter to you (most browsers can export these
  to a file, or sync them to an account)

## Step 4: Confirm the backup actually worked

Open the external drive or cloud folder and check that the files are really
there — don't just trust that the copy finished. This step catches almost
every "I thought I backed it up" story.

## What Linux installation will and won't touch

- **Will erase:** the laptop's internal drive, if you choose the
  straightforward "erase and install" option in `05-linux-installation.md`
  (this is the option this guide recommends for a dedicated build machine).
- **Will not touch:** anything on a separate external USB drive, unless you
  specifically select that drive during installation. Always double-check
  which drive is selected before confirming an install.
- **A safer alternative:** if you're not ready to erase anything yet, you
  can run Linux from the USB drive itself without installing it ("try it"
  or "live" mode), or set up dual-boot to keep the existing system
  alongside Linux. Both options are covered in `05-linux-installation.md`.

## Ready

Once anything important is backed up and confirmed, move on to
`05-linux-installation.md`.

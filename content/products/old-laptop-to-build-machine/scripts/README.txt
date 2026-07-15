SCRIPTS — Old Laptop to Build Machine

Two shell scripts for Linux Mint / Ubuntu (used in Chapter 5 of the guide).
Both are plain text — open them in any editor and read them before running.

--------------------------------------------------------------------
setup-dev-machine.sh   — installs your development tools
--------------------------------------------------------------------
Installs Git, build tools, Python, VS Code, Node.js 22 (+ npm), and the
GitHub CLI, using current official software sources.

Before it changes anything, it:
  - checks that you're on a supported Debian/Ubuntu-family system (Linux
    Mint, Ubuntu, Pop!_OS, ...) and REFUSES to run anywhere else;
  - prints exactly what it will install;
  - asks you to type "yes" to continue.

It is safe to run more than once — it checks whether each tool is already
installed before installing it, and never deletes or overwrites your files.
It writes a log to /tmp so you can see what happened if a step fails.

Run it:
    chmod +x setup-dev-machine.sh
    ./setup-dev-machine.sh

--------------------------------------------------------------------
verify-setup.sh        — checks what's installed
--------------------------------------------------------------------
Prints a plain report of which tools are present and their versions. It
changes NOTHING on your computer — safe to run any time, including before
setup, to see where you're starting from.

Run it:
    chmod +x verify-setup.sh
    ./verify-setup.sh

--------------------------------------------------------------------
What these scripts will NOT do
--------------------------------------------------------------------
  - They never touch disk partitions or erase drives.
  - They never delete or overwrite files they didn't create.
  - They never pipe an unknown internet script into your shell. The only
    downloads are official software-signing KEYS (not programs), which is
    the standard, safe way to add a trusted software source.
  - They contain no secrets or passwords.

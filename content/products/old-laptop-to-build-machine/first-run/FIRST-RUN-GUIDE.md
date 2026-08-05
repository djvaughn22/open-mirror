# Welcome to your Build Machine

This computer is prepared to help you explore ideas, build projects, and
create a real first working version. It is your computer — this guide never
takes control away from you, and nothing on the machine requires a
subscription to work.

## 1 · Make it yours

Before anything else, create your own:

- **Local username and password** — chosen by you during setup. There is no
  Open Mirror, DJ, or service login anywhere on this machine.
- **Browser profile** — Firefox starts fresh, signed into nothing.
- **Optional accounts, only when you choose them:**
  - A free GitHub account of your own (for backing up projects and putting a
    first website online).
  - AI-service accounts of your own, if you want AI help in the browser.
  - An Open Mirror account, when Open Mirror services that use one open and
    you decide they're worth it. Terms and prices are always shown before
    you sign up.

No payment information is ever stored on this machine.

## 2 · Choose where to begin

Three good starting doors — pick whichever fits today:

- **Play and Create in iDontCry** — https://idontcry.com
  Games, creative tools, and ideas worth trying. Play the arcade
  (idontcry.com/games), take on Circuit's missions, dream up artwork in the
  Dream Shop, or learn piano. No account needed.
- **Build an Idea in Step In The Ring** — https://stepinthering.com
  Take any idea and turn it into a real first build. Open the engine picker
  at stepinthering.com/engines, or start with the beginner walkthrough at
  stepinthering.com/build.
- **Open the Free Local Tools** — Visual Studio Code, Git, Node.js, Python,
  LibreOffice, and the rest. All free, all yours, no account.

## 3 · Your first project — the whole journey, small

The bridge between products is you: you carry your idea from one place to
the next. Nothing transfers automatically, and that's honest — here's the
manual path that works today:

1. Play in iDontCry until an idea shows up that makes you curious — a game
   twist, a tool, a thing your family would use.
2. Open Step In The Ring and put that idea into the right engine (the Idea
   Engine is the safe first choice: stepinthering.com/engines?engine=idea).
3. When the engine gives you a plan or starter structure, save or copy it
   into a new folder: `~/Projects/my-first-build/`.
4. Open that folder in Visual Studio Code.
5. Run it locally. For a plain website folder:
   `python3 -m http.server` in a terminal, then open
   `http://localhost:8000` in Firefox.
6. Make one visible change — a headline, a color, a sentence — save, and
   refresh the browser to see it live.
7. Go back to your Step In The Ring project for the next guided step.

Repeat step 5–7 until you have a real first working version. That's MVP1 —
not a business, not a promise, a true thing you made.

## 4 · Saving your work

- Git snapshots your project so no experiment can destroy it:
  `git init`, then `git add -A && git commit -m "first version"` inside the
  project folder.
- If you created your own GitHub account, `gh auth login` connects it —
  optional, separate, and yours.

## 5 · If something goes wrong

- The machine keeps working without any account or subscription — it is a
  normal Linux computer underneath.
- Recovery and reinstall instructions are in the included playbook's
  troubleshooting and recovery guides.
- Questions about the machine itself: ask@openmirrorllc.com with your
  machine's inventory ID (on the condition report).

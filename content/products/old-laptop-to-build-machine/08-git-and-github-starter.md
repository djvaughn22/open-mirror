# Git and GitHub Starter

## What these two things are, and how they're different

- **Git** is a program on your computer that tracks changes to your files
  over time. Every time you "commit," Git saves a snapshot you can always
  go back to. It works entirely on your own machine — no internet or
  account required.
- **GitHub** is a website that stores copies of your Git projects online,
  so you can back them up, share them, and (as you'll see in
  `10-deployment-walkthrough.md`) publish them as live websites for free.

Git is the tool. GitHub is one place to keep a copy of what it tracks.

## Step 1: Tell Git who you are

Every commit records a name and email. Run these once, with your own
details:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

You can use any name and email — it doesn't need to match anything else.
This just labels your commits.

## Step 2: Create a free GitHub account

Go to github.com and sign up. It's free for public and private
repositories. Choose a username you don't mind being visible — it'll appear
in your project URLs.

## Step 3: Sign in to GitHub from the terminal

The GitHub CLI (`gh`), installed in `06-development-machine-setup.md`, lets
you create and manage repositories without leaving the terminal.

```bash
gh auth login
```

Follow the prompts: choose **GitHub.com**, **HTTPS**, and let it open your
browser to finish signing in. This is a one-time setup per machine.

## Core Git workflow

This is the loop you'll repeat for every project, including the one in
`09-first-project-walkthrough.md`:

```bash
# 1. See what's changed
git status

# 2. Stage the changes you want to save
git add .

# 3. Save a snapshot, with a short note about what changed
git commit -m "Describe what you changed"

# 4. Send it to GitHub
git push
```

## Starting a brand-new project's Git history

Inside a project folder, for the first time:

```bash
git init
git add .
git commit -m "First commit"
```

`git init` turns the current folder into a Git repository. From here on,
Git is tracking it.

## Connecting a local project to a new GitHub repository

Using the GitHub CLI, from inside your project folder:

```bash
gh repo create my-project-name --public --source=. --push
```

This creates a new repository on GitHub named `my-project-name`, connects
your local folder to it, and pushes your first commit — all in one command.
Use `--private` instead of `--public` if you don't want it visible to
others.

## A few terms, plainly

- **Repository ("repo")** — a project folder that Git is tracking. Can live
  locally, on GitHub, or both.
- **Commit** — a saved snapshot, with a message describing it.
- **Push** — sending your local commits up to GitHub.
- **Pull** — bringing changes from GitHub down to your local machine.
- **Clone** — downloading a full copy of a GitHub repository to your
  computer for the first time.
- **Branch** — a separate line of work inside a repository. You don't need
  this yet — everything in this bundle happens on the default branch.

## Next

Continue to `09-first-project-walkthrough.md` to put this workflow to use
on a real project.

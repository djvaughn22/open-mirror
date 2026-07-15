# Git & GitHub Reference

A one-page lookup for the Git and GitHub commands used in this bundle.

## The difference

- **Git** — a program on your computer that saves snapshots of your work.
  Works with no internet or account.
- **GitHub** — a website that stores copies of your Git projects online, for
  backup, sharing, and free website hosting (GitHub Pages).

## One-time setup per machine

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
gh auth login    # choose GitHub.com, then HTTPS
```

## Starting a project's history

```bash
git init                 # turn the current folder into a Git repo
git add .                # stage everything
git commit -m "First commit"
```

## The everyday loop

```bash
git status                    # what changed since the last save
git add .                     # stage the changes to save
git commit -m "Describe it"   # save a snapshot with a note
git push                      # send snapshots up to GitHub
```

## Connecting a local project to a new GitHub repo

```bash
gh repo create my-project --public --source=. --push
```

Creates the GitHub repository, links your folder to it, and pushes — in one
command. Use `--private` to keep it hidden.

## Getting a copy of a GitHub project

```bash
gh repo clone your-username/my-project
```

## Words, plainly

| Term | Meaning |
|---|---|
| Repository ("repo") | A project folder that Git is tracking |
| Commit | A saved snapshot, with a message |
| Push | Sending your commits up to GitHub |
| Pull | Bringing changes from GitHub down to your machine |
| Clone | Downloading a full copy of a GitHub repo |
| Branch | A separate line of work (not needed for this bundle) |

## If `git push` asks for a password and rejects it

GitHub no longer accepts plain passwords here. Run `gh auth login` again and
let it finish — it sets up the right kind of access automatically.

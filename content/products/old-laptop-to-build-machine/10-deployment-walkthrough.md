# Deployment Walkthrough

"Deploying" means putting your project somewhere the public internet can
reach it — turning a folder on your laptop into a real, visitable website.
This walkthrough uses **GitHub Pages**, the simplest free option for a
static site like the Build Log from `09-first-project-walkthrough.md`: no
extra account, no payment, no configuration file. It publishes directly
from the GitHub repository you already created.

## Step 1: Turn on GitHub Pages

1. In a browser, go to your repository:
   `github.com/your-username/build-log`
2. Click **Settings** (top of the repository page).
3. In the left sidebar, click **Pages**.
4. Under "Build and deployment," set **Source** to **Deploy from a
   branch**.
5. Set **Branch** to `main` (or `master`, whichever your repository uses)
   and folder to `/ (root)`.
6. Click **Save**.

## Step 2: Wait for it to publish

GitHub takes a minute or two to build and publish the site the first time.
Refresh the Pages settings page — once it's ready, it shows a message like
"Your site is live at `https://your-username.github.io/build-log/`."

## Step 3: Visit your live site

Open that URL in a browser. You should see your Build Log page, live on
the internet, reachable by anyone with the link.

## Step 4: Make a change and publish an update

This is the part that makes it feel real: change something, and watch the
live site update.

1. Open `index.html` in VS Code and change the `<h1>` text to something of
   your own.
2. Save the file.
3. In the terminal, inside the `build-log` folder:

```bash
git add .
git commit -m "Update heading"
git push
```

4. Wait a minute, then refresh your live URL — the change is there.

That loop — edit, commit, push, see it live — is the same loop used for
every real project, no matter how big it gets.

## Where this fits with real-world projects

GitHub Pages only serves static files (HTML, CSS, JavaScript) — it doesn't
run a backend server or database. That's exactly right for this first
project. Later, larger projects that need a live backend (like a form that
emails you, or a database) use a different kind of host — see
`13-open-mirror-tools-guide.md` for where to go with a bigger idea once
you've got this working.

## Next

If anything didn't go as written, check `11-troubleshooting.md` first,
then `12-if-something-goes-wrong.md`. Otherwise, continue to
`13-open-mirror-tools-guide.md`.

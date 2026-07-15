# first-project/ — the Build Log

This is the finished version of the small website you build in **Chapter 7**
of the guide. Use it two ways:

1. **Type the files yourself** while following the guide, and compare against
   these if something misbehaves.
2. Or just open this folder's `index.html` to see the finished result.

## Running it

No build step, no server, no install needed — it's plain HTML, CSS, and
JavaScript. Open `index.html` in any browser (double-click it, or run
`xdg-open index.html` in the terminal).

## What it does

A single page with a text box and a button. Type what you just built, press
**Add entry**, and it appears at the top of a list with a timestamp. Your
entries are saved in the browser's own storage, so they're still there next
time you open the page. There's no server, database, or account — everything
lives in this one browser, on this one device.

## The three files, and what each is for

- **`index.html`** — the page's structure: a heading, the form (text box +
  button), an empty-state message, the list, and a small footer.
- **`style.css`** — how it looks: the card, colors, spacing, and a subtle
  animation when a new entry appears.
- **`script.js`** — what it does: saves each entry, reloads saved entries when
  the page opens, and redraws the list.

If you're typing them yourself and want to check your work, the exact contents
are the three files right here in this folder — open them in VS Code and read
along.

## The 13 steps this teaches (Chapters 7–9 of the guide)

1. Find and open your project folder (`cd ~/build-log`).
2. Open it in the editor (`code .`).
3. Understand the three files (above).
4. Run it locally (open `index.html` in a browser).
5. Make a visible change (edit the heading, save, reload).
6. Create a Git repository (`git init`).
7. Make the first commit (`git add .` then `git commit`).
8. Create/connect a GitHub repository (`gh repo create ... --push`).
9. Push the project (done by that same command).
10. Deploy it free (turn on GitHub Pages).
11. Change it again (edit a file).
12. Push and redeploy the update (`git add . && git commit && git push`).
13. Find the live URL later (Settings → Pages, or
    `https://your-username.github.io/build-log/`).

You finish with a live page you can send to someone.

## Make it your own

This is your project — change anything. Try editing the heading and subtitle
in `index.html`, or the colors near the top of `style.css` (the `--brand`
value controls the button and accents). Save, reload, and see your change.

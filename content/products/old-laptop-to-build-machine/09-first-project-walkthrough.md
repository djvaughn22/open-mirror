# First Project Walkthrough

You're going to build a small, real website: a **Build Log** — a single page
where you can type a note and a button adds it to a running list, saved
right in your browser. It's small on purpose. The goal isn't the project —
it's finishing the full loop: write code, run it, save it, publish it.

The finished version is in this bundle's `first-project/` folder. Use it to
check your work, but type the files yourself first — that's where the
learning happens.

## Step 1: Create a project folder

```bash
cd ~
mkdir build-log
cd build-log
```

You're now inside an empty folder called `build-log`.

## Step 2: Open it in your code editor

```bash
code .
```

This opens the current folder in VS Code. Use its file explorer (left side)
to create new files.

## Step 3: Create `index.html`

Create a file named `index.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Build Log</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main>
    <h1>My Build Log</h1>
    <p>A running log of what I've built, starting today.</p>

    <form id="log-form">
      <input type="text" id="log-input" placeholder="What did you just do?" required>
      <button type="submit">Add entry</button>
    </form>

    <ul id="log-list"></ul>
  </main>

  <script src="script.js"></script>
</body>
</html>
```

This is the page's structure: a heading, a form to type an entry, and an
empty list that will fill up with entries.

## Step 4: Create `style.css`

```css
body {
  font-family: system-ui, sans-serif;
  max-width: 560px;
  margin: 60px auto;
  padding: 0 20px;
  color: #1a1a1a;
  background: #fafafa;
}

h1 {
  margin-bottom: 4px;
}

form {
  display: flex;
  gap: 8px;
  margin: 24px 0;
}

input {
  flex: 1;
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 10px 16px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 12px;
  border-bottom: 1px solid #e5e5e5;
}

li time {
  display: block;
  font-size: 12px;
  color: #777;
}
```

## Step 5: Create `script.js`

```js
const form = document.getElementById("log-form");
const input = document.getElementById("log-input");
const list = document.getElementById("log-list");

// Load any entries already saved in this browser
const saved = JSON.parse(localStorage.getItem("buildLog") || "[]");
saved.forEach(addEntryToPage);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const entry = { text, date: new Date().toLocaleString() };
  addEntryToPage(entry);

  const all = JSON.parse(localStorage.getItem("buildLog") || "[]");
  all.push(entry);
  localStorage.setItem("buildLog", JSON.stringify(all));

  input.value = "";
});

function addEntryToPage(entry) {
  const li = document.createElement("li");
  const time = document.createElement("time");
  time.textContent = entry.date;
  li.appendChild(time);
  li.append(entry.text);
  list.prepend(li);
}
```

This saves your entries in the browser's `localStorage`, so they're still
there next time you open the page — no server or database needed for this
first project.

## Step 6: Run it locally

You don't need a server for a page this simple. In your file manager, or by
running `xdg-open index.html` from the terminal, open `index.html` directly
in a browser. Type something in the box, press "Add entry," and watch it
appear in the list.

If it doesn't work, check `11-troubleshooting.md`.

## Step 7: Save it with Git

Back in the terminal, inside the `build-log` folder:

```bash
git init
git add .
git commit -m "First commit: build log page"
```

## Step 8: Push it to GitHub

```bash
gh repo create build-log --public --source=. --push
```

Your code is now saved on GitHub, at `github.com/your-username/build-log`.

## Next

Continue to `10-deployment-walkthrough.md` to put this page live on the
internet, at a real URL.

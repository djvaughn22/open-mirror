// The Build Log — a small, real website.
// Everything runs in your browser. Entries are saved in the browser's own
// storage (localStorage), so they're still here next time you open the page.
// No server, no account, no database.

const form = document.getElementById("log-form");
const input = document.getElementById("log-input");
const list = document.getElementById("log-list");
const empty = document.getElementById("empty");
const count = document.getElementById("count");

const STORAGE_KEY = "buildLog";

// Load whatever was saved last time and show it.
let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
render();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  // Add the new entry to the front of the list and save.
  entries.unshift({ text, date: new Date().toLocaleString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

  input.value = "";
  input.focus();
  render();
});

// Draw the whole list from our saved entries.
function render() {
  list.innerHTML = "";

  for (const entry of entries) {
    const li = document.createElement("li");

    const time = document.createElement("time");
    time.textContent = entry.date;

    const text = document.createElement("div");
    text.className = "text";
    text.textContent = entry.text;

    li.appendChild(time);
    li.appendChild(text);
    list.appendChild(li);
  }

  // Show the empty message only when there are no entries.
  empty.style.display = entries.length ? "none" : "block";
  count.textContent = entries.length === 1 ? "1 entry" : `${entries.length} entries`;
}

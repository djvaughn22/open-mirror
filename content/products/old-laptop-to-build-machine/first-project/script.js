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

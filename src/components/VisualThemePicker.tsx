"use client";

import { useEffect, useState } from "react";
import type { VisualTheme } from "./VisualThemeProvider";

const STORAGE_KEY = "crossheartpray-visual-theme";

const visualThemes: { value: VisualTheme; label: string }[] = [
  { value: "classic", label: "Classic" },
  { value: "warm", label: "Calm" },
  { value: "bright", label: "Fresh" },
];

function cleanTheme(value: string | null | undefined): VisualTheme {
  if (value === "warm" || value === "bright") {
    return value;
  }

  return "classic";
}

function updateUrlTheme(theme: VisualTheme) {
  const url = new URL(window.location.href);

  if (theme === "classic") {
    url.searchParams.delete("color");
    url.searchParams.delete("theme");
  } else {
    url.searchParams.set("color", theme);
    url.searchParams.delete("theme");
  }

  window.history.replaceState(null, "", url.toString());
}

export default function VisualThemePicker() {
  const [theme, setTheme] = useState<VisualTheme>("classic");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = cleanTheme(
      params.get("color") ||
        params.get("theme") ||
        document.documentElement.dataset.chpVisualTheme ||
        window.localStorage.getItem(STORAGE_KEY),
    );

    setTheme(initial);
  }, []);

  function chooseTheme(nextTheme: VisualTheme) {
    setTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    updateUrlTheme(nextTheme);

    window.dispatchEvent(
      new CustomEvent("crossheartpray-visual-theme", {
        detail: { theme: nextTheme },
      }),
    );
  }

  return (
    <label className="flex flex-col gap-2 rounded-2xl border border-slate-700 bg-slate-900 p-3 text-left">
      <span className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-slate-400">
        Color Theme
      </span>

      <select
        value={theme}
        onChange={(event) => chooseTheme(event.target.value as VisualTheme)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold text-slate-100 outline-none"
      >
        {visualThemes.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

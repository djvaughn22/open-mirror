"use client";

import { useEffect, useState } from "react";
import { COUNTRY_COLOR_THEMES, getCountryTheme } from "../lib/countryColorThemes";

const STORAGE_KEY = "crossheartpray-country-colors";

function updateUrlTheme(code: string) {
  const url = new URL(window.location.href);

  if (code === "DEFAULT") {
    url.searchParams.delete("country");
    url.searchParams.delete("theme");
  } else {
    url.searchParams.set("country", code);
    url.searchParams.delete("theme");
  }

  window.history.replaceState(null, "", url.toString());
}

export default function CountryColorPicker() {
  const [countryCode, setCountryCode] = useState("DEFAULT");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("country") || params.get("theme");
    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    const initial = (fromUrl || fromStorage || "DEFAULT").toUpperCase();

    setCountryCode(getCountryTheme(initial).code);
  }, []);

  function chooseCountry(code: string) {
    const cleanCode = code.toUpperCase();

    setCountryCode(cleanCode);
    window.localStorage.setItem(STORAGE_KEY, cleanCode);
    updateUrlTheme(cleanCode);

    window.dispatchEvent(
      new CustomEvent("crossheartpray-country-theme", {
        detail: { code: cleanCode },
      }),
    );
  }

  return (
    <label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        Colors
      </span>

      <select
        value={countryCode}
        onChange={(event) => chooseCountry(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm font-bold text-white outline-none"
      >
        <option value="DEFAULT">CrossHeartPray Dark</option>
        {COUNTRY_COLOR_THEMES.map((theme) => (
          <option key={theme.code} value={theme.code}>
            {theme.name}
          </option>
        ))}
      </select>
    </label>
  );
}

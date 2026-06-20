"use client";

import { useEffect } from "react";
import { getCountryTheme } from "../lib/countryColorThemes";

const STORAGE_KEY = "crossheartpray-country-colors";

function applyTheme(code?: string | null) {
  const theme = getCountryTheme(code);
  const root = document.documentElement;

  root.dataset.countryTheme = theme.code;
  root.style.setProperty("--chp-country-bg", theme.background);
  root.style.setProperty("--chp-country-surface", theme.surface);
  root.style.setProperty("--chp-country-surface-soft", theme.surfaceSoft);
  root.style.setProperty("--chp-country-text", theme.text);
  root.style.setProperty("--chp-country-muted", theme.muted);
  root.style.setProperty("--chp-country-accent", theme.accent);
  root.style.setProperty("--chp-country-accent-2", theme.accent2);
  root.style.setProperty("--chp-country-border", theme.border);
}

export default function CountryColorThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get("country") || params.get("theme");
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    const theme = urlTheme || savedTheme || "DEFAULT";

    if (urlTheme) {
      window.localStorage.setItem(STORAGE_KEY, urlTheme.toUpperCase());
    }

    applyTheme(theme);

    function handleThemeChange(event: Event) {
      const customEvent = event as CustomEvent<{ code?: string }>;
      const code = customEvent.detail?.code || "DEFAULT";

      window.localStorage.setItem(STORAGE_KEY, code);
      applyTheme(code);
    }

    window.addEventListener("crossheartpray-country-theme", handleThemeChange);

    return () => {
      window.removeEventListener("crossheartpray-country-theme", handleThemeChange);
    };
  }, []);

  return <>{children}</>;
}

"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "crossheartpray-visual-theme";

export type VisualTheme = "classic" | "warm" | "bright";

function cleanTheme(value: string | null | undefined): VisualTheme {
  if (value === "warm" || value === "bright") {
    return value;
  }

  return "classic";
}

function applyTheme(theme: VisualTheme) {
  document.documentElement.dataset.chpVisualTheme = theme;
}

export default function VisualThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // The Welcome hero at "/" is the locked front door.
    // It must always keep the original CrossHeartPray dark style.
    if (pathname === "/") {
      applyTheme("classic");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const fromUrl = cleanTheme(params.get("color") || params.get("theme"));
    const fromStorage = cleanTheme(window.localStorage.getItem(STORAGE_KEY));
    const theme = params.has("color") || params.has("theme") ? fromUrl : fromStorage;

    window.localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);

    function handleThemeChange(event: Event) {
      const customEvent = event as CustomEvent<{ theme?: VisualTheme }>;
      const nextTheme = cleanTheme(customEvent.detail?.theme);

      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
    }

    window.addEventListener("crossheartpray-visual-theme", handleThemeChange);

    return () => {
      window.removeEventListener("crossheartpray-visual-theme", handleThemeChange);
    };
  }, [pathname]);

  return <>{children}</>;
}

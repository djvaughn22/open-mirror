"use client";

// ─────────────────────────────────────────────────────────────────────────────
// One quiet "Share" control for a single link. Native Web Share first (a
// cancelled share stays silent); otherwise the address is copied; if copying
// is blocked, the address itself is shown so the action always works. The
// result is announced politely. Nothing is tracked.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

export default function ShareLink({ title, text, url, label }: { title: string; text: string; url: string; label: string }) {
  const [status, setStatus] = useState("");

  async function share() {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title, text, url });
        return;
      }
    } catch (err) {
      if (err instanceof Error && (err.name === "AbortError" || /cancel|abort/i.test(err.message))) return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied.");
    } catch {
      setStatus(url);
    }
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={share}
        className="om-share-btn"
        style={{
          minHeight: 44,
          padding: "0 16px",
          borderRadius: 999,
          border: "1px solid var(--om-border)",
          background: "transparent",
          color: "#C4B5FD",
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {label}
      </button>
      <span aria-live="polite" style={{ fontSize: 12.5, fontWeight: 600, color: "#94a3b8", overflowWrap: "anywhere" }}>
        {status}
      </span>
    </span>
  );
}

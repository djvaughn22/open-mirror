"use client";

// Share the game. Copy the link, or export the card as a PNG in the browser
// (see ./exportCard.ts) — no image server, no upload, no cost.

import { useState } from "react";
import { cardToPngDataUrl } from "./exportCard";
import { SHARE_CARD_ID } from "./ShareCard";

export default function ShareActions({ url, title, fileName }: { url: string; title: string; fileName: string }) {
  const [note, setNote] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const say = (message: string) => {
    setNote(message);
    window.setTimeout(() => setNote(""), 2600);
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Cancelled or unsupported — fall through to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      say("Link copied.");
    } catch {
      say("Could not copy the link. Select the address bar instead.");
    }
  };

  const saveImage = async () => {
    const node = document.getElementById(SHARE_CARD_ID);
    if (!node) {
      say("The card is not on this page.");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await Promise.race([
        cardToPngDataUrl(node),
        new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error("timeout")), 12000)),
      ]);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${fileName}.png`;
      a.click();
      say("Image saved.");
    } catch {
      say("The image could not be created. The card is still on screen to screenshot.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={share}
          className="min-h-11 rounded-full bg-[#38bdf8] px-5 text-sm font-black text-[#0b1220] transition hover:brightness-110"
        >
          Share the game
        </button>
        <button
          type="button"
          onClick={saveImage}
          disabled={busy}
          className="min-h-11 rounded-full border border-[#26324c] bg-[#1c2740] px-5 text-sm font-black text-[#e8edf5] transition hover:brightness-125 disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save the card"}
        </button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-xs font-semibold text-[#94a3b8]">
        {note}
      </p>
    </div>
  );
}

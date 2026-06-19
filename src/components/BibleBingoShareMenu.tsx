"use client";

import { useState } from "react";

type ShareItemLabel = "board" | "card";

type BibleBingoShareMenuProps = {
  boardHref: string;
  boardUrl: string;
  shareText: string;
  emailSubject: string;
  htmlEmail?: string;
  align?: "center" | "right";
  itemLabel?: ShareItemLabel;
  buttonLabel?: string;
  iconOnly?: boolean;
  showOpenOption?: boolean;
};

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.7 6.8-4.4" />
      <path d="m8.6 13.3 6.8 4.4" />
    </svg>
  );
}

function menuPositionClass(align: BibleBingoShareMenuProps["align"]) {
  if (align === "right") {
    return "right-0";
  }

  return "left-1/2 -translate-x-1/2";
}

function shareLabels(itemLabel: ShareItemLabel) {
  if (itemLabel === "card") {
    return {
      open: "Open this card",
      text: "Text this card",
      copyLink: "Copy card link",
      copyText: "Copy post text",
      copiedLink: "Card link copied",
      copiedText: "Post text copied",
      help: "Send a card. Start a Bible conversation.",
    };
  }

  return {
    open: "Open this board",
    text: "Text 7 cards",
    copyLink: "Copy board link",
    copyText: "Copy post text",
    copiedLink: "Board link copied",
    copiedText: "Post text copied",
    help: "Ask someone: Which card should we explore?",
  };
}

export default function BibleBingoShareMenu({
  boardHref,
  boardUrl,
  shareText,
  align = "center",
  itemLabel = "board",
  buttonLabel = "Share",
  iconOnly = false,
  showOpenOption = true,
}: BibleBingoShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const labels = shareLabels(itemLabel);

  const encodedShareText = encodeURIComponent(shareText);

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("Copy failed");
      window.setTimeout(() => setCopied(""), 1800);
    }
  }

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={buttonLabel}
        className={
          iconOnly
            ? "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-emerald-50 shadow-sm transition hover:bg-black/45"
            : "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-300/10 px-5 py-2 text-sm font-bold text-emerald-50 shadow-sm transition hover:bg-emerald-300/15"
        }
      >
        <ShareIcon />
        {iconOnly ? <span className="sr-only">{buttonLabel}</span> : <span>{buttonLabel}</span>}
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute top-full z-50 mt-3 w-72 rounded-2xl border border-white/15 bg-slate-950 p-3 text-left shadow-2xl ${menuPositionClass(align)}`}
        >
          {showOpenOption ? (
            <a
              role="menuitem"
              href={boardHref}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {labels.open}
            </a>
          ) : null}

          <a
            role="menuitem"
            href={`sms:?&body=${encodedShareText}`}
            className="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            {labels.text}
          </a>

          <button
            type="button"
            role="menuitem"
            onClick={() => copyValue(boardUrl, labels.copiedLink)}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            {labels.copyLink}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => copyValue(shareText, labels.copiedText)}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            {labels.copyText}
          </button>

          <p className="px-4 pb-2 pt-1 text-xs leading-5 text-slate-400">
            {copied || labels.help}
          </p>
        </div>
      ) : null}
    </div>
  );
}

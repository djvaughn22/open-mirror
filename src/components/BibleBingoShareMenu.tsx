"use client";

import { useState } from "react";

type BibleBingoShareMenuProps = {
  boardHref: string;
  boardUrl: string;
  shareText: string;
  emailSubject: string;
  htmlEmail?: string;
  align?: "center" | "right";
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

export default function BibleBingoShareMenu({
  boardHref,
  boardUrl,
  shareText,
  emailSubject,
  htmlEmail,
  align = "center",
}: BibleBingoShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");

  const encodedShareText = encodeURIComponent(shareText);
  const encodedEmailSubject = encodeURIComponent(emailSubject);

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

  async function copyHtmlEmail() {
    if (!htmlEmail) {
      await copyValue(shareText, "Invite text copied");
      return;
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([htmlEmail], { type: "text/html" }),
          "text/plain": new Blob([shareText], { type: "text/plain" }),
        }),
      ]);

      setCopied("HTML email board copied");
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      await copyValue(shareText, "Invite text copied");
    }
  }

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-300/10 px-5 py-2 text-sm font-bold text-emerald-50 shadow-sm transition hover:bg-emerald-300/15"
      >
        <ShareIcon />
        <span>Share</span>
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute top-full z-50 mt-3 w-72 rounded-2xl border border-white/15 bg-slate-950 p-3 text-left shadow-2xl ${menuPositionClass(align)}`}
        >
          <a
            role="menuitem"
            href={boardHref}
            className="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Open live board
          </a>

          <a
            role="menuitem"
            href={`sms:?&body=${encodedShareText}`}
            className="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Text board link
          </a>

          <a
            role="menuitem"
            href={`mailto:?subject=${encodedEmailSubject}&body=${encodedShareText}`}
            className="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Email board link
          </a>

          <button
            type="button"
            role="menuitem"
            onClick={copyHtmlEmail}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            Copy HTML email board
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => copyValue(boardUrl, "Board link copied")}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            Copy board link
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => copyValue(shareText, "Invite text copied")}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            Copy invite text
          </button>

          <p className="px-4 pb-2 pt-1 text-xs leading-5 text-slate-400">
            {copied || "Use the link for text. Copy HTML email board, then paste into an email body for the rich card view."}
          </p>
        </div>
      ) : null}
    </div>
  );
}

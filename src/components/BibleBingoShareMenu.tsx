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
  return align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";
}

function shareLabels(itemLabel: ShareItemLabel) {
  const itemName = itemLabel === "card" ? "card" : "board";

  return {
    open: `Open live ${itemName}`,
    emailRendered: `Email ${itemName}`,
    copyLink: "Copy link",
    copyText: "Copy share text",
    copyEmail: `Copy email ${itemName}`,
    emailTextOnly: "Email text only",
    copiedLink: "Link copied.",
    copiedText: "Share text copied.",
    copiedHtml: `Email ${itemName} copied. Paste it into Gmail.`,
    copiedHtmlAndOpened: `Gmail opened. Paste once to add the rendered ${itemName}.`,
    help: `Email ${itemName} opens Gmail and puts the rendered email on your clipboard. Paste once in the body.`,
  };
}

export default function BibleBingoShareMenu({
  boardHref,
  boardUrl,
  shareText,
  emailSubject,
  htmlEmail,
  align = "center",
  itemLabel = "board",
  buttonLabel = "Share",
  iconOnly = false,
  showOpenOption = true,
}: BibleBingoShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const labels = shareLabels(itemLabel);

  const openHref = boardUrl || boardHref;
  const encodedShareText = encodeURIComponent(shareText);
  const encodedEmailSubject = encodeURIComponent(emailSubject);
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedEmailSubject}`;

  async function copyPlainText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 2600);
    } catch {
      setCopied("Copy failed.");
      window.setTimeout(() => setCopied(""), 2600);
    }
  }

  async function copyRichHtmlEmail(value: string, successLabel = labels.copiedHtml) {
    try {
      if ("ClipboardItem" in window && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([value], { type: "text/html" }),
            "text/plain": new Blob([shareText], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(value);
      }

      setCopied(successLabel);
      window.setTimeout(() => setCopied(""), 4200);
      return true;
    } catch {
      setCopied("Copy failed.");
      window.setTimeout(() => setCopied(""), 2600);
      return false;
    }
  }

  async function emailRenderedCardOrBoard(value: string) {
    const composeWindow = window.open("about:blank", "_blank");
    const copiedEmail = await copyRichHtmlEmail(value, labels.copiedHtmlAndOpened);

    if (!copiedEmail) {
      composeWindow?.close();
      return;
    }

    if (composeWindow) {
      composeWindow.location.href = gmailComposeUrl;
    } else {
      window.open(gmailComposeUrl, "_blank");
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
          className={`absolute top-full z-50 mt-3 w-80 rounded-2xl border border-white/15 bg-slate-950 p-3 text-left shadow-2xl ${menuPositionClass(align)}`}
        >
          {showOpenOption ? (
            <a
              role="menuitem"
              href={openHref}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {labels.open}
            </a>
          ) : null}

          {htmlEmail ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => emailRenderedCardOrBoard(htmlEmail)}
              className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-emerald-50 hover:bg-emerald-300/10"
            >
              {labels.emailRendered}
            </button>
          ) : null}

          <button
            type="button"
            role="menuitem"
            onClick={() => copyPlainText(boardUrl, labels.copiedLink)}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            {labels.copyLink}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => copyPlainText(shareText, labels.copiedText)}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            {labels.copyText}
          </button>

          {htmlEmail ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => copyRichHtmlEmail(htmlEmail)}
              className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
            >
              {labels.copyEmail}
            </button>
          ) : null}

          <a
            role="menuitem"
            href={`mailto:?subject=${encodedEmailSubject}&body=${encodedShareText}`}
            className="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            {labels.emailTextOnly}
          </a>

          <p className="px-4 pb-2 pt-1 text-xs leading-5 text-slate-400">
            {copied || labels.help}
          </p>
        </div>
      ) : null}
    </div>
  );
}

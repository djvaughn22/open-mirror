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
  const name = itemLabel === "card" ? "card" : "board";
  const titleName = itemLabel === "card" ? "Card" : "Board";

  return {
    htmlEmail: `Email ${titleName} HTML`,
    textUrl: `Text ${titleName} URL`,
    copyUrl: `Copy ${titleName} URL`,
    copiedUrl: `${titleName} URL copied`,
    copiedHtml: `${titleName} copied. Gmail opened. Click the email body and paste once.`,
    help: `Email HTML copies a Gmail-safe ${name} and opens Gmail. Click the email body and paste once. Text URL sends the link. Copy URL copies the link.`,
  };
}

function gmailComposeUrl(subject: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&tf=cm&su=${encodeURIComponent(subject)}`;
}

function mailtoFallbackUrl(subject: string, body: string) {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function plainTextWithUrl(shareText: string, boardUrl: string) {
  return shareText.includes(boardUrl) ? shareText : `${shareText}\n\n${boardUrl}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildGmailSafeHtml(subject: string, shareText: string, boardUrl: string, itemLabel: ShareItemLabel) {
  const titleName = itemLabel === "card" ? "Bible Bingo Card" : "Bible Bingo Board";
  const safeSubject = escapeHtml(subject);
  const safeUrl = escapeHtml(boardUrl);
  const safeLines = shareText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 10px 0;color:#1f2937;font-size:16px;line-height:1.55;">${escapeHtml(line)}</p>`)
    .join("");

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f8fafc;">
  <div style="border:1px solid #d1d5db;border-radius:22px;background:#ffffff;padding:28px;text-align:center;box-shadow:0 10px 30px rgba(15,23,42,0.12);">
    <div style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;font-weight:800;color:#047857;margin-bottom:12px;">${titleName}</div>
    <h1 style="margin:0 0 18px 0;color:#0f172a;font-size:24px;line-height:1.25;">${safeSubject}</h1>
    <div style="text-align:left;margin:0 auto 22px auto;max-width:470px;">
      ${safeLines}
    </div>
    <a href="${safeUrl}" style="display:inline-block;background:#065f46;color:#ffffff;text-decoration:none;font-weight:800;border-radius:999px;padding:13px 22px;">Open ${titleName}</a>
    <p style="margin:20px 0 0 0;color:#64748b;font-size:13px;line-height:1.45;">✝️ Cross ❤️ Heart 🙏 Pray</p>
  </div>
</div>`.trim();
}

async function copyRenderedHtmlToClipboard(html: string, plainText: string) {
  if (!("ClipboardItem" in window) || !navigator.clipboard.write) {
    await navigator.clipboard.writeText(plainText);
    return;
  }

  await navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([plainText], { type: "text/plain" }),
    }),
  ]);
}

export default function BibleBingoShareMenu({
  boardHref: _boardHref,
  boardUrl,
  shareText,
  emailSubject,
  htmlEmail,
  align = "center",
  itemLabel = "board",
  buttonLabel = "Share",
  iconOnly = false,
  showOpenOption: _showOpenOption = false,
}: BibleBingoShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const labels = shareLabels(itemLabel);
  const encodedBoardUrl = encodeURIComponent(boardUrl);
  const plainShareText = plainTextWithUrl(shareText, boardUrl);

  async function copyPlainText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 2600);
    } catch {
      setCopied("Copy failed");
      window.setTimeout(() => setCopied(""), 2600);
    }
  }

  async function openHtmlEmailDraft() {
    if (!htmlEmail) {
      return;
    }

    const gmailSafeHtml = buildGmailSafeHtml(emailSubject, plainShareText, boardUrl, itemLabel);

    try {
      await copyRenderedHtmlToClipboard(gmailSafeHtml, plainShareText);
      setCopied(labels.copiedHtml);
      window.setTimeout(() => setCopied(""), 5200);
    } catch {
      setCopied("Copy failed. Opening email with plain text link.");
      window.setTimeout(() => setCopied(""), 4200);
      window.location.href = mailtoFallbackUrl(emailSubject, plainShareText);
      return;
    }

    const openedWindow = window.open(gmailComposeUrl(emailSubject), "_blank", "noopener,noreferrer");

    if (!openedWindow) {
      window.location.href = mailtoFallbackUrl(emailSubject, plainShareText);
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
          {htmlEmail ? (
            <button
              type="button"
              role="menuitem"
              onClick={openHtmlEmailDraft}
              className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-emerald-50 hover:bg-emerald-300/10"
            >
              {labels.htmlEmail}
            </button>
          ) : null}

          <a
            role="menuitem"
            href={`sms:?&body=${encodedBoardUrl}`}
            className="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            {labels.textUrl}
          </a>

          <button
            type="button"
            role="menuitem"
            onClick={() => copyPlainText(boardUrl, labels.copiedUrl)}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            {labels.copyUrl}
          </button>

          <p className="px-4 pb-2 pt-1 text-xs leading-5 text-slate-400">
            {copied || labels.help}
          </p>
        </div>
      ) : null}
    </div>
  );
}

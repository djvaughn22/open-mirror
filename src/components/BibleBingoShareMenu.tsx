"use client";

import { useState, useEffect, useRef } from "react";

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
  enableSignature?: boolean;
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

function titleNameFor(itemLabel: ShareItemLabel) {
  return itemLabel === "card" ? "Card" : "Board";
}

function plainTextWithUrl(shareText: string, boardUrl: string) {
  return shareText.includes(boardUrl) ? shareText : `${shareText}\n\n${boardUrl}`;
}


function timestampLabel() {
  return new Date().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function signedShareText(shareText: string, toName: string, fromName: string) {
  const signatureLines = [
    toName.trim() ? `To: ${toName.trim()}` : "",
    fromName.trim() ? `From: ${fromName.trim()}` : "",
    `Shared: ${timestampLabel()}`,
  ].filter(Boolean);

  return `${signatureLines.join("\n")}\n\n${shareText}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function filenameSafe(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "cross-heart-pray";
}

function buildLightPrintHtml(title: string, shareText: string, boardUrl: string, itemLabel: ShareItemLabel) {
  const safeTitle = escapeHtml(title || titleNameFor(itemLabel));
  const safeKind = escapeHtml(itemLabel === "card" ? "Card" : "Board");
  const safeUrl = escapeHtml(boardUrl);
  const lines = shareText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const body = lines
    .map((line) => {
      const isUrl = /^https?:\/\//i.test(line);
      return isUrl
        ? `<p class="line url"><a href="${escapeHtml(line)}">${escapeHtml(line)}</a></p>`
        : `<p class="line">${escapeHtml(line)}</p>`;
    })
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${safeTitle}</title>
  <style>
    @page { margin: 0.45in; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #ffffff;
      color: #111827;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1.32;
    }
    .sheet {
      max-width: 760px;
      margin: 0 auto;
      padding: 0;
    }
    .brand {
      text-align: center;
      font-size: 18px;
      margin: 0 0 8px;
    }
    .kind {
      text-align: center;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin: 0 0 6px;
      color: #374151;
    }
    h1 {
      margin: 0 0 12px;
      text-align: center;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 22px;
      line-height: 1.15;
      color: #111827;
    }
    .content {
      column-count: 2;
      column-gap: 24px;
      border-top: 1px solid #d1d5db;
      border-bottom: 1px solid #d1d5db;
      padding: 12px 0;
    }
    .line {
      break-inside: avoid;
      margin: 0 0 7px;
      color: #1f2937;
    }
    .url {
      font-size: 10px;
      overflow-wrap: anywhere;
      color: #374151;
    }
    a {
      color: #111827;
      text-decoration: underline;
    }
    .footer {
      margin: 10px 0 0;
      text-align: center;
      font-size: 10px;
      color: #4b5563;
    }
    @media screen {
      body { background: #f3f4f6; padding: 24px; }
      .sheet { background: #ffffff; padding: 28px; border: 1px solid #d1d5db; }
    }
    @media print {
      .content { column-count: 2; }
    }
  </style>
</head>
<body>
  <main class="sheet">
    <p class="brand">✝️ ❤️ 🙏</p>
    <p class="kind">✝️ ❤️ 🙏 · Bible Bingo 7 · ${safeKind}</p>
    <h1>${safeTitle}</h1>
    <section class="content">${body}</section>
    <p class="footer">Open online: <a href="${safeUrl}">${safeUrl}</a></p>
  </main>
</body>
</html>`;
}

function printableDocument(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { margin: 0.45in; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      background: #ffffff !important;
      color: #111827 !important;
      font-family: Arial, Helvetica, sans-serif;
    }
    body {
      padding: 0;
    }
    a {
      color: #065f46 !important;
      text-decoration: underline;
    }
    img {
      max-width: 100%;
    }
    @media print {
      body {
        background: #ffffff !important;
      }
      div, section, article, table, tr, td {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}

function printHtml(html: string) {
  if (typeof window === "undefined") return false;

  const printWindow = window.open("", "_blank", "width=900,height=720");

  if (!printWindow) {
    return false;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  const runPrint = () => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch {
      // Keep the printable card open if the browser blocks print.
    }
  };

  printWindow.addEventListener("load", () => window.setTimeout(runPrint, 500), {
    once: true,
  });

  window.setTimeout(runPrint, 900);

  return true;
}

function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildEmailHtml(emailSubject: string, shareText: string, boardUrl: string, itemLabel: ShareItemLabel) {
  const title = itemLabel === "card" ? "Bible Bingo Card" : "Bible Bingo Board";
  const safeTitle = escapeHtml(title);
  const safeSubject = escapeHtml(emailSubject);
  const safeUrl = escapeHtml(boardUrl);
  const safeLines = shareText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 12px 0;color:#1f2937;font-size:16px;line-height:1.55;">${escapeHtml(line)}</p>`)
    .join("");

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f8fafc;">
  <div style="border:1px solid #d1d5db;border-radius:22px;background:#ffffff;padding:28px;text-align:center;">
    <div style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;font-weight:800;color:#047857;margin-bottom:12px;">${safeTitle}</div>
    <h1 style="margin:0 0 18px 0;color:#0f172a;font-size:24px;line-height:1.25;">${safeSubject}</h1>
    <div style="text-align:left;margin:0 auto 22px auto;max-width:470px;">${safeLines}</div>
    <a href="${safeUrl}" style="display:inline-block;background:#065f46;color:#ffffff;text-decoration:none;font-weight:800;border-radius:999px;padding:13px 22px;">Open ${safeTitle}</a>
    <p style="margin:20px 0 0 0;color:#64748b;font-size:13px;line-height:1.45;">✝️ ❤️ 🙏</p>
  </div>
</div>`.trim();
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

async function copyHtmlForEmail(html: string, plainText: string) {
  if (!("ClipboardItem" in window) || !navigator.clipboard.write) {
    await copyText(plainText);
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
  enableSignature = false,
}: BibleBingoShareMenuProps) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {

    if (!open) return;


    function handlePointerDown(event: PointerEvent) {

      const target = event.target;

      if (!(target instanceof Node)) return;

      if (menuRef.current?.contains(target)) return;

      setOpen(false);

    }


    function handleEscape(event: KeyboardEvent) {

      if (event.key === "Escape") {

        setOpen(false);

      }

    }


    document.addEventListener("pointerdown", handlePointerDown);

    document.addEventListener("keydown", handleEscape);


    return () => {

      document.removeEventListener("pointerdown", handlePointerDown);

      document.removeEventListener("keydown", handleEscape);

    };

  }, [open]);

  const [copied, setCopied] = useState("");
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const titleName = titleNameFor(itemLabel);
  const plainShareText = plainTextWithUrl(shareText, boardUrl);

  function shareTextForCopy() {
    return enableSignature
      ? signedShareText(plainShareText, toName, fromName)
      : plainShareText;
  }

  async function handleCopy(value: string, label: string) {
    try {
      await copyText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 2600);
    } catch {
      setCopied("Copy failed");
      window.setTimeout(() => setCopied(""), 2600);
    }
  }

  async function handleCopyHtml() {
    try {
      const textForCopy = shareTextForCopy();

      await copyHtmlForEmail(
        htmlEmail || buildEmailHtml(emailSubject, textForCopy, boardUrl, itemLabel),
        textForCopy,
      );
      setCopied("Email copied");
      window.setTimeout(() => setCopied(""), 2600);
    } catch {
      setCopied("Copy failed");
      window.setTimeout(() => setCopied(""), 2600);
    }
  }

  function lightPrintHtml() {
    return buildLightPrintHtml(emailSubject, shareTextForCopy(), boardUrl, itemLabel);
  }

  function handlePrintPdf() {
    const opened = printHtml(lightPrintHtml());
    setCopied(opened ? "Print opened" : "Print blocked");
    window.setTimeout(() => setCopied(""), 2600);
  }

  return (
    <div ref={menuRef} className="relative inline-flex">
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
        {iconOnly ? <span className="sr-only">{buttonLabel}</span> : <span>Share</span>}
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute top-full z-50 mt-3 w-72 rounded-2xl border border-white/15 bg-slate-950 p-3 text-left shadow-2xl ${menuPositionClass(align)}`}
        >
          {enableSignature ? (
            <div className="mb-2 space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                To
                <input
                  value={toName}
                  onChange={(event) => setToName(event.target.value)}
                  placeholder="Name"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-white outline-none placeholder:text-slate-500"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                From
                <input
                  value={fromName}
                  onChange={(event) => setFromName(event.target.value)}
                  placeholder="Your name"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-white outline-none placeholder:text-slate-500"
                />
              </label>

              <p className="text-xs leading-5 text-slate-500">
                Timestamp is added when copied.
              </p>
            </div>
          ) : null}

          <button
            type="button"
            role="menuitem"
            onClick={() => handleCopy(shareTextForCopy(), "Text copied")}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            Copy text
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleCopy(boardUrl, `${titleName} URL copied`)}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            Copy link
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleCopyHtml}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-emerald-50 hover:bg-emerald-300/10"
          >
            Copy email
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handlePrintPdf}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            Print / Save PDF
          </button>


          <p className="px-4 pb-2 pt-1 text-xs leading-5 text-slate-400">
            {copied || "Ready to paste."}
          </p>
        </div>
      ) : null}
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";

type ShareItemLabel = "board" | "card" | "dailyHope";

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
  if (itemLabel === "dailyHope") return "Daily Hope";
  return itemLabel === "board" ? "board" : "card";
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

// CHP unified share/export helpers start
function chpEscapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function chpEscapeAttr(value: string) {
  return chpEscapeHtml(value);
}

function chpLinkifyLine(value: string) {
  const urlPattern = /(https?:\/\/[^\s<>"']+)/g;
  return value
    .split(urlPattern)
    .map((part) => {
      if (/^https?:\/\//.test(part)) {
        const safeUrl = chpEscapeAttr(part);
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${chpEscapeHtml(part)}</a>`;
      }

      return chpEscapeHtml(part);
    })
    .join("");
}

function chpShareTextToHtml(value: string) {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${chpLinkifyLine(line)}</p>`)
    .join("\n");
}

function chpFileNameFromTitle(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) || "crossheartpray-share"
  );
}
// CHP unified share/export helpers end

function chpCleanPrintLine(value: string) {
  return value
    .replace(/https?:\/\/[^\s<>"']+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function chpShareTextToPrintHtml(value: string) {
  const lines = value
    .split(/\n+/)
    .map((line) => chpCleanPrintLine(line))
    .filter(Boolean);

  if (lines.length === 0) {
    return `<p class="line">CrossHeartPray card details.</p>`;
  }

  return lines
    .map((line) => {
      const isReference =
        /^[1-3]?\s?[A-Za-z]+(?:\s+of\s+[A-Za-z]+)?\s+\d+:\d+/.test(line) ||
        /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+\d+:\d+/.test(line);

      if (isReference) {
        return `<p class="reference">${chpEscapeHtml(line)}</p>`;
      }

      return `<p class="line">${chpEscapeHtml(line)}</p>`;
    })
    .join("\n");
}

function buildLightPrintHtml(title: string, shareText: string, boardUrl: string, itemLabel: ShareItemLabel) {
  const safeTitle = chpEscapeHtml(title || titleNameFor(itemLabel));
  const bodyHtml = chpShareTextToPrintHtml(shareText);
  const kind = chpEscapeHtml(titleNameFor(itemLabel));

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${safeTitle}</title>
  <style>
    @page { size: letter portrait; margin: 0.42in; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #ffffff;
      color: #0f172a;
      font-family: Georgia, "Times New Roman", serif;
    }
    .page {
      max-width: 780px;
      margin: 0 auto;
      padding: 22px;
    }
    .card {
      border: 2px solid #0f172a;
      border-radius: 24px;
      background: #ffffff;
      padding: 28px;
    }
    .icons {
      text-align: center;
      font-size: 28px;
      letter-spacing: 0.18em;
      margin: 0 0 8px;
    }
    .kind {
      text-align: center;
      margin: 0 0 8px;
      color: #334155;
      font: 900 11px Arial, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.16em;
    }
    h1 {
      margin: 0 0 18px;
      text-align: center;
      font-size: 30px;
      line-height: 1.08;
    }
    .content {
      display: grid;
      gap: 10px;
      border-top: 1px solid #cbd5e1;
      border-bottom: 1px solid #cbd5e1;
      padding: 18px 0;
    }
    .line,
    .reference {
      margin: 0;
      font-size: 17px;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    .reference {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #334155;
    }
    .footer {
      margin: 16px 0 0;
      text-align: center;
      color: #475569;
      font: 800 11px Arial, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    @media screen {
      body { background: #f8fafc; padding: 22px; }
      .card { box-shadow: 0 12px 30px rgba(15, 23, 42, 0.10); }
    }
    @media print {
      body { background: #ffffff; }
      .page { padding: 0; }
      .card { box-shadow: none; }
    }
  </style>
</head>
<body>
  <main class="page">
    <article class="card">
      <div class="icons">✝️ ❤️ 🙏</div>
      <p class="kind">CrossHeartPray · ${kind}</p>
      <h1>${safeTitle}</h1>
      <section class="content">${bodyHtml}</section>
      <p class="footer">Cross Heart Pray your way through it.</p>
    </article>
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
  const safeSubject = chpEscapeHtml(emailSubject);
  const safeBoardUrl = chpEscapeAttr(boardUrl);
  const safeKind = chpEscapeHtml(titleNameFor(itemLabel));
  const bodyHtml = chpShareTextToHtml(shareText);

  return `<div style="font-family: Georgia, 'Times New Roman', serif; color: #0f172a; background: #f8fafc; padding: 24px;">
  <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 2px solid #0f172a; border-radius: 24px; padding: 28px;">
    <div style="text-align: center; font-size: 28px; letter-spacing: 8px;">✝️ ❤️ 🙏</div>
    <p style="text-align: center; margin: 10px 0; color: #334155; font: 800 12px Arial, sans-serif; text-transform: uppercase; letter-spacing: 1.6px;">CrossHeartPray · ${safeKind}</p>
    <h1 style="margin: 0 0 18px; text-align: center; font-size: 28px; line-height: 1.1;">${safeSubject}</h1>
    <div style="font-size: 18px; line-height: 1.55;">${bodyHtml}</div>
    <p style="margin-top: 22px; text-align: center;">
      <a href="${safeBoardUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; border: 1px solid #0f172a; border-radius: 999px; padding: 12px 18px; color: #0f172a; font: 900 12px Arial, sans-serif; text-transform: uppercase; letter-spacing: 1.4px; text-decoration: none;">Open and Explore</a>
      <a href="https://www.crossheartpray.com/bible-reading-plan" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-left: 8px; border: 1px solid #0f172a; border-radius: 999px; padding: 12px 18px; color: #0f172a; font: 900 12px Arial, sans-serif; text-transform: uppercase; letter-spacing: 1.4px; text-decoration: none;">Read Plan</a>
    </p>
    <p style="text-align: center; color: #475569; font: 700 12px Arial, sans-serif;">Cross Heart Pray your way through it.</p>
  </div>
</div>`;
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

function handleDownloadHtml() {
  downloadHtml(`${chpFileNameFromTitle(emailSubject)}.html`, lightPrintHtml());
  setCopied("HTML downloaded");
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
        {iconOnly ? <span className="sr-only">{buttonLabel}</span> : <span>{buttonLabel}</span>}
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
            {itemLabel === "dailyHope" ? "Copy full Daily Hope" : `Copy full ${titleName}`}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleCopy(boardUrl, `${titleName} URL copied`)}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            {itemLabel === "dailyHope" ? "Copy Daily Hope link" : `Copy ${titleName} link`}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleCopyHtml}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-emerald-50 hover:bg-emerald-300/10"
          >
            {itemLabel === "dailyHope" ? "Copy full Daily Hope email" : `Copy full email ${titleName}`}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handlePrintPdf}
            className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            {itemLabel === "dailyHope" ? "Print full Daily Hope / Save PDF" : `Print full ${titleName} / Save PDF`}
          </button>


          <p className="px-4 pb-2 pt-1 text-xs leading-5 text-slate-400">
            {copied || "Ready to paste with clickable links."}
          </p>
        </div>
      ) : null}
    </div>
  );
}

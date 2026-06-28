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

function chpDownloadLineHtml(value: string) {
  const clean = value
    .replace(/https?:\/\/[^\s<>"']+/g, "")
    .replace(/\bOpen online:\s*/gi, "")
    .replace(/\bOpen:\s*/gi, "")
    .replace(/\bURL:\s*/gi, "")
    .replace(/\bLink:\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return "";

  const isReference = /^[1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)?\s+\d+(?::\d+)?/.test(clean);
  const isDetail = /^(to:|from:|shared:|section:|lane:|week:|day:|daily hope|prayer|verse|card|board)/i.test(clean);
  const className = isReference ? "reference" : isDetail ? "detail" : clean.length > 95 ? "main" : "line";

  return `<p class="${className}">${chpEscapeHtml(clean)}</p>`;
}

function chpFullDetailsHtml(value: string) {
  const html = value
    .split(/\n+/)
    .map((line) => chpDownloadLineHtml(line))
    .filter(Boolean)
    .join("\n");

  return html || `<p class="line">CrossHeartPray details.</p>`;
}


function chpPrettyCardLines(value: string) {
  return value
    .split(/\n+/)
    .map((line) =>
      line
        .replace(/\bOpen online:\s*/gi, "")
        .replace(/\bOpen:\s*/gi, "")
        .replace(/\bURL:\s*/gi, "")
        .replace(/\bLink:\s*/gi, "")
        .trim()
    )
    .filter(Boolean);
}

function chpPrettyCardsHtml(value: string, allowLinks: boolean) {
  const rawLines = chpPrettyCardLines(value);
  const cardBlocks: string[][] = [];
  let current: string[] = [];

  for (const line of rawLines) {
    const startsNewCard =
      /^(card\s+\d+|verse card|prayer card|daily hope|sinner prayer|salvation prayer|live in the moment prayer)/i.test(line) ||
      (/^[1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)?\s+\d+:\d+/.test(line) && current.length > 2);

    if (startsNewCard && current.length) {
      cardBlocks.push(current);
      current = [];
    }

    current.push(line);
  }

  if (current.length) cardBlocks.push(current);
  if (!cardBlocks.length) cardBlocks.push(["CrossHeartPray card details."]);

  return cardBlocks
    .map((lines) => {
      const body = lines
        .map((line) => {
          const cleanForClass = line.replace(/https?:\/\/[^\s<>"']+/g, "").trim();
          if (!cleanForClass) return "";

          const isReference = /^[1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)?\s+\d+(?::\d+)?/.test(cleanForClass);
          const isMeta = /^(to:|from:|shared:|section:|lane:|week:|day:|card\s+\d+|daily hope|prayer card|verse card|board)/i.test(cleanForClass);
          const className = isReference ? "reference" : isMeta ? "meta" : cleanForClass.length > 90 ? "verse" : "line";

          const html = allowLinks ? chpLinkifyLine(line) : chpEscapeHtml(cleanForClass);
          return `<p class="${className}">${html}</p>`;
        })
        .filter(Boolean)
        .join("\n");

      return `<article class="pretty-card">${body}</article>`;
    })
    .join("\n");
}

function chpPrettyCardCss() {
  return `
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #f8fafc;
      color: #0f172a;
      font-family: Georgia, "Times New Roman", serif;
    }
    .page {
      max-width: 880px;
      margin: 0 auto;
      padding: 22px;
    }
    .shell {
      border: 2px solid #0f172a;
      border-radius: 28px;
      background: #ffffff;
      padding: 24px;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
    }
    .icons {
      text-align: center;
      font-size: 28px;
      letter-spacing: 0.18em;
      margin-bottom: 8px;
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
    .cards {
      display: grid;
      gap: 14px;
    }
    .pretty-card {
      break-inside: avoid;
      border: 1px solid #cbd5e1;
      border-radius: 22px;
      background: #ffffff;
      padding: 18px;
      box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
    }
    p {
      margin: 0 0 8px;
      overflow-wrap: anywhere;
    }
    p:last-child { margin-bottom: 0; }
    .reference {
      color: #065f46;
      font: 900 14px Arial, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .meta {
      color: #475569;
      font: 900 11px Arial, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    .verse {
      color: #0f172a;
      font-size: 19px;
      line-height: 1.52;
    }
    .line {
      color: #0f172a;
      font-size: 16px;
      line-height: 1.45;
    }
    a {
      color: #065f46;
      font-weight: 900;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .footer {
      margin-top: 16px;
      text-align: center;
      color: #475569;
      font: 800 11px Arial, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    @media print {
      @page { size: letter portrait; margin: 0.38in; }
      body { background: #ffffff; }
      .page { padding: 0; }
      .shell, .pretty-card { box-shadow: none; }
    }
  `;
}



function chpPrettyExportExtractUrls(value: string) {
  return value.match(/https?:\/\/[^\s<>"']+/g) ?? [];
}

function chpPrettyExportCleanText(value: string) {
  return value
    .replace(/https?:\/\/[^\s<>"']+/g, "")
    .replace(/\bOpen online:\s*/gi, "")
    .replace(/\bOpen:\s*/gi, "")
    .replace(/\bURL:\s*/gi, "")
    .replace(/\bLink:\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function chpPrettyExportLineKind(value: string) {
  if (/^[1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)?\s+\d+(?::\d+)?(?:[-–]\d+)?/.test(value)) {
    return "reference";
  }

  if (/^(card\s+\d+|verse card|prayer card|daily hope|sinner prayer|salvation prayer|live in the moment prayer|board)/i.test(value)) {
    return "heading";
  }

  if (/^(to:|from:|shared:|section:|lane:|week:|day:|date:)/i.test(value)) {
    return "meta";
  }

  if (value.length > 90) {
    return "main";
  }

  return "line";
}

function chpPrettyExportSplitCards(value: string) {
  const rawLines = value.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const globalLines: string[] = [];
  const cards: Array<{ lines: string[]; links: string[] }> = [];
  let current: { lines: string[]; links: string[] } = { lines: [], links: [] };
  let startedCards = false;

  const flush = () => {
    if (current.lines.length || current.links.length) {
      cards.push(current);
      current = { lines: [], links: [] };
    }
  };

  for (const rawLine of rawLines) {
    const urls = chpPrettyExportExtractUrls(rawLine);
    const clean = chpPrettyExportCleanText(rawLine);

    const isGlobal =
      !startedCards &&
      /^(to:|from:|shared:|date:|crossheartpray|cross heart pray|bible bingo 7)$/i.test(clean);

    if (isGlobal) {
      if (clean) globalLines.push(clean);
      continue;
    }

    const startsCard =
      /^(card\s+\d+|verse card|prayer card|daily hope|sinner prayer|salvation prayer|live in the moment prayer|board)/i.test(clean) ||
      /^[1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)?\s+\d+(?::\d+)?(?:[-–]\d+)?/.test(clean);

    if (startsCard && startedCards && (current.lines.length || current.links.length)) {
      flush();
    }

    startedCards = true;

    if (clean) current.lines.push(clean);
    for (const url of urls) current.links.push(url);
  }

  flush();

  if (!cards.length) {
    cards.push({
      lines: globalLines.length ? globalLines : ["CrossHeartPray card details."],
      links: [],
    });
    return { globalLines: [], cards };
  }

  return { globalLines, cards };
}

function chpPrettyExportParagraph(value: string, allowLinks: boolean) {
  const kind = chpPrettyExportLineKind(value);
  const html = allowLinks ? chpLinkifyLine(value) : chpEscapeHtml(value);

  const styleByKind: Record<string, string> = {
    heading: "margin:0 0 8px;color:#065f46;font:900 13px Arial,sans-serif;text-transform:uppercase;letter-spacing:1.4px;",
    reference: "margin:0 0 8px;color:#065f46;font:900 14px Arial,sans-serif;text-transform:uppercase;letter-spacing:1.2px;",
    meta: "margin:0 0 8px;color:#475569;font:900 11px Arial,sans-serif;text-transform:uppercase;letter-spacing:1.2px;",
    main: "margin:0 0 10px;color:#0f172a;font-size:19px;line-height:1.52;",
    line: "margin:0 0 9px;color:#0f172a;font-size:16px;line-height:1.45;",
  };

  return `<p class="${kind}" style="${styleByKind[kind] ?? styleByKind.line}">${html}</p>`;
}

function chpPrettyExportCardsHtml(value: string, allowLinks: boolean) {
  const { globalLines, cards } = chpPrettyExportSplitCards(value);

  const globalHtml = globalLines.length
    ? `<div class="share-meta" style="margin:0 0 14px;padding:12px 14px;border:1px solid #cbd5e1;border-radius:18px;background:#f8fafc;">${globalLines
        .map((line) => chpPrettyExportParagraph(line, allowLinks))
        .join("")}</div>`
    : "";

  const cardsHtml = cards
    .map((card, index) => {
      const body = card.lines.map((line) => chpPrettyExportParagraph(line, allowLinks)).join("");

      const uniqueLinks = Array.from(new Set(card.links));
      const linksHtml = uniqueLinks.length
        ? `<div class="card-links" style="margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;">${uniqueLinks
            .map((url) => {
              const safeUrl = chpEscapeAttr(url);
              return `<p style="margin:0 0 7px;color:#475569;font:800 11px Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;">Open source: <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="color:#065f46;font-weight:900;text-decoration:underline;text-underline-offset:3px;">${chpEscapeHtml(url)}</a></p>`;
            })
            .join("")}</div>`
        : "";

      return `<article class="pretty-card" style="break-inside:avoid;margin:0 0 14px;border:1px solid #cbd5e1;border-radius:22px;background:#ffffff;padding:18px;box-shadow:0 8px 22px rgba(15,23,42,0.08);">
        <div style="margin:0 0 10px;color:#94a3b8;font:900 10px Arial,sans-serif;text-transform:uppercase;letter-spacing:1.4px;">${cards.length > 1 ? `Card ${index + 1}` : "Card"}</div>
        ${body}
        ${linksHtml}
      </article>`;
    })
    .join("");

  return `${globalHtml}<div class="cards">${cardsHtml}</div>`;
}

function chpPrettyExportCss() {
  return `
    @page { size: letter portrait; margin: 0.38in; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #f8fafc;
      color: #0f172a;
      font-family: Georgia, "Times New Roman", serif;
    }
    .page {
      max-width: 880px;
      margin: 0 auto;
      padding: 22px;
    }
    .shell {
      border: 2px solid #0f172a;
      border-radius: 28px;
      background: #ffffff;
      padding: 24px;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
    }
    .icons {
      text-align: center;
      font-size: 28px;
      letter-spacing: 0.18em;
      margin-bottom: 8px;
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
    a {
      color: #065f46;
      font-weight: 900;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .footer {
      margin-top: 16px;
      text-align: center;
      color: #475569;
      font: 800 11px Arial, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    @media print {
      body { background: #ffffff; }
      .page { padding: 0; }
      .shell, .pretty-card { box-shadow: none !important; }
    }
  `;
}


function buildLightPrintHtml(title: string, shareText: string, boardUrl: string, itemLabel: ShareItemLabel) {
  const safeTitle = chpEscapeHtml(title || titleNameFor(itemLabel));
  const kind = chpEscapeHtml(titleNameFor(itemLabel));
  const cardsHtml = chpPrettyExportCardsHtml(shareText, true);
  void boardUrl;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${safeTitle}</title>
  <style>${chpPrettyExportCss()}</style>
</head>
<body>
  <main class="page">
    <section class="shell">
      <div class="icons">✝️ ❤️ 🙏</div>
      <p class="kind">CrossHeartPray · ${kind}</p>
      <h1>${safeTitle}</h1>
      ${cardsHtml}
      <p class="footer">Cross Heart Pray your way through it.</p>
    </section>
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
  const safeKind = chpEscapeHtml(titleNameFor(itemLabel));
  const cardsHtml = chpPrettyExportCardsHtml(shareText, true);
  void boardUrl;

  return `<div style="font-family:Georgia,'Times New Roman',serif;color:#0f172a;background:#f8fafc;padding:22px;">
  <div style="max-width:780px;margin:0 auto;background:#ffffff;border:2px solid #0f172a;border-radius:28px;padding:24px;">
    <div style="text-align:center;font-size:28px;letter-spacing:8px;">✝️ ❤️ 🙏</div>
    <p style="text-align:center;margin:8px 0;color:#334155;font:900 11px Arial,sans-serif;text-transform:uppercase;letter-spacing:1.6px;">CrossHeartPray · ${safeKind}</p>
    <h1 style="margin:0 0 18px;text-align:center;font-size:30px;line-height:1.08;">${safeSubject}</h1>
    ${cardsHtml}
    <p style="margin-top:16px;text-align:center;color:#475569;font:800 11px Arial,sans-serif;text-transform:uppercase;letter-spacing:1.3px;">Cross Heart Pray your way through it.</p>
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

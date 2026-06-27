export type ChpStaticHtmlExportOptions = {
  title?: string;
  fileName?: string;
  rootSelector?: string;
};

const REMOVE_SELECTORS = [
  "script",
  "noscript",
  "iframe",
  "button",
  "input",
  "textarea",
  "select",
  "nav",
  "header",
  "footer",
  "[data-chp-no-export]",
  ".print\\:hidden",
  ".chp-no-print",
  ".chp-share-menu",
].join(",");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function makeSafeFileName(value: string): string {
  const safe = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

  return safe || "cross-heart-pray-cards";
}

function stripUrlsFromText(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  while (walker.nextNode()) {
    if (walker.currentNode instanceof Text) nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    node.textContent = (node.textContent || "")
      .replace(/https?:\/\/\S+/gi, "")
      .replace(/\s+\)/g, ")")
      .replace(/\s{2,}/g, " ");
  });
}

function cleanClone(source: Element): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;

  clone.querySelectorAll(REMOVE_SELECTORS).forEach((node) => node.remove());

  clone.querySelectorAll("details").forEach((node) => {
    node.setAttribute("open", "");
  });

  clone.querySelectorAll("a").forEach((anchor) => {
    const span = document.createElement("span");
    span.innerHTML = anchor.innerHTML || anchor.textContent || "";
    anchor.replaceWith(span);
  });

  clone.querySelectorAll("*").forEach((node) => {
    Array.from(node.attributes).forEach((attr) => {
      if (
        attr.name === "href" ||
        attr.name === "target" ||
        attr.name === "rel" ||
        attr.name.startsWith("on")
      ) {
        node.removeAttribute(attr.name);
      }
    });
  });

  stripUrlsFromText(clone);
  return clone;
}

function buildChpStaticHtml(options: ChpStaticHtmlExportOptions = {}): string {
  const source =
    (options.rootSelector ? document.querySelector(options.rootSelector) : null) ||
    document.querySelector("[data-chp-export-root]") ||
    document.querySelector("main") ||
    document.body;

  const title = options.title || document.title || "Cross Heart Pray";
  const clone = cleanClone(source);

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
  @page { margin: 0.5in; }
  html, body {
    margin: 0;
    background: #ffffff;
    color: #000000;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  body { padding: 24px; }
  * {
    color: #000000 !important;
    background: transparent !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  a, span { text-decoration: none !important; }
  img { max-width: 100%; }
  article, section, table, tr, [class*="card"], [class*="rounded"], [class*="border"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .chp-export-shell {
    max-width: 860px;
    margin: 0 auto;
  }
  .chp-export-shell > * + * { margin-top: 16px; }
  h1, h2, h3, p { margin-top: 0; }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #000;
    padding: 8px;
    vertical-align: top;
  }
  button, nav, header, footer, input, textarea, select, iframe, script, noscript {
    display: none !important;
  }
</style>
</head>
<body>
  <main class="chp-export-shell">
    ${clone.innerHTML}
  </main>
</body>
</html>`;
}

export function downloadChpStaticHtml(options: ChpStaticHtmlExportOptions = {}) {
  const html = buildChpStaticHtml(options)
    .replace(/\s+href=(["']).*?\1/gi, "")
    .replace(/https?:\/\/[^\s<>"']+/gi, "");

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const baseName = makeSafeFileName(options.fileName || options.title || document.title || "cross-heart-pray-cards");

  link.href = url;
  link.download = `${baseName}.html`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

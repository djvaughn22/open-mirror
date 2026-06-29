"use client";

import { useEffect } from "react";

type ShareOptions = {
  title: string;
  fileBase: string;
  heading: string;
  subheading: string;
};

function norm(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "cross-heart-pray"
  );
}

function supportedPath() {
  const path = window.location.pathname;
  return path.includes("/daily-hope") || path.includes("/explorebible") || path.includes("/bible-bingo");
}

function isShareClick(action: HTMLElement) {
  const label = norm(
    [
      action.innerText || "",
      action.textContent || "",
      action.getAttribute("aria-label") || "",
      action.getAttribute("title") || "",
    ].join(" ")
  );

  if (!label) return false;
  if (label.includes("share") || label.includes("email") || label.includes("copy html")) return true;
  return false;
}

function optionsFor(action: HTMLElement): ShareOptions {
  const path = window.location.pathname;
  const label = norm(action.innerText || action.textContent || "");

  if (path.includes("/daily-hope")) {
    const stack = label.includes("stack") || label.includes("all");
    return {
      title: stack ? "Daily Hope Card Stack" : "Daily Hope Card",
      fileBase: stack ? "daily-hope-card-stack" : "daily-hope-card",
      heading: "Daily Hope",
      subheading: stack ? "FULL PRAYER CARD STACK" : "PRAYER CARD",
    };
  }

  const focused = label.includes("card") || window.location.href.includes("card=");
  return {
    title: focused ? "Bible Bingo Card" : "Bible Bingo Board",
    fileBase: focused ? "bible-bingo-card" : "bible-bingo-board",
    heading: "Bible Bingo",
    subheading: focused ? "FOCUSED CARD" : "FULL BOARD",
  };
}

function bestShareRoot(action: HTMLElement) {
  const explicit =
    action.closest<HTMLElement>("[data-render-share-root]") ||
    document.querySelector<HTMLElement>("[data-render-share-root]");
  if (explicit) return explicit;

  const main = document.querySelector<HTMLElement>("main");
  const candidates: HTMLElement[] = [];

  let node: HTMLElement | null = action;
  while (node && node !== document.body) {
    const textLength = (node.textContent || "").replace(/\s+/g, " ").trim().length;
    if (textLength > 80) candidates.push(node);
    if (main && node === main) break;
    node = node.parentElement;
  }

  const cardish = candidates.find((el) => {
    const tag = el.tagName.toLowerCase();
    const cls = el.className ? String(el.className).toLowerCase() : "";
    return tag === "article" || tag === "section" || cls.includes("card") || cls.includes("board");
  });

  if (cardish) return cardish;
  if (main) return main;
  return document.body;
}

function stripNoise(root: HTMLElement) {
  root.querySelectorAll("script,style,button,input,textarea,select,nav,form,svg,video,audio,[role='button'],[role='dialog']").forEach((el) => el.remove());

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  const noise = [
    /ShareHTML copies complete formatted content and opens text\/email\.?/gi,
    /URL copies link only\.?/gi,
    /copies complete formatted content/gi,
    /opens text\/email/gi,
    /copy html/gi,
    /share html/gi,
    /share card/gi,
    /share board/gi,
    /share stack/gi,
    /open board/gi,
    /back to all 7/gi,
    /print \/ save pdf/gi,
  ];

  textNodes.forEach((node) => {
    let value = node.nodeValue || "";
    noise.forEach((pattern) => {
      value = value.replace(pattern, "");
    });
    node.nodeValue = value;
  });

  root.querySelectorAll<HTMLElement>("a").forEach((a) => {
    const text = norm(a.textContent || "");
    if (!text || /^[smtwtfs]$/.test(text) || text === "today" || text === "expand all days") {
      a.remove();
      return;
    }
    a.removeAttribute("class");
    a.removeAttribute("id");
    a.style.color = "#315c49";
    a.style.textDecoration = "underline";
    a.style.wordBreak = "break-word";
  });

  Array.from(root.querySelectorAll<HTMLElement>("*"))
    .reverse()
    .forEach((el) => {
      const text = (el.textContent || "").replace(/\s+/g, "").trim();
      if (!text && el.children.length === 0 && el.tagName.toLowerCase() !== "br") el.remove();
    });
}

function cleanElement(el: HTMLElement, depth = 0) {
  const tag = el.tagName.toLowerCase();

  el.removeAttribute("class");
  el.removeAttribute("id");
  el.removeAttribute("style");

  el.style.boxSizing = "border-box";
  el.style.maxWidth = "100%";
  el.style.writingMode = "horizontal-tb";
  el.style.textOrientation = "mixed";
  el.style.overflowWrap = "break-word";
  el.style.wordBreak = "normal";
  el.style.whiteSpace = "normal";
  el.style.color = "#2f3437";
  el.style.fontFamily = "Arial, Helvetica, sans-serif";
  el.style.lineHeight = "1.45";

  if (tag === "h1") {
    el.style.fontSize = "42px";
    el.style.fontWeight = "900";
    el.style.margin = "0 0 14px 0";
  } else if (tag === "h2") {
    el.style.fontSize = "30px";
    el.style.fontWeight = "900";
    el.style.margin = "0 0 12px 0";
  } else if (tag === "h3") {
    el.style.fontSize = "22px";
    el.style.fontWeight = "900";
    el.style.margin = "18px 0 8px 0";
  } else if (tag === "p" || tag === "li") {
    el.style.fontSize = "18px";
    el.style.margin = "0 0 12px 0";
  } else if (tag === "strong" || tag === "b") {
    el.style.fontWeight = "900";
  } else if (tag === "em" || tag === "i") {
    el.style.fontStyle = "italic";
  } else if (tag === "small") {
    el.style.fontSize = "13px";
    el.style.letterSpacing = "1px";
  }

  const textLength = (el.textContent || "").replace(/\s+/g, " ").trim().length;
  const cardish =
    depth <= 2 &&
    textLength > 70 &&
    (tag === "article" ||
      tag === "section" ||
      tag === "div" ||
      tag === "main");

  if (cardish && depth > 0) {
    el.style.background = "#dff1fb";
    el.style.border = "2px solid #b8e1d5";
    el.style.borderRadius = "28px";
    el.style.padding = "24px";
    el.style.margin = "0 0 22px 0";
    el.style.boxShadow = "0 10px 24px rgba(34, 54, 62, 0.10)";
  }

  Array.from(el.children).forEach((child) => {
    if (child instanceof HTMLElement) cleanElement(child, depth + 1);
  });
}

function buildCleanHtml(source: HTMLElement, options: ShareOptions) {
  const clone = source.cloneNode(true) as HTMLElement;
  stripNoise(clone);
  cleanElement(clone, 0);

  clone.style.width = "100%";
  clone.style.maxWidth = "720px";
  clone.style.margin = "0 auto";

  const plainText = (clone.textContent || options.title)
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  const html = `
<div xmlns="http://www.w3.org/1999/xhtml" style="background:#eef7ff;color:#2f3437;font-family:Arial,Helvetica,sans-serif;padding:34px;width:760px;max-width:100%;box-sizing:border-box;">
  <div style="max-width:720px;margin:0 auto 26px auto;">
    <div style="font-size:38px;line-height:1.1;margin-bottom:12px;">✝️ ❤️ 🙏</div>
    <div style="color:#456f59;font-size:18px;font-weight:900;letter-spacing:8px;margin-bottom:10px;">CROSS HEART PRAY</div>
    <div style="color:#2f3437;font-size:52px;font-weight:900;line-height:1.05;margin-bottom:12px;">${escapeHtml(options.heading)}</div>
    <div style="color:#456f59;font-size:20px;font-weight:900;letter-spacing:6px;">${escapeHtml(options.subheading)}</div>
  </div>
  ${clone.outerHTML}
</div>`.trim();

  return { html, plainText };
}

async function makePng(html: string, fileBase: string) {
  const width = 760;
  const temp = document.createElement("div");
  temp.style.position = "fixed";
  temp.style.left = "-10000px";
  temp.style.top = "0";
  temp.innerHTML = html;
  document.body.appendChild(temp);

  const height = Math.min(16000, Math.max(620, Math.ceil((temp.firstElementChild as HTMLElement)?.scrollHeight || 900)));
  temp.remove();

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <foreignObject x="0" y="0" width="100%" height="100%">
    ${html}
  </foreignObject>
</svg>`.trim();

  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  const img = new Image();

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Rendered image failed."));
    img.src = url;
  });

  const scale = Math.min(2, window.devicePixelRatio || 2);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable.");

  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(url);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
  if (!blob) throw new Error("PNG failed.");

  return new File([blob], `${slugify(fileBase)}.png`, { type: "image/png" });
}

async function copyPretty(html: string, plainText: string, pngFile?: File) {
  const ClipboardItemCtor = window.ClipboardItem;

  if (navigator.clipboard?.write && ClipboardItemCtor) {
    if (pngFile) {
      try {
        await navigator.clipboard.write([
          new ClipboardItemCtor({
            "image/png": pngFile,
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plainText], { type: "text/plain" }),
          }),
        ]);
        return;
      } catch {
        /* try html next */
      }
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItemCtor({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plainText], { type: "text/plain" }),
        }),
      ]);
      return;
    } catch {
      /* execCommand fallback next */
    }
  }

  const temp = document.createElement("div");
  temp.contentEditable = "true";
  temp.style.position = "fixed";
  temp.style.left = "-10000px";
  temp.style.top = "0";
  temp.innerHTML = html;
  document.body.appendChild(temp);

  const range = document.createRange();
  range.selectNodeContents(temp);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  document.execCommand("copy");
  selection?.removeAllRanges();
  temp.remove();
}

async function doRenderedShare(action: HTMLElement) {
  const options = optionsFor(action);
  const root = bestShareRoot(action);
  const clean = buildCleanHtml(root, options);

  let pngFile: File | undefined;

  try {
    pngFile = await makePng(clean.html, options.fileBase);
  } catch {
    pngFile = undefined;
  }

  const nav = navigator as Navigator & {
    canShare?: (data: { files?: File[] }) => boolean;
    share?: (data: { title?: string; text?: string; files?: File[] }) => Promise<void>;
  };

  if (pngFile && nav.share && (!nav.canShare || nav.canShare({ files: [pngFile] }))) {
    try {
      await nav.share({ title: options.title, files: [pngFile] });
      return;
    } catch {
      /* copy fallback */
    }
  }

  await copyPretty(clean.html, clean.plainText, pngFile);

  const old = document.title;
  document.title = `${options.title} copied`;
  window.setTimeout(() => {
    document.title = old;
  }, 1800);
}

export default function RenderedShareInterceptor() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!supportedPath()) return;

      const target = event.target as HTMLElement | null;
      const action = target?.closest<HTMLElement>("button,a,[role='button']");
      if (!action || !isShareClick(action)) return;

      event.preventDefault();
      event.stopPropagation();
      (event as any).stopImmediatePropagation?.();

      void doRenderedShare(action);
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}

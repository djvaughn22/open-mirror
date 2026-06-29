"use client";

import { useEffect, useState } from "react";

type ShareOptions = {
  title: string;
  fileBase: string;
  heading: string;
  subheading: string;
  kind: "daily-hope" | "bible-bingo-board" | "bible-bingo-card";
};

type ShareContext = {
  root: HTMLElement;
  options: ShareOptions;
  url: string;
};

function norm(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function getActionLabel(action: HTMLElement) {
  return norm(
    [
      action.innerText || "",
      action.textContent || "",
      action.getAttribute("aria-label") || "",
      action.getAttribute("title") || "",
    ].join(" ")
  );
}

function isShareTrigger(action: HTMLElement) {
  const label = getActionLabel(action);
  if (!label) return false;
  if (label.includes("share")) return true;
  if (label.includes("email")) return true;
  if (label.includes("text")) return true;
  if (label.includes("copy html")) return true;
  return false;
}

function optionsFor(action: HTMLElement): ShareOptions {
  const path = window.location.pathname;
  const label = getActionLabel(action);
  const href = window.location.href.toLowerCase();

  if (path.includes("/daily-hope")) {
    const stack = label.includes("stack") || label.includes("all");
    return {
      title: stack ? "Daily Hope Card Stack" : "Daily Hope Card",
      fileBase: stack ? "daily-hope-card-stack" : "daily-hope-card",
      heading: "Daily Hope",
      subheading: stack ? "FULL PRAYER CARD STACK" : "PRAYER CARD",
      kind: "daily-hope",
    };
  }

  const focused = label.includes("card") || href.includes("card=");
  return {
    title: focused ? "Bible Bingo Card" : "Bible Bingo Board",
    fileBase: focused ? "bible-bingo-card" : "bible-bingo-board",
    heading: "Bible Bingo",
    subheading: focused ? "FOCUSED CARD" : "FULL BOARD",
    kind: focused ? "bible-bingo-card" : "bible-bingo-board",
  };
}

function dynamicUrl(action: HTMLElement, options: ShareOptions) {
  const href =
    action instanceof HTMLAnchorElement &&
    action.href &&
    !action.href.startsWith("mailto:") &&
    !action.href.startsWith("sms:")
      ? action.href
      : window.location.href;

  const url = new URL(href, window.location.origin);

  if (options.kind === "bible-bingo-board") {
    url.searchParams.delete("card");
  }

  return url.toString();
}

function bestShareRoot(action: HTMLElement, options: ShareOptions) {
  const explicit =
    action.closest<HTMLElement>("[data-render-share-root]") ||
    document.querySelector<HTMLElement>("[data-render-share-root]");
  if (explicit) return explicit;

  if (options.kind === "bible-bingo-board") {
    return document.querySelector<HTMLElement>("main") || document.body;
  }

  let node: HTMLElement | null = action;
  while (node && node !== document.body) {
    const textLength = (node.textContent || "").replace(/\s+/g, " ").trim().length;
    const tag = node.tagName.toLowerCase();
    const cls = node.className ? String(node.className).toLowerCase() : "";
    if (
      textLength > 80 &&
      (tag === "article" || tag === "section" || cls.includes("card") || cls.includes("hope") || cls.includes("bingo"))
    ) {
      return node;
    }
    node = node.parentElement;
  }

  return document.querySelector<HTMLElement>("main") || document.body;
}

function stripNoise(root: HTMLElement) {
  root
    .querySelectorAll(
      "script,style,button,input,textarea,select,nav,form,svg,img,video,audio,[role='button'],[role='dialog']"
    )
    .forEach((el) => el.remove());

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
    /expand all days/gi,
    /bible reading plan today/gi,
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
    if (!text || /^[smtwtfs]$/.test(text) || text === "today") {
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
  } else if (tag === "small") {
    el.style.fontSize = "13px";
    el.style.letterSpacing = "1px";
  }

  const textLength = (el.textContent || "").replace(/\s+/g, " ").trim().length;
  const cardish = depth <= 2 && depth > 0 && textLength > 70 && ["article", "section", "div", "main"].includes(tag);

  if (cardish) {
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

function buildCleanHtml(source: HTMLElement, options: ShareOptions, url: string) {
  const clone = source.cloneNode(true) as HTMLElement;
  stripNoise(clone);
  cleanElement(clone, 0);

  clone.style.width = "100%";
  clone.style.maxWidth = "720px";
  clone.style.margin = "0 auto";

  const plainText = `${options.title}\n\n${(clone.textContent || options.title)
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim()}\n\n${url}`;

  const html = `
<div xmlns="http://www.w3.org/1999/xhtml" style="background:#eef7ff;color:#2f3437;font-family:Arial,Helvetica,sans-serif;padding:34px;width:760px;max-width:100%;box-sizing:border-box;">
  <div style="max-width:720px;margin:0 auto 26px auto;">
    <div style="font-size:38px;line-height:1.1;margin-bottom:12px;">✝️ ❤️ 🙏</div>
    <div style="color:#456f59;font-size:18px;font-weight:900;letter-spacing:8px;margin-bottom:10px;">CROSS HEART PRAY</div>
    <div style="color:#2f3437;font-size:52px;font-weight:900;line-height:1.05;margin-bottom:12px;">${escapeHtml(options.heading)}</div>
    <div style="color:#456f59;font-size:20px;font-weight:900;letter-spacing:6px;">${escapeHtml(options.subheading)}</div>
  </div>
  ${clone.outerHTML}
  <div style="max-width:720px;margin:22px auto 0 auto;color:#315c49;font-size:15px;line-height:1.35;word-break:break-word;">
    <strong>Open:</strong> <a href="${escapeHtml(url)}" style="color:#315c49;text-decoration:underline;">${escapeHtml(url)}</a>
  </div>
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

async function copyRendered(html: string, plainText: string, pngFile?: File) {
  const ClipboardItemCtor = (window as any).ClipboardItem;

  if (navigator.clipboard?.write && ClipboardItemCtor) {
    if (pngFile) {
      try {
        await navigator.clipboard.write([
          new ClipboardItemCtor({
            "image/png": pngFile,
          }),
        ]);
        return;
      } catch {
        /* try rich html below */
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
      /* fallback below */
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

function openEmail(subject: string, body: string) {
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function openText(body: string) {
  const separator = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "&" : "?";
  window.location.href = `sms:${separator}body=${encodeURIComponent(body)}`;
}

async function shareNativeOrFallback(mode: "email" | "text", context: ShareContext, setStatus: (value: string) => void) {
  const { html, plainText } = buildCleanHtml(context.root, context.options, context.url);

  setStatus("Preparing rendered card…");

  let pngFile: File | undefined;
  try {
    pngFile = await makePng(html, context.options.fileBase);
  } catch {
    pngFile = undefined;
  }

  const nav = navigator as Navigator & {
    canShare?: (data: { files?: File[] }) => boolean;
    share?: (data: { title?: string; text?: string; files?: File[] }) => Promise<void>;
  };

  if (pngFile && nav.share && (!nav.canShare || nav.canShare({ files: [pngFile] }))) {
    setStatus(mode === "email" ? "Opening share sheet for email…" : "Opening share sheet for text…");
    await nav.share({
      title: context.options.title,
      text: context.url,
      files: [pngFile],
    });
    setStatus("Shared.");
    return;
  }

  await copyRendered(html, plainText, pngFile);

  if (mode === "email") {
    setStatus("Copied rendered card. Opening email…");
    openEmail(context.options.title, `${context.options.title}\n\n${context.url}`);
  } else {
    setStatus("Copied rendered card. Opening text…");
    openText(`${context.options.title}\n${context.url}`);
  }
}

async function copyUrl(url: string, setStatus: (value: string) => void) {
  await navigator.clipboard.writeText(url);
  setStatus("URL copied.");
}

export default function RenderedShareInterceptor() {
  const [context, setContext] = useState<ShareContext | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!supportedPath()) return;

      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-render-share-modal='true']")) return;

      const action = target.closest<HTMLElement>("button,a,[role='button']");
      if (!action || !isShareTrigger(action)) return;

      event.preventDefault();
      event.stopPropagation();
      (event as any).stopImmediatePropagation?.();

      const options = optionsFor(action);
      const url = dynamicUrl(action, options);
      const root = bestShareRoot(action, options);

      setStatus("");
      setContext({ root, options, url });
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  if (!context) return null;

  return (
    <div
      data-render-share-modal="true"
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "rgba(0,0,0,0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
      onClick={() => setContext(null)}
    >
      <div
        style={{
          width: "min(430px, 100%)",
          borderRadius: 28,
          background: "#eef7ff",
          color: "#263034",
          border: "1px solid rgba(184,225,213,0.95)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          padding: 22,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ fontSize: 30, lineHeight: 1, marginBottom: 10 }}>✝️ ❤️ 🙏</div>
        <div
          style={{
            color: "#456f59",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 4,
            marginBottom: 8,
          }}
        >
          CROSS HEART PRAY
        </div>
        <h2 style={{ margin: "0 0 6px 0", fontSize: 30, lineHeight: 1.1, fontWeight: 900 }}>
          Share {context.options.title}
        </h2>
        <p style={{ margin: "0 0 18px 0", color: "#526166", fontSize: 14, lineHeight: 1.35 }}>
          Choose rendered card/board or copy the exact live URL.
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <button
            type="button"
            onClick={() => void shareNativeOrFallback("email", context, setStatus)}
            style={{
              width: "100%",
              border: 0,
              borderRadius: 18,
              padding: "14px 16px",
              fontSize: 16,
              fontWeight: 900,
              background: "#315c49",
              color: "white",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            📧 Email rendered {context.options.kind === "bible-bingo-board" ? "board" : "card"}
          </button>

          <button
            type="button"
            onClick={() => void shareNativeOrFallback("text", context, setStatus)}
            style={{
              width: "100%",
              border: 0,
              borderRadius: 18,
              padding: "14px 16px",
              fontSize: 16,
              fontWeight: 900,
              background: "#315c49",
              color: "white",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            💬 Text rendered {context.options.kind === "bible-bingo-board" ? "board" : "card"}
          </button>

          <button
            type="button"
            onClick={() => void copyUrl(context.url, setStatus)}
            style={{
              width: "100%",
              border: "2px solid #b8e1d5",
              borderRadius: 18,
              padding: "14px 16px",
              fontSize: 16,
              fontWeight: 900,
              background: "white",
              color: "#315c49",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            🔗 Copy URL only
          </button>
        </div>

        <div
          style={{
            marginTop: 14,
            minHeight: 20,
            color: "#315c49",
            fontSize: 13,
            fontWeight: 800,
            wordBreak: "break-word",
          }}
        >
          {status || context.url}
        </div>

        <button
          type="button"
          onClick={() => setContext(null)}
          style={{
            marginTop: 14,
            width: "100%",
            border: 0,
            borderRadius: 16,
            padding: "11px 14px",
            fontSize: 14,
            fontWeight: 900,
            background: "rgba(49,92,73,0.09)",
            color: "#315c49",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

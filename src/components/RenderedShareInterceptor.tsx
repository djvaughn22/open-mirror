"use client";

import { useEffect } from "react";

type RenderedShareOptions = {
  title: string;
  fileBase: string;
  eyebrow: string;
  heading: string;
  subheading: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "share";
}

function normalizeText(input: string) {
  return input.replace(/\s+/g, " ").trim().toLowerCase();
}

function isShareActionLabel(label: string) {
  if (!label) return false;
  const okWords = ["share", "email", "copy", "message"];
  return okWords.some((word) => label.includes(word));
}

function isSupportedPath(pathname: string) {
  return (
    pathname.includes("/daily-hope") ||
    pathname.includes("/explorebible") ||
    pathname.includes("/bible-bingo")
  );
}

function removeEmptyNodes(root: HTMLElement) {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>("div,span,p,strong,em"));
  nodes.reverse().forEach((node) => {
    const text = (node.textContent || "").replace(/\s+/g, "").trim();
    if (!text && node.children.length === 0) node.remove();
  });
}

function inlineStyles(source: Element, clone: Element) {
  if (!(source instanceof HTMLElement) || !(clone instanceof HTMLElement)) return;

  const computed = window.getComputedStyle(source);
  const props = [
    "align-items",
    "background",
    "background-color",
    "border",
    "border-bottom",
    "border-left",
    "border-radius",
    "border-right",
    "border-top",
    "box-shadow",
    "box-sizing",
    "color",
    "display",
    "flex",
    "flex-direction",
    "flex-wrap",
    "font-family",
    "font-size",
    "font-style",
    "font-weight",
    "gap",
    "grid-template-columns",
    "justify-content",
    "letter-spacing",
    "line-height",
    "margin",
    "margin-bottom",
    "margin-left",
    "margin-right",
    "margin-top",
    "max-width",
    "min-height",
    "padding",
    "padding-bottom",
    "padding-left",
    "padding-right",
    "padding-top",
    "text-align",
    "text-decoration",
    "text-transform",
    "white-space",
    "width",
  ];

  clone.removeAttribute("class");
  clone.removeAttribute("id");
  clone.removeAttribute("style");

  props.forEach((prop) => {
    const value = computed.getPropertyValue(prop);
    if (value) clone.style.setProperty(prop, value);
  });

  if (computed.display === "inline") clone.style.display = "inline";
  if (computed.display === "inline-block") clone.style.display = "inline-block";

  Array.from(source.children).forEach((child, i) => {
    const cloneChild = clone.children.item(i);
    if (cloneChild) inlineStyles(child, cloneChild);
  });
}

function cleanupClone(root: HTMLElement) {
  const selectors = [
    "button",
    "input",
    "textarea",
    "select",
    "nav",
    "form",
    "svg",
    "video",
    "audio",
    "[role='button']",
    "[role='dialog']",
    "[aria-label*='share' i]",
    "[aria-label*='copy' i]",
    "[aria-label*='email' i]",
    "[data-no-render-share='true']",
  ];

  root.querySelectorAll<HTMLElement>(selectors.join(",")).forEach((el) => el.remove());

  const killPhrases = new Set([
    "share",
    "share card",
    "share board",
    "share all",
    "email",
    "copy",
    "copy html",
    "copy text",
    "message",
    "print / save pdf",
    "back to all 7",
    "open board",
    "open card",
    "today",
    "expand all days",
    "bible reading plan today",
  ]);

  root.querySelectorAll<HTMLElement>("a").forEach((a) => {
    const text = normalizeText(a.textContent || "");
    if (killPhrases.has(text) || /^[smtwtfs]$/.test(text)) {
      a.remove();
      return;
    }
    a.style.color = "#315c49";
    a.style.textDecoration = "none";
  });

  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    el.style.maxWidth = "100%";
    el.style.boxSizing = "border-box";
    if (normalizeText(el.textContent || "") === "") {
      if (el.tagName === "HR") el.remove();
    }
  });

  removeEmptyNodes(root);
}

function findShareRoot(action: HTMLElement): HTMLElement | null {
  const explicit =
    action.closest<HTMLElement>("[data-render-share-root]") ||
    document.querySelector<HTMLElement>("[data-render-share-root]");

  if (explicit) return explicit;

  const nearbyCard = action.closest<HTMLElement>(
    "article, section, [class*='card'], [class*='Card'], [class*='board'], [class*='Board']"
  );
  if (nearbyCard && (nearbyCard.textContent || "").trim().length > 80) return nearbyCard;

  const main = document.querySelector<HTMLElement>("main");
  if (main) return main;

  return document.body;
}

function buildBrandBlock(options: RenderedShareOptions) {
  return [
    `<div style="max-width:760px;margin:0 auto 26px auto;">`,
    `<div style="font-size:38px;line-height:1.1;margin-bottom:12px;">✝️ ❤️ 🙏</div>`,
    `<div style="color:#456f59;font-size:18px;font-weight:800;letter-spacing:8px;margin-bottom:10px;">${options.eyebrow}</div>`,
    `<div style="color:#2f3437;font-size:52px;font-weight:900;line-height:1.05;margin-bottom:12px;">${options.heading}</div>`,
    `<div style="color:#456f59;font-size:20px;font-weight:900;letter-spacing:6px;">${options.subheading}</div>`,
    `</div>`,
  ].join("");
}

function buildRenderedShare(root: HTMLElement, options: RenderedShareOptions) {
  const rect = root.getBoundingClientRect();
  const width = Math.min(820, Math.max(380, Math.ceil(rect.width || 430)));

  const clone = root.cloneNode(true) as HTMLElement;
  inlineStyles(root, clone);
  cleanupClone(clone);

  clone.style.width = "100%";
  clone.style.maxWidth = "760px";
  clone.style.margin = "0 auto";

  const wrapper = document.createElement("div");
  wrapper.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  wrapper.style.cssText = [
    "background:#eef7ff",
    "color:#2f3437",
    "font-family:Arial, Helvetica, sans-serif",
    "padding:34px",
    `width:${width}px`,
    "box-sizing:border-box",
  ].join(";");

  const header = document.createElement("div");
  header.innerHTML = buildBrandBlock(options);

  wrapper.appendChild(header);
  wrapper.appendChild(clone);

  const stage = document.createElement("div");
  stage.style.cssText = "position:fixed;left:-10000px;top:0;z-index:-1;";
  stage.appendChild(wrapper);
  document.body.appendChild(stage);

  const height = Math.min(16000, Math.max(600, Math.ceil(wrapper.scrollHeight + 4)));
  const html = `<!doctype html><html><body style="margin:0;background:#eef7ff;">${wrapper.outerHTML}</body></html>`;
  const svgHtml = new XMLSerializer().serializeToString(wrapper);
  const plainText = (clone.textContent || options.title)
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  stage.remove();

  return { width, height, html, svgHtml, plainText };
}

async function copyRichHtml(html: string, plainText: string) {
  const clipboardApi = navigator.clipboard as Clipboard & {
    write?: (items: ClipboardItem[]) => Promise<void>;
  };
  const ClipboardItemCtor = (window as any).ClipboardItem;

  if (clipboardApi?.write && ClipboardItemCtor) {
    await clipboardApi.write([
      new ClipboardItemCtor({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plainText], { type: "text/plain" }),
      }),
    ]);
    return;
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

async function renderPngFile(rendered: { width: number; height: number; svgHtml: string }, fileName: string) {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${rendered.width}" height="${rendered.height}" viewBox="0 0 ${rendered.width} ${rendered.height}">`,
    `<foreignObject x="0" y="0" width="100%" height="100%">`,
    rendered.svgHtml,
    `</foreignObject>`,
    `</svg>`,
  ].join("");

  const objectUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  const image = new Image();

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Rendered share image failed to load."));
    image.src = objectUrl;
  });

  const scale = Math.min(2, window.devicePixelRatio || 2);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(rendered.width * scale);
  canvas.height = Math.ceil(rendered.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Rendered share canvas failed.");

  context.scale(scale, scale);
  context.drawImage(image, 0, 0);
  URL.revokeObjectURL(objectUrl);

  const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
  if (!pngBlob) throw new Error("Rendered share PNG failed.");

  return new File([pngBlob], fileName, { type: "image/png" });
}

function pageOptions(pathname: string, label: string): RenderedShareOptions {
  const lower = label.toLowerCase();

  if (pathname.includes("/daily-hope")) {
    return {
      title: "Daily Hope",
      fileBase: "daily-hope",
      eyebrow: "CROSS HEART PRAY",
      heading: "Daily Hope",
      subheading: lower.includes("stack") ? "FULL PRAYER CARD STACK" : "PRAYER CARD",
    };
  }

  const singleCard = lower.includes("card") || pathname.includes("card=") || pathname.includes("/card");
  return {
    title: singleCard ? "Bible Bingo Card" : "Bible Bingo",
    fileBase: singleCard ? "bible-bingo-card" : "bible-bingo-board",
    eyebrow: "CROSS HEART PRAY",
    heading: "Bible Bingo",
    subheading: singleCard ? "FOCUSED CARD" : "FULL BOARD",
  };
}

async function shareRenderedNode(root: HTMLElement, options: RenderedShareOptions) {
  const rendered = buildRenderedShare(root, options);
  const fileName = `${slugify(options.fileBase)}.png`;

  try {
    const file = await renderPngFile(rendered, fileName);
    const nav = navigator as Navigator & {
      canShare?: (data: { files?: File[] }) => boolean;
      share?: (data: { title?: string; text?: string; files?: File[] }) => Promise<void>;
    };

    if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
      await nav.share({ title: options.title, files: [file] });
      return;
    }
  } catch {
    // fall through to HTML copy
  }

  await copyRichHtml(rendered.html, rendered.plainText);

  const oldTitle = document.title;
  document.title = `${options.title} copied`;
  window.setTimeout(() => {
    document.title = oldTitle;
  }, 1600);
}

export default function RenderedShareInterceptor() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const pathname = window.location.pathname;
      if (!isSupportedPath(pathname)) return;

      const target = event.target as HTMLElement | null;
      const action = target?.closest("button,a,[role='button']") as HTMLElement | null;
      if (!action) return;

      const label = normalizeText(action.innerText || action.textContent || "");
      if (!isShareActionLabel(label)) return;

      event.preventDefault();
      event.stopPropagation();
      (event as any).stopImmediatePropagation?.();

      const root = findShareRoot(action);
      if (!root) return;

      const options = pageOptions(pathname, label);
      void shareRenderedNode(root, options);
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}

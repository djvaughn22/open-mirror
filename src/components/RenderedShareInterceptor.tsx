"use client";

import { useEffect, useState } from "react";

type ShareKind = "daily-hope" | "bible-bingo-board" | "bible-bingo-card";

type ShareOptions = {
  title: string;
  fileBase: string;
  heading: string;
  subheading: string;
  kind: ShareKind;
};

type ShareContext = {
  root: HTMLElement;
  options: ShareOptions;
  url: string;
};

function norm(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
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
  return label.includes("share") || label.includes("email") || label.includes("text") || label.includes("copy html");
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

function removeJunk(clone: HTMLElement) {
  clone
    .querySelectorAll(
      "script,style,button,input,textarea,select,nav,form,svg,img,video,audio,[role='button'],[role='dialog']"
    )
    .forEach((el) => el.remove());

  clone.querySelectorAll<HTMLElement>("a").forEach((a) => {
    const text = norm(a.textContent || "");
    if (!text || /^[smtwtfs]$/.test(text) || text === "today") {
      a.remove();
    }
  });
}

function isNoiseLine(line: string) {
  const value = norm(line);
  if (!value) return true;

  const exact = new Set([
    "share",
    "share card",
    "share board",
    "share stack",
    "share html",
    "copy html",
    "copy text",
    "copy url",
    "copy link",
    "url copies link only",
    "email",
    "text",
    "message",
    "open board",
    "back to all 7",
    "print / save pdf",
    "expand all days",
    "today",
    "bible reading plan today",
  ]);

  if (exact.has(value)) return true;
  if (/^s\s*m\s*t\s*w\s*t\s*f\s*s$/i.test(value)) return true;
  if (value.includes("sharehtml copies complete formatted content")) return true;
  if (value.includes("opens text/email")) return true;
  if (value.includes("url copies link only")) return true;
  if (value.length < 2) return true;

  return false;
}

function cleanLine(line: string) {
  return line
    .replace(/ShareHTML copies complete formatted content and opens text\/email\.?/gi, "")
    .replace(/URL copies link only\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLines(root: HTMLElement, options: ShareOptions) {
  const clone = root.cloneNode(true) as HTMLElement;
  removeJunk(clone);

  const blockSelector = "h1,h2,h3,h4,p,li,blockquote,article,section,div,span,strong";
  const blockTags = new Set(["H1", "H2", "H3", "H4", "P", "LI", "BLOCKQUOTE", "ARTICLE", "SECTION", "DIV"]);

  const candidates = Array.from(clone.querySelectorAll<HTMLElement>(blockSelector));
  const lines: string[] = [];
  const seen = new Set<string>();

  for (const el of candidates) {
    const hasBlockChild = Array.from(el.children).some((child) => blockTags.has(child.tagName));
    const raw = cleanLine(el.textContent || "");
    const key = norm(raw);

    if (hasBlockChild && raw.length > 80) continue;
    if (isNoiseLine(raw)) continue;
    if (seen.has(key)) continue;

    seen.add(key);
    lines.push(raw);
  }

  if (lines.length < 3) {
    const fallback = (clone.textContent || "")
      .split(/\n|(?=Romans\s+\d+:)|(?=Psalm\s+\d+:)|(?=Proverbs\s+\d+:)|(?=Matthew\s+\d+:)|(?=Mark\s+\d+:)|(?=Luke\s+\d+:)|(?=John\s+\d+:)/g)
      .map(cleanLine)
      .filter((line) => !isNoiseLine(line));

    for (const line of fallback) {
      const key = norm(line);
      if (!seen.has(key)) {
        seen.add(key);
        lines.push(line);
      }
    }
  }

  const trimmed = lines
    .filter((line) => !isNoiseLine(line))
    .slice(0, options.kind === "daily-hope" ? 120 : 90);

  return trimmed.length ? trimmed : [options.title];
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth || !current) {
      current = test;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function isHeadingLine(line: string) {
  const value = norm(line);
  return (
    value === "daily hope" ||
    value === "sinner prayer" ||
    value === "salvation prayer" ||
    value.includes("prayer card") ||
    value.includes("bible bingo") ||
    value.includes("cross heart pray")
  );
}

function isVerseLine(line: string) {
  return /^[1-3]?\s?[A-Z][a-z]+(?:\s+of\s+[A-Z][a-z]+)?\s+\d+:\d+/.test(line);
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

async function makeRenderedPng(context: ShareContext) {
  const lines = extractLines(context.root, context.options);
  const width = 1080;
  const pad = 72;
  const cardPad = 42;
  const cardX = pad;
  const cardW = width - pad * 2;
  const textW = cardW - cardPad * 2;

  const measureCanvas = document.createElement("canvas");
  const measure = measureCanvas.getContext("2d");
  if (!measure) throw new Error("Canvas unavailable.");

  let estimated = 72 + 70 + 44 + 86 + 54 + 44;

  for (const line of lines) {
    if (isHeadingLine(line)) {
      measure.font = "900 44px Arial";
      estimated += wrapText(measure, line, textW).length * 56 + 12;
    } else if (isVerseLine(line)) {
      measure.font = "900 31px Georgia";
      estimated += wrapText(measure, line, textW).length * 43 + 12;
    } else {
      measure.font = "400 30px Georgia";
      estimated += wrapText(measure, line, textW).length * 43 + 10;
    }
  }

  estimated += 120;
  const height = Math.min(16000, Math.max(900, estimated));
  const scale = height > 9000 ? 1 : Math.min(2, window.devicePixelRatio || 1.5);

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable.");
  ctx.scale(scale, scale);

  ctx.fillStyle = "#eef7ff";
  ctx.fillRect(0, 0, width, height);

  let y = 72;

  ctx.fillStyle = "#263034";
  ctx.font = "700 56px Arial";
  ctx.fillText("✝️  ❤️  🙏", pad, y);
  y += 78;

  ctx.fillStyle = "#456f59";
  ctx.font = "900 24px Arial";
  ctx.fillText("CROSS HEART PRAY", pad, y);
  y += 70;

  ctx.fillStyle = "#263034";
  ctx.font = "900 72px Arial";
  ctx.fillText(context.options.heading, pad, y);
  y += 66;

  ctx.fillStyle = "#456f59";
  ctx.font = "900 27px Arial";
  ctx.fillText(context.options.subheading, pad, y);
  y += 54;

  const cardTop = y;
  roundRectPath(ctx, cardX, cardTop, cardW, height - cardTop - 60, 38);
  ctx.fillStyle = "#dff1fb";
  ctx.fill();
  ctx.strokeStyle = "#b8e1d5";
  ctx.lineWidth = 3;
  ctx.stroke();

  y += cardPad;

  for (const line of lines) {
    if (y > height - 170) break;

    if (isHeadingLine(line)) {
      ctx.fillStyle = "#263034";
      ctx.font = "900 44px Arial";
      for (const wrapped of wrapText(ctx, line, textW)) {
        ctx.fillText(wrapped, cardX + cardPad, y);
        y += 56;
      }
      y += 10;
    } else if (isVerseLine(line)) {
      ctx.fillStyle = "#315c49";
      ctx.font = "900 31px Georgia";
      for (const wrapped of wrapText(ctx, line, textW)) {
        ctx.fillText(wrapped, cardX + cardPad, y);
        y += 43;
      }
      y += 10;
    } else {
      ctx.fillStyle = "#2f3437";
      ctx.font = "400 30px Georgia";
      for (const wrapped of wrapText(ctx, line, textW)) {
        ctx.fillText(wrapped, cardX + cardPad, y);
        y += 43;
      }
      y += 9;
    }
  }

  y = Math.min(y + 28, height - 105);
  ctx.fillStyle = "#315c49";
  ctx.font = "700 24px Arial";
  ctx.fillText("Open:", cardX + cardPad, y);
  y += 34;

  ctx.fillStyle = "#315c49";
  ctx.font = "400 22px Arial";
  for (const wrapped of wrapText(ctx, context.url, textW)) {
    if (y > height - 42) break;
    ctx.fillText(wrapped, cardX + cardPad, y);
    y += 30;
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
  if (!blob) throw new Error("PNG failed.");

  return new File([blob], `${slugify(context.options.fileBase)}.png`, { type: "image/png" });
}

async function copyImageToClipboard(file: File) {
  const ClipboardItemCtor = (window as any).ClipboardItem;
  if (!navigator.clipboard?.write || !ClipboardItemCtor) return false;

  try {
    await navigator.clipboard.write([
      new ClipboardItemCtor({
        "image/png": file,
      }),
    ]);
    return true;
  } catch {
    return false;
  }
}

async function shareFileOnly(file: File, title: string) {
  const nav = navigator as Navigator & {
    canShare?: (data: { files?: File[] }) => boolean;
    share?: (data: { title?: string; files?: File[] }) => Promise<void>;
  };

  if (!nav.share) return false;

  try {
    await nav.share({
      title,
      files: [file],
    });
    return true;
  } catch {
    return false;
  }
}

async function copyUrl(url: string, setStatus: (value: string) => void) {
  await navigator.clipboard.writeText(url);
  setStatus("URL copied.");
}

export default function RenderedShareInterceptor() {
  const [context, setContext] = useState<ShareContext | null>(null);
  const [status, setStatus] = useState("");
  const [renderedFile, setRenderedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!context) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    setRenderedFile(null);
    setPreviewUrl(null);
    setStatus("Rendering image…");

    void makeRenderedPng(context)
      .then((file) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(file);
        setRenderedFile(file);
        setPreviewUrl(objectUrl);
        setStatus("Rendered image ready.");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("Could not render image in this browser. Copy URL still works.");
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [context]);

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

  const itemWord = context.options.kind === "bible-bingo-board" ? "board" : "card";
  const canShareRendered = Boolean(renderedFile);

  const shareRendered = async (targetName: "Mail" | "Messages") => {
    if (!renderedFile) {
      setStatus("Still rendering image…");
      return;
    }

    setStatus(`Opening share sheet. Choose ${targetName}.`);
    const shared = await shareFileOnly(renderedFile, context.options.title);

    if (shared) {
      setStatus("Rendered image shared.");
      return;
    }

    const copied = await copyImageToClipboard(renderedFile);
    setStatus(
      copied
        ? `Native image share is blocked here. Rendered image copied — paste it into ${targetName}.`
        : `Native image share is blocked here. Rendered image is shown below.`
    );
  };

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
          maxHeight: "92vh",
          overflow: "auto",
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
        <div style={{ color: "#456f59", fontSize: 12, fontWeight: 900, letterSpacing: 4, marginBottom: 8 }}>
          CROSS HEART PRAY
        </div>

        <h2 style={{ margin: "0 0 6px 0", fontSize: 30, lineHeight: 1.1, fontWeight: 900 }}>
          Share {context.options.title}
        </h2>

        <p style={{ margin: "0 0 18px 0", color: "#526166", fontSize: 14, lineHeight: 1.35 }}>
          Email/Text shares the rendered PNG image. URL copies the live link only.
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <button
            type="button"
            disabled={!canShareRendered}
            onClick={() => void shareRendered("Mail")}
            style={{
              width: "100%",
              border: 0,
              borderRadius: 18,
              padding: "14px 16px",
              fontSize: 16,
              fontWeight: 900,
              background: canShareRendered ? "#315c49" : "#9fb5ad",
              color: "white",
              cursor: canShareRendered ? "pointer" : "wait",
              textAlign: "left",
            }}
          >
            📧 Email rendered {itemWord}
          </button>

          <button
            type="button"
            disabled={!canShareRendered}
            onClick={() => void shareRendered("Messages")}
            style={{
              width: "100%",
              border: 0,
              borderRadius: 18,
              padding: "14px 16px",
              fontSize: 16,
              fontWeight: 900,
              background: canShareRendered ? "#315c49" : "#9fb5ad",
              color: "white",
              cursor: canShareRendered ? "pointer" : "wait",
              textAlign: "left",
            }}
          >
            💬 Text rendered {itemWord}
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

        {previewUrl ? (
          <img
            src={previewUrl}
            alt={`${context.options.title} rendered preview`}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              marginTop: 14,
              borderRadius: 18,
              border: "1px solid #b8e1d5",
              background: "#eef7ff",
            }}
          />
        ) : null}

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

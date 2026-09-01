// ─────────────────────────────────────────────────────────────────────────────
// Export the share card as a PNG, in the browser, at feed size.
//
// The node's own computed styles are inlined into an SVG <foreignObject> and
// rasterized on a canvas. No image server, no upload, no cost — and no
// stylesheet crawling, which is what made the general-purpose library take long
// enough to look broken on this page.
// ─────────────────────────────────────────────────────────────────────────────

/** 1080px wide is what every phone-shaped feed wants. */
const TARGET_WIDTH = 1080;

export async function cardToPngDataUrl(node: HTMLElement, targetWidth = TARGET_WIDTH): Promise<string> {
  const width = node.offsetWidth;
  const height = node.offsetHeight;
  if (width === 0 || height === 0) throw new Error("the card is not visible");

  const clone = node.cloneNode(true) as HTMLElement;
  const source = [node, ...Array.from(node.querySelectorAll<HTMLElement>("*"))];
  const copy = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))];

  for (let i = 0; i < source.length; i += 1) {
    const computed = getComputedStyle(source[i]);
    let css = "";
    for (const property of Array.from(computed)) {
      css += `${property}:${computed.getPropertyValue(property)};`;
    }
    copy[i].setAttribute("style", css);
    // Classes would only re-apply rules the inlined styles already carry, and
    // the SVG has no stylesheet to resolve them against.
    copy[i].removeAttribute("class");
  }
  clone.style.margin = "0";

  const holder = document.createElement("div");
  holder.appendChild(clone);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<foreignObject x="0" y="0" width="100%" height="100%">` +
    `<div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px">${holder.innerHTML}</div>` +
    `</foreignObject></svg>`;

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("the card could not be drawn"));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });

  const scale = targetWidth / width;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("this browser cannot draw the card");

  // Paint the background first: a transparent PNG looks broken in a feed.
  ctx.fillStyle = getComputedStyle(node).backgroundColor || "#0b1220";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/png");
}

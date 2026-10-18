// ─────────────────────────────────────────────────────────────────────────────
// Copy one site address to the clipboard and report what actually happened.
// "Link copied" only after writeText resolves; if the clipboard is missing,
// throws or rejects, the address itself comes back so the visitor can copy
// it by hand. Kept free of React and window so it can be tested directly.
// ─────────────────────────────────────────────────────────────────────────────

export const COPIED_MESSAGE = "Link copied";

export type ClipboardLike = { writeText(text: string): Promise<void> } | undefined | null;

export type CopyResult = { copied: boolean; message: string };

export async function copySiteLink(url: string, clipboard: ClipboardLike): Promise<CopyResult> {
  try {
    if (!clipboard || typeof clipboard.writeText !== "function") throw new Error("Clipboard unavailable");
    await clipboard.writeText(url);
    return { copied: true, message: COPIED_MESSAGE };
  } catch {
    return { copied: false, message: url };
  }
}

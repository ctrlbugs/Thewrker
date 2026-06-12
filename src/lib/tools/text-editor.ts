export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
}

export function getTextStats(text: string): TextStats {
  const trimmedLines = text.split(/\r?\n/);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const paragraphs = text.trim()
    ? text.split(/\n\s*\n/).filter((part) => part.trim()).length
    : 0;

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words,
    lines: trimmedLines.length,
    paragraphs,
  };
}

export function findAndReplace(
  text: string,
  search: string,
  replacement: string,
  matchCase = false,
): string {
  if (!search) return text;

  if (matchCase) {
    return text.split(search).join(replacement);
  }

  const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  return text.replace(regex, replacement);
}

export const TEXT_EDITOR_STORAGE_KEY = "powerdesk-text-editor-content";

export function loadSavedText(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TEXT_EDITOR_STORAGE_KEY) ?? "";
}

export function saveText(text: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TEXT_EDITOR_STORAGE_KEY, text);
}

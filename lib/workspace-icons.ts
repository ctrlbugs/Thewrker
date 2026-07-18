/**
 * Custom 32×32 PNG icons live in /public/icons/{name}.png
 * Drop files using these exact names; they wire in automatically once listed below.
 *
 * Expected drops:
 *   text-editor · pdf · image · archive · converter · compressor · ai
 *   json · base64 · uuid · hash · jwt · regex · careeros · overview
 */

/** Icons that have been dropped into public/icons/ */
export const READY_CUSTOM_ICONS = {
  pdf: "/icons/pdf.png",
} as const;

export type CustomIconId = keyof typeof READY_CUSTOM_ICONS;

/** Nav key → custom PNG filename (without path) */
export const NAV_ICON_FILE: Record<string, string> = {
  overview: "overview",
  careeros: "careeros",
  text: "text-editor",
  pdf: "pdf",
  image: "image",
  archive: "archive",
  convert: "converter",
  compress: "compressor",
  ai: "ai",
  json: "json",
  base64: "base64",
  uuid: "uuid",
  hash: "hash",
  jwt: "jwt",
  regex: "regex",
};

/** Studio / tool module id → custom PNG filename */
export const MODULE_ICON_FILE: Record<string, string> = {
  "text-editor": "text-editor",
  "pdf-studio": "pdf",
  "image-studio": "image",
  "archive-studio": "archive",
  "converter-hub": "converter",
  "compressor-studio": "compressor",
  "ai-studio": "ai",
  "json-formatter": "json",
  base64: "base64",
  uuid: "uuid",
  hash: "hash",
  jwt: "jwt",
  regex: "regex",
};

export function customIconSrc(fileKey: string | undefined): string | null {
  if (!fileKey) return null;
  const ready = READY_CUSTOM_ICONS[fileKey as CustomIconId];
  return ready ?? null;
}

export function navCustomIconSrc(navIcon: string): string | null {
  return customIconSrc(NAV_ICON_FILE[navIcon]);
}

export function moduleCustomIconSrc(
  moduleId: string,
  fallbackSvg?: string
): string {
  const custom = customIconSrc(MODULE_ICON_FILE[moduleId]);
  return custom ?? fallbackSvg ?? "/assets/icons/files.svg";
}

import { formatBytes } from "@/lib/tools/image";

export type FileLimitCategory =
  | "image"
  | "document"
  | "pdf"
  | "archive"
  | "audio"
  | "video"
  | "media";

const LIMITS: Record<FileLimitCategory, number> = {
  image: 25 * 1024 * 1024,
  document: 15 * 1024 * 1024,
  pdf: 25 * 1024 * 1024,
  archive: 50 * 1024 * 1024,
  audio: 50 * 1024 * 1024,
  video: 200 * 1024 * 1024,
  media: 200 * 1024 * 1024,
};

export function getFileSizeLimit(category: FileLimitCategory): number {
  return LIMITS[category];
}

export function validateFileSize(
  file: File,
  category: FileLimitCategory,
): { ok: true } | { ok: false; error: string } {
  const limit = LIMITS[category];
  if (file.size <= limit) return { ok: true };

  return {
    ok: false,
    error: `File is too large (${formatBytes(file.size)}). Maximum for this tool is ${formatBytes(limit)}.`,
  };
}

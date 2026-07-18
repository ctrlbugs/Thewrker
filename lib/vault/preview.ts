export type VaultPreviewKind =
  | "pdf"
  | "image"
  | "text"
  | "docx"
  | "sheet"
  | "audio"
  | "video"
  | "unsupported";

export function detectPreviewKind(
  name: string,
  mime?: string
): VaultPreviewKind {
  const lower = name.toLowerCase();
  const type = (mime || "").toLowerCase();

  if (type.includes("pdf") || lower.endsWith(".pdf")) return "pdf";
  if (
    type.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(lower)
  ) {
    return "image";
  }
  if (
    type.startsWith("audio/") ||
    /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(lower)
  ) {
    return "audio";
  }
  if (
    type.startsWith("video/") ||
    /\.(mp4|webm|mov|m4v|avi)$/i.test(lower)
  ) {
    return "video";
  }
  if (
    type.includes("wordprocessingml") ||
    type === "application/msword" ||
    /\.(docx|doc)$/i.test(lower)
  ) {
    return "docx";
  }
  if (
    type.includes("spreadsheetml") ||
    type.includes("excel") ||
    /\.(xlsx|xls|csv)$/i.test(lower)
  ) {
    return "sheet";
  }
  if (
    type.startsWith("text/") ||
    type.includes("json") ||
    /\.(txt|md|markdown|json|csv|log|xml|html?|css|js|ts|tsx|jsx|py|env|yml|yaml)$/i.test(
      lower
    )
  ) {
    return "text";
  }
  return "unsupported";
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, data] = dataUrl.split(",");
  const mime = meta.match(/:(.*?);/)?.[1] || "application/octet-stream";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function dataUrlToArrayBuffer(dataUrl: string): Promise<ArrayBuffer> {
  return dataUrlToBlob(dataUrl).arrayBuffer();
}

export async function dataUrlToText(dataUrl: string): Promise<string> {
  const blob = dataUrlToBlob(dataUrl);
  return blob.text();
}

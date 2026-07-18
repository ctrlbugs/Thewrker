import type { ToolResult } from "../types";

export function encodeBase64(text: string): ToolResult<string> {
  try {
    const encoded =
      typeof window !== "undefined"
        ? btoa(unescape(encodeURIComponent(text)))
        : Buffer.from(text, "utf-8").toString("base64");
    return { ok: true, data: encoded };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Encoding failed.",
    };
  }
}

export function decodeBase64(value: string): ToolResult<string> {
  if (!value.trim()) {
    return { ok: false, error: "Input is empty." };
  }

  try {
    const decoded =
      typeof window !== "undefined"
        ? decodeURIComponent(escape(atob(value.trim())))
        : Buffer.from(value.trim(), "base64").toString("utf-8");
    return { ok: true, data: decoded };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid Base64 input.",
    };
  }
}

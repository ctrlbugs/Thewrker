import type { ToolResult } from "../types";

export type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

export async function hashText(
  text: string,
  algorithm: HashAlgorithm = "SHA-256",
): Promise<ToolResult<string>> {
  if (!text) {
    return { ok: false, error: "Input is empty." };
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const digest = await crypto.subtle.digest(algorithm, data);
    const hash = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return { ok: true, data: hash };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Hashing failed.",
    };
  }
}

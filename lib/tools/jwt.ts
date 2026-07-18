import type { ToolResult } from "../types";

export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  if (typeof window !== "undefined") {
    return decodeURIComponent(
      escape(atob(padded.replace(/\s/g, ""))),
    );
  }

  return Buffer.from(padded, "base64").toString("utf-8");
}

export function decodeJwt(token: string): ToolResult<JwtParts> {
  const trimmed = token.trim();
  if (!trimmed) {
    return { ok: false, error: "Token is empty." };
  }

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return { ok: false, error: "JWT must have header, payload, and signature." };
  }

  try {
    const header = JSON.parse(decodeBase64Url(parts[0])) as Record<string, unknown>;
    const payload = JSON.parse(decodeBase64Url(parts[1])) as Record<string, unknown>;
    return {
      ok: true,
      data: {
        header,
        payload,
        signature: parts[2],
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to decode JWT.",
    };
  }
}

import type { ToolResult } from "../types";

export function formatJson(input: string, indent = 2): ToolResult<string> {
  if (!input.trim()) {
    return { ok: false, error: "Input is empty." };
  }

  try {
    const parsed = JSON.parse(input);
    return { ok: true, data: JSON.stringify(parsed, null, indent) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid JSON.",
    };
  }
}

export function minifyJson(input: string): ToolResult<string> {
  if (!input.trim()) {
    return { ok: false, error: "Input is empty." };
  }

  try {
    const parsed = JSON.parse(input);
    return { ok: true, data: JSON.stringify(parsed) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid JSON.",
    };
  }
}

export function validateJson(input: string): ToolResult<object> {
  if (!input.trim()) {
    return { ok: false, error: "Input is empty." };
  }

  try {
    const parsed = JSON.parse(input);
    return { ok: true, data: parsed as object };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid JSON.",
    };
  }
}

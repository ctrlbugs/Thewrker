import type { ToolResult } from "../types";

export interface RegexMatchResult {
  matches: string[];
  groups: string[][];
  highlighted: string;
}

export function testRegex(
  pattern: string,
  flags: string,
  text: string,
): ToolResult<RegexMatchResult> {
  if (!pattern) {
    return { ok: false, error: "Pattern is required." };
  }

  try {
    const regex = new RegExp(pattern, flags);
    const globalRegex = new RegExp(
      pattern,
      flags.includes("g") ? flags : `${flags}g`,
    );
    const matches = Array.from(text.matchAll(globalRegex)).map((match) => match[0]);
    const groups = Array.from(text.matchAll(globalRegex)).map(
      (match) => match.slice(1).map((group) => group ?? ""),
    );

    let highlighted = text;
    if (matches.length > 0) {
      highlighted = text.replace(
        new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`),
        (match) => `⟦${match}⟧`,
      );
    }

    return {
      ok: true,
      data: { matches, groups, highlighted },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid regular expression.",
    };
  }
}

export function replaceWithRegex(
  pattern: string,
  flags: string,
  text: string,
  replacement: string,
): ToolResult<string> {
  if (!pattern) {
    return { ok: false, error: "Pattern is required." };
  }

  try {
    const regex = new RegExp(pattern, flags);
    return { ok: true, data: text.replace(regex, replacement) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid regular expression.",
    };
  }
}

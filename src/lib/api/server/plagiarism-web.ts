import "server-only";

import type { PlagiarismFlag } from "@/lib/tools/plagiarism";
import { searchWeb } from "./web-search";

function pickSearchSentences(text: string, limit = 4): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n{2,}/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.split(/\s+/).length >= 8)
    .sort((a, b) => b.length - a.length)
    .slice(0, limit);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function appearsInSnippet(sentence: string, snippet: string): boolean {
  const normalizedSentence = normalize(sentence);
  const normalizedSnippet = normalize(snippet);
  if (normalizedSnippet.includes(normalizedSentence)) return true;

  const words = normalizedSentence.split(" ").filter((word) => word.length > 3);
  if (words.length < 6) return false;

  const chunk = words.slice(0, 8).join(" ");
  return normalizedSnippet.includes(chunk);
}

export async function runWebPlagiarismScan(text: string): Promise<{
  provider: string;
  flags: PlagiarismFlag[];
  searchesRun: number;
}> {
  const sentences = pickSearchSentences(text);
  const flags: PlagiarismFlag[] = [];
  let provider = "";
  let searchesRun = 0;

  for (const sentence of sentences) {
    const quoted = `"${sentence.slice(0, 120)}"`;
    const result = await searchWeb(quoted);
    if (!result) break;

    provider = result.provider;
    searchesRun += 1;

    for (const hit of result.hits) {
      if (appearsInSnippet(sentence, hit.snippet)) {
        flags.push({
          text: sentence.slice(0, 180),
          reason: `Possible web match: ${hit.title} (${hit.url})`,
          severity: "high",
        });
        break;
      }
    }
  }

  return { provider, flags, searchesRun };
}

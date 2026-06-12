import type { ToolResult } from "../types";

export interface PlagiarismFlag {
  text: string;
  reason: string;
  severity: "low" | "medium" | "high";
}

export interface PlagiarismWebScan {
  enabled: boolean;
  provider: string;
  searchesRun: number;
  matchesFound: number;
}

export interface PlagiarismReport {
  originalityScore: number;
  wordCount: number;
  sentenceCount: number;
  uniqueWordRatio: number;
  repeatedPhraseCount: number;
  referenceSimilarity: number | null;
  flags: PlagiarismFlag[];
  summary: string;
  webScan?: PlagiarismWebScan;
}

export function mergeWebScanResults(
  report: PlagiarismReport,
  webResult: { provider: string; searchesRun: number; flags: PlagiarismFlag[] },
): PlagiarismReport {
  const webFlags = webResult.flags;
  const mergedFlags = [...webFlags, ...report.flags].slice(0, 25);
  const webPenalty = Math.min(
    35,
    webFlags.filter((flag) => flag.severity === "high").length * 10 +
      webFlags.filter((flag) => flag.severity === "medium").length * 4,
  );
  const originalityScore = Math.max(5, report.originalityScore - webPenalty);

  let summary = report.summary;
  if (webFlags.length > 0) {
    summary = `Web scan found ${webFlags.length} possible online match(es). Review flagged sections and cited sources.`;
  } else if (webResult.searchesRun > 0) {
    summary = `${report.summary} No obvious web matches found in sampled sentences.`;
  }

  return {
    ...report,
    originalityScore,
    flags: mergedFlags,
    summary,
    webScan: {
      enabled: true,
      provider: webResult.provider,
      searchesRun: webResult.searchesRun,
      matchesFound: webFlags.length,
    },
  };
}

const COMMON_PHRASES = [
  "in conclusion",
  "it is important to note that",
  "according to research",
  "studies have shown",
  "lorem ipsum",
  "as a matter of fact",
  "in today's society",
  "since the beginning of time",
  "throughout history",
  "needless to say",
];

function tokenizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n{2,}/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 20);
}

function getShingles(text: string, size = 5): Set<string> {
  const words = tokenizeWords(text);
  const shingles = new Set<string>();
  for (let index = 0; index <= words.length - size; index += 1) {
    shingles.add(words.slice(index, index + size).join(" "));
  }
  return shingles;
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function findRepeatedPhrases(text: string, minWords = 6): PlagiarismFlag[] {
  const sentences = splitSentences(text);
  const seen = new Map<string, number>();
  const flags: PlagiarismFlag[] = [];

  for (const sentence of sentences) {
    const normalized = sentence.toLowerCase().replace(/\s+/g, " ").trim();
    if (normalized.split(" ").length < minWords) continue;
    const count = (seen.get(normalized) ?? 0) + 1;
    seen.set(normalized, count);
    if (count === 2) {
      flags.push({
        text: sentence.slice(0, 160),
        reason: "Repeated sentence detected in this document.",
        severity: "medium",
      });
    }
  }

  const words = tokenizeWords(text);
  const phraseCounts = new Map<string, number>();
  for (let index = 0; index <= words.length - minWords; index += 1) {
    const phrase = words.slice(index, index + minWords).join(" ");
    phraseCounts.set(phrase, (phraseCounts.get(phrase) ?? 0) + 1);
  }

  for (const [phrase, count] of phraseCounts) {
    if (count < 3) continue;
    flags.push({
      text: phrase,
      reason: `Phrase appears ${count} times in the document.`,
      severity: "low",
    });
    if (flags.length >= 12) break;
  }

  return flags;
}

function findCommonBoilerplate(text: string): PlagiarismFlag[] {
  const lower = text.toLowerCase();
  return COMMON_PHRASES.filter((phrase) => lower.includes(phrase)).map((phrase) => ({
    text: phrase,
    reason: "Common boilerplate phrase often found in generic content.",
    severity: "low" as const,
  }));
}

function findLongDuplicateBlocks(text: string, referenceText?: string): PlagiarismFlag[] {
  if (!referenceText?.trim()) return [];

  const sourceShingles = getShingles(referenceText, 8);
  const sentences = splitSentences(text);
  const flags: PlagiarismFlag[] = [];

  for (const sentence of sentences) {
    const similarity = jaccardSimilarity(getShingles(sentence, 8), sourceShingles);
    if (similarity >= 0.45) {
      flags.push({
        text: sentence.slice(0, 180),
        reason: `High similarity (${Math.round(similarity * 100)}%) to your reference text.`,
        severity: similarity >= 0.7 ? "high" : "medium",
      });
    }
    if (flags.length >= 15) break;
  }

  return flags;
}

export function analyzePlagiarism(
  text: string,
  referenceText?: string,
): ToolResult<PlagiarismReport> {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: "Paste or upload document text to analyze." };
  }

  if (trimmed.length < 80) {
    return { ok: false, error: "Document is too short for a meaningful plagiarism check." };
  }

  const words = tokenizeWords(trimmed);
  const uniqueWords = new Set(words);
  const sentences = splitSentences(trimmed);
  const uniqueWordRatio = words.length > 0 ? uniqueWords.size / words.length : 0;

  const repeatedFlags = findRepeatedPhrases(trimmed);
  const boilerplateFlags = findCommonBoilerplate(trimmed);
  const referenceFlags = findLongDuplicateBlocks(trimmed, referenceText);

  const flags = [...referenceFlags, ...repeatedFlags, ...boilerplateFlags].slice(0, 20);

  const referenceSimilarity = referenceText?.trim()
    ? jaccardSimilarity(getShingles(trimmed, 6), getShingles(referenceText, 6))
    : null;

  let penalty = 0;
  penalty += Math.min(25, referenceFlags.filter((f) => f.severity === "high").length * 8);
  penalty += Math.min(15, repeatedFlags.length * 4);
  penalty += Math.min(10, boilerplateFlags.length * 2);
  if (uniqueWordRatio < 0.35) penalty += 12;

  const originalityScore = Math.max(5, Math.min(100, Math.round(100 - penalty)));

  let summary = "Your document shows strong originality signals.";
  if (originalityScore < 50) {
    summary = "Multiple overlap patterns detected. Review flagged sections carefully.";
  } else if (originalityScore < 75) {
    summary = "Some repetitive or generic patterns were found. Consider revising flagged areas.";
  }

  if (referenceSimilarity !== null && referenceSimilarity > 0.35) {
    summary = `Document overlaps significantly (${Math.round(referenceSimilarity * 100)}%) with the reference text you provided.`;
  }

  return {
    ok: true,
    data: {
      originalityScore,
      wordCount: words.length,
      sentenceCount: sentences.length,
      uniqueWordRatio: Math.round(uniqueWordRatio * 100),
      repeatedPhraseCount: repeatedFlags.length,
      referenceSimilarity:
        referenceSimilarity === null ? null : Math.round(referenceSimilarity * 100),
      flags,
      summary,
    },
  };
}

import type { PlagiarismFlag } from "@/lib/tools/plagiarism";

/** Local staging stubs for optional remote AI APIs */

export async function extractTextWithOcrApi(_file: File): Promise<{
  ok: boolean;
  text?: string;
  error?: string;
}> {
  return {
    ok: false,
    error:
      "OCR API is not connected in this environment. Use a text-based PDF or paste content.",
  };
}

/** Throws when unavailable so callers can fall back to local engine */
export async function removeBackgroundViaApi(_file: File): Promise<Blob> {
  throw new Error(
    "Remote background-removal API is offline. Falling back to local engine.",
  );
}

export async function runWebPlagiarismCheck(_text: string): Promise<{
  provider: string;
  searchesRun: number;
  flags: PlagiarismFlag[];
}> {
  return {
    provider: "local-stub",
    searchesRun: 0,
    flags: [],
  };
}

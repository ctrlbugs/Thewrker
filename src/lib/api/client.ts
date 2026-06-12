import { sanitizeApiErrorMessage } from "./user-error";

export interface IntegrationStatus {
  "google-cse": boolean;
  serpapi: boolean;
  "ocr-space": boolean;
  "remove-bg": boolean;
  openai: boolean;
  webSearch: boolean;
}

export interface WebPlagiarismResponse {
  provider: string;
  searchesRun: number;
  flags: { text: string; reason: string; severity: "low" | "medium" | "high" }[];
}

async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    const raw = data.error ?? `Request failed (${response.status}).`;
    return sanitizeApiErrorMessage(raw);
  } catch {
    return "Something went wrong. Please try again.";
  }
}

export async function fetchIntegrationStatus(): Promise<IntegrationStatus> {
  const response = await fetch("/api/integrations", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not load API integration status.");
  }
  return response.json() as Promise<IntegrationStatus>;
}

export async function runWebPlagiarismCheck(text: string): Promise<WebPlagiarismResponse> {
  const response = await fetch("/api/plagiarism/web-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<WebPlagiarismResponse>;
}

export async function extractTextWithOcrApi(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/ocr/extract", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data = (await response.json()) as { text: string };
  return data.text;
}

export async function removeBackgroundViaApi(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/image/remove-background", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.blob();
}

import "server-only";

import { getEnv, hasOcrSpace } from "./env";

export async function extractTextWithOcr(
  file: File,
  language = "eng",
): Promise<string> {
  if (!hasOcrSpace()) {
    throw new Error("OCR API is not configured. Add OCR_SPACE_API_KEY to .env.local");
  }

  const apiKey = getEnv("OCR_SPACE_API_KEY")!;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", language);
  formData.append("isOverlayRequired", "false");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("OCREngine", "2");

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: { apikey: apiKey },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`OCR request failed (${response.status}).`);
  }

  const data = (await response.json()) as {
    IsErroredOnProcessing?: boolean;
    ErrorMessage?: string | string[];
    ParsedResults?: { ParsedText?: string }[];
  };

  if (data.IsErroredOnProcessing) {
    const message = Array.isArray(data.ErrorMessage)
      ? data.ErrorMessage.join(", ")
      : data.ErrorMessage ?? "OCR processing error.";
    throw new Error(message);
  }

  const text = (data.ParsedResults ?? [])
    .map((result) => result.ParsedText ?? "")
    .join("\n\n")
    .trim();

  if (!text) {
    throw new Error("OCR could not extract readable text from this file.");
  }

  return text;
}

import { extractTextWithOcrApi } from "@/lib/api/client";

import type { ToolResult } from "../types";

const SUPPORTED_DOCUMENT_EXTENSIONS = [
  "txt",
  "md",
  "markdown",
  "docx",
  "pdf",
  "rtf",
  "csv",
] as const;

export type DocumentExtension = (typeof SUPPORTED_DOCUMENT_EXTENSIONS)[number];

export function getDocumentExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function isSupportedDocument(fileName: string): boolean {
  const ext = getDocumentExtension(fileName);
  return SUPPORTED_DOCUMENT_EXTENSIONS.includes(ext as DocumentExtension);
}

type PdfJsModule = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (opts: { data: Uint8Array }) => {
    promise: Promise<{
      numPages: number;
      getPage: (page: number) => Promise<{
        getTextContent: () => Promise<{
          items: Array<{ str?: string }>;
        }>;
      }>;
    }>;
  };
};

async function extractPdfText(file: File): Promise<string> {
  // Keep pdfjs out of the webpack graph (avoids @napi-rs/canvas / WASM build crash)
  const pdfjs = (await new Function(
    'return import("pdfjs-dist")'
  )()) as PdfJsModule;

  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.1.200/build/pdf.worker.min.mjs";
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const parts: string[] = [];

  for (let page = 1; page <= pdf.numPages; page += 1) {
    const pageContent = await pdf.getPage(page);
    const textContent = await pageContent.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    parts.push(pageText);
  }

  return parts.join("\n\n").trim();
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

export async function extractTextFromFile(file: File): Promise<ToolResult<string>> {
  const extension = getDocumentExtension(file.name);

  if (!isSupportedDocument(file.name)) {
    return {
      ok: false,
      error: "Supported formats: PDF, DOCX, TXT, MD, RTF, CSV.",
    };
  }

  try {
    if (extension === "pdf") {
      const text = await extractPdfText(file);
      if (text) {
        return { ok: true, data: text };
      }

      try {
        const ocr = await extractTextWithOcrApi(file);
        if (ocr.ok && ocr.text?.trim()) {
          return { ok: true, data: ocr.text.trim() };
        }
      } catch {
        // OCR API not configured or failed — fall through to user-facing error.
      }

      return {
        ok: false,
        error:
          "No readable text found in this PDF. It may be a scanned image — try a text-based export or paste the content directly.",
      };
    }

    if (extension === "docx") {
      const text = await extractDocxText(file);
      if (!text) {
        return { ok: false, error: "No readable text found in this DOCX file." };
      }
      return { ok: true, data: text };
    }

    const text = await file.text();
    if (!text.trim()) {
      return { ok: false, error: "The document appears to be empty." };
    }
    return { ok: true, data: text.trim() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to read document.",
    };
  }
}

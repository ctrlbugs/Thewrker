import { PDFDocument } from "pdf-lib";
import type { ToolResult } from "../types";
import type { ProgressReporter } from "./progress";
import { clampProgress } from "./progress";

export interface PdfInfo {
  pageCount: number;
  fileName: string;
  fileSize: number;
}

async function readPdf(file: File): Promise<PDFDocument> {
  const bytes = await file.arrayBuffer();
  return PDFDocument.load(bytes, { ignoreEncryption: true });
}

export async function getPdfInfo(file: File): Promise<ToolResult<PdfInfo>> {
  try {
    const pdf = await readPdf(file);
    return {
      ok: true,
      data: {
        pageCount: pdf.getPageCount(),
        fileName: file.name,
        fileSize: file.size,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to read PDF.",
    };
  }
}

export function parsePageRange(
  input: string,
  totalPages: number,
): ToolResult<number[]> {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter a page range." };
  }

  const pages = new Set<number>();
  const parts = trimmed.split(",").map((part) => part.trim());

  for (const part of parts) {
    if (!part) continue;

    if (part.includes("-")) {
      const [startRaw, endRaw] = part.split("-").map((value) => value.trim());
      const start = Number(startRaw);
      const end = Number(endRaw);

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        return { ok: false, error: `Invalid range: ${part}` };
      }
      if (start < 1 || end > totalPages || start > end) {
        return { ok: false, error: `Range out of bounds: ${part}` };
      }

      for (let page = start; page <= end; page += 1) {
        pages.add(page - 1);
      }
      continue;
    }

    const page = Number(part);
    if (!Number.isInteger(page) || page < 1 || page > totalPages) {
      return { ok: false, error: `Invalid page: ${part}` };
    }
    pages.add(page - 1);
  }

  if (pages.size === 0) {
    return { ok: false, error: "No valid pages selected." };
  }

  return { ok: true, data: Array.from(pages).sort((a, b) => a - b) };
}

export async function mergePdfs(
  files: File[],
  onProgress?: ProgressReporter,
): Promise<ToolResult<Blob>> {
  if (files.length < 2) {
    return { ok: false, error: "Select at least 2 PDF files to merge." };
  }

  try {
    onProgress?.(5, "Creating merged document...");
    const merged = await PDFDocument.create();
    const total = files.length;

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const pdf = await readPdf(file);
      const copiedPages = await merged.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => merged.addPage(page));
      onProgress?.(
        clampProgress(10 + ((index + 1) / total) * 70),
        `Merging ${file.name}...`,
      );
    }

    onProgress?.(88, "Saving merged PDF...");
    const bytes = await merged.save();
    onProgress?.(100, "Merge complete.");
    return {
      ok: true,
      data: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "PDF merge failed.",
    };
  }
}

export async function extractPdfPages(
  file: File,
  pageIndices: number[],
  onProgress?: ProgressReporter,
): Promise<ToolResult<Blob>> {
  try {
    onProgress?.(10, "Reading PDF...");
    const source = await readPdf(file);
    const output = await PDFDocument.create();
    onProgress?.(45, "Extracting selected pages...");
    const copiedPages = await output.copyPages(source, pageIndices);
    copiedPages.forEach((page) => output.addPage(page));

    onProgress?.(85, "Saving extracted PDF...");
    const bytes = await output.save();
    onProgress?.(100, "Extraction complete.");
    return {
      ok: true,
      data: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "PDF split failed.",
    };
  }
}

export async function splitPdfAllPages(
  file: File,
  onProgress?: ProgressReporter,
): Promise<ToolResult<{ name: string; blob: Blob }[]>> {
  try {
    onProgress?.(8, "Reading PDF...");
    const source = await readPdf(file);
    const totalPages = source.getPageCount();
    const outputs: { name: string; blob: Blob }[] = [];
    const baseName = file.name.replace(/\.pdf$/i, "");

    for (let index = 0; index < totalPages; index += 1) {
      const pageDoc = await PDFDocument.create();
      const [page] = await pageDoc.copyPages(source, [index]);
      pageDoc.addPage(page);
      const bytes = await pageDoc.save();
      outputs.push({
        name: `${baseName}-page-${index + 1}.pdf`,
        blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
      });
      onProgress?.(
        clampProgress(12 + ((index + 1) / totalPages) * 86),
        `Splitting page ${index + 1} of ${totalPages}...`,
      );
    }

    onProgress?.(100, "Split complete.");
    return { ok: true, data: outputs };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "PDF split failed.",
    };
  }
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

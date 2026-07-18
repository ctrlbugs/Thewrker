import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
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

export async function deletePdfPages(
  file: File,
  pageIndices: number[],
  onProgress?: ProgressReporter,
): Promise<ToolResult<Blob>> {
  try {
    onProgress?.(10, "Reading PDF...");
    const source = await readPdf(file);
    const keep = source
      .getPageIndices()
      .filter((index) => !pageIndices.includes(index));
    if (keep.length === 0) {
      return { ok: false, error: "You can’t delete every page." };
    }
    if (keep.length === source.getPageCount()) {
      return { ok: false, error: "No matching pages to delete." };
    }
    const output = await PDFDocument.create();
    onProgress?.(50, "Removing selected pages...");
    const copied = await output.copyPages(source, keep);
    copied.forEach((page) => output.addPage(page));
    onProgress?.(90, "Saving PDF...");
    const bytes = await output.save();
    onProgress?.(100, "Delete complete.");
    return {
      ok: true,
      data: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Delete pages failed.",
    };
  }
}

export async function rotatePdfPages(
  file: File,
  angle: 90 | 180 | 270,
  onProgress?: ProgressReporter,
): Promise<ToolResult<Blob>> {
  try {
    onProgress?.(15, "Reading PDF...");
    const pdf = await readPdf(file);
    onProgress?.(55, `Rotating pages ${angle}°...`);
    pdf.getPages().forEach((page) => {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angle) % 360));
    });
    onProgress?.(90, "Saving PDF...");
    const bytes = await pdf.save();
    onProgress?.(100, "Rotate complete.");
    return {
      ok: true,
      data: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Rotate failed.",
    };
  }
}

export async function reorderPdfPages(
  file: File,
  pageIndices: number[],
  onProgress?: ProgressReporter,
): Promise<ToolResult<Blob>> {
  try {
    onProgress?.(12, "Reading PDF...");
    const source = await readPdf(file);
    const total = source.getPageCount();
    if (pageIndices.length !== total) {
      return {
        ok: false,
        error: `Order must include every page once (1-${total}).`,
      };
    }
    const unique = new Set(pageIndices);
    if (unique.size !== total) {
      return { ok: false, error: "Each page can appear only once in the order." };
    }
    const output = await PDFDocument.create();
    onProgress?.(50, "Reordering pages...");
    const copied = await output.copyPages(source, pageIndices);
    copied.forEach((page) => output.addPage(page));
    onProgress?.(90, "Saving PDF...");
    const bytes = await output.save();
    onProgress?.(100, "Organize complete.");
    return {
      ok: true,
      data: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Reorder failed.",
    };
  }
}

export async function insertPdfPages(
  baseFile: File,
  insertFile: File,
  afterPage: number,
  onProgress?: ProgressReporter,
): Promise<ToolResult<Blob>> {
  try {
    onProgress?.(10, "Reading PDFs...");
    const base = await readPdf(baseFile);
    const insert = await readPdf(insertFile);
    const baseCount = base.getPageCount();
    if (afterPage < 0 || afterPage > baseCount) {
      return {
        ok: false,
        error: `Insert position must be between 0 and ${baseCount}.`,
      };
    }
    const output = await PDFDocument.create();
    onProgress?.(40, "Building new page order...");
    const before = await output.copyPages(
      base,
      Array.from({ length: afterPage }, (_, i) => i),
    );
    before.forEach((page) => output.addPage(page));
    const inserted = await output.copyPages(insert, insert.getPageIndices());
    inserted.forEach((page) => output.addPage(page));
    const after = await output.copyPages(
      base,
      Array.from({ length: baseCount - afterPage }, (_, i) => afterPage + i),
    );
    after.forEach((page) => output.addPage(page));
    onProgress?.(90, "Saving PDF...");
    const bytes = await output.save();
    onProgress?.(100, "Insert complete.");
    return {
      ok: true,
      data: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Insert pages failed.",
    };
  }
}

export async function numberPdfPages(
  file: File,
  onProgress?: ProgressReporter,
): Promise<ToolResult<Blob>> {
  try {
    onProgress?.(12, "Reading PDF...");
    const pdf = await readPdf(file);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const pages = pdf.getPages();
    onProgress?.(50, "Adding page numbers...");
    pages.forEach((page, index) => {
      const { width } = page.getSize();
      const label = `${index + 1}`;
      const size = 11;
      const textWidth = font.widthOfTextAtSize(label, size);
      page.drawText(label, {
        x: (width - textWidth) / 2,
        y: 24,
        size,
        font,
        color: rgb(0.25, 0.3, 0.38),
      });
    });
    onProgress?.(90, "Saving PDF...");
    const bytes = await pdf.save();
    onProgress?.(100, "Page numbers added.");
    return {
      ok: true,
      data: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Numbering failed.",
    };
  }
}

export async function cropPdfPages(
  file: File,
  margin: number,
  onProgress?: ProgressReporter,
): Promise<ToolResult<Blob>> {
  if (!Number.isFinite(margin) || margin < 0) {
    return { ok: false, error: "Enter a valid margin (0 or more)." };
  }
  try {
    onProgress?.(12, "Reading PDF...");
    const pdf = await readPdf(file);
    onProgress?.(55, "Cropping pages...");
    pdf.getPages().forEach((page) => {
      const { width, height } = page.getSize();
      const m = Math.min(margin, width / 2 - 1, height / 2 - 1);
      page.setCropBox(m, m, width - m * 2, height - m * 2);
    });
    onProgress?.(90, "Saving PDF...");
    const bytes = await pdf.save();
    onProgress?.(100, "Crop complete.");
    return {
      ok: true,
      data: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Crop failed.",
    };
  }
}

export async function stampPdfText(
  file: File,
  text: string,
  onProgress?: ProgressReporter,
): Promise<ToolResult<Blob>> {
  const stamp = text.trim();
  if (!stamp) return { ok: false, error: "Enter text to stamp." };
  try {
    onProgress?.(12, "Reading PDF...");
    const pdf = await readPdf(file);
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    onProgress?.(55, "Stamping text...");
    pdf.getPages().forEach((page) => {
      const { width, height } = page.getSize();
      const size = 18;
      const textWidth = font.widthOfTextAtSize(stamp, size);
      page.drawText(stamp, {
        x: Math.max(24, (width - textWidth) / 2),
        y: height / 2,
        size,
        font,
        color: rgb(0.13, 0.22, 0.42),
        opacity: 0.35,
      });
    });
    onProgress?.(90, "Saving PDF...");
    const bytes = await pdf.save();
    onProgress?.(100, "Edit complete.");
    return {
      ok: true,
      data: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Edit failed.",
    };
  }
}

export async function imagesToPdf(
  files: File[],
  onProgress?: ProgressReporter,
): Promise<ToolResult<Blob>> {
  if (!files.length) return { ok: false, error: "Select at least one image." };
  try {
    onProgress?.(8, "Creating PDF...");
    const pdf = await PDFDocument.create();
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      const isPng =
        file.type === "image/png" || /\.png$/i.test(file.name);
      const image = isPng
        ? await pdf.embedPng(bytes)
        : await pdf.embedJpg(bytes);
      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
      onProgress?.(
        clampProgress(10 + ((i + 1) / files.length) * 80),
        `Adding ${file.name}...`,
      );
    }
    onProgress?.(95, "Saving PDF...");
    const out = await pdf.save();
    onProgress?.(100, "Conversion complete.");
    return {
      ok: true,
      data: new Blob([out as BlobPart], { type: "application/pdf" }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Image conversion failed.",
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

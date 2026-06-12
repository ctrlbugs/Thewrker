import JSZip from "jszip";
import type { ToolResult } from "../types";
import type { ProgressReporter } from "./progress";
import { clampProgress } from "./progress";

export interface ArchiveEntry {
  name: string;
  size: number;
  isDirectory: boolean;
}

export interface ExtractedArchiveFile {
  name: string;
  size: number;
  blob: Blob;
}

export interface ZipCompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercent: number;
}

export type ZipCompressionLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

async function buildZipFromFiles(
  files: File[],
  compressionLevel: ZipCompressionLevel,
  onProgress?: ProgressReporter,
): Promise<Blob> {
  const zip = new JSZip();
  const total = files.length;

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const bytes = await file.arrayBuffer();
    zip.file(file.name, bytes);
    onProgress?.(
      clampProgress(8 + ((index + 1) / total) * 32),
      `Adding ${file.name}...`,
    );
  }

  onProgress?.(45, "Compressing archive...");

  return zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: compressionLevel },
    },
    (metadata) => {
      onProgress?.(
        clampProgress(45 + metadata.percent * 0.55),
        "Compressing archive...",
      );
    },
  );
}

async function buildZipFromArchive(
  source: JSZip,
  compressionLevel: ZipCompressionLevel,
  onProgress?: ProgressReporter,
): Promise<Blob> {
  const zip = new JSZip();
  const entries = Object.values(source.files);
  const total = entries.length || 1;

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (entry.dir) {
      zip.folder(entry.name);
    } else {
      const content = await entry.async("uint8array");
      zip.file(entry.name, content);
    }
    onProgress?.(
      clampProgress(10 + ((index + 1) / total) * 35),
      `Repacking ${entry.name}...`,
    );
  }

  onProgress?.(50, "Applying maximum compression...");

  return zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: compressionLevel },
    },
    (metadata) => {
      onProgress?.(
        clampProgress(50 + metadata.percent * 0.48),
        "Applying maximum compression...",
      );
    },
  );
}

export async function createZip(
  files: File[],
  compressionLevel: ZipCompressionLevel = 6,
  onProgress?: ProgressReporter,
): Promise<ToolResult<Blob>> {
  if (files.length === 0) {
    return { ok: false, error: "Select at least one file to archive." };
  }

  try {
    onProgress?.(0, "Preparing archive...");
    const blob = await buildZipFromFiles(files, compressionLevel, onProgress);
    onProgress?.(100, "Archive ready.");
    return { ok: true, data: blob };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Archive creation failed.",
    };
  }
}

export async function compressZip(
  file: File,
  compressionLevel: ZipCompressionLevel = 9,
  onProgress?: ProgressReporter,
): Promise<ToolResult<ZipCompressionResult>> {
  try {
    onProgress?.(5, "Reading ZIP file...");
    const bytes = await file.arrayBuffer();
    const source = await JSZip.loadAsync(bytes);
    const blob = await buildZipFromArchive(source, compressionLevel, onProgress);
    const originalSize = file.size;
    const compressedSize = blob.size;
    const savedBytes = Math.max(originalSize - compressedSize, 0);
    const savedPercent =
      originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

    onProgress?.(100, "Compression complete.");

    return {
      ok: true,
      data: {
        blob,
        originalSize,
        compressedSize,
        savedBytes,
        savedPercent,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "ZIP compression failed.",
    };
  }
}

export async function extractZip(
  file: File,
  onProgress?: ProgressReporter,
): Promise<ToolResult<ExtractedArchiveFile[]>> {
  try {
    onProgress?.(8, "Opening archive...");
    const bytes = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(bytes);
    const extracted: ExtractedArchiveFile[] = [];

    const fileEntries = Object.values(zip.files).filter((entry) => !entry.dir);
    const total = fileEntries.length || 1;

    for (let index = 0; index < fileEntries.length; index += 1) {
      const entry = fileEntries[index];
      const content = await entry.async("blob");
      extracted.push({
        name: entry.name,
        size: content.size,
        blob: content,
      });
      onProgress?.(
        clampProgress(12 + ((index + 1) / total) * 86),
        `Extracting ${entry.name}...`,
      );
    }

    extracted.sort((a, b) => a.name.localeCompare(b.name));
    onProgress?.(100, "Extraction complete.");
    return { ok: true, data: extracted };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Archive extraction failed.",
    };
  }
}

export async function listZipEntries(file: File): Promise<ToolResult<ArchiveEntry[]>> {
  try {
    const bytes = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(bytes);
    const entries: ArchiveEntry[] = [];

    for (const [relativePath, entry] of Object.entries(zip.files)) {
      if (entry.dir) {
        entries.push({
          name: relativePath,
          size: 0,
          isDirectory: true,
        });
        continue;
      }

      const content = await entry.async("uint8array");
      entries.push({
        name: relativePath,
        size: content.length,
        isDirectory: false,
      });
    }

    entries.sort((a, b) => a.name.localeCompare(b.name));
    return { ok: true, data: entries };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to read archive.",
    };
  }
}

export async function extractZipEntry(
  file: File,
  entryName: string,
): Promise<ToolResult<ExtractedArchiveFile>> {
  try {
    const bytes = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(bytes);
    const entry = zip.file(entryName);

    if (!entry || entry.dir) {
      return { ok: false, error: "File not found in archive." };
    }

    const content = await entry.async("blob");
    return {
      ok: true,
      data: {
        name: entry.name,
        size: content.size,
        blob: content,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to extract file.",
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

import type { FFmpeg } from "@ffmpeg/ffmpeg";
import type { ToolResult } from "../types";

export type MediaCategory = "audio" | "video";

export interface MediaConversion {
  id: string;
  label: string;
  category: MediaCategory;
  inputExt: string[];
  outputExt: string;
  mimeType: string;
  buildArgs: (inputName: string, outputName: string) => string[];
}

export interface MediaConversionResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
}

export interface MediaProgress {
  stage: "loading" | "converting" | "done" | "error";
  progress: number;
  message: string;
}

const FFMPEG_CORE_VERSION = "0.12.10";
const FFMPEG_CORE_BASE = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/umd`;

let ffmpegInstance: FFmpeg | null = null;
let ffmpegReady = false;
let ffmpegLoading: Promise<FFmpeg> | null = null;

export const MEDIA_CONVERSIONS: MediaConversion[] = [
  {
    id: "mp3-wav",
    label: "MP3 → WAV",
    category: "audio",
    inputExt: ["mp3"],
    outputExt: "wav",
    mimeType: "audio/wav",
    buildArgs: (input, output) => ["-i", input, output],
  },
  {
    id: "wav-mp3",
    label: "WAV → MP3",
    category: "audio",
    inputExt: ["wav"],
    outputExt: "mp3",
    mimeType: "audio/mpeg",
    buildArgs: (input, output) => [
      "-i",
      input,
      "-codec:a",
      "libmp3lame",
      "-qscale:a",
      "2",
      output,
    ],
  },
  {
    id: "mp3-aac",
    label: "MP3 → AAC",
    category: "audio",
    inputExt: ["mp3"],
    outputExt: "m4a",
    mimeType: "audio/mp4",
    buildArgs: (input, output) => ["-i", input, "-c:a", "aac", "-b:a", "192k", output],
  },
  {
    id: "aac-mp3",
    label: "AAC/M4A → MP3",
    category: "audio",
    inputExt: ["aac", "m4a"],
    outputExt: "mp3",
    mimeType: "audio/mpeg",
    buildArgs: (input, output) => [
      "-i",
      input,
      "-codec:a",
      "libmp3lame",
      "-qscale:a",
      "2",
      output,
    ],
  },
  {
    id: "mp4-mp3",
    label: "MP4 → MP3 (extract audio)",
    category: "audio",
    inputExt: ["mp4"],
    outputExt: "mp3",
    mimeType: "audio/mpeg",
    buildArgs: (input, output) => [
      "-i",
      input,
      "-vn",
      "-codec:a",
      "libmp3lame",
      "-qscale:a",
      "2",
      output,
    ],
  },
  {
    id: "mp4-mov",
    label: "MP4 → MOV",
    category: "video",
    inputExt: ["mp4"],
    outputExt: "mov",
    mimeType: "video/quicktime",
    buildArgs: (input, output) => ["-i", input, "-c", "copy", output],
  },
  {
    id: "mov-mp4",
    label: "MOV → MP4",
    category: "video",
    inputExt: ["mov"],
    outputExt: "mp4",
    mimeType: "video/mp4",
    buildArgs: (input, output) => ["-i", input, "-c", "copy", output],
  },
  {
    id: "mp4-avi",
    label: "MP4 → AVI",
    category: "video",
    inputExt: ["mp4"],
    outputExt: "avi",
    mimeType: "video/x-msvideo",
    buildArgs: (input, output) => [
      "-i",
      input,
      "-c:v",
      "mpeg4",
      "-c:a",
      "mp3",
      output,
    ],
  },
  {
    id: "avi-mp4",
    label: "AVI → MP4",
    category: "video",
    inputExt: ["avi"],
    outputExt: "mp4",
    mimeType: "video/mp4",
    buildArgs: (input, output) => [
      "-i",
      input,
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-c:a",
      "aac",
      output,
    ],
  },
];

export function getConversionForFile(
  file: File,
  category: MediaCategory,
): MediaConversion | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return (
    MEDIA_CONVERSIONS.find(
      (conversion) =>
        conversion.category === category &&
        conversion.inputExt.includes(extension),
    ) ?? null
  );
}

export function getOutputFileName(inputName: string, outputExt: string): string {
  const base = inputName.replace(/\.[^.]+$/, "");
  return `${base}-converted.${outputExt}`;
}

export function getCompressedFileName(inputName: string, outputExt: string): string {
  const base = inputName.replace(/\.[^.]+$/, "");
  return `${base}-compressed.${outputExt}`;
}

function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

async function runFfmpegTransform(
  file: File,
  outputExt: string,
  mimeType: string,
  buildArgs: (inputName: string, outputName: string) => string[],
  onProgress?: (update: MediaProgress) => void,
): Promise<ToolResult<MediaConversionResult>> {
  const extension = getFileExtension(file.name);

  try {
    const [{ fetchFile }] = await Promise.all([import("@ffmpeg/util")]);
    const ffmpeg = await loadFfmpeg(onProgress);
    const inputName = `input.${extension}`;
    const outputName = `output.${outputExt}`;

    onProgress?.({
      stage: "converting",
      progress: 0,
      message: "Preparing file...",
    });

    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec(buildArgs(inputName, outputName));

    const data = await ffmpeg.readFile(outputName);
    const bytes =
      data instanceof Uint8Array ? data : new TextEncoder().encode(String(data));

    if (bytes.byteLength === 0) {
      return { ok: false, error: "Compression produced an empty file." };
    }

    const blob = new Blob([bytes as BlobPart], { type: mimeType });
    const fileName = getCompressedFileName(file.name, outputExt);

    onProgress?.({
      stage: "done",
      progress: 100,
      message: "Compression complete.",
    });

    return {
      ok: true,
      data: { blob, fileName, mimeType },
    };
  } catch (error) {
    onProgress?.({
      stage: "error",
      progress: 0,
      message: error instanceof Error ? error.message : "Compression failed.",
    });

    return {
      ok: false,
      error: error instanceof Error ? error.message : "Media compression failed.",
    };
  }
}

export async function compressAudioFile(
  file: File,
  bitrateKbps: number,
  onProgress?: (update: MediaProgress) => void,
): Promise<ToolResult<MediaConversionResult>> {
  const extension = getFileExtension(file.name);
  const supported = ["mp3", "wav", "aac", "m4a"];

  if (!supported.includes(extension)) {
    return {
      ok: false,
      error: "Supported audio formats: MP3, WAV, AAC, M4A.",
    };
  }

  const bitrate = Math.min(320, Math.max(64, Math.round(bitrateKbps)));

  if (extension === "wav") {
    return runFfmpegTransform(
      file,
      "mp3",
      "audio/mpeg",
      (input, output) => [
        "-i",
        input,
        "-codec:a",
        "libmp3lame",
        "-b:a",
        `${bitrate}k`,
        output,
      ],
      onProgress,
    );
  }

  if (extension === "mp3") {
    return runFfmpegTransform(
      file,
      "mp3",
      "audio/mpeg",
      (input, output) => [
        "-i",
        input,
        "-codec:a",
        "libmp3lame",
        "-b:a",
        `${bitrate}k`,
        output,
      ],
      onProgress,
    );
  }

  return runFfmpegTransform(
    file,
    "m4a",
    "audio/mp4",
    (input, output) => ["-i", input, "-c:a", "aac", "-b:a", `${bitrate}k`, output],
    onProgress,
  );
}

export async function compressVideoFile(
  file: File,
  crf: number,
  onProgress?: (update: MediaProgress) => void,
): Promise<ToolResult<MediaConversionResult>> {
  const extension = getFileExtension(file.name);
  const supported = ["mp4", "mov", "avi"];

  if (!supported.includes(extension)) {
    return {
      ok: false,
      error: "Supported video formats: MP4, MOV, AVI.",
    };
  }

  const quality = Math.min(32, Math.max(18, Math.round(crf)));

  return runFfmpegTransform(
    file,
    "mp4",
    "video/mp4",
    (input, output) => [
      "-i",
      input,
      "-c:v",
      "libx264",
      "-crf",
      String(quality),
      "-preset",
      "medium",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      output,
    ],
    onProgress,
  );
}

async function loadFfmpeg(
  onProgress?: (update: MediaProgress) => void,
): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegReady) {
    return ffmpegInstance;
  }

  if (ffmpegLoading) {
    return ffmpegLoading;
  }

  ffmpegLoading = (async () => {
    onProgress?.({
      stage: "loading",
      progress: 0,
      message: "Loading media engine (~31 MB)...",
    });

    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import("@ffmpeg/ffmpeg"),
      import("@ffmpeg/util"),
    ]);

    const ffmpeg = new FFmpeg();

    ffmpeg.on("progress", ({ progress }) => {
      onProgress?.({
        stage: "converting",
        progress: Math.round(progress * 100),
        message: `Converting... ${Math.round(progress * 100)}%`,
      });
    });

    ffmpeg.on("log", ({ message }) => {
      if (message.toLowerCase().includes("error")) {
        onProgress?.({
          stage: "converting",
          progress: 0,
          message,
        });
      }
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
    });

    ffmpegInstance = ffmpeg;
    ffmpegReady = true;
    onProgress?.({
      stage: "loading",
      progress: 100,
      message: "Media engine ready.",
    });

    return ffmpeg;
  })();

  try {
    return await ffmpegLoading;
  } finally {
    ffmpegLoading = null;
  }
}

export async function convertMediaFile(
  file: File,
  conversion: MediaConversion,
  onProgress?: (update: MediaProgress) => void,
): Promise<ToolResult<MediaConversionResult>> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!conversion.inputExt.includes(extension)) {
    return {
      ok: false,
      error: `Expected ${conversion.inputExt.join(" or ").toUpperCase()} file.`,
    };
  }

  try {
    const [{ fetchFile }] = await Promise.all([import("@ffmpeg/util")]);
    const ffmpeg = await loadFfmpeg(onProgress);
    const inputName = `input.${extension}`;
    const outputName = `output.${conversion.outputExt}`;

    onProgress?.({
      stage: "converting",
      progress: 0,
      message: "Preparing file...",
    });

    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec(conversion.buildArgs(inputName, outputName));

    const data = await ffmpeg.readFile(outputName);
    const bytes =
      data instanceof Uint8Array ? data : new TextEncoder().encode(String(data));

    if (bytes.byteLength === 0) {
      return { ok: false, error: "Conversion produced an empty file." };
    }

    const blob = new Blob([bytes as BlobPart], { type: conversion.mimeType });
    const fileName = getOutputFileName(file.name, conversion.outputExt);

    onProgress?.({
      stage: "done",
      progress: 100,
      message: "Conversion complete.",
    });

    return {
      ok: true,
      data: {
        blob,
        fileName,
        mimeType: conversion.mimeType,
      },
    };
  } catch (error) {
    onProgress?.({
      stage: "error",
      progress: 0,
      message: error instanceof Error ? error.message : "Conversion failed.",
    });

    return {
      ok: false,
      error: error instanceof Error ? error.message : "Media conversion failed.",
    };
  }
}

"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { downloadBlob } from "@/lib/tools/archive";
import {
  compressImageFile,
  formatBytes,
  getCompressionStats,
  type ImageOutputFormat,
} from "@/lib/tools/image";
import { compressAudioFile, compressVideoFile } from "@/lib/tools/media";

type CompressTab = "image" | "audio" | "video";

const VIDEO_PRESETS = [
  { id: "high", label: "High quality", crf: 20, hint: "Best quality, moderate size reduction." },
  { id: "balanced", label: "Balanced", crf: 24, hint: "Recommended for most videos." },
  { id: "small", label: "Maximum compression", crf: 28, hint: "Smallest file, lower quality." },
] as const;

function SavingsCard({
  originalSize,
  compressedSize,
  savedPercent,
}: {
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="body-emphasized-14pt mb-2">Compression result</p>
      <p className="body-regular-14">
        {formatBytes(originalSize)} → {formatBytes(compressedSize)}
      </p>
      <p className="body-secondary-info-14pt mt-1">
        {savedPercent > 0
          ? `${savedPercent}% smaller (${formatBytes(originalSize - compressedSize)} saved)`
          : "File size unchanged or slightly larger — try a lower quality setting."}
      </p>
    </div>
  );
}

export default function CompressorStudioTool() {
  const task = useAsyncTask();
  const [tab, setTab] = useState<CompressTab>("image");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [outputName, setOutputName] = useState("");
  const [stats, setStats] = useState<ReturnType<typeof getCompressionStats> | null>(null);

  const [imageQuality, setImageQuality] = useState(0.75);
  const [imageFormat, setImageFormat] = useState<ImageOutputFormat>("image/jpeg");
  const [imageMaxWidth, setImageMaxWidth] = useState(0);
  const [audioBitrate, setAudioBitrate] = useState(128);
  const [videoPreset, setVideoPreset] = useState<(typeof VIDEO_PRESETS)[number]["id"]>("balanced");

  const resetOutput = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setOutputName("");
    setStats(null);
  };

  const handleFileChange = (nextFile: File | null) => {
    setFile(nextFile);
    resetOutput();
    setMessage(nextFile ? `Loaded ${nextFile.name} (${formatBytes(nextFile.size)})` : "");
  };

  const handleTabChange = (nextTab: CompressTab) => {
    setTab(nextTab);
    handleFileChange(null);
    setMessage("");
  };

  const trackMediaProgress = (
    update: (progress: number, message?: string) => void,
    mediaProgress: { stage: string; progress: number; message: string },
  ) => {
    if (mediaProgress.stage === "loading") {
      update(Math.max(8, mediaProgress.progress), mediaProgress.message);
      return;
    }
    if (mediaProgress.stage === "converting") {
      update(Math.max(12, Math.min(96, mediaProgress.progress)), mediaProgress.message);
      return;
    }
    update(100, mediaProgress.message);
  };

  const compressImage = async () => {
    if (!file) {
      setMessage("Choose an image first.");
      return;
    }

    await task.run("Compressing image...", async (update) => {
      update(20, "Optimizing image...");
      const blob = await compressImageFile(file, {
        quality: imageQuality,
        format: imageFormat,
        maxWidth: imageMaxWidth > 0 ? imageMaxWidth : undefined,
      });
      update(90, "Preparing download...");
      const resultStats = getCompressionStats(file.size, blob.size);
      const ext = imageFormat.split("/")[1];
      const name = file.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`;
      downloadBlob(blob, name);
      resetOutput();
      setPreviewUrl(URL.createObjectURL(blob));
      setOutputName(name);
      setStats(resultStats);
      update(100, "Image compressed.");
      setMessage(`Compressed ${file.name} successfully.`);
    });
  };

  const compressAudio = async () => {
    if (!file) {
      setMessage("Choose an audio file first.");
      return;
    }

    await task.run("Compressing audio...", async (update) => {
      const result = await compressAudioFile(file, audioBitrate, (mediaProgress) =>
        trackMediaProgress(update, mediaProgress),
      );
      if (!result.ok || !result.data) throw new Error(result.error ?? "Audio compression failed.");

      downloadBlob(result.data.blob, result.data.fileName);
      resetOutput();
      setPreviewUrl(URL.createObjectURL(result.data.blob));
      setOutputName(result.data.fileName);
      setStats(getCompressionStats(file.size, result.data.blob.size));
      setMessage(`Compressed ${file.name} successfully.`);
    });
  };

  const compressVideo = async () => {
    if (!file) {
      setMessage("Choose a video file first.");
      return;
    }

    const preset = VIDEO_PRESETS.find((item) => item.id === videoPreset) ?? VIDEO_PRESETS[1];

    await task.run("Compressing video...", async (update) => {
      const result = await compressVideoFile(file, preset.crf, (mediaProgress) =>
        trackMediaProgress(update, mediaProgress),
      );
      if (!result.ok || !result.data) throw new Error(result.error ?? "Video compression failed.");

      downloadBlob(result.data.blob, result.data.fileName);
      resetOutput();
      setPreviewUrl(URL.createObjectURL(result.data.blob));
      setOutputName(result.data.fileName);
      setStats(getCompressionStats(file.size, result.data.blob.size));
      setMessage(`Compressed ${file.name} successfully.`);
    });
  };

  const acceptMap: Record<CompressTab, string> = {
    image: "image/*",
    audio: "audio/*,.mp3,.wav,.aac,.m4a",
    video: "video/*,.mp4,.mov,.avi",
  };

  const handlerMap: Record<CompressTab, () => Promise<void>> = {
    image: compressImage,
    audio: compressAudio,
    video: compressVideo,
  };

  return (
    <div className="space-y-5">
      <div className="pd-tab-group">
        <button
          type="button"
          className={`pd-tab ${tab === "image" ? "pd-tab--active" : ""}`}
          onClick={() => handleTabChange("image")}
        >
          <span className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/image.svg" alt="" width={16} height={16} aria-hidden />
            Image
          </span>
        </button>
        <button
          type="button"
          className={`pd-tab ${tab === "audio" ? "pd-tab--active" : ""}`}
          onClick={() => handleTabChange("audio")}
        >
          <span className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/audio.svg" alt="" width={16} height={16} aria-hidden />
            Audio
          </span>
        </button>
        <button
          type="button"
          className={`pd-tab ${tab === "video" ? "pd-tab--active" : ""}`}
          onClick={() => handleTabChange("video")}
        >
          <span className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/video.svg" alt="" width={16} height={16} aria-hidden />
            Video
          </span>
        </button>
      </div>

      <OperationStatus
        active={task.active}
        progress={task.progress}
        message={task.message}
        error={task.error}
      />

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">
          Upload {tab} file
        </span>
        <input
          type="file"
          accept={acceptMap[tab]}
          className="pd-file-input"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
        />
      </label>

      {file && (
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="body-emphasized-14pt">{file.name}</p>
          <p className="body-secondary-info-14pt">Original size: {formatBytes(file.size)}</p>
        </div>
      )}

      {tab === "image" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="block">
            <span className="body-emphasized-14pt mb-2 block">Quality ({Math.round(imageQuality * 100)}%)</span>
            <input
              type="range"
              min={0.3}
              max={1}
              step={0.05}
              value={imageQuality}
              onChange={(event) => setImageQuality(Number(event.target.value))}
              className="w-full"
            />
          </label>
          <label className="block">
            <span className="body-emphasized-14pt mb-2 block">Max width (optional)</span>
            <input
              type="number"
              min={0}
              max={4000}
              placeholder="Keep original"
              value={imageMaxWidth || ""}
              onChange={(event) => setImageMaxWidth(Number(event.target.value))}
              className="pd-input"
            />
          </label>
          <label className="block">
            <span className="body-emphasized-14pt mb-2 block">Output format</span>
            <select
              value={imageFormat}
              onChange={(event) => setImageFormat(event.target.value as ImageOutputFormat)}
              className="pd-input"
            >
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WEBP</option>
              <option value="image/png">PNG</option>
            </select>
          </label>
        </div>
      )}

      {tab === "audio" && (
        <label className="block rounded-2xl border border-border bg-white p-4">
          <span className="body-emphasized-14pt mb-2 block">Bitrate: {audioBitrate} kbps</span>
          <input
            type="range"
            min={64}
            max={320}
            step={16}
            value={audioBitrate}
            onChange={(event) => setAudioBitrate(Number(event.target.value))}
            className="w-full"
          />
          <p className="body-secondary-info-14pt mt-2">
            Lower bitrate = smaller file. WAV files are exported as compressed MP3.
          </p>
        </label>
      )}

      {tab === "video" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {VIDEO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                videoPreset === preset.id
                  ? "border-accent bg-accent-light"
                  : "border-border bg-white hover:border-accent"
              }`}
              onClick={() => setVideoPreset(preset.id)}
            >
              <span className="body-emphasized-14pt block">{preset.label}</span>
              <span className="body-secondary-info-14pt mt-1 block">{preset.hint}</span>
            </button>
          ))}
        </div>
      )}

      <ActionButton loading={task.active} disabled={!file} onClick={handlerMap[tab]}>
        Compress & Download
      </ActionButton>

      {stats && (
        <SavingsCard
          originalSize={stats.originalSize}
          compressedSize={stats.compressedSize}
          savedPercent={stats.savedPercent}
        />
      )}

      {previewUrl && (
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="body-emphasized-14pt mb-3">{outputName}</p>
          {tab === "image" && (
            <img src={previewUrl} alt="Compressed preview" className="max-h-[360px] rounded-xl object-contain" />
          )}
          {tab === "audio" && <audio controls src={previewUrl} className="w-full" />}
          {tab === "video" && (
            <video controls src={previewUrl} className="max-h-[360px] w-full rounded-xl" />
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { downloadBlob } from "@/lib/tools/archive";
import { formatBytes } from "@/lib/tools/image";
import {
  convertMediaFile,
  getConversionForFile,
  MEDIA_CONVERSIONS,
  type MediaCategory,
  type MediaConversion,
} from "@/lib/tools/media";

export default function ConverterHubTool() {
  const task = useAsyncTask();
  const [category, setCategory] = useState<MediaCategory>("audio");
  const [file, setFile] = useState<File | null>(null);
  const [selectedConversion, setSelectedConversion] = useState<MediaConversion | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState("");
  const [outputSize, setOutputSize] = useState("");
  const [message, setMessage] = useState("");

  const availableConversions = useMemo(
    () => MEDIA_CONVERSIONS.filter((conversion) => conversion.category === category),
    [category],
  );

  const handleFileChange = (nextFile: File | null) => {
    setFile(nextFile);
    setSelectedConversion(null);
    setPreviewUrl("");
    setOutputBlob(null);
    setOutputName("");
    setOutputSize("");

    if (!nextFile) return;

    const match = getConversionForFile(nextFile, category);
    if (match) {
      setSelectedConversion(match);
      setMessage(`Ready to convert: ${match.label}`);
      return;
    }

    setMessage(
      `Unsupported format. Upload ${category === "audio" ? "MP3, WAV, AAC, or M4A" : "MP4, MOV, or AVI"}.`,
    );
  };

  const handleConvert = async () => {
    if (!file || !selectedConversion) {
      setMessage("Select a file and conversion type.");
      return;
    }

    await task.run(`Converting to ${selectedConversion.outputExt.toUpperCase()}...`, async (update) => {
      const result = await convertMediaFile(file, selectedConversion, (mediaProgress) => {
        if (mediaProgress.stage === "loading") {
          update(8, mediaProgress.message);
          return;
        }
        if (mediaProgress.stage === "converting") {
          update(Math.max(12, Math.min(96, mediaProgress.progress)), mediaProgress.message);
          return;
        }
        if (mediaProgress.stage === "done") {
          update(100, mediaProgress.message);
        }
      });

      if (!result.ok || !result.data) throw new Error(result.error ?? "Conversion failed.");

      downloadBlob(result.data.blob, result.data.fileName);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(result.data.blob));
      setOutputBlob(result.data.blob);
      setOutputName(result.data.fileName);
      setOutputSize(formatBytes(result.data.blob.size));
      setMessage(`Converted successfully: ${selectedConversion.label}`);
    });
  };

  return (
    <div className="space-y-5">
      <div className="pd-tab-group">
        <button
          type="button"
          className={`pd-tab ${category === "audio" ? "pd-tab--active" : ""}`}
          onClick={() => {
            setCategory("audio");
            handleFileChange(null);
            setMessage("");
          }}
        >
          <span className="flex items-center gap-2">
            <Image src="/assets/icons/audio.svg" alt="" width={16} height={16} aria-hidden />
            Audio
          </span>
        </button>
        <button
          type="button"
          className={`pd-tab ${category === "video" ? "pd-tab--active" : ""}`}
          onClick={() => {
            setCategory("video");
            handleFileChange(null);
            setMessage("");
          }}
        >
          <span className="flex items-center gap-2">
            <Image src="/assets/icons/video.svg" alt="" width={16} height={16} aria-hidden />
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

      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">
          Upload {category === "audio" ? "audio" : "video"} file
        </span>
        <input
          type="file"
          accept={category === "audio" ? "audio/*,.mp3,.wav,.aac,.m4a" : "video/*,.mp4,.mov,.avi"}
          className="pd-file-input"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
        />
      </label>

      {file && (
        <div className="rounded-2xl bg-page-bg p-4">
          <p className="body-emphasized-14pt">{file.name}</p>
          <p className="body-secondary-info-14pt">{formatBytes(file.size)}</p>
        </div>
      )}

      <div>
        <p className="body-emphasized-14pt mb-2">Conversion type</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {availableConversions.map((conversion) => (
            <button
              key={conversion.id}
              type="button"
              className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                selectedConversion?.id === conversion.id
                  ? "border-accent bg-accent-light"
                  : "border-border bg-page-bg hover:border-accent"
              }`}
              onClick={() => {
                setSelectedConversion(conversion);
                setMessage(`Selected: ${conversion.label}`);
              }}
            >
              <span className="body-emphasized-14pt">{conversion.label}</span>
            </button>
          ))}
        </div>
      </div>

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      <ActionButton
        loading={task.active}
        disabled={!file || !selectedConversion}
        onClick={handleConvert}
      >
        Convert & Download
      </ActionButton>

      {previewUrl && (
        <div className="rounded-2xl bg-page-bg p-4">
          <p className="body-emphasized-14pt mb-1">{outputName}</p>
          <p className="body-secondary-info-14pt mb-4">Output size: {outputSize}</p>
          {category === "audio" ? (
            <audio controls src={previewUrl} className="w-full" />
          ) : (
            <video controls src={previewUrl} className="max-h-[360px] w-full rounded-xl" />
          )}
          <div className="mt-4">
            <ActionButton
              variant="secondary"
              onClick={() => {
                if (outputBlob) downloadBlob(outputBlob, outputName);
              }}
            >
              Download Again
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}

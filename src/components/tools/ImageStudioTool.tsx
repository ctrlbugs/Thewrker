"use client";

import { useEffect, useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useApiIntegrations } from "@/hooks/useApiIntegrations";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { removeBackgroundViaApi } from "@/lib/api/client";
import { downloadBlob } from "@/lib/tools/archive";
import { removeImageBackground } from "@/lib/tools/background-removal";
import {
  formatBytes,
  processImageFile,
  type ImageOutputFormat,
} from "@/lib/tools/image";

type Tab = "edit" | "remove-bg";

export default function ImageStudioTool() {
  const task = useAsyncTask();
  const { status: apiStatus } = useApiIntegrations();
  const [tab, setTab] = useState<Tab>("edit");
  const [file, setFile] = useState<File | null>(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState("");
  const [maxWidth, setMaxWidth] = useState(800);
  const [quality, setQuality] = useState(0.85);
  const [format, setFormat] = useState<ImageOutputFormat>("image/jpeg");
  const [previewUrl, setPreviewUrl] = useState("");
  const [outputSize, setOutputSize] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!file) {
      setSourcePreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setSourcePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const resetOutput = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setOutputSize("");
  };

  const handleFileChange = (nextFile: File | null) => {
    setFile(nextFile);
    resetOutput();
    setMessage(nextFile ? `Loaded ${nextFile.name}` : "");
  };

  const process = async () => {
    if (!file) {
      setMessage("Choose an image first.");
      return;
    }

    await task.run("Processing image...", async (update) => {
      update(15, "Loading image...");
      update(45, "Resizing and converting...");
      const blob = await processImageFile(file, { maxWidth, format, quality });
      update(90, "Preparing download...");
      resetOutput();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setOutputSize(formatBytes(blob.size));
      downloadBlob(blob, `thewrker-image.${format.split("/")[1]}`);
      update(100, "Image ready.");
      setMessage(`Processed ${file.name} successfully.`);
    });
  };

  const removeBackground = async () => {
    if (!file) {
      setMessage("Choose an image first.");
      return;
    }

    await task.run("Removing background...", async (update) => {
      let blob: Blob;

      if (apiStatus["remove-bg"]) {
        try {
          update(20, "Removing background...");
          blob = await removeBackgroundViaApi(file);
          update(95, "Almost done...");
        } catch {
          blob = await removeImageBackground(file, (progress) => {
            if (progress.stage === "loading") {
              update(Math.max(8, progress.progress), progress.message);
              return;
            }
            if (progress.stage === "fetch") {
              update(Math.max(12, Math.min(45, progress.progress)), progress.message);
              return;
            }
            if (progress.stage === "compute") {
              update(Math.max(46, Math.min(96, progress.progress)), progress.message);
              return;
            }
            update(100, progress.message);
          });
        }
      } else {
        blob = await removeImageBackground(file, (progress) => {
          if (progress.stage === "loading") {
            update(Math.max(8, progress.progress), progress.message);
            return;
          }
          if (progress.stage === "fetch") {
            update(Math.max(12, Math.min(45, progress.progress)), progress.message);
            return;
          }
          if (progress.stage === "compute") {
            update(Math.max(46, Math.min(96, progress.progress)), progress.message);
            return;
          }
          update(100, progress.message);
        });
      }

      resetOutput();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setOutputSize(formatBytes(blob.size));
      const baseName = file.name.replace(/\.[^.]+$/, "");
      downloadBlob(blob, `${baseName}-no-bg.png`);
      update(100, "Transparent PNG ready.");
      setMessage(`Background removed from ${file.name}.`);
    });
  };

  return (
    <div className="space-y-5">
      <div className="pd-tab-group">
        <button
          type="button"
          className={`pd-tab ${tab === "edit" ? "pd-tab--active" : ""}`}
          onClick={() => setTab("edit")}
        >
          Resize & Convert
        </button>
        <button
          type="button"
          className={`pd-tab ${tab === "remove-bg" ? "pd-tab--active" : ""}`}
          onClick={() => setTab("remove-bg")}
        >
          Remove Background
        </button>
      </div>

      {tab === "remove-bg" && (
        <p className="body-secondary-info-14pt rounded-2xl border border-border bg-white px-4 py-3">
          AI-powered background removal runs privately in your browser. First use may download a
          model (~40MB); later runs are faster.
        </p>
      )}

      <OperationStatus
        active={task.active}
        progress={task.progress}
        message={task.message}
        error={task.error}
      />

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">Upload Image</span>
        <input
          type="file"
          accept="image/*"
          className="pd-file-input"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
        />
      </label>

      {sourcePreviewUrl && (
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="body-emphasized-14pt mb-3">Original</p>
          <img
            src={sourcePreviewUrl}
            alt="Original preview"
            className="max-h-[280px] rounded-xl object-contain"
          />
        </div>
      )}

      {tab === "edit" ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block">
              <span className="body-emphasized-14pt mb-2 block">Max Width (px)</span>
              <input
                type="number"
                min={100}
                max={4000}
                value={maxWidth}
                onChange={(event) => setMaxWidth(Number(event.target.value))}
                className="pd-input"
              />
            </label>
            <label className="block">
              <span className="body-emphasized-14pt mb-2 block">Quality</span>
              <input
                type="number"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="pd-input"
              />
            </label>
            <label className="block">
              <span className="body-emphasized-14pt mb-2 block">Output Format</span>
              <select
                value={format}
                onChange={(event) => setFormat(event.target.value as ImageOutputFormat)}
                className="pd-input"
              >
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </label>
          </div>

          <ActionButton loading={task.active} disabled={!file} onClick={process}>
            Process Image
          </ActionButton>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="body-emphasized-14pt mb-1">Output</p>
            <p className="body-secondary-info-14pt">
              Transparent PNG — ideal for logos, product photos, and profile cutouts.
            </p>
          </div>

          <ActionButton loading={task.active} disabled={!file} onClick={removeBackground}>
            Remove Background
          </ActionButton>
        </>
      )}

      {previewUrl && (
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="body-secondary-info-14pt mb-3">Output size: {outputSize}</p>
          <div
            className="inline-block max-w-full rounded-xl p-4"
            style={{
              background:
                "linear-gradient(45deg, #ececec 25%, transparent 25%), linear-gradient(-45deg, #ececec 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ececec 75%), linear-gradient(-45deg, transparent 75%, #ececec 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
              backgroundColor: "#ffffff",
            }}
          >
            <img
              src={previewUrl}
              alt="Processed preview"
              className="max-h-[420px] object-contain"
            />
          </div>
          <div className="mt-4">
            <ActionButton
              variant="secondary"
              onClick={() => {
                if (!previewUrl) return;
                fetch(previewUrl)
                  .then((response) => response.blob())
                  .then((blob) => {
                    const ext = tab === "remove-bg" ? "png" : format.split("/")[1];
                    downloadBlob(blob, `thewrker-image.${ext}`);
                  });
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

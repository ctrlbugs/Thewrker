"use client";

import { useMemo, useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import {
  compressZip,
  createZip,
  downloadBlob,
  extractZip,
  extractZipEntry,
  listZipEntries,
  type ArchiveEntry,
  type ZipCompressionLevel,
} from "@/lib/tools/archive";
import { formatBytes } from "@/lib/tools/image";

type Tab = "create" | "extract" | "compress";

export default function ArchiveStudioTool() {
  const task = useAsyncTask();
  const [tab, setTab] = useState<Tab>("create");
  const [createFiles, setCreateFiles] = useState<File[]>([]);
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<ZipCompressionLevel>(9);
  const [message, setMessage] = useState("");

  const compressionHint = useMemo(() => {
    if (compressionLevel >= 8) return "Maximum compression — smaller file, slower processing.";
    if (compressionLevel >= 5) return "Balanced compression.";
    return "Fast compression — larger file size.";
  }, [compressionLevel]);

  const loadArchive = async (file: File | null) => {
    setArchiveFile(file);
    setEntries([]);
    if (!file) return;

    const result = await listZipEntries(file);
    if (!result.ok || !result.data) {
      setMessage(result.error ?? "Unable to read archive.");
      return;
    }

    setEntries(result.data);
    setMessage(`Found ${result.data.filter((entry) => !entry.isDirectory).length} files.`);
  };

  const handleCreateZip = async () => {
    await task.run("Creating ZIP archive...", async (update) => {
      const result = await createZip(createFiles, compressionLevel, update);
      if (!result.ok || !result.data) throw new Error(result.error ?? "Archive creation failed.");
      downloadBlob(result.data, "thewrker-archive.zip");
      setMessage(`Created ZIP with ${createFiles.length} file(s).`);
    });
  };

  const handleCompressZip = async () => {
    if (!compressFile) {
      setMessage("Upload a ZIP file to compress.");
      return;
    }

    await task.run("Compressing ZIP archive...", async (update) => {
      const result = await compressZip(compressFile, compressionLevel, update);
      if (!result.ok || !result.data) throw new Error(result.error ?? "Compression failed.");
      downloadBlob(
        result.data.blob,
        compressFile.name.replace(/\.zip$/i, "-compressed.zip"),
      );
      setMessage(
        `Compressed ${formatBytes(result.data.originalSize)} → ${formatBytes(result.data.compressedSize)} (${result.data.savedPercent}% smaller).`,
      );
    });
  };

  const handleExtractAll = async () => {
    if (!archiveFile) {
      setMessage("Upload a ZIP file first.");
      return;
    }

    await task.run("Extracting archive...", async (update) => {
      const result = await extractZip(archiveFile, update);
      if (!result.ok || !result.data) throw new Error(result.error ?? "Extraction failed.");
      result.data.forEach((item) => {
        downloadBlob(item.blob, item.name.split("/").pop() ?? item.name);
      });
      setMessage(`Extracted ${result.data.length} file(s).`);
    });
  };

  const handleExtractOne = async (entryName: string) => {
    if (!archiveFile) return;

    await task.run(`Extracting ${entryName}...`, async (update) => {
      update(20, `Extracting ${entryName}...`);
      const result = await extractZipEntry(archiveFile, entryName);
      if (!result.ok || !result.data) throw new Error(result.error ?? "Extraction failed.");
      downloadBlob(result.data.blob, result.data.name.split("/").pop() ?? result.data.name);
      update(100, "Download ready.");
      setMessage(`Downloaded ${entryName}.`);
    });
  };

  return (
    <div className="space-y-5">
      <div className="pd-tab-group">
        {(["create", "extract", "compress"] as Tab[]).map((item) => (
          <button
            key={item}
            type="button"
            className={`pd-tab ${tab === item ? "pd-tab--active" : ""}`}
            onClick={() => setTab(item)}
          >
            {item === "create" ? "Create ZIP" : item === "extract" ? "Extract ZIP" : "Compress ZIP"}
          </button>
        ))}
      </div>

      <CompressionControl
        level={compressionLevel}
        hint={compressionHint}
        onChange={setCompressionLevel}
      />

      <OperationStatus
        active={task.active}
        progress={task.progress}
        message={task.message}
        error={task.error}
      />

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      {tab === "create" && (
        <div className="space-y-4">
          <label className="block">
            <span className="body-emphasized-14pt mb-2 block">Select files to compress</span>
            <input
              type="file"
              multiple
              className="pd-file-input"
              onChange={(event) => setCreateFiles(Array.from(event.target.files ?? []))}
            />
          </label>
          {createFiles.length > 0 && (
            <FileList files={createFiles} />
          )}
          <ActionButton
            loading={task.active}
            disabled={createFiles.length === 0}
            onClick={handleCreateZip}
          >
            Create & Download ZIP
          </ActionButton>
        </div>
      )}

      {tab === "extract" && (
        <div className="space-y-4">
          <label className="block">
            <span className="body-emphasized-14pt mb-2 block">Upload ZIP archive</span>
            <input
              type="file"
              accept=".zip,application/zip"
              className="pd-file-input"
              onChange={(event) => loadArchive(event.target.files?.[0] ?? null)}
            />
          </label>
          {entries.length > 0 && (
            <div className="pd-data-table">
              <div className="pd-data-table-head">
                <span className="body-emphasized-14pt">File</span>
                <span className="body-emphasized-14pt">Size</span>
                <span className="body-emphasized-14pt">Action</span>
              </div>
              <ul className="custom-scrollbar max-h-[320px] overflow-y-auto">
                {entries
                  .filter((entry) => !entry.isDirectory)
                  .map((entry) => (
                    <li key={entry.name} className="pd-data-table-row">
                      <span className="body-regular-14 truncate">{entry.name}</span>
                      <span className="body-secondary-info-14pt">{formatBytes(entry.size)}</span>
                      <ActionButton
                        variant="secondary"
                        loading={task.active}
                        onClick={() => handleExtractOne(entry.name)}
                      >
                        Download
                      </ActionButton>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <ActionButton loading={task.active} disabled={!archiveFile} onClick={handleExtractAll}>
            Extract All Files
          </ActionButton>
        </div>
      )}

      {tab === "compress" && (
        <div className="space-y-4">
          <label className="block">
            <span className="body-emphasized-14pt mb-2 block">Upload ZIP to re-compress</span>
            <input
              type="file"
              accept=".zip,application/zip"
              className="pd-file-input"
              onChange={(event) => setCompressFile(event.target.files?.[0] ?? null)}
            />
          </label>
          {compressFile && (
            <div className="rounded-2xl bg-page-bg p-4">
              <p className="body-emphasized-14pt">{compressFile.name}</p>
              <p className="body-secondary-info-14pt">
                Original size: {formatBytes(compressFile.size)}
              </p>
            </div>
          )}
          <ActionButton loading={task.active} disabled={!compressFile} onClick={handleCompressZip}>
            Compress & Download ZIP
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function CompressionControl({
  level,
  hint,
  onChange,
}: {
  level: ZipCompressionLevel;
  hint: string;
  onChange: (level: ZipCompressionLevel) => void;
}) {
  return (
    <div className="rounded-2xl bg-page-bg p-4">
      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">Compression level: {level}</span>
        <input
          type="range"
          min={1}
          max={9}
          value={level}
          onChange={(event) => onChange(Number(event.target.value) as ZipCompressionLevel)}
          className="w-full"
        />
      </label>
      <p className="body-secondary-info-14pt mt-2">{hint}</p>
    </div>
  );
}

function FileList({ files }: { files: File[] }) {
  return (
    <ul className="space-y-2 rounded-2xl bg-page-bg p-4">
      {files.map((file, index) => (
        <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 body-regular-14">
          <span>{file.name}</span>
          <span className="body-secondary-info-14pt">{formatBytes(file.size)}</span>
        </li>
      ))}
    </ul>
  );
}

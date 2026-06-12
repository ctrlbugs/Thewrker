"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import {
  downloadBlob,
  extractPdfPages,
  getPdfInfo,
  mergePdfs,
  parsePageRange,
  splitPdfAllPages,
  type PdfInfo,
} from "@/lib/tools/pdf";
import { formatBytes } from "@/lib/tools/image";

type Tab = "merge" | "split";

export default function PdfStudioTool() {
  const task = useAsyncTask();
  const [tab, setTab] = useState<Tab>("merge");
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [pageRange, setPageRange] = useState("1");
  const [message, setMessage] = useState("");

  const loadSplitPdf = async (file: File | null) => {
    setSplitFile(file);
    setPdfInfo(null);
    if (!file) return;

    const info = await getPdfInfo(file);
    if (!info.ok || !info.data) {
      setMessage(info.error ?? "Unable to read PDF.");
      return;
    }

    setPdfInfo(info.data);
    setPageRange(`1-${info.data.pageCount}`);
    setMessage(`${info.data.pageCount} pages loaded.`);
  };

  const handleMerge = async () => {
    await task.run("Merging PDF files...", async (update) => {
      const result = await mergePdfs(mergeFiles, update);
      if (!result.ok || !result.data) throw new Error(result.error ?? "Merge failed.");
      downloadBlob(result.data, "thewrker-merged.pdf");
      setMessage(`Merged ${mergeFiles.length} PDFs successfully.`);
    });
  };

  const handleExtractRange = async () => {
    if (!splitFile || !pdfInfo) {
      setMessage("Upload a PDF first.");
      return;
    }

    const pages = parsePageRange(pageRange, pdfInfo.pageCount);
    if (!pages.ok || !pages.data) {
      setMessage(pages.error ?? "Invalid page range.");
      return;
    }

    await task.run("Extracting PDF pages...", async (update) => {
      const result = await extractPdfPages(splitFile, pages.data!, update);
      if (!result.ok || !result.data) throw new Error(result.error ?? "Split failed.");
      downloadBlob(result.data, splitFile.name.replace(/\.pdf$/i, "-extract.pdf"));
      setMessage(`Extracted ${pages.data!.length} page(s).`);
    });
  };

  const handleSplitAll = async () => {
    if (!splitFile) {
      setMessage("Upload a PDF first.");
      return;
    }

    await task.run("Splitting PDF into pages...", async (update) => {
      const result = await splitPdfAllPages(splitFile, update);
      if (!result.ok || !result.data) throw new Error(result.error ?? "Split failed.");
      result.data.forEach((item) => downloadBlob(item.blob, item.name));
      setMessage(`Split into ${result.data.length} separate PDF files.`);
    });
  };

  return (
    <div className="space-y-5">
      <div className="pd-tab-group">
        <button
          type="button"
          className={`pd-tab ${tab === "merge" ? "pd-tab--active" : ""}`}
          onClick={() => setTab("merge")}
        >
          Merge PDFs
        </button>
        <button
          type="button"
          className={`pd-tab ${tab === "split" ? "pd-tab--active" : ""}`}
          onClick={() => setTab("split")}
        >
          Split PDF
        </button>
      </div>

      <OperationStatus
        active={task.active}
        progress={task.progress}
        message={task.message}
        error={task.error}
      />

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      {tab === "merge" ? (
        <div className="space-y-4">
          <label className="block">
            <span className="body-emphasized-14pt mb-2 block">Select PDF files (2 or more)</span>
            <input
              type="file"
              accept="application/pdf"
              multiple
              className="pd-file-input"
              onChange={(event) => setMergeFiles(Array.from(event.target.files ?? []))}
            />
          </label>
          {mergeFiles.length > 0 && (
            <ul className="space-y-2 rounded-2xl bg-page-bg p-4">
              {mergeFiles.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex justify-between gap-3 body-regular-14">
                  <span>{index + 1}. {file.name}</span>
                  <span className="body-secondary-info-14pt">{formatBytes(file.size)}</span>
                </li>
              ))}
            </ul>
          )}
          <ActionButton loading={task.active} disabled={mergeFiles.length < 2} onClick={handleMerge}>
            Merge & Download
          </ActionButton>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block">
            <span className="body-emphasized-14pt mb-2 block">Upload PDF</span>
            <input
              type="file"
              accept="application/pdf"
              className="pd-file-input"
              onChange={(event) => loadSplitPdf(event.target.files?.[0] ?? null)}
            />
          </label>
          {pdfInfo && (
            <div className="rounded-2xl bg-page-bg p-4">
              <p className="body-emphasized-14pt">{pdfInfo.fileName}</p>
              <p className="body-secondary-info-14pt">
                {pdfInfo.pageCount} pages · {formatBytes(pdfInfo.fileSize)}
              </p>
            </div>
          )}
          <label className="block">
            <span className="body-emphasized-14pt mb-2 block">Page range (e.g. 1-3, 5)</span>
            <input
              value={pageRange}
              onChange={(event) => setPageRange(event.target.value)}
              className="pd-input font-mono text-sm"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <ActionButton loading={task.active} disabled={!splitFile} onClick={handleExtractRange}>
              Extract Pages
            </ActionButton>
            <ActionButton
              variant="secondary"
              loading={task.active}
              disabled={!splitFile}
              onClick={handleSplitAll}
            >
              Split Every Page
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import FileDropzone from "@/components/ui/FileDropzone";
import OperationStatus from "@/components/ui/OperationStatus";
import { useApiIntegrations } from "@/hooks/useApiIntegrations";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { runWebPlagiarismCheck } from "@/lib/api/client";
import { extractTextFromFile } from "@/lib/tools/document-extract";
import { formatBytes } from "@/lib/tools/image";
import {
  analyzePlagiarism,
  mergeWebScanResults,
  type PlagiarismReport,
} from "@/lib/tools/plagiarism";

type InputMode = "upload" | "paste";

function scoreClass(score: number): string {
  if (score >= 75) return "pd-score-ring--good";
  if (score >= 50) return "pd-score-ring--warn";
  return "pd-score-ring--risk";
}

export default function PlagiarismStudioTool() {
  const task = useAsyncTask();
  const { status: apiStatus } = useApiIntegrations();
  const [mode, setMode] = useState<InputMode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [referenceText, setReferenceText] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [report, setReport] = useState<PlagiarismReport | null>(null);
  const [message, setMessage] = useState("");

  const runCheck = async () => {
    await task.run("Analyzing document...", async (update) => {
      let text = documentText;

      if (mode === "paste") {
        text = pastedText;
      } else if (file) {
        update(20, "Extracting text from document...");
        const extracted = await extractTextFromFile(file);
        if (!extracted.ok || !extracted.data) {
          throw new Error(extracted.error ?? "Could not read document.");
        }
        text = extracted.data;
        setDocumentText(text);
      } else {
        throw new Error("Upload a document or paste text to check.");
      }

      update(55, "Scanning for repeated and overlapping patterns...");
      const result = analyzePlagiarism(text, referenceText || undefined);
      if (!result.ok || !result.data) {
        throw new Error(result.error ?? "Plagiarism analysis failed.");
      }

      let finalReport = result.data;

      if (apiStatus.webSearch) {
        try {
          update(72, "Checking for matching content online...");
          const webResult = await runWebPlagiarismCheck(text);
          finalReport = mergeWebScanResults(finalReport, webResult);
        } catch {
          // Web scan unavailable — continue with local analysis only.
        }
      }

      update(100, "Analysis complete.");
      setReport(finalReport);
      setMessage(finalReport.summary);
    });
  };

  return (
    <div className="space-y-5">
      <p className="body-secondary-info-14pt rounded-2xl border border-border bg-white px-4 py-3">
        Upload PDF, DOCX, TXT, MD, RTF, or CSV — or paste your document directly. Analysis checks
        originality, repetition, and online matches where available.
      </p>

      <div className="pd-tab-group">
        <button
          type="button"
          className={`pd-tab ${mode === "upload" ? "pd-tab--active" : ""}`}
          onClick={() => setMode("upload")}
        >
          Upload Document
        </button>
        <button
          type="button"
          className={`pd-tab ${mode === "paste" ? "pd-tab--active" : ""}`}
          onClick={() => setMode("paste")}
        >
          Paste Text
        </button>
      </div>

      <OperationStatus
        active={task.active}
        progress={task.progress}
        message={task.message}
        error={task.error}
      />

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      {mode === "upload" ? (
        <FileDropzone
          category="document"
          accept=".pdf,.docx,.txt,.md,.markdown,.rtf,.csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          hint="PDF, DOCX, TXT, MD, RTF, CSV · Max 15 MB"
          disabled={task.active}
          onError={(error) => setMessage(error)}
          onFile={(nextFile) => {
            setFile(nextFile);
            setReport(null);
            setDocumentText("");
            setMessage(nextFile ? `Selected ${nextFile.name} (${formatBytes(nextFile.size)})` : "");
          }}
        />
      ) : (
        <label className="block">
          <span className="body-emphasized-14pt mb-2 block">Paste document text</span>
          <textarea
            className="pd-textarea min-h-[220px] font-[var(--font-manrope)] text-sm"
            value={pastedText}
            onChange={(event) => {
              setPastedText(event.target.value);
              setReport(null);
            }}
            placeholder="Paste essay, article, or assignment text here..."
          />
        </label>
      )}

      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">
          Reference text (optional)
        </span>
        <textarea
          className="pd-textarea min-h-[120px] font-[var(--font-manrope)] text-sm"
          value={referenceText}
          onChange={(event) => setReferenceText(event.target.value)}
          placeholder="Paste source material to compare against (optional)..."
        />
      </label>

      <ActionButton
        loading={task.active}
        disabled={mode === "upload" ? !file : pastedText.trim().length < 80}
        onClick={runCheck}
      >
        Run Plagiarism Check
      </ActionButton>

      {report && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-white p-5 md:grid-cols-[auto_1fr]">
            <div className={`pd-score-ring ${scoreClass(report.originalityScore)}`}>
              <div className="text-center">
                <p className="text-30-extrabold">{report.originalityScore}%</p>
                <p className="body-secondary-info-14pt">Originality</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Words" value={String(report.wordCount)} />
              <Stat label="Sentences" value={String(report.sentenceCount)} />
              <Stat label="Unique words" value={`${report.uniqueWordRatio}%`} />
              <Stat
                label="Reference match"
                value={
                  report.referenceSimilarity === null
                    ? "N/A"
                    : `${report.referenceSimilarity}%`
                }
              />
              {report.webScan?.enabled && (
                <>
                  <Stat label="Web searches" value={String(report.webScan.searchesRun)} />
                  <Stat label="Web matches" value={String(report.webScan.matchesFound)} />
                </>
              )}
            </div>
          </div>

          {report.flags.length > 0 ? (
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="body-emphasized-14pt mb-3">Flagged patterns ({report.flags.length})</p>
              <ul className="space-y-3">
                {report.flags.map((flag, index) => (
                  <li
                    key={`${flag.text}-${index}`}
                    className="rounded-xl border border-border bg-page-bg px-4 py-3"
                  >
                    <p className="body-emphasized-14pt mb-1 capitalize">{flag.severity} · {flag.reason}</p>
                    <p className="body-regular-14">{flag.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="body-regular-14">No significant overlap patterns were detected.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-page-bg p-3 text-center">
      <p className="text-22-bold">{value}</p>
      <p className="body-secondary-info-14pt">{label}</p>
    </div>
  );
}

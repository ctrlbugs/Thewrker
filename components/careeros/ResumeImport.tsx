"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Link2,
  Linkedin,
  ClipboardPaste,
  Upload,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { extractTextFromFile } from "@/lib/tools/document-extract";
import {
  RESUME_IMPORT_KEY,
  aiCleanDraft,
  parseResumeText,
  saveDraft,
  seedFromImportMeta,
  type ResumeDraft,
} from "@/lib/careeros/resume-draft";
import "@/app/careeros.css";

type ImportMode = "file" | "linkedin" | "paste";
type ImportPhase =
  | "idle"
  | "importing"
  | "analyzing"
  | "done"
  | "error";

const PHASE_COPY: Record<
  Exclude<ImportPhase, "idle" | "error">,
  { title: string; sub: string; progress: number }
> = {
  importing: {
    title: "Importing resume…",
    sub: "Reading your file and pulling out the content",
    progress: 35,
  },
  analyzing: {
    title: "Analyzing content…",
    sub: "Mapping sections and polishing your draft",
    progress: 72,
  },
  done: {
    title: "Uploaded",
    sub: "Your resume is ready in the builder",
    progress: 100,
  },
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function ResumeImport() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ImportMode>("file");
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [paste, setPaste] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [phase, setPhase] = useState<ImportPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);

  const busy = phase === "importing" || phase === "analyzing";
  const complete = phase === "done";

  const canContinue =
    mode === "file"
      ? Boolean(file)
      : mode === "linkedin"
        ? linkedIn.trim().length > 8
        : paste.trim().length > 40;

  const acceptFile = useCallback((next?: File | null) => {
    setError(null);
    setWarn(null);
    if (!next) return;
    const ok = /\.(pdf|doc|docx)$/i.test(next.name);
    if (!ok) {
      setError("Please upload a .pdf, .doc, or .docx file.");
      return;
    }
    if (next.size > 50 * 1024 * 1024) {
      setError("File must be 50 MB or smaller.");
      return;
    }
    setFile(next);
    setPhase("idle");
    setProgress(0);
  }, []);

  const clearFile = () => {
    setFile(null);
    setError(null);
    setWarn(null);
    setPhase("idle");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const persistAndFinish = async (draft: ResumeDraft) => {
    saveDraft(draft);
    try {
      localStorage.setItem(
        RESUME_IMPORT_KEY,
        JSON.stringify({
          mode,
          fileName: file?.name ?? null,
          linkedIn,
          pasteLength: paste.length,
          at: Date.now(),
        })
      );
    } catch {
      /* ignore */
    }
    setProgress(100);
    setPhase("done");
  };

  const handleContinue = async () => {
    if (!canContinue || busy || complete) return;
    setError(null);
    setWarn(null);
    setPhase("importing");
    setProgress(12);

    try {
      let draft = seedFromImportMeta({
        mode,
        fileName: file?.name,
        linkedIn,
        paste,
      });

      if (mode === "file" && file) {
        setProgress(28);
        await sleep(320);
        setProgress(42);
        const result = await extractTextFromFile(file);
        const extracted = result.ok ? result.data?.trim() ?? "" : "";

        setPhase("analyzing");
        setProgress(58);
        await sleep(280);

        if (extracted.length > 40) {
          draft = parseResumeText(extracted, file.name);
          setProgress(82);
        } else {
          draft = seedFromImportMeta({ mode: "file", fileName: file.name });
          setWarn(
            result.ok
              ? "Little text found — we seeded a draft you can edit."
              : result.error ||
                  "Could not fully read this file — you can still refine a draft."
          );
          setProgress(78);
        }

        await sleep(360);
        draft = aiCleanDraft(draft);
        setProgress(94);
        await sleep(220);
      } else if (mode === "paste") {
        setProgress(40);
        await sleep(280);
        setPhase("analyzing");
        setProgress(65);
        draft = parseResumeText(paste);
        await sleep(320);
        draft = aiCleanDraft(draft);
        setProgress(92);
        await sleep(200);
      } else {
        setProgress(40);
        await sleep(300);
        setPhase("analyzing");
        setProgress(70);
        draft.personalInfo.linkedIn = linkedIn.trim();
        await sleep(350);
        setProgress(90);
        await sleep(180);
      }

      await persistAndFinish(draft);
    } catch {
      setError("Import failed. Try another file or paste your text.");
      setPhase("error");
      setProgress(0);
    }
  };

  const openBuilder = () => {
    router.replace("/dashboard/careeros/builder?imported=1");
  };

  const fileSizeLabel = file
    ? file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(file.size / 1024))} KB`
    : "";

  const phaseMeta =
    phase === "importing" || phase === "analyzing" || phase === "done"
      ? PHASE_COPY[phase]
      : null;

  const displayProgress =
    phase === "done" ? 100 : Math.max(progress, phaseMeta?.progress ?? 0);

  return (
    <div className="cos-root cos-import-shell">
      <div className="cos-import-card">
        <div className="cos-import-card-head">
          <span className="cos-import-mark">
            <FileText className="h-4 w-4" />
          </span>
          <p className="cos-import-kicker">CareerOS · Resume Builder</p>
        </div>

        <h1 className="cos-import-title">
          Let&apos;s import your
          <br />
          career history
        </h1>
        <p className="cos-import-lead">
          One calm upload — then refine with live preview, templates, and AI that
          keeps your voice.
        </p>

        {!complete && (
          <>
            <h2 className="cos-import-question">
              How would you like to add your career information?
            </h2>

            <div className="cos-seg" role="tablist" aria-label="Import method">
              {(
                [
                  { id: "file", label: "Resume File", icon: FileText },
                  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
                  { id: "paste", label: "Paste Text", icon: ClipboardPaste },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={mode === id}
                  disabled={busy}
                  className={cn(mode === id && "is-active")}
                  onClick={() => {
                    if (busy) return;
                    setMode(id);
                    setError(null);
                    setWarn(null);
                  }}
                >
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">
                      {id === "file"
                        ? "File"
                        : id === "linkedin"
                          ? "Link"
                          : "Paste"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {mode === "file" && !complete && (
          <div
            className={cn(
              "cos-drop",
              dragOver && "is-active",
              file && !busy && "is-ready",
              busy && "is-busy"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              if (!busy) setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (!busy) acceptFile(e.dataTransfer.files?.[0]);
            }}
          >
            {busy ? (
              <div className="cos-import-progress" role="status" aria-live="polite">
                <div className="cos-import-progress-icon" aria-hidden>
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
                <p className="cos-import-progress-title">
                  {phaseMeta?.title ?? "Importing resume…"}
                </p>
                <p className="cos-import-progress-sub">
                  {file?.name
                    ? `Working on ${file.name}`
                    : phaseMeta?.sub}
                </p>
                <div
                  className="cos-progress-track"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={displayProgress}
                  role="progressbar"
                >
                  <div
                    className="cos-progress-fill"
                    style={{ width: `${displayProgress}%` }}
                  />
                </div>
                <div className="cos-progress-meta">
                  <span>
                    {phase === "importing" ? "Importing" : "Analyzing"}
                  </span>
                  <span>{Math.round(displayProgress)}%</span>
                </div>
                <ul className="cos-progress-steps">
                  <li className={cn(phase !== "idle" && "is-done")}>
                    Import resume
                  </li>
                  <li
                    className={cn(
                      phase === "analyzing" && "is-active",
                      phase === "done" && "is-done"
                    )}
                  >
                    Analyze content
                  </li>
                  <li>Open builder</li>
                </ul>
              </div>
            ) : file ? (
              <div className="cos-file-ready">
                <div className="cos-file-ready-icon">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="cos-file-ready-meta">
                  <p className="cos-file-ready-name">{file.name}</p>
                  <p className="cos-file-ready-size">
                    {fileSizeLabel} · Ready to import
                  </p>
                </div>
                <button
                  type="button"
                  className="cos-file-ready-remove"
                  onClick={clearFile}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="cos-drop-icon">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="cos-drop-title">
                  Choose a file or drag and drop it here
                </p>
                <p className="cos-drop-hint">.doc, .docx or .pdf — up to 50 MB</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf"
                  className="hidden"
                  onChange={(e) => acceptFile(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="cos-btn cos-btn--ghost cos-btn--equal mt-4"
                >
                  Browse file
                </button>
              </>
            )}
          </div>
        )}

        {mode !== "file" && busy && (
          <div className="cos-drop is-busy mt-4">
            <div className="cos-import-progress" role="status" aria-live="polite">
              <div className="cos-import-progress-icon" aria-hidden>
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <p className="cos-import-progress-title">
                {phaseMeta?.title ?? "Importing…"}
              </p>
              <p className="cos-import-progress-sub">{phaseMeta?.sub}</p>
              <div
                className="cos-progress-track"
                role="progressbar"
                aria-valuenow={displayProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="cos-progress-fill"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
              <div className="cos-progress-meta">
                <span>
                  {phase === "importing" ? "Importing" : "Analyzing"}
                </span>
                <span>{Math.round(displayProgress)}%</span>
              </div>
            </div>
          </div>
        )}

        {mode === "linkedin" && !busy && !complete && (
          <div className="mt-5 space-y-3">
            <label className="block text-sm font-semibold text-[#21386B]">
              LinkedIn profile URL
            </label>
            <div className="cos-field">
              <Link2 className="h-4 w-4 text-[#8a97ab]" />
              <input
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                placeholder="https://www.linkedin.com/in/your-name"
              />
            </div>
            <p className="text-xs leading-relaxed text-[#5b6b85]">
              We&apos;ll attach the URL to your master resume. You stay in control
              of every section before export.
            </p>
          </div>
        )}

        {mode === "paste" && !busy && !complete && (
          <div className="mt-5 space-y-3">
            <label className="block text-sm font-semibold text-[#21386B]">
              Paste resume text
            </label>
            <textarea
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              rows={7}
              placeholder="Paste your resume content here…"
              className="cos-import-textarea"
            />
          </div>
        )}

        {complete && (
          <div className="cos-import-done" role="status" aria-live="polite">
            <div className="cos-import-done-alert">
              <span className="cos-import-done-icon" aria-hidden>
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <p className="cos-import-done-title">Done — resume uploaded</p>
                <p className="cos-import-done-sub">
                  {file?.name
                    ? `${file.name} is ready. Open the builder to review and refine.`
                    : "Your career history is ready. Open the builder to review and refine."}
                </p>
              </div>
            </div>
            <div
              className="cos-progress-track cos-progress-track--done"
              role="progressbar"
              aria-valuenow={100}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="cos-progress-fill" style={{ width: "100%" }} />
            </div>
            <div className="cos-progress-meta">
              <span>Complete</span>
              <span>100%</span>
            </div>
            {warn && <p className="cos-import-warn">{warn}</p>}
          </div>
        )}

        {error && <p className="cos-import-error">{error}</p>}
        {warn && !complete && <p className="cos-import-warn">{warn}</p>}

        <div className="cos-import-actions mt-6">
          {complete ? (
            <button
              type="button"
              onClick={openBuilder}
              className="cos-btn cos-btn--primary cos-btn--equal cos-import-actions--full"
            >
              Open resume builder
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={!canContinue || busy}
                onClick={handleContinue}
                className="cos-btn cos-btn--primary cos-btn--equal"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {phase === "analyzing" ? "Analyzing…" : "Importing…"}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Import & continue
                  </>
                )}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => router.replace("/dashboard/careeros/builder")}
                className="cos-btn cos-btn--ghost cos-btn--equal"
              >
                Skip — start blank
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

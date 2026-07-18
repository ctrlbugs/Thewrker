"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2, Upload, X } from "lucide-react";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import {
  cropPdfPages,
  deletePdfPages,
  downloadBlob,
  extractPdfPages,
  getPdfInfo,
  imagesToPdf,
  insertPdfPages,
  mergePdfs,
  numberPdfPages,
  parsePageRange,
  reorderPdfPages,
  rotatePdfPages,
  splitPdfAllPages,
  stampPdfText,
  type PdfInfo,
} from "@/lib/tools/pdf";
import { formatBytes } from "@/lib/tools/image";
import {
  getPdfTool,
  PDF_CONVERT_FROM,
  PDF_CONVERT_TO,
  PDF_EDIT_TOOLS,
  type PdfToolId,
} from "@/lib/pdf-studio-tools";
import { cn } from "@/lib/utils";
import "@/app/pdf-studio.css";

type MenuKey = "edit" | "convert" | null;

export default function PdfStudioTool() {
  const task = useAsyncTask();
  const [toolId, setToolId] = useState<PdfToolId>("merge");
  const [menu, setMenu] = useState<MenuKey>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [pageRange, setPageRange] = useState("1");
  const [pageOrder, setPageOrder] = useState("1");
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);
  const [insertAfter, setInsertAfter] = useState("1");
  const [cropMargin, setCropMargin] = useState("36");
  const [stampText, setStampText] = useState("Confidential");
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const tool = useMemo(() => getPdfTool(toolId), [toolId]);
  const isReady = Boolean(tool.ready);
  const primary = files[0] ?? null;
  const isImageConvert = toolId === "from-jpg" || toolId === "from-png";

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    setMessage("");
    setFiles([]);
    setPdfInfo(null);
    setPageRange("1");
    setPageOrder("1");
    setInsertAfter("1");
    if (fileRef.current) fileRef.current.value = "";
  }, [toolId]);

  const selectTool = (id: PdfToolId) => {
    setToolId(id);
    setMenu(null);
  };

  const loadInfo = async (file: File) => {
    const info = await getPdfInfo(file);
    if (!info.ok || !info.data) {
      setMessage(info.error ?? "Unable to read PDF.");
      setPdfInfo(null);
      return;
    }
    setPdfInfo(info.data);
    setPageRange(`1-${info.data.pageCount}`);
    setPageOrder(
      Array.from({ length: info.data.pageCount }, (_, i) => i + 1).join(",")
    );
    setInsertAfter(String(info.data.pageCount));
    setMessage(`${info.data.pageCount} pages ready.`);
  };

  const acceptFiles = async (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const list = Array.from(incoming);
    const filtered = isImageConvert
      ? list.filter((f) =>
          toolId === "from-png"
            ? /image\/png|\.png$/i.test(f.type + f.name)
            : /image\/(jpeg|jpg)|\.jpe?g$/i.test(f.type + f.name)
        )
      : list.filter((f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name));

    if (!filtered.length) {
      setMessage(isImageConvert ? "Please choose image files." : "Please choose PDF files.");
      return;
    }

    if (tool.multiple || isImageConvert) {
      setFiles((prev) => [...prev, ...filtered]);
      setMessage(`${filtered.length} file(s) added.`);
      if (!isImageConvert && filtered[0]) await loadInfo(filtered[0]);
      return;
    }

    setFiles([filtered[0]]);
    await loadInfo(filtered[0]);
  };

  const runDownload = async (
    label: string,
    action: (
      update: (progress: number, message?: string) => void
    ) => Promise<{ ok: boolean; data?: Blob; error?: string }>,
    name: string
  ) => {
    await task.run(label, async (update) => {
      const result = await action(update);
      if (!result.ok || !result.data) throw new Error(result.error ?? "Action failed.");
      downloadBlob(result.data, name);
      setMessage("Download ready.");
    });
  };

  const handlePrimaryAction = async () => {
    if (!isReady) return;

    if (toolId === "merge") {
      await task.run("Merging PDF files...", async (update) => {
        const result = await mergePdfs(files, update);
        if (!result.ok || !result.data) throw new Error(result.error ?? "Merge failed.");
        downloadBlob(result.data, "thewrker-merged.pdf");
        setMessage(`Merged ${files.length} PDFs successfully.`);
      });
      return;
    }

    if (toolId === "split") {
      if (!primary) return setMessage("Upload a PDF first.");
      await task.run("Splitting PDF into pages...", async (update) => {
        const result = await splitPdfAllPages(primary, update);
        if (!result.ok || !result.data) throw new Error(result.error ?? "Split failed.");
        result.data.forEach((item) => downloadBlob(item.blob, item.name));
        setMessage(`Split into ${result.data.length} separate PDF files.`);
      });
      return;
    }

    if (toolId === "extract") {
      if (!primary || !pdfInfo) return setMessage("Upload a PDF first.");
      const pages = parsePageRange(pageRange, pdfInfo.pageCount);
      if (!pages.ok || !pages.data) return setMessage(pages.error ?? "Invalid range.");
      await runDownload(
        "Extracting PDF pages...",
        (update) => extractPdfPages(primary, pages.data!, update),
        primary.name.replace(/\.pdf$/i, "-extract.pdf")
      );
      return;
    }

    if (toolId === "delete") {
      if (!primary || !pdfInfo) return setMessage("Upload a PDF first.");
      const pages = parsePageRange(pageRange, pdfInfo.pageCount);
      if (!pages.ok || !pages.data) return setMessage(pages.error ?? "Invalid range.");
      await runDownload(
        "Deleting PDF pages...",
        (update) => deletePdfPages(primary, pages.data!, update),
        primary.name.replace(/\.pdf$/i, "-deleted.pdf")
      );
      return;
    }

    if (toolId === "rotate") {
      if (!primary) return setMessage("Upload a PDF first.");
      await runDownload(
        "Rotating PDF pages...",
        (update) => rotatePdfPages(primary, rotateAngle, update),
        primary.name.replace(/\.pdf$/i, `-rotated-${rotateAngle}.pdf`)
      );
      return;
    }

    if (toolId === "reorder") {
      if (!primary || !pdfInfo) return setMessage("Upload a PDF first.");
      const pages = parsePageRange(pageOrder, pdfInfo.pageCount);
      if (!pages.ok || !pages.data) return setMessage(pages.error ?? "Invalid order.");
      await runDownload(
        "Organizing PDF pages...",
        (update) => reorderPdfPages(primary, pages.data!, update),
        primary.name.replace(/\.pdf$/i, "-organized.pdf")
      );
      return;
    }

    if (toolId === "insert") {
      if (files.length < 2) return setMessage("Select a base PDF and a PDF to insert.");
      const after = Number(insertAfter);
      if (!Number.isInteger(after) || after < 0) {
        return setMessage("Enter a valid insert position.");
      }
      await runDownload(
        "Inserting PDF pages...",
        (update) => insertPdfPages(files[0], files[1], after, update),
        files[0].name.replace(/\.pdf$/i, "-inserted.pdf")
      );
      return;
    }

    if (toolId === "number") {
      if (!primary) return setMessage("Upload a PDF first.");
      await runDownload(
        "Adding page numbers...",
        (update) => numberPdfPages(primary, update),
        primary.name.replace(/\.pdf$/i, "-numbered.pdf")
      );
      return;
    }

    if (toolId === "crop") {
      if (!primary) return setMessage("Upload a PDF first.");
      await runDownload(
        "Cropping PDF pages...",
        (update) => cropPdfPages(primary, Number(cropMargin), update),
        primary.name.replace(/\.pdf$/i, "-cropped.pdf")
      );
      return;
    }

    if (toolId === "edit") {
      if (!primary) return setMessage("Upload a PDF first.");
      await runDownload(
        "Editing PDF...",
        (update) => stampPdfText(primary, stampText, update),
        primary.name.replace(/\.pdf$/i, "-edited.pdf")
      );
      return;
    }

    if (isImageConvert) {
      await task.run("Converting images to PDF...", async (update) => {
        const result = await imagesToPdf(files, update);
        if (!result.ok || !result.data) throw new Error(result.error ?? "Convert failed.");
        downloadBlob(result.data, "thewrker-images.pdf");
        setMessage(`Converted ${files.length} image(s) to PDF.`);
      });
    }
  };

  const editActive = PDF_EDIT_TOOLS.some((t) => t.id === toolId);
  const convertActive = [...PDF_CONVERT_TO, ...PDF_CONVERT_FROM].some(
    (t) => t.id === toolId
  );

  const primaryLabel = (() => {
    if (toolId === "merge") return "Merge & download";
    if (toolId === "split") return "Split every page";
    if (toolId === "extract") return "Extract pages";
    if (toolId === "delete") return "Delete pages";
    if (toolId === "rotate") return "Rotate & download";
    if (toolId === "reorder") return "Save new order";
    if (toolId === "insert") return "Insert & download";
    if (toolId === "number") return "Add page numbers";
    if (toolId === "crop") return "Crop & download";
    if (toolId === "edit") return "Stamp & download";
    if (isImageConvert) return "Convert to PDF";
    return "Continue";
  })();

  const canRun = (() => {
    if (!isReady || task.active) return false;
    if (toolId === "merge") return files.length >= 2;
    if (toolId === "insert") return files.length >= 2;
    if (isImageConvert) return files.length >= 1;
    return Boolean(primary);
  })();

  const acceptAttr = isImageConvert
    ? toolId === "from-png"
      ? "image/png,.png"
      : "image/jpeg,.jpg,.jpeg"
    : "application/pdf,.pdf";

  return (
    <div className="pdf-studio" ref={rootRef}>
      <nav className="ps-nav" aria-label="PDF tools">
        <button
          type="button"
          className={cn("ps-nav-item", menu === "edit" && "is-open", editActive && "is-active")}
          aria-expanded={menu === "edit"}
          onClick={() => setMenu((m) => (m === "edit" ? null : "edit"))}
        >
          Edit
          <ChevronDown className="ps-nav-chevron h-4 w-4" />
        </button>
        <button
          type="button"
          className={cn(
            "ps-nav-item",
            menu === "convert" && "is-open",
            convertActive && "is-active"
          )}
          aria-expanded={menu === "convert"}
          onClick={() => setMenu((m) => (m === "convert" ? null : "convert"))}
        >
          Convert
          <ChevronDown className="ps-nav-chevron h-4 w-4" />
        </button>

        {menu && (
          <>
            <div className="ps-mega-backdrop sm:hidden" onClick={() => setMenu(null)} aria-hidden />
            <div className="ps-mega" role="menu">
              {menu === "edit" ? (
                <div className="ps-mega-grid" style={{ gridTemplateColumns: "1fr" }}>
                  <div>
                    <p className="ps-mega-col-title">Edit PDF</p>
                    <ul className="ps-mega-list">
                      {PDF_EDIT_TOOLS.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className={cn("ps-mega-link", toolId === item.id && "is-active")}
                            onClick={() => selectTool(item.id)}
                          >
                            <span>{item.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="ps-mega-grid">
                  <div>
                    <p className="ps-mega-col-title">Convert to PDF</p>
                    <ul className="ps-mega-list">
                      {PDF_CONVERT_TO.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className={cn("ps-mega-link", toolId === item.id && "is-active")}
                            onClick={() => selectTool(item.id)}
                          >
                            <span>{item.label}</span>
                            {!item.ready ? <span className="ps-mega-tag">Soon</span> : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="ps-mega-col-title">Convert from PDF</p>
                    <ul className="ps-mega-list">
                      {PDF_CONVERT_FROM.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className={cn("ps-mega-link", toolId === item.id && "is-active")}
                            onClick={() => selectTool(item.id)}
                          >
                            <span>{item.label}</span>
                            <span className="ps-mega-tag">Soon</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      <section className="ps-hero">
        <div>
          <div className="ps-brand">
            <Image src="/icons/pdf.png" alt="" width={32} height={32} />
            <span>TheWrker PDF</span>
          </div>
          <h1 className="ps-title">{tool.title}</h1>
          <p className="ps-sub">{tool.subtitle}</p>
          <div className="ps-actions">
            <button
              type="button"
              className="ps-btn"
              disabled={!isReady || task.active}
              onClick={() => fileRef.current?.click()}
            >
              {task.active ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {tool.cta}
                </>
              )}
            </button>
            <span className="ps-drop-hint">or drop it below</span>
          </div>
        </div>
        <div className="ps-hero-art" aria-hidden>
          <div className="ps-hero-art-frame">
            <Image
              src={tool.heroIcon}
              alt=""
              width={280}
              height={280}
              className="object-contain"
              unoptimized={tool.heroIcon.endsWith(".svg")}
            />
          </div>
        </div>
      </section>

      <section className="ps-panel">
        <input
          ref={fileRef}
          type="file"
          accept={isReady ? acceptAttr : undefined}
          multiple={Boolean(tool.multiple) || isImageConvert}
          className="hidden"
          onChange={(e) => {
            void acceptFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {isReady ? (
          <>
            <div
              className={cn("ps-dropzone", dragOver && "is-drag")}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                void acceptFiles(e.dataTransfer.files);
              }}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
              }}
            >
              <Upload className="h-6 w-6 text-[#76bec5]" />
              <strong>
                {tool.multiple || isImageConvert
                  ? "Drop files here"
                  : "Drop a file here"}
              </strong>
              <span>
                {isImageConvert ? "Images only" : "PDF only"} · processed in your browser
              </span>
            </div>

            <div className="ps-body">
              <OperationStatus
                active={task.active}
                progress={task.progress}
                message={task.message}
                error={task.error}
              />

              {message && !task.active ? (
                <p
                  className={cn(
                    "ps-status",
                    /fail|unable|invalid|please|can’t|can't/i.test(message) && "is-error"
                  )}
                >
                  {message}
                </p>
              ) : null}

              {files.length > 0 ? (
                <ul className="ps-file-list">
                  {files.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="ps-file-row">
                      <div className="ps-file-meta">
                        <p className="ps-file-name">
                          {toolId === "insert"
                            ? `${index === 0 ? "Base" : "Insert"} · ${file.name}`
                            : `${index + 1}. ${file.name}`}
                        </p>
                        <p className="ps-file-sub">
                          {index === 0 && pdfInfo && !isImageConvert
                            ? `${pdfInfo.pageCount} pages · ${formatBytes(pdfInfo.fileSize)}`
                            : formatBytes(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="ps-remove"
                        onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {toolId === "extract" || toolId === "delete" ? (
                <div className="ps-field">
                  <label htmlFor="ps-range">
                    {toolId === "delete" ? "Pages to delete" : "Page range"} (e.g. 1-3, 5)
                  </label>
                  <input
                    id="ps-range"
                    className="ps-input"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                  />
                </div>
              ) : null}

              {toolId === "reorder" ? (
                <div className="ps-field">
                  <label htmlFor="ps-order">New page order (e.g. 3,1,2,4)</label>
                  <input
                    id="ps-order"
                    className="ps-input"
                    value={pageOrder}
                    onChange={(e) => setPageOrder(e.target.value)}
                  />
                </div>
              ) : null}

              {toolId === "rotate" ? (
                <div className="ps-field">
                  <label htmlFor="ps-angle">Rotation</label>
                  <select
                    id="ps-angle"
                    className="ps-input"
                    value={rotateAngle}
                    onChange={(e) =>
                      setRotateAngle(Number(e.target.value) as 90 | 180 | 270)
                    }
                  >
                    <option value={90}>90° clockwise</option>
                    <option value={180}>180°</option>
                    <option value={270}>270° clockwise</option>
                  </select>
                </div>
              ) : null}

              {toolId === "insert" ? (
                <div className="ps-field">
                  <label htmlFor="ps-insert">Insert after page (0 = beginning)</label>
                  <input
                    id="ps-insert"
                    className="ps-input"
                    value={insertAfter}
                    onChange={(e) => setInsertAfter(e.target.value)}
                  />
                </div>
              ) : null}

              {toolId === "crop" ? (
                <div className="ps-field">
                  <label htmlFor="ps-crop">Margin to trim (points)</label>
                  <input
                    id="ps-crop"
                    className="ps-input"
                    value={cropMargin}
                    onChange={(e) => setCropMargin(e.target.value)}
                  />
                </div>
              ) : null}

              {toolId === "edit" ? (
                <div className="ps-field">
                  <label htmlFor="ps-stamp">Text to stamp</label>
                  <input
                    id="ps-stamp"
                    className="ps-input"
                    value={stampText}
                    onChange={(e) => setStampText(e.target.value)}
                  />
                </div>
              ) : null}

              {toolId === "split" && primary ? (
                <div className="ps-toolbar" style={{ marginBottom: "0.75rem" }}>
                  <button
                    type="button"
                    className="ps-btn ps-btn--ghost"
                    disabled={task.active || !pdfInfo}
                    onClick={async () => {
                      if (!primary || !pdfInfo) return;
                      const pages = parsePageRange(pageRange, pdfInfo.pageCount);
                      if (!pages.ok || !pages.data) {
                        setMessage(pages.error ?? "Invalid range.");
                        return;
                      }
                      await runDownload(
                        "Extracting PDF pages...",
                        (update) => extractPdfPages(primary, pages.data!, update),
                        primary.name.replace(/\.pdf$/i, "-extract.pdf")
                      );
                    }}
                  >
                    Extract range instead
                  </button>
                </div>
              ) : null}

              {toolId === "split" ? (
                <div className="ps-field">
                  <label htmlFor="ps-range-split">Optional extract range</label>
                  <input
                    id="ps-range-split"
                    className="ps-input"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                  />
                </div>
              ) : null}

              {files.length > 0 ? (
                <div className="ps-toolbar">
                  <button
                    type="button"
                    className="ps-btn"
                    disabled={!canRun}
                    onClick={() => void handlePrimaryAction()}
                  >
                    {task.active ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      primaryLabel
                    )}
                  </button>
                  <button
                    type="button"
                    className="ps-btn ps-btn--ghost"
                    disabled={task.active}
                    onClick={() => {
                      setFiles([]);
                      setPdfInfo(null);
                    }}
                  >
                    Clear
                  </button>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="ps-soon">
            <h3>{tool.title}</h3>
            <p>This conversion path is coming soon. JPG/PNG to PDF is ready today.</p>
            <div className="ps-actions" style={{ justifyContent: "center", marginTop: "1.25rem" }}>
              <button type="button" className="ps-btn" onClick={() => selectTool("from-jpg")}>
                Convert JPG to PDF
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

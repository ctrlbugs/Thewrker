"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eye, Loader2, X } from "lucide-react";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { downloadVaultItem } from "@/lib/vault/store";
import type { VaultItem } from "@/lib/vault/types";
import {
  dataUrlToArrayBuffer,
  dataUrlToBlob,
  dataUrlToText,
  detectPreviewKind,
} from "@/lib/vault/preview";

type VaultFileViewerProps = {
  item: VaultItem;
  onClose: () => void;
};

export default function VaultFileViewer({ item, onClose }: VaultFileViewerProps) {
  const kind = useMemo(
    () => detectPreviewKind(item.name, item.mime),
    [item.name, item.mime]
  );
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const [objectUrl, setObjectUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let createdUrl = "";

    const load = async () => {
      setLoading(true);
      setError("");
      setHtml("");
      setText("");
      setObjectUrl("");

      if (!item.dataUrl) {
        setError("File content is not available for preview.");
        setLoading(false);
        return;
      }

      try {
        if (kind === "pdf" || kind === "image" || kind === "audio" || kind === "video") {
          createdUrl = URL.createObjectURL(dataUrlToBlob(item.dataUrl));
          if (cancelled) {
            URL.revokeObjectURL(createdUrl);
            return;
          }
          setObjectUrl(createdUrl);
          setLoading(false);
          return;
        }

        if (kind === "text") {
          const value = await dataUrlToText(item.dataUrl);
          if (!cancelled) setText(value);
          return;
        }

        if (kind === "docx") {
          if (/\.doc$/i.test(item.name) && !/\.docx$/i.test(item.name)) {
            setError("Legacy .doc files can’t be previewed here. Download to open in Word.");
            return;
          }
          const buffer = await dataUrlToArrayBuffer(item.dataUrl);
          const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
          if (!cancelled) setHtml(result.value || "<p><em>Empty document.</em></p>");
          return;
        }

        if (kind === "sheet") {
          if (/\.csv$/i.test(item.name) || item.mime?.includes("csv")) {
            const value = await dataUrlToText(item.dataUrl);
            const workbook = XLSX.read(value, { type: "string" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            if (!cancelled) {
              setHtml(XLSX.utils.sheet_to_html(sheet, { id: "vault-sheet" }));
            }
            return;
          }
          const buffer = await dataUrlToArrayBuffer(item.dataUrl);
          const workbook = XLSX.read(buffer, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          if (!cancelled) {
            setHtml(
              `<p class="vault-viewer-sheet-name">${workbook.SheetNames[0]}</p>` +
                XLSX.utils.sheet_to_html(sheet, { id: "vault-sheet" })
            );
          }
          return;
        }

        setError("Preview isn’t available for this file type. You can still download it.");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to preview this file.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [item, kind]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="vault-viewer-backdrop" role="dialog" aria-modal="true" aria-label={`View ${item.name}`}>
      <div className="vault-viewer">
        <header className="vault-viewer-head">
          <div className="vault-viewer-title">
            <Eye className="h-4 w-4 shrink-0 text-[#76bec5]" />
            <div className="min-w-0">
              <p>{item.name}</p>
              <span>{kind.toUpperCase()} preview</span>
            </div>
          </div>
          <div className="vault-viewer-actions">
            <button
              type="button"
              className="vault-btn vault-btn--ghost"
              onClick={() => downloadVaultItem(item)}
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              type="button"
              className="vault-icon-btn"
              aria-label="Close preview"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="vault-viewer-body">
          {loading ? (
            <div className="vault-viewer-state">
              <Loader2 className="h-6 w-6 animate-spin text-[#76bec5]" />
              <p>Loading preview…</p>
            </div>
          ) : error ? (
            <div className="vault-viewer-state">
              <p>{error}</p>
              <button
                type="button"
                className="vault-btn vault-btn--teal"
                onClick={() => downloadVaultItem(item)}
              >
                <Download className="h-4 w-4" />
                Download file
              </button>
            </div>
          ) : kind === "pdf" && objectUrl ? (
            <iframe title={item.name} src={objectUrl} className="vault-viewer-frame" />
          ) : kind === "image" && objectUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={objectUrl} alt={item.name} className="vault-viewer-image" />
          ) : kind === "audio" && objectUrl ? (
            <div className="vault-viewer-media">
              <audio controls src={objectUrl} />
            </div>
          ) : kind === "video" && objectUrl ? (
            <div className="vault-viewer-media">
              <video controls src={objectUrl} />
            </div>
          ) : kind === "text" ? (
            <pre className="vault-viewer-text">{text}</pre>
          ) : html ? (
            <div
              className="vault-viewer-html"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <div className="vault-viewer-state">
              <p>Nothing to show for this file.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import {
  getFileSizeLimit,
  validateFileSize,
  type FileLimitCategory,
} from "@/lib/file-limits";
import { formatBytes } from "@/lib/tools/image";

interface FileDropzoneProps {
  accept?: string;
  category: FileLimitCategory;
  label?: string;
  hint?: string;
  disabled?: boolean;
  onFile: (file: File | null) => void;
  onError?: (message: string) => void;
}

export default function FileDropzone({
  accept,
  category,
  label = "Upload file",
  hint,
  disabled = false,
  onFile,
  onError,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const limitLabel = formatBytes(getFileSizeLimit(category));

  const handleFile = (file: File | null) => {
    if (!file) {
      onFile(null);
      return;
    }

    const validation = validateFileSize(file, category);
    if (!validation.ok) {
      onError?.(validation.error);
      return;
    }

    onFile(file);
  };

  return (
    <div className="space-y-2">
      <span className="body-emphasized-14pt block">{label}</span>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={`pd-dropzone ${dragging ? "pd-dropzone--active" : ""} ${disabled ? "pd-dropzone--disabled" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (disabled) return;
          handleFile(event.dataTransfer.files?.[0] ?? null);
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
      >
        <p className="body-emphasized-14pt">Drop file here or click to browse</p>
        <p className="body-secondary-info-14pt mt-1">
          {hint ?? `Max size: ${limitLabel}`}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={disabled}
          onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}

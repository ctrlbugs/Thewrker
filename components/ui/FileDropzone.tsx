"use client";

interface FileDropzoneProps {
  accept?: string;
  onFile: (file: File | null) => void;
  onError?: (error: string) => void;
  label?: string;
  hint?: string;
  category?: string;
  disabled?: boolean;
  file?: File | null;
}

export default function FileDropzone({
  accept,
  onFile,
  onError,
  label = "Drop a file here or click to browse",
  hint = "Supported files ready for analysis",
  disabled = false,
  file,
}: FileDropzoneProps) {
  return (
    <label
      className={`block rounded-2xl border border-dashed border-[var(--color-border,#e3e4e6)] bg-[#f6f7f8] p-6 text-center transition ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[#072635]/40"
      }`}
    >
      <input
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(event) => {
          const next = event.target.files?.[0] ?? null;
          if (next && next.size > 15 * 1024 * 1024) {
            onError?.("File is too large. Max size is 15 MB.");
            onFile(null);
            return;
          }
          onFile(next);
        }}
      />
      <p className="text-sm font-bold text-[#072635]">{label}</p>
      {file ? (
        <p className="mt-2 text-sm text-[#707070]">{file.name}</p>
      ) : (
        <p className="mt-2 text-sm text-[#707070]">{hint}</p>
      )}
    </label>
  );
}

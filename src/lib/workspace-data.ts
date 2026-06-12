import type { CorePillar, DevTool, WorkspaceModule } from "./types";

export const WORKSPACE_MODULES: WorkspaceModule[] = [
  {
    id: "text-editor",
    title: "Text Editor",
    description: "Write and edit plain text, markdown, config files, and data formats.",
    icon: "/assets/icons/text-editor.svg",
    accentColor: "#e0f3fa",
    href: "/editor/text",
    formats: ["TXT", "MD", "JSON", "XML", "CSV", "YAML"],
    features: ["Find & Replace", "Word Count", "Auto Save", "Line & Character Stats"],
  },
  {
    id: "pdf-studio",
    title: "PDF Studio",
    description: "Merge, split, and manage PDF documents in your browser.",
    icon: "/assets/icons/pdf-acrobat.svg",
    accentColor: "#d8fcf7",
    href: "/studio/pdf",
    formats: ["PDF"],
    features: ["Merge PDFs", "Split by Page Range", "Split Every Page", "Download Instantly"],
  },
  {
    id: "image-studio",
    title: "Image Studio",
    description: "Resize, compress, convert, and remove image backgrounds in your browser.",
    icon: "/assets/icons/image.svg",
    accentColor: "#ffe6f1",
    href: "/studio/image",
    formats: ["PNG", "JPG", "WEBP", "SVG", "ICO", "BMP"],
    features: ["Remove Background", "Resize", "Compress", "Convert Formats"],
  },
  {
    id: "archive-studio",
    title: "Archive Studio",
    description: "Create, extract, and compress ZIP archives in your workspace.",
    icon: "/assets/icons/archive.svg",
    accentColor: "#e0f3fa",
    href: "/studio/archive",
    formats: ["ZIP"],
    features: ["Create ZIP", "Compress ZIP", "Extract ZIP", "Compression Level Control"],
  },
  {
    id: "converter-hub",
    title: "Converter Hub",
    description: "Convert audio and video formats without leaving your workspace.",
    icon: "/assets/icons/converter.svg",
    accentColor: "#f4f0fe",
    href: "/studio/converter",
    formats: ["MP3", "WAV", "AAC", "MP4", "MOV", "AVI"],
    features: ["MP3 ↔ WAV", "MP4 ↔ MOV", "MP4 → MP3", "AVI ↔ MP4"],
  },
  {
    id: "compressor-studio",
    title: "Compressor Studio",
    description: "Shrink image, audio, and video file sizes without leaving your workspace.",
    icon: "/assets/icons/files.svg",
    accentColor: "#e0f3fa",
    href: "/studio/compressor",
    formats: ["JPG", "WEBP", "PNG", "MP3", "MP4"],
    features: ["Image Compress", "Audio Compress", "Video Compress", "Size Savings"],
  },
  {
    id: "ai-studio",
    title: "AI Studio",
    description: "Check documents for originality, repetition, and similarity patterns.",
    icon: "/assets/icons/ai.svg",
    accentColor: "#d8fcf7",
    href: "/studio/ai",
    formats: ["PDF", "DOCX", "TXT", "MD", "RTF"],
    features: ["Plagiarism Check", "Upload or Paste", "Reference Compare", "Local Analysis"],
  },
];

export const DEV_TOOLS: DevTool[] = [
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format, minify, and validate JSON instantly.",
    icon: "/assets/icons/json.svg",
    href: "/tools/json-formatter",
  },
  {
    id: "base64",
    title: "Base64 Encoder",
    description: "Encode and decode Base64 text.",
    icon: "/assets/icons/base64.svg",
    href: "/tools/base64",
  },
  {
    id: "uuid",
    title: "UUID Generator",
    description: "Generate unique identifiers on demand.",
    icon: "/assets/icons/uuid.svg",
    href: "/tools/uuid",
  },
  {
    id: "hash",
    title: "Hash Generator",
    description: "Create SHA-256, SHA-384, and SHA-512 hashes.",
    icon: "/assets/icons/hash.svg",
    href: "/tools/hash",
  },
  {
    id: "jwt",
    title: "JWT Decoder",
    description: "Inspect JWT headers and payloads safely.",
    icon: "/assets/icons/jwt.svg",
    href: "/tools/jwt",
  },
  {
    id: "regex",
    title: "Regex Tester",
    description: "Test patterns, flags, and replacements live.",
    icon: "/assets/icons/regex.svg",
    href: "/tools/regex",
  },
];

export const CORE_PILLARS: CorePillar[] = [
  {
    id: "workspaces",
    title: "Workspaces",
    description:
      "Every project gets files, chat, meetings, tasks, notes, AI, and team members in one place.",
    accentColor: "#d8fcf7",
  },
  {
    id: "file-engine",
    title: "Universal File Engine",
    description:
      "Open documents, code, media, and archives without switching applications.",
    accentColor: "#e0f3fa",
  },
  {
    id: "ai",
    title: "AI Workspace Assistant",
    description:
      "Analyze documents for originality and similarity directly in your browser.",
    accentColor: "#f4f0fe",
  },
];

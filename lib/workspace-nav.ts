export type WorkspaceNavItem = {
  name: string;
  href: string;
  icon:
    | "overview"
    | "careeros"
    | "organisation"
    | "files"
    | "text"
    | "pdf"
    | "image"
    | "archive"
    | "convert"
    | "compress"
    | "ai"
    | "json"
    | "base64"
    | "uuid"
    | "hash"
    | "jwt"
    | "regex";
};

export type WorkspaceNavSection = {
  title: string;
  items: WorkspaceNavItem[];
};

export const WORKSPACE_NAV: WorkspaceNavSection[] = [
  {
    title: "Workspace",
    items: [
      { name: "Overview", href: "/dashboard", icon: "overview" },
      { name: "CareerOS", href: "/dashboard/careeros", icon: "careeros" },
      { name: "Organisation", href: "/dashboard/organisation", icon: "organisation" },
      { name: "Files", href: "/dashboard/files", icon: "files" },
    ],
  },
  {
    title: "Studios",
    items: [
      { name: "Text Editor", href: "/dashboard/studios/text", icon: "text" },
      { name: "PDF Studio", href: "/dashboard/studios/pdf", icon: "pdf" },
      { name: "Image Studio", href: "/dashboard/studios/image", icon: "image" },
      { name: "Archive Studio", href: "/dashboard/studios/archive", icon: "archive" },
      { name: "Converter Hub", href: "/dashboard/studios/converter", icon: "convert" },
      { name: "Compressor Studio", href: "/dashboard/studios/compressor", icon: "compress" },
      { name: "AI Studio", href: "/dashboard/studios/ai", icon: "ai" },
    ],
  },
  {
    title: "Developer Tools",
    items: [
      { name: "JSON Formatter", href: "/dashboard/tools/json", icon: "json" },
      { name: "Base64 Encoder", href: "/dashboard/tools/base64", icon: "base64" },
      { name: "UUID Generator", href: "/dashboard/tools/uuid", icon: "uuid" },
      { name: "Hash Generator", href: "/dashboard/tools/hash", icon: "hash" },
      { name: "JWT Decoder", href: "/dashboard/tools/jwt", icon: "jwt" },
      { name: "Regex Tester", href: "/dashboard/tools/regex", icon: "regex" },
    ],
  },
];


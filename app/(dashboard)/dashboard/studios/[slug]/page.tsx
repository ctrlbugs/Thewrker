"use client";

import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import ToolShell from "@/components/tools/ToolShell";
import "@/app/workspace-overview.css";
import "@/app/workspace-tools.css";
import "@/app/studio-shell.css";

const TOOLS: Record<
  string,
  {
    title: string;
    description: string;
    brand: string;
    iconSrc: string;
    component: React.ComponentType;
    bare?: boolean;
  }
> = {
  text: {
    title: "Text Editor",
    description:
      "Write and edit plain text, markdown, configs, and data formats in a calm, focused workspace.",
    brand: "TheWrker Text",
    iconSrc: "/assets/icons/text-editor.svg",
    component: dynamic(() => import("@/components/tools/TextEditorTool"), { ssr: false }),
  },
  pdf: {
    title: "PDF Studio",
    description: "Merge multiple PDFs or split a PDF by page range or individual pages.",
    brand: "TheWrker PDF",
    iconSrc: "/icons/pdf.png",
    component: dynamic(() => import("@/components/tools/PdfStudioTool"), { ssr: false }),
    bare: true,
  },
  image: {
    title: "Image Studio",
    description:
      "Resize, convert, and remove backgrounds — clean image tools that stay in your browser.",
    brand: "TheWrker Image",
    iconSrc: "/assets/icons/image.svg",
    component: dynamic(() => import("@/components/tools/ImageStudioTool"), { ssr: false }),
  },
  archive: {
    title: "Archive Studio",
    description:
      "Create, extract, and compress ZIP archives without leaving your workspace.",
    brand: "TheWrker Archive",
    iconSrc: "/assets/icons/archive.svg",
    component: dynamic(() => import("@/components/tools/ArchiveStudioTool"), { ssr: false }),
  },
  converter: {
    title: "Converter Hub",
    description:
      "Convert audio and video formats quickly with a simple, focused workflow.",
    brand: "TheWrker Convert",
    iconSrc: "/assets/icons/converter.svg",
    component: dynamic(() => import("@/components/tools/ConverterHubTool"), { ssr: false }),
  },
  compressor: {
    title: "Compressor Studio",
    description:
      "Shrink image, audio, and video file sizes while keeping quality under control.",
    brand: "TheWrker Compress",
    iconSrc: "/assets/icons/files.svg",
    component: dynamic(() => import("@/components/tools/CompressorStudioTool"), { ssr: false }),
  },
  ai: {
    title: "AI Studio",
    description:
      "Check documents for originality, repetition, and similarity patterns in one place.",
    brand: "TheWrker AI",
    iconSrc: "/assets/icons/ai.svg",
    component: dynamic(() => import("@/components/tools/PlagiarismStudioTool"), { ssr: false }),
  },
};

export default function StudioPage({ params }: { params: { slug: string } }) {
  const tool = TOOLS[params.slug];
  if (!tool) notFound();

  const Tool = tool.component;

  return (
    <div className="workspace-overview-root mx-auto w-full max-w-[1400px]">
      {tool.bare ? (
        <Tool />
      ) : (
        <ToolShell
          title={tool.title}
          description={tool.description}
          brand={tool.brand}
          iconSrc={tool.iconSrc}
        >
          <Tool />
        </ToolShell>
      )}
    </div>
  );
}

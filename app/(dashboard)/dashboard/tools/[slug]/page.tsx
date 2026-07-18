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
  }
> = {
  json: {
    title: "JSON Formatter",
    description: "Format, minify, and validate JSON instantly — clean and quick.",
    brand: "TheWrker Dev",
    iconSrc: "/assets/icons/json.svg",
    component: dynamic(() => import("@/components/tools/JsonFormatterTool"), { ssr: false }),
  },
  base64: {
    title: "Base64 Encoder",
    description: "Encode and decode Base64 text with a simple, reliable workflow.",
    brand: "TheWrker Dev",
    iconSrc: "/assets/icons/base64.svg",
    component: dynamic(() => import("@/components/tools/Base64Tool"), { ssr: false }),
  },
  uuid: {
    title: "UUID Generator",
    description: "Generate unique identifiers on demand for apps, tests, and APIs.",
    brand: "TheWrker Dev",
    iconSrc: "/assets/icons/uuid.svg",
    component: dynamic(() => import("@/components/tools/UuidTool"), { ssr: false }),
  },
  hash: {
    title: "Hash Generator",
    description: "Create SHA-256, SHA-384, and SHA-512 hashes in your browser.",
    brand: "TheWrker Dev",
    iconSrc: "/assets/icons/hash.svg",
    component: dynamic(() => import("@/components/tools/HashTool"), { ssr: false }),
  },
  jwt: {
    title: "JWT Decoder",
    description: "Inspect JWT headers and payloads safely without leaving your workspace.",
    brand: "TheWrker Dev",
    iconSrc: "/assets/icons/jwt.svg",
    component: dynamic(() => import("@/components/tools/JwtTool"), { ssr: false }),
  },
  regex: {
    title: "Regex Tester",
    description: "Test patterns, flags, and replacements live with clear match feedback.",
    brand: "TheWrker Dev",
    iconSrc: "/assets/icons/regex.svg",
    component: dynamic(() => import("@/components/tools/RegexTool"), { ssr: false }),
  },
};

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = TOOLS[params.slug];
  if (!tool) notFound();

  const Tool = tool.component;

  return (
    <div className="workspace-overview-root mx-auto w-full max-w-[1400px]">
      <ToolShell
        title={tool.title}
        description={tool.description}
        brand={tool.brand}
        iconSrc={tool.iconSrc}
      >
        <Tool />
      </ToolShell>
    </div>
  );
}

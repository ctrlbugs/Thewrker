import Image from "next/image";
import Link from "next/link";
import type { DevTool } from "@/lib/types";

interface DevToolCardProps {
  tool: DevTool;
}

export default function DevToolCard({ tool }: DevToolCardProps) {
  return (
    <Link href={tool.href} className="pd-workspace-card-link group">
      <article className="pd-workspace-card flex h-full items-start gap-4 bg-white p-4 sm:p-5">
        <div className="pd-module-icon shrink-0 border border-border bg-white">
          <Image src={tool.icon} alt="" width={24} height={24} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-3">
            <h3 className="body-emphasized-14pt">{tool.title}</h3>
            <span
              className="body-secondary-info-14pt shrink-0 transition-colors group-hover:text-primary"
              aria-hidden
            >
              →
            </span>
          </div>
          <p className="body-secondary-info-14pt">{tool.description}</p>
        </div>
      </article>
    </Link>
  );
}

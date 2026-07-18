import Link from "next/link";
import type { CSSProperties } from "react";
import type { DevTool } from "@/lib/types";

interface DevToolCardProps {
  tool: DevTool;
}

export default function DevToolCard({ tool }: DevToolCardProps) {
  return (
    <Link href={tool.href} className="block h-full no-underline">
      <article
        className="ws-soft-card ws-tool-soft group h-full"
        style={
          {
            "--tool-soft": tool.accentColor ?? "#eef3f6",
            "--tool-strong": tool.accentStrong ?? "#76BEC5",
          } as CSSProperties
        }
      >
        <div className="flex items-start gap-3.5 p-4 sm:p-5">
          <div className="ws-tool-soft-icon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tool.icon}
              alt=""
              width={26}
              height={26}
              aria-hidden
              className="h-[26px] w-[26px] object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-[#3b4758]">{tool.title}</h3>
              <span className="text-sm font-medium text-[#b0b8c6] transition group-hover:text-[#76bec5]">
                →
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-[#8a97ab]">
              {tool.description}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

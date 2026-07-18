import Link from "next/link";
import type { CSSProperties } from "react";
import type { WorkspaceModule } from "@/lib/types";

interface ModuleCardProps {
  module: WorkspaceModule;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link href={module.href} className="block h-full no-underline">
      <article
        className="ws-soft-card ws-studio-soft group h-full"
        style={
          {
            "--studio-soft": module.accentColor,
            "--studio-strong": module.accentStrong,
          } as CSSProperties
        }
      >
        <div className="ws-soft-card-head">
          <div className="ws-studio-soft-icon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={module.icon}
              alt=""
              width={28}
              height={28}
              aria-hidden
              className="h-7 w-7 object-contain"
            />
          </div>
          <span className="ws-badge ws-badge--teal">Open</span>
        </div>

        <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
          <h3 className="text-[1.05rem] font-semibold tracking-tight text-[#3b4758]">
            {module.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#8a97ab]">
            {module.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {module.formats.slice(0, 4).map((format) => (
              <span key={format} className="ws-chip">
                {format}
              </span>
            ))}
          </div>

          <ul className="mt-4 space-y-2 border-t border-[#eef1f4] pt-3.5">
            {module.features.slice(0, 3).map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-[13px] text-[#5b6b85]"
              >
                <span className="ws-dot" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Link>
  );
}

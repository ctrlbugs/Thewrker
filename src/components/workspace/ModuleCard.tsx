import Image from "next/image";
import Link from "next/link";
import type { WorkspaceModule } from "@/lib/types";

interface ModuleCardProps {
  module: WorkspaceModule;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link href={module.href} className="pd-workspace-card-link group">
      <article className="pd-workspace-card flex h-full min-h-full flex-col bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className="pd-module-icon shrink-0"
            style={{ backgroundColor: module.accentColor }}
          >
            <Image
              src={module.icon}
              alt=""
              width={24}
              height={24}
              aria-hidden
            />
          </div>
          <span className="body-secondary-info-14pt transition-colors group-hover:text-primary group-hover:font-semibold">
            Open →
          </span>
        </div>

        <h3 className="inner-card-title-18pt mb-2">{module.title}</h3>
        <p className="body-secondary-info-14pt mb-4 flex-1">{module.description}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {module.formats.slice(0, 6).map((format) => (
            <span key={format} className="pd-card-format-tag">
              {format}
            </span>
          ))}
        </div>

        <ul className="space-y-2 border-t border-border pt-4">
          {module.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="pd-status-dot shrink-0" />
              <span className="body-regular-14">{feature}</span>
            </li>
          ))}
        </ul>
      </article>
    </Link>
  );
}

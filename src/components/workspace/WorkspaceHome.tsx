import { DEV_TOOLS, WORKSPACE_MODULES } from "@/lib/workspace-data";
import DevToolCard from "./DevToolCard";
import HeroSection from "./HeroSection";
import ModuleCard from "./ModuleCard";

export default function WorkspaceHome() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 lg:gap-6">
      <HeroSection />

      <section className="pd-panel">
        <header className="pd-panel-header">
          <h2 className="card-title-24pt">Studios</h2>
          <p className="body-secondary-info-14pt mt-1">
            Open, edit, convert, and manage every file type from one workspace.
          </p>
        </header>
        <div className="pd-panel-body pd-panel-body--cards grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {WORKSPACE_MODULES.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section className="pd-panel">
        <header className="pd-panel-header">
          <h2 className="card-title-24pt">Developer Toolkit</h2>
          <p className="body-secondary-info-14pt mt-1">
            Built-in utilities for formatting, encoding, decoding, and testing.
          </p>
        </header>
        <div className="pd-panel-body pd-panel-body--cards grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {DEV_TOOLS.map((tool) => (
            <DevToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}

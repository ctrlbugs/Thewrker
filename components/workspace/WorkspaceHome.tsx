"use client";

import { DEV_TOOLS } from "@/lib/workspace-data";
import { ContentReady } from "./DashboardSkeleton";
import DevToolCard from "./DevToolCard";
import HeroSection from "./HeroSection";
import QuickActions from "./QuickActions";
import StatCards from "./StatCards";

/** Velonic-inspired Workspace overview */
export default function WorkspaceHome() {
  return (
    <ContentReady variant="overview" minMs={320}>
      <div className="workspace-overview-root mx-auto flex w-full max-w-[1400px] flex-col gap-5 lg:gap-6">
        <HeroSection />
        <StatCards />
        <QuickActions />

        <section id="devtools" className="ws-soft-card scroll-mt-24">
          <header className="ws-soft-card-head ws-soft-card-head--panel">
            <div>
              <h2 className="ws-soft-card-title">Developer Toolkit</h2>
              <p className="ws-soft-card-sub">
                Formatting, encoding, hashing, and testing — always one click away.
              </p>
            </div>
          </header>
          <div className="ws-soft-panel-body grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:p-5 xl:grid-cols-3">
            {DEV_TOOLS.map((tool) => (
              <DevToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </ContentReady>
  );
}

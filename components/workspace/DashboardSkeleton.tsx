"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const COMPACT_QUERY = "(max-width: 1023px)";

/** Phones + tablets only — laptops/desktops skip skeletons */
export function useCompactViewport() {
  const [compact, setCompact] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(COMPACT_QUERY).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return compact;
}

function Bone({ className }: { className?: string }) {
  return <div className={cn("ds-skel-bone", className)} aria-hidden />;
}

/** Main content skeleton — overview / generic dashboard pages */
export function DashboardContentSkeleton({
  variant = "overview",
}: {
  variant?: "overview" | "page";
}) {
  if (variant === "page") {
    return (
      <div className="ds-skel" role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">Loading content…</span>
        <div className="ds-skel-stack">
          <Bone className="ds-skel-line ds-skel-line--lg" />
          <Bone className="ds-skel-line ds-skel-line--md" />
          <div className="ds-skel-grid ds-skel-grid--2">
            <Bone className="ds-skel-card" />
            <Bone className="ds-skel-card" />
          </div>
          <Bone className="ds-skel-panel" />
        </div>
      </div>
    );
  }

  return (
    <div className="ds-skel" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading dashboard…</span>
      <div className="ds-skel-stack">
        <Bone className="ds-skel-hero" />

        <div className="ds-skel-grid ds-skel-grid--4">
          <Bone className="ds-skel-stat" />
          <Bone className="ds-skel-stat" />
          <Bone className="ds-skel-stat" />
          <Bone className="ds-skel-stat" />
        </div>

        <div className="ds-skel-block">
          <Bone className="ds-skel-line ds-skel-line--md" />
          <Bone className="ds-skel-line ds-skel-line--sm" />
          <div className="ds-skel-grid ds-skel-grid--3">
            <Bone className="ds-skel-tile" />
            <Bone className="ds-skel-tile" />
            <Bone className="ds-skel-tile" />
            <Bone className="ds-skel-tile" />
            <Bone className="ds-skel-tile" />
            <Bone className="ds-skel-tile" />
          </div>
        </div>

        <div className="ds-skel-block">
          <Bone className="ds-skel-line ds-skel-line--md" />
          <Bone className="ds-skel-line ds-skel-line--sm" />
          <div className="ds-skel-grid ds-skel-grid--3">
            <Bone className="ds-skel-tile ds-skel-tile--short" />
            <Bone className="ds-skel-tile ds-skel-tile--short" />
            <Bone className="ds-skel-tile ds-skel-tile--short" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Route loading — skeleton on phones/iPads only */
export function MobileRouteSkeleton({
  variant = "page",
}: {
  variant?: "overview" | "page";
}) {
  const compact = useCompactViewport();
  if (!compact) return null;
  return <DashboardContentSkeleton variant={variant} />;
}

/** Full shell skeleton while auth settles — phones/iPads only */
export function DashboardShellSkeleton() {
  return (
    <div
      className="ds-shell ds-skel-shell"
      data-theme="light"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Loading workspace…</span>

      <aside className="ds-sidebar ds-skel-sidebar" aria-hidden>
        <div className="ds-skel-brand">
          <Bone className="ds-skel-logo" />
        </div>
        <div className="ds-skel-nav">
          {Array.from({ length: 8 }).map((_, i) => (
            <Bone key={i} className="ds-skel-nav-item" />
          ))}
        </div>
      </aside>

      <div className="ds-main ds-skel-main">
        <div className="ds-skel-topbar" aria-hidden>
          <Bone className="ds-skel-icon ds-skel-menu" />
          <div className="ds-skel-title-stack">
            <Bone className="ds-skel-line ds-skel-line--xs" />
            <Bone className="ds-skel-line ds-skel-line--title" />
          </div>
          <Bone className="ds-skel-search" />
          <div className="ds-skel-top-actions">
            <Bone className="ds-skel-icon" />
            <Bone className="ds-skel-avatar" />
          </div>
        </div>
        <main className="ds-content">
          <DashboardContentSkeleton variant="overview" />
        </main>
      </div>
    </div>
  );
}

/** Compact-viewport gate: skeleton only on phones/iPads */
export function ContentReady({
  children,
  variant = "overview",
  minMs = 320,
}: {
  children: ReactNode;
  variant?: "overview" | "page";
  minMs?: number;
}) {
  const compact = useCompactViewport();
  const [ready, setReady] = useState(!compact);

  useEffect(() => {
    // Desktop / laptop — show content immediately, no skeleton
    if (!compact) {
      setReady(true);
      return;
    }

    setReady(false);
    const started = Date.now();
    let cancelled = false;
    let timeoutId = 0;
    const targetMs = Math.max(minMs, 420);

    const finish = () => {
      if (cancelled) return;
      const wait = Math.max(0, targetMs - (Date.now() - started));
      timeoutId = window.setTimeout(() => {
        if (!cancelled) setReady(true);
      }, wait);
    };

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(finish);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timeoutId);
    };
  }, [compact, minMs]);

  if (compact && !ready) {
    return <DashboardContentSkeleton variant={variant} />;
  }

  return <>{children}</>;
}

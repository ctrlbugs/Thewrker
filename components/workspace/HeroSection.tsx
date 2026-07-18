import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/brand";

export default function HeroSection() {
  return (
    <section className="ws-overview-hero">
      <div className="ws-overview-hero-glow" aria-hidden />
      <div className="ws-overview-hero-orb ws-overview-hero-orb--a" aria-hidden />
      <div className="ws-overview-hero-orb ws-overview-hero-orb--b" aria-hidden />
      <div className="ws-overview-hero-grid" aria-hidden />

      <div className="ws-overview-hero-inner">
        <span className="ws-overview-badge">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {BRAND.name} Workspace
        </span>

        <h1 className="ws-overview-title">
          <span>One Workspace. Every File.</span>
          <span>Every Opportunity.</span>
        </h1>

        <p className="ws-overview-subtitle">{BRAND.heroVision}</p>

        <div className="ws-overview-hero-actions">
          <Link href="#quick-start" className="ws-overview-cta ws-overview-cta--primary">
            Explore Studios
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/dashboard/careeros" className="ws-overview-cta ws-overview-cta--ghost">
            Open CareerOS
          </Link>
        </div>
      </div>
    </section>
  );
}

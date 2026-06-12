import { BRAND } from "@/lib/brand";
import { TAGLINE, VISION } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="pd-panel">
      <div className="pd-panel-body">
        <span className="pd-tag mb-4">{BRAND.name} Workspace</span>
        <h1 className="hero-title mb-3">{TAGLINE}</h1>
        <p className="hero-subtitle">{VISION}</p>
      </div>
    </section>
  );
}

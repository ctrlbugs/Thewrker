import type { CorePillar } from "@/lib/types";

interface PillarCardProps {
  pillar: CorePillar;
}

export default function PillarCard({ pillar }: PillarCardProps) {
  return (
    <article
      className="pd-card p-5 sm:p-6"
      style={{ borderTop: `4px solid ${pillar.accentColor}` }}
    >
      <h3 className="inner-card-title-18pt mb-2">{pillar.title}</h3>
      <p className="body-secondary-info-14pt">{pillar.description}</p>
    </article>
  );
}

"use client";

import type { CareerDNA } from "@/lib/careeros/types";
import { CAREER_LEVELS, INDUSTRY_NICHES } from "@/lib/careeros/types";

interface CareerDNACardProps {
  dna: CareerDNA;
}

export default function CareerDNACard({ dna }: CareerDNACardProps) {
  const levelLabel = CAREER_LEVELS.find((l) => l.id === dna.careerLevel)?.label ?? dna.careerLevel;
  const industryLabel = INDUSTRY_NICHES.find((n) => n.id === dna.industry)?.label ?? dna.industry;

  return (
    <div className="pd-careeros-dna-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="pd-careeros-kicker">Career DNA</p>
          <h3 className="pd-careeros-section-title mt-1">{dna.role}</h3>
          <p className="pd-careeros-muted mt-1">{dna.careerPath}</p>
        </div>
        <div className="pd-careeros-match-badge">
          <span className="text-2xl font-extrabold">{dna.levelConfidence}%</span>
          <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Confidence</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="pd-careeros-dna-stat">
          <span className="pd-careeros-dna-label">Level</span>
          <span className="pd-careeros-dna-value">{levelLabel}</span>
        </div>
        <div className="pd-careeros-dna-stat">
          <span className="pd-careeros-dna-label">Industry</span>
          <span className="pd-careeros-dna-value">{industryLabel}</span>
        </div>
        <div className="pd-careeros-dna-stat">
          <span className="pd-careeros-dna-label">Experience</span>
          <span className="pd-careeros-dna-value">{dna.experienceYears} yrs</span>
        </div>
        <div className="pd-careeros-dna-stat">
          <span className="pd-careeros-dna-label">Skills</span>
          <span className="pd-careeros-dna-value">{dna.skills.length}</span>
        </div>
      </div>

      {dna.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {dna.skills.slice(0, 12).map((skill) => (
            <span key={skill} className="pd-careeros-skill-tag">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

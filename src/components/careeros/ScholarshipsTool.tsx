"use client";

import { recommendScholarships } from "@/lib/careeros/scholarships";
import { useCareerOSContext } from "./CareerOSProvider";

export default function ScholarshipsTool() {
  const { state } = useCareerOSContext();
  const scholarships = recommendScholarships(state.profile.careerDNA);

  return (
    <div className="space-y-6">
      <div className="pd-careeros-flow-hero">
        <p className="pd-careeros-kicker">Scholarship Intelligence</p>
        <h2 className="pd-careeros-section-title mt-1">Fund your next level</h2>
        <p className="pd-careeros-muted mt-2 max-w-2xl">
          Curated scholarships matched to your education level, industry niche, and career goals — from
          Chevening to professional certifications.
        </p>
      </div>

      {!state.profile.careerDNA && (
        <p className="body-regular-14 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          Upload your CV in Resume Lab to unlock personalized scholarship recommendations.
        </p>
      )}

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {scholarships.map((s) => (
          <li key={s.id} className="pd-careeros-job-card">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <p className="pd-careeros-job-title">{s.name}</p>
              {s.fullyFunded && <span className="pd-careeros-stage-pill">Fully funded</span>}
            </div>
            <p className="body-regular-14 mb-3 text-slate-600">{s.description}</p>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="pd-careeros-filter-pill pd-careeros-filter-pill--active capitalize">
                {s.level}
              </span>
              {s.regions.slice(0, 2).map((r) => (
                <span key={r} className="pd-careeros-filter-pill">
                  {r}
                </span>
              ))}
            </div>
            <p className="pd-careeros-muted mb-3 text-xs">Deadline: {s.deadline}</p>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-btn-primary inline-flex items-center px-4 py-2 text-sm"
            >
              Learn more
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

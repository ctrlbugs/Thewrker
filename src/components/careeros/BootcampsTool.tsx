"use client";

import { useState } from "react";
import { recommendBootcamps, type BootcampType } from "@/lib/careeros/bootcamps";
import { useCareerOSContext } from "./CareerOSProvider";

const TABS: { id: BootcampType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "scholarship", label: "Scholarship" },
  { id: "paid", label: "Paid" },
];

export default function BootcampsTool() {
  const { state } = useCareerOSContext();
  const [tab, setTab] = useState<BootcampType | "all">("all");
  const bootcamps = recommendBootcamps(
    state.profile.careerDNA,
    tab === "all" ? undefined : tab,
  );

  return (
    <div className="space-y-6">
      <div className="pd-careeros-flow-hero">
        <p className="pd-careeros-kicker">Bootcamp Discovery</p>
        <h2 className="pd-careeros-section-title mt-1">Level up your skills</h2>
        <p className="pd-careeros-muted mt-2 max-w-2xl">
          Free courses, scholarship programs, and paid cohorts — recommended based on your niche and skill gaps.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`pd-careeros-filter-pill ${tab === t.id ? "pd-careeros-filter-pill--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {bootcamps.map((b) => (
          <li key={b.id} className="pd-careeros-job-card">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <p className="pd-careeros-job-title">{b.name}</p>
              <span className="pd-careeros-stage-pill capitalize">{b.type}</span>
            </div>
            <p className="pd-careeros-muted mb-1 text-sm">{b.provider} · {b.duration}</p>
            <p className="body-regular-14 mb-3 text-slate-600">{b.description}</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {b.focus.map((f) => (
                <span key={f} className="pd-careeros-skill-tag text-xs">
                  {f}
                </span>
              ))}
            </div>
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-btn-primary inline-flex items-center px-4 py-2 text-sm"
            >
              View program
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import { buildUpskillRoadmap, identifySkillGaps } from "@/lib/careeros/upskill";
import { useCareerOSContext } from "./CareerOSProvider";

export default function UpskillEngineTool() {
  const { state } = useCareerOSContext();
  const [duration, setDuration] = useState<30 | 60 | 90>(30);
  const gaps = identifySkillGaps(state.profile.careerDNA);
  const roadmap = buildUpskillRoadmap(state.profile.careerDNA, duration);

  return (
    <div className="space-y-6">
      <div className="pd-careeros-flow-hero">
        <p className="pd-careeros-kicker">Upskill Engine</p>
        <h2 className="pd-careeros-section-title mt-1">Your learning roadmap</h2>
        <p className="pd-careeros-muted mt-2 max-w-2xl">
          CareerOS identifies skill gaps from your CV and builds a 30, 60, or 90-day plan with free and paid
          resources to close them.
        </p>
      </div>

      {!state.profile.careerDNA && (
        <p className="body-regular-14 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          Upload your CV in Resume Lab to generate a personalized upskill roadmap.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {([30, 60, 90] as const).map((d) => (
          <button
            key={d}
            type="button"
            className={`pd-careeros-filter-pill ${duration === d ? "pd-careeros-filter-pill--active" : ""}`}
            onClick={() => setDuration(d)}
          >
            {d}-day plan
          </button>
        ))}
      </div>

      {gaps.length > 0 && (
        <div className="pd-careeros-dna-card">
          <p className="body-emphasized-14pt mb-2">Skill gaps detected</p>
          <div className="flex flex-wrap gap-2">
            {gaps.map((gap) => (
              <span key={gap} className="pd-careeros-skill-tag">
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {roadmap.weeks.map((week) => (
          <div key={week.week} className="pd-careeros-job-card">
            <div className="mb-3 flex items-center gap-3">
              <span className="pd-careeros-week-badge">Week {week.week}</span>
              <p className="pd-careeros-job-title capitalize">{week.focus}</p>
            </div>
            <ul className="space-y-2">
              {week.resources.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-page-bg px-4 py-3">
                  <div>
                    <p className="body-emphasized-14pt">{r.title}</p>
                    <p className="pd-careeros-muted text-xs">
                      {r.provider} · {r.type} · {r.cost}
                    </p>
                  </div>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-careeros-text-btn"
                  >
                    Open →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ActionButton
        variant="secondary"
        onClick={() => {
          const text = roadmap.weeks
            .map((w) => `Week ${w.week}: ${w.focus}\n${w.resources.map((r) => `- ${r.title}: ${r.url}`).join("\n")}`)
            .join("\n\n");
          void navigator.clipboard.writeText(text);
        }}
      >
        Copy roadmap
      </ActionButton>
    </div>
  );
}

"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { useApiIntegrations } from "@/hooks/useApiIntegrations";
import { aiCareerGrowthPlan } from "@/lib/api/careeros-client";
import { buildLocalGrowthPlan } from "@/lib/careeros/growth";
import type { CareerGrowthPlan } from "@/lib/careeros/types";
import { useCareerOSContext } from "./CareerOSProvider";

function toGrowthPlan(
  input: Omit<CareerGrowthPlan, "updatedAt"> & { updatedAt?: string },
): CareerGrowthPlan {
  return {
    ...input,
    milestones: input.milestones.map((m) => ({ ...m, completed: m.completed ?? false })),
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  };
}

export default function CareerGrowthTool() {
  const task = useAsyncTask();
  const { status: apiStatus } = useApiIntegrations();
  const { state, setGrowthPlan, toggleGrowthMilestone } = useCareerOSContext();
  const [message, setMessage] = useState("");
  const plan = state.growthPlan;

  const generate = async () => {
    if (apiStatus.openai) {
      await task.run("Building your growth plan...", async (update) => {
        update(30, "Analyzing skills and career trajectory...");
        const result = await aiCareerGrowthPlan({
          profileJson: JSON.stringify(state.profile),
          applicationsJson: JSON.stringify(state.applications),
        });
        update(90, "Saving plan...");
        setGrowthPlan(
          toGrowthPlan({
            targetRole: result.targetRole,
            summary: result.summary,
            skillGaps: result.skillGaps,
            milestones: result.milestones.map((m) => ({ ...m, completed: false })),
            weeklyFocus: result.weeklyFocus,
          }),
        );
        setMessage("Career growth plan generated.");
        update(100, "Done.");
      });
      return;
    }

    setGrowthPlan(buildLocalGrowthPlan(state.profile));
    setMessage("Growth plan generated.");
  };

  return (
    <div className="space-y-5">
      <p className="body-secondary-info-14pt rounded-2xl border border-border bg-white px-4 py-3">
        Career Growth Agent maps your skill gaps, 12-week milestones, and weekly focus areas to help
        you progress toward your target remote role.
      </p>

      <OperationStatus
        active={task.active}
        progress={task.progress}
        message={task.message}
        error={task.error}
      />

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      <ActionButton loading={task.active} onClick={generate}>
        Generate growth plan
      </ActionButton>

      {plan && (
        <div className="space-y-4">
          <div className="pd-careeros-hero">
            <p className="pd-careeros-kicker">Target role</p>
            <h3 className="pd-careeros-hero-title mt-1 text-xl md:text-2xl">{plan.targetRole}</h3>
            <p className="pd-careeros-hero-text mt-2 max-w-3xl">{plan.summary}</p>
            <p className="pd-careeros-hero-muted mt-2 text-sm">
              Last updated {new Date(plan.updatedAt).toLocaleDateString()}
            </p>
          </div>

          {plan.skillGaps.length > 0 && (
            <div className="pd-workspace-card p-5">
              <p className="body-emphasized-14pt mb-3">Skill gaps to close</p>
              <div className="flex flex-wrap gap-2">
                {plan.skillGaps.map((skill) => (
                  <span key={skill} className="pd-careeros-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pd-workspace-card p-5">
            <p className="body-emphasized-14pt mb-3">12-week milestones</p>
            <ul className="space-y-3">
              {plan.milestones.map((milestone, index) => (
                <li
                  key={`${milestone.title}-${index}`}
                  className="rounded-xl border border-border bg-page-bg px-4 py-3"
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={milestone.completed}
                      onChange={() => toggleGrowthMilestone(index)}
                    />
                    <span>
                      <span className="body-emphasized-14pt block">
                        {milestone.title}{" "}
                        <span className="body-secondary-info-14pt font-normal">
                          · {milestone.timeframe}
                        </span>
                      </span>
                      <ul className="mt-2 space-y-1">
                        {milestone.actions.map((action) => (
                          <li key={action} className="body-regular-14">
                            → {action}
                          </li>
                        ))}
                      </ul>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="pd-workspace-card p-5">
            <p className="body-emphasized-14pt mb-3">This week&apos;s focus</p>
            <ul className="space-y-2">
              {plan.weeklyFocus.map((item) => (
                <li key={item} className="body-regular-14">
                  ✓ {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { useApiIntegrations } from "@/hooks/useApiIntegrations";
import { aiCareerInsights } from "@/lib/api/careeros-client";
import { buildCareerInsights } from "@/lib/careeros/analysis";
import { APPLICATION_STAGES } from "@/lib/careeros/types";
import { useCareerOSContext } from "./CareerOSProvider";

export default function CareerInsightsTool() {
  const task = useAsyncTask();
  const { status: apiStatus } = useApiIntegrations();
  const { state } = useCareerOSContext();
  const insights = buildCareerInsights(state.profile, state.applications);
  const [aiSummary, setAiSummary] = useState("");
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const pipeline = APPLICATION_STAGES.map((stage) => ({
    ...stage,
    count: state.applications.filter((app) => app.stage === stage.id).length,
  }));

  const total = state.applications.length || 1;

  const generateAiInsights = async () => {
    if (!apiStatus.openai) {
      setMessage("Personalized insights aren't available right now. Review the stats below.");
      return;
    }

    await task.run("Generating career insights...", async (update) => {
      update(35, "Analyzing your career data...");
      const result = await aiCareerInsights({
        profileJson: JSON.stringify(state.profile),
        applicationsJson: JSON.stringify(state.applications),
      });
      update(100, "Done.");
      setAiSummary(result.summary);
      setAiRecommendations(result.recommendations);
      setMessage("Career insights updated.");
    });
  };

  return (
    <div className="space-y-5">
      <OperationStatus
        active={task.active}
        progress={task.progress}
        message={task.message}
        error={task.error}
      />

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      <div className="flex flex-wrap gap-3">
        <ActionButton loading={task.active} onClick={generateAiInsights}>
          Refresh insights
        </ActionButton>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {insights.map((insight) => (
          <div key={insight.label} className="pd-careeros-stat-card">
            <p className="body-secondary-info-14pt">{insight.label}</p>
            <p className="text-22-bold text-primary">{insight.value}</p>
            <p className="body-secondary-info-14pt mt-1">{insight.detail}</p>
          </div>
        ))}
      </div>

      <div className="pd-workspace-card p-5">
        <p className="body-emphasized-14pt mb-4">Application pipeline</p>
        <div className="space-y-3">
          {pipeline.map((stage) => (
            <div key={stage.id}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="body-emphasized-14pt">{stage.label}</span>
                <span className="body-secondary-info-14pt">
                  {stage.count} ({Math.round((stage.count / total) * 100)}%)
                </span>
              </div>
              <div className="pd-careeros-pipeline-track">
                <div
                  className="pd-careeros-pipeline-fill"
                  style={{
                    width: `${Math.max(4, (stage.count / total) * 100)}%`,
                    backgroundColor: stage.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pd-workspace-card p-5">
        <p className="body-emphasized-14pt mb-3">Growth recommendations</p>
        {aiSummary && <p className="body-regular-14 mb-4">{aiSummary}</p>}
        <ul className="space-y-2">
          {(aiRecommendations.length > 0
            ? aiRecommendations
            : [
                "Target roles with compatibility scores above 70% to improve response rates.",
                "Keep your resume skills aligned with remote job descriptions in your field.",
                "Schedule follow-ups within 5–7 days for applications in the Applied stage.",
                "Use Interview Prep before every interview stage application.",
                ...(state.profile.skills.length < 8
                  ? ["Add more skills to your Resume Lab profile for better job fit scoring."]
                  : []),
              ]
          ).map((item) => (
            <li key={item} className="body-regular-14">
              → {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { useApiIntegrations } from "@/hooks/useApiIntegrations";
import { aiScoreJobFit } from "@/lib/api/careeros-client";
import { scoreJobCompatibility } from "@/lib/careeros/analysis";
import { useCareerOSContext } from "./CareerOSProvider";
import {
  APPLICATION_STAGES,
  type ApplicationStage,
  type JobApplication,
  type WorkMode,
} from "@/lib/careeros/types";

function emptyForm(): Omit<JobApplication, "id" | "createdAt" | "updatedAt"> {
  return {
    company: "",
    role: "",
    location: "",
    workMode: "remote",
    jobDescription: "",
    stage: "saved",
    notes: "",
    url: "",
  };
}

export default function ApplicationTrackerTool() {
  const task = useAsyncTask();
  const { status: apiStatus } = useApiIntegrations();
  const { state, upsertApplication, deleteApplication, upsertReminder } = useCareerOSContext();
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ApplicationStage | "all">("all");
  const [message, setMessage] = useState("");

  const filtered =
    filter === "all"
      ? state.applications
      : state.applications.filter((app) => app.stage === filter);

  const saveApplication = async () => {
    if (!form.company.trim() || !form.role.trim()) {
      setMessage("Company and role are required.");
      return;
    }

    await task.run("Saving application...", async (update) => {
      const now = new Date().toISOString();
      let compatibilityScore = scoreJobCompatibility(
        state.profile.resumeText,
        form.jobDescription,
        state.profile.skills,
      );
      let fitRationale: string | undefined;

      if (apiStatus.openai && form.jobDescription.trim()) {
        update(40, "Calculating job fit...");
        const fit = await aiScoreJobFit({
          resumeText: state.profile.resumeText,
          skills: state.profile.skills,
          yearsExperience: state.profile.yearsExperience,
          level: state.profile.level,
          role: form.role,
          company: form.company,
          jobDescription: form.jobDescription,
        });
        compatibilityScore = fit.score;
        fitRationale = fit.rationale;
      }

      const application: JobApplication = {
        id: editingId ?? crypto.randomUUID(),
        ...form,
        compatibilityScore,
        fitRationale,
        createdAt: editingId
          ? state.applications.find((item) => item.id === editingId)?.createdAt ?? now
          : now,
        updatedAt: now,
        appliedAt: form.stage !== "saved" ? form.appliedAt ?? now : undefined,
      };

      upsertApplication(application);

      if (form.followUpAt) {
        upsertReminder({
          id: `reminder-${application.id}`,
          applicationId: application.id,
          title: `Follow up: ${form.role} at ${form.company}`,
          dueAt: form.followUpAt,
          completed: false,
        });
      }

      setForm(emptyForm());
      setEditingId(null);
      setMessage(editingId ? "Application updated." : "Application saved.");
      update(100, "Done.");
    });
  };

  const startEdit = (app: JobApplication) => {
    setEditingId(app.id);
    setForm({
      company: app.company,
      role: app.role,
      location: app.location,
      workMode: app.workMode,
      jobDescription: app.jobDescription,
      stage: app.stage,
      appliedAt: app.appliedAt,
      followUpAt: app.followUpAt,
      notes: app.notes,
      url: app.url ?? "",
      compatibilityScore: app.compatibilityScore,
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

      <div className="pd-tab-group">
        <button
          type="button"
          className={`pd-tab ${filter === "all" ? "pd-tab--active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({state.applications.length})
        </button>
        {APPLICATION_STAGES.map((stage) => (
          <button
            key={stage.id}
            type="button"
            className={`pd-tab ${filter === stage.id ? "pd-tab--active" : ""}`}
            onClick={() => setFilter(stage.id)}
          >
            {stage.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="pd-workspace-card space-y-4 p-5">
          <p className="body-emphasized-14pt">{editingId ? "Edit application" : "New application"}</p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="body-emphasized-14pt mb-1 block">Company</span>
              <input
                className="pd-input"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="body-emphasized-14pt mb-1 block">Role</span>
              <input
                className="pd-input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="body-emphasized-14pt mb-1 block">Location</span>
              <input
                className="pd-input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="body-emphasized-14pt mb-1 block">Work mode</span>
              <select
                className="pd-input"
                value={form.workMode}
                onChange={(e) => setForm({ ...form, workMode: e.target.value as WorkMode })}
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </label>
            <label className="block">
              <span className="body-emphasized-14pt mb-1 block">Stage</span>
              <select
                className="pd-input"
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value as ApplicationStage })}
              >
                {APPLICATION_STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="body-emphasized-14pt mb-1 block">Follow-up date</span>
              <input
                type="date"
                className="pd-input"
                value={form.followUpAt?.slice(0, 10) ?? ""}
                onChange={(e) =>
                  setForm({ ...form, followUpAt: e.target.value ? `${e.target.value}T09:00:00.000Z` : undefined })
                }
              />
            </label>
          </div>

          <label className="block">
            <span className="body-emphasized-14pt mb-1 block">Job URL</span>
            <input
              className="pd-input"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
            />
          </label>

          <label className="block">
            <span className="body-emphasized-14pt mb-1 block">Job description</span>
            <textarea
              className="pd-textarea min-h-[140px]"
              value={form.jobDescription}
              onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
              placeholder="Paste the job description for compatibility scoring..."
            />
          </label>

          <label className="block">
            <span className="body-emphasized-14pt mb-1 block">Notes</span>
            <textarea
              className="pd-textarea min-h-[80px]"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <ActionButton loading={task.active} onClick={saveApplication}>
              {editingId ? "Update application" : "Save application"}
            </ActionButton>
            {editingId && (
              <ActionButton
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm());
                }}
              >
                Cancel edit
              </ActionButton>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="pd-workspace-card p-5">
              <p className="body-secondary-info-14pt">No applications in this stage yet.</p>
            </div>
          ) : (
            filtered.map((app) => (
              <article key={app.id} className="pd-workspace-card p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="body-emphasized-14pt">{app.role}</p>
                    <p className="body-secondary-info-14pt">{app.company}</p>
                    <p className="body-secondary-info-14pt capitalize">
                      {app.workMode} · {app.location || "Location TBD"}
                    </p>
                  </div>
                  <span className="pd-careeros-stage-pill capitalize">{app.stage}</span>
                </div>

                {typeof app.compatibilityScore === "number" && (
                  <p className="body-regular-14 mb-2">
                    Job fit: <strong>{app.compatibilityScore}%</strong>
                  </p>
                )}

                {app.fitRationale && (
                  <p className="body-secondary-info-14pt mb-2">{app.fitRationale}</p>
                )}

                {app.notes && <p className="body-secondary-info-14pt mb-3">{app.notes}</p>}

                <div className="flex flex-wrap gap-2">
                  <ActionButton variant="secondary" onClick={() => startEdit(app)}>
                    Edit
                  </ActionButton>
                  <ActionButton variant="secondary" onClick={() => deleteApplication(app.id)}>
                    Delete
                  </ActionButton>
                  {app.url && (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pd-btn-secondary inline-flex items-center px-4 py-2 text-sm"
                    >
                      View posting
                    </a>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

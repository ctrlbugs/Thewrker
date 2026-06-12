"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { useApiIntegrations } from "@/hooks/useApiIntegrations";
import { aiInterviewPrep } from "@/lib/api/careeros-client";
import { generateInterviewQuestions } from "@/lib/careeros/analysis";
import { useCareerOSContext } from "./CareerOSProvider";

export default function InterviewPrepTool() {
  const task = useAsyncTask();
  const { status: apiStatus } = useApiIntegrations();
  const { state } = useCareerOSContext();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salaryTarget, setSalaryTarget] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [companyPrep, setCompanyPrep] = useState<string[]>([]);
  const [salaryTips, setSalaryTips] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const generate = async () => {
    if (!role.trim()) {
      setMessage("Role is required to generate questions.");
      return;
    }

    if (apiStatus.openai) {
      await task.run("Preparing interview session...", async (update) => {
        update(30, "Building company prep and questions...");
        const result = await aiInterviewPrep({
          company,
          role,
          jobDescription,
          salaryTarget,
          resumeText: state.profile.resumeText,
        });
        update(90, "Finalizing session...");
        setCompanyPrep(result.companyPrep);
        setQuestions(result.questions);
        setSalaryTips(result.salaryTips);
        setMessage("Interview prep session ready.");
        update(100, "Done.");
      });
      return;
    }

    setQuestions(generateInterviewQuestions(role, company, jobDescription));
    setCompanyPrep([
      `Research ${company || "the company"} mission, product, and recent news.`,
      "Prepare 2–3 thoughtful questions about team structure and success metrics.",
    ]);
    setSalaryTips(
      salaryTarget
        ? [`Your target range is ${salaryTarget} — research market rates for this role.`]
        : [],
    );
    setMessage("Interview prep session ready.");
  };

  const loadFromApplication = (appId: string) => {
    const app = state.applications.find((item) => item.id === appId);
    if (!app) return;
    setCompany(app.company);
    setRole(app.role);
    setJobDescription(app.jobDescription);
    setMessage(`Loaded ${app.role} at ${app.company}.`);
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

      {state.applications.length > 0 && (
        <label className="block max-w-md">
          <span className="body-emphasized-14pt mb-1 block">Load from application</span>
          <select
            className="pd-input"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) loadFromApplication(e.target.value);
            }}
          >
            <option value="" disabled>
              Select an application...
            </option>
            {state.applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.role} — {app.company}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="body-emphasized-14pt mb-1 block">Company</span>
          <input className="pd-input" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
        <label className="block">
          <span className="body-emphasized-14pt mb-1 block">Role</span>
          <input className="pd-input" value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
        <label className="block md:col-span-2">
          <span className="body-emphasized-14pt mb-1 block">Salary target (optional)</span>
          <input
            className="pd-input"
            value={salaryTarget}
            onChange={(e) => setSalaryTarget(e.target.value)}
            placeholder="e.g. $65,000 - $80,000 USD"
          />
        </label>
      </div>

      <label className="block">
        <span className="body-emphasized-14pt mb-1 block">Job description</span>
        <textarea
          className="pd-textarea min-h-[140px]"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </label>

      <ActionButton loading={task.active} onClick={generate}>
        Generate interview prep
      </ActionButton>

      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="pd-workspace-card p-4">
            <p className="body-emphasized-14pt mb-2">Company prep</p>
            <ul className="body-regular-14 list-disc space-y-1 pl-5">
              {companyPrep.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {salaryTips.length > 0 && (
            <div className="pd-workspace-card p-4">
              <p className="body-emphasized-14pt mb-2">Salary preparation</p>
              <ul className="body-regular-14 list-disc space-y-1 pl-5">
                {salaryTips.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pd-workspace-card p-4">
            <p className="body-emphasized-14pt mb-3">Practice questions ({questions.length})</p>
            <ol className="space-y-3">
              {questions.map((question, index) => (
                <li key={question} className="rounded-xl border border-border bg-page-bg px-4 py-3">
                  <p className="body-secondary-info-14pt mb-1">Question {index + 1}</p>
                  <p className="body-regular-14">{question}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

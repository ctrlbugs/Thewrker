import type {
  AiAtsReport,
  AiCareerGrowthPlan,
  AiCareerInsights,
  AiInterviewPrep,
  AiJobFit,
  AiResumeUpgrade,
  AiTailoredResume,
} from "@/lib/careeros/ai-types";
import type { EmploymentType, IndustryNiche, WorkMode } from "@/lib/careeros/types";
import { sanitizeApiErrorMessage } from "./user-error";

export interface RemoteOpportunity {
  id: string;
  title: string;
  company: string;
  url: string;
  snippet: string;
  source: string;
  matchScore?: number;
}

async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    const raw = data.error ?? `Request failed (${response.status}).`;
    return sanitizeApiErrorMessage(raw);
  } catch {
    return "Something went wrong. Please try again.";
  }
}

async function postCareerOSAi<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/careeros/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<T>;
}

export function aiAnalyzeResume(payload: {
  resumeText: string;
  name: string;
  headline: string;
  yearsExperience: number;
}) {
  return postCareerOSAi<AiAtsReport>("resume-analyze", payload);
}

export function aiUpgradeResume(payload: {
  resumeText: string;
  name: string;
  headline: string;
  yearsExperience: number;
  template: string;
  industry: string;
}) {
  return postCareerOSAi<AiResumeUpgrade>("resume-upgrade", payload);
}

export function aiTailorResume(payload: {
  resumeText: string;
  jobDescription: string;
  role: string;
  company: string;
}) {
  return postCareerOSAi<AiTailoredResume>("resume-tailor", payload);
}

export function aiGenerateCoverLetter(payload: {
  profileName: string;
  headline: string;
  resumeText: string;
  skills: string[];
  company: string;
  role: string;
  jobDescription: string;
}) {
  return postCareerOSAi<{ letter: string }>("cover-letter", payload);
}

export function aiInterviewPrep(payload: {
  company: string;
  role: string;
  jobDescription: string;
  salaryTarget: string;
  resumeText: string;
}) {
  return postCareerOSAi<AiInterviewPrep>("interview", payload);
}

export function aiCareerInsights(payload: {
  profileJson: string;
  applicationsJson: string;
}) {
  return postCareerOSAi<AiCareerInsights>("insights", payload);
}

export function aiScoreJobFit(payload: {
  resumeText: string;
  skills: string[];
  yearsExperience: number;
  level: string;
  role: string;
  company: string;
  jobDescription: string;
}) {
  return postCareerOSAi<AiJobFit>("job-fit", payload);
}

export function aiCareerGrowthPlan(payload: {
  profileJson: string;
  applicationsJson: string;
}) {
  return postCareerOSAi<AiCareerGrowthPlan>("career-growth", payload);
}

export async function extractCvText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/ocr/extract", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data = (await response.json()) as { text: string };
  return data.text;
}

export async function discoverOpportunities(payload: {
  headline: string;
  skills: string[];
  level: string;
  workMode: WorkMode;
  employmentTypes?: EmploymentType[];
  industry?: IndustryNiche | "all";
  location?: string;
  query?: string;
  resumeText?: string;
}) {
  const response = await fetch("/api/careeros/opportunities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<{ opportunities: RemoteOpportunity[]; provider: string }>;
}

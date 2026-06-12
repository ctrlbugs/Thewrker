import "server-only";

import type {
  AiAtsReport,
  AiCareerGrowthPlan,
  AiCareerInsights,
  AiInterviewPrep,
  AiJobFit,
  AiResumeUpgrade,
  AiTailoredResume,
} from "@/lib/careeros/ai-types";
import { chatCompletion, parseJsonResponse } from "./openai";

export type {
  AiAtsReport,
  AiCareerGrowthPlan,
  AiCareerInsights,
  AiInterviewPrep,
  AiJobFit,
  AiTailoredResume,
} from "@/lib/careeros/ai-types";

export async function aiAnalyzeResume(input: {
  resumeText: string;
  name: string;
  headline: string;
  yearsExperience: number;
}): Promise<AiAtsReport> {
  const raw = await chatCompletion({
    json: true,
    system: `You are an expert ATS resume coach for remote and hybrid job seekers.
Respond with JSON only: { "atsScore": number 0-100, "strengths": string[], "improvements": string[], "skills": string[], "suggestedLevel": "entry"|"junior"|"intermediate"|"senior"|"lead", "summary": string }`,
    user: `Analyze this resume for ATS readiness and career level fit.

Name: ${input.name || "Not provided"}
Headline: ${input.headline || "Not provided"}
Years of experience: ${input.yearsExperience}

Resume:
${input.resumeText}`,
  });

  const parsed = parseJsonResponse<AiAtsReport>(raw);
  return {
    atsScore: Math.max(0, Math.min(100, Math.round(parsed.atsScore ?? 0))),
    strengths: parsed.strengths ?? [],
    improvements: parsed.improvements ?? [],
    skills: parsed.skills ?? [],
    suggestedLevel: parsed.suggestedLevel ?? "junior",
    summary: parsed.summary ?? "",
  };
}

export async function aiTailorResume(input: {
  resumeText: string;
  jobDescription: string;
  role: string;
  company: string;
}): Promise<AiTailoredResume> {
  const raw = await chatCompletion({
    json: true,
    system: `You are a resume tailoring expert. Improve the resume for the target role while staying truthful.
Respond with JSON only: { "tailoredResume": string, "changesSummary": string[] }`,
    user: `Tailor this resume for:
Role: ${input.role}
Company: ${input.company}

Job description:
${input.jobDescription}

Resume:
${input.resumeText}`,
  });

  return parseJsonResponse<AiTailoredResume>(raw);
}

export async function aiGenerateCoverLetter(input: {
  profileName: string;
  headline: string;
  resumeText: string;
  skills: string[];
  company: string;
  role: string;
  jobDescription: string;
}): Promise<string> {
  return chatCompletion({
    system: `You write concise, professional cover letters for remote and hybrid roles.
Use a warm, confident tone. 3-4 short paragraphs. No placeholder brackets in the final letter.
Sign off with the candidate's name if provided.`,
    user: `Write a cover letter.

Candidate: ${input.profileName || "Candidate"}
Headline: ${input.headline || "Professional"}
Skills: ${input.skills.join(", ") || "See resume"}
Company: ${input.company}
Role: ${input.role}

Job description:
${input.jobDescription}

Resume excerpt:
${input.resumeText.slice(0, 3000)}`,
  });
}

export async function aiInterviewPrep(input: {
  company: string;
  role: string;
  jobDescription: string;
  salaryTarget: string;
  resumeText: string;
}): Promise<AiInterviewPrep> {
  const raw = await chatCompletion({
    json: true,
    system: `You are an interview coach for remote job seekers.
Respond with JSON only: { "companyPrep": string[], "questions": string[], "salaryTips": string[] }
Provide 4-6 company prep bullets, 10-12 interview questions, and 3-5 salary negotiation tips.`,
    user: `Prepare interview coaching for:
Company: ${input.company || "Unknown"}
Role: ${input.role}
Salary target: ${input.salaryTarget || "Not specified"}

Job description:
${input.jobDescription}

Candidate resume:
${input.resumeText.slice(0, 2500)}`,
  });

  return parseJsonResponse<AiInterviewPrep>(raw);
}

export async function aiCareerInsights(input: {
  profileJson: string;
  applicationsJson: string;
}): Promise<AiCareerInsights> {
  const raw = await chatCompletion({
    json: true,
    system: `You are a career strategist for remote and hybrid professionals, especially African tech talent entering global markets.
Respond with JSON only: { "summary": string, "recommendations": string[] }
Give 5-7 specific, actionable recommendations.`,
    user: `Profile and application data:
${input.profileJson}

Applications:
${input.applicationsJson}`,
  });

  return parseJsonResponse<AiCareerInsights>(raw);
}

export async function aiScoreJobFit(input: {
  resumeText: string;
  skills: string[];
  yearsExperience: number;
  level: string;
  role: string;
  company: string;
  jobDescription: string;
}): Promise<AiJobFit> {
  const raw = await chatCompletion({
    json: true,
    system: `You assess job fit for candidates applying to remote/hybrid roles.
Respond with JSON only: { "score": number 0-100, "rationale": string, "gaps": string[], "strengths": string[], "recommendedLevel": "entry"|"junior"|"intermediate"|"senior"|"lead" }
Penalize roles far above the candidate's level. Be honest but encouraging.`,
    user: `Candidate level: ${input.level}
Years experience: ${input.yearsExperience}
Skills: ${input.skills.join(", ")}

Target role: ${input.role} at ${input.company}

Job description:
${input.jobDescription}

Resume:
${input.resumeText.slice(0, 3000)}`,
  });

  const parsed = parseJsonResponse<AiJobFit>(raw);
  return {
    score: Math.max(0, Math.min(100, Math.round(parsed.score ?? 0))),
    rationale: parsed.rationale ?? "",
    gaps: parsed.gaps ?? [],
    strengths: parsed.strengths ?? [],
    recommendedLevel: parsed.recommendedLevel ?? "junior",
  };
}

export async function aiCareerGrowthPlan(input: {
  profileJson: string;
  applicationsJson: string;
}): Promise<AiCareerGrowthPlan> {
  const raw = await chatCompletion({
    json: true,
    system: `You are a long-term career growth coach for remote and hybrid professionals, with focus on African tech talent entering global markets.
Respond with JSON only: {
  "targetRole": string,
  "summary": string,
  "skillGaps": string[],
  "milestones": [{ "title": string, "timeframe": string, "actions": string[] }],
  "weeklyFocus": string[]
}
Provide 3 milestones (4 weeks, 8 weeks, 12 weeks) and 3-5 weekly focus items.`,
    user: `Build a 12-week career growth plan.

Profile:
${input.profileJson}

Application history:
${input.applicationsJson}`,
  });

  return parseJsonResponse<AiCareerGrowthPlan>(raw);
}

export async function aiUpgradeResume(input: {
  resumeText: string;
  name: string;
  headline: string;
  yearsExperience: number;
  template: string;
  industry: string;
}): Promise<AiResumeUpgrade> {
  const raw = await chatCompletion({
    json: true,
    system: `You are an expert resume writer who reformats messy CVs into ATS-optimized, professional resumes.
Use this structure: Name, Headline, Contact, Professional Summary, Core Skills, Professional Experience (with bullet achievements using metrics), Education, Certifications.
Respond with JSON only: {
  "upgradedResume": string (full plain-text resume, use clear section headers),
  "atsScore": number 0-100,
  "improvements": string[],
  "suggestedLevel": "entry"|"junior"|"intermediate"|"senior"|"lead",
  "headline": string
}
Stay truthful — improve structure and wording, do not invent employers or degrees.`,
    user: `Reformat this resume into a premium ${input.template} template style for a ${input.industry} professional.

Name: ${input.name || "Candidate"}
Current headline: ${input.headline || "Not provided"}
Years of experience: ${input.yearsExperience}

Original resume:
${input.resumeText}`,
  });

  const parsed = parseJsonResponse<AiResumeUpgrade>(raw);
  return {
    upgradedResume: parsed.upgradedResume ?? "",
    atsScore: Math.max(0, Math.min(100, Math.round(parsed.atsScore ?? 0))),
    improvements: parsed.improvements ?? [],
    suggestedLevel: parsed.suggestedLevel ?? "junior",
    headline: parsed.headline ?? input.headline,
  };
}

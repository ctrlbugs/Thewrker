import { NextResponse } from "next/server";

import {
  aiAnalyzeResume,
  aiCareerGrowthPlan,
  aiCareerInsights,
  aiGenerateCoverLetter,
  aiInterviewPrep,
  aiScoreJobFit,
  aiTailorResume,
  aiUpgradeResume,
} from "@/lib/api/server/careeros-ai";
import { hasOpenAi } from "@/lib/api/server/openai";

type CareerOSAiAction =
  | "resume-analyze"
  | "resume-upgrade"
  | "resume-tailor"
  | "cover-letter"
  | "interview"
  | "insights"
  | "job-fit"
  | "career-growth";

export async function POST(request: Request) {
  if (!hasOpenAi()) {
    return NextResponse.json(
      {
        error: "This feature is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }

  let body: { action?: CareerOSAiAction; payload?: Record<string, unknown> };
  try {
    body = (await request.json()) as { action?: CareerOSAiAction; payload?: Record<string, unknown> };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { action, payload = {} } = body;
  if (!action) {
    return NextResponse.json({ error: "Missing action." }, { status: 400 });
  }

  try {
    switch (action) {
      case "resume-analyze": {
        const result = await aiAnalyzeResume({
          resumeText: String(payload.resumeText ?? ""),
          name: String(payload.name ?? ""),
          headline: String(payload.headline ?? ""),
          yearsExperience: Number(payload.yearsExperience ?? 0),
        });
        return NextResponse.json(result);
      }
      case "resume-upgrade": {
        const result = await aiUpgradeResume({
          resumeText: String(payload.resumeText ?? ""),
          name: String(payload.name ?? ""),
          headline: String(payload.headline ?? ""),
          yearsExperience: Number(payload.yearsExperience ?? 0),
          template: String(payload.template ?? "executive"),
          industry: String(payload.industry ?? "technology"),
        });
        return NextResponse.json(result);
      }
      case "resume-tailor": {
        const result = await aiTailorResume({
          resumeText: String(payload.resumeText ?? ""),
          jobDescription: String(payload.jobDescription ?? ""),
          role: String(payload.role ?? ""),
          company: String(payload.company ?? ""),
        });
        return NextResponse.json(result);
      }
      case "cover-letter": {
        const letter = await aiGenerateCoverLetter({
          profileName: String(payload.profileName ?? ""),
          headline: String(payload.headline ?? ""),
          resumeText: String(payload.resumeText ?? ""),
          skills: Array.isArray(payload.skills) ? payload.skills.map(String) : [],
          company: String(payload.company ?? ""),
          role: String(payload.role ?? ""),
          jobDescription: String(payload.jobDescription ?? ""),
        });
        return NextResponse.json({ letter });
      }
      case "interview": {
        const result = await aiInterviewPrep({
          company: String(payload.company ?? ""),
          role: String(payload.role ?? ""),
          jobDescription: String(payload.jobDescription ?? ""),
          salaryTarget: String(payload.salaryTarget ?? ""),
          resumeText: String(payload.resumeText ?? ""),
        });
        return NextResponse.json(result);
      }
      case "insights": {
        const result = await aiCareerInsights({
          profileJson: String(payload.profileJson ?? "{}"),
          applicationsJson: String(payload.applicationsJson ?? "[]"),
        });
        return NextResponse.json(result);
      }
      case "job-fit": {
        const result = await aiScoreJobFit({
          resumeText: String(payload.resumeText ?? ""),
          skills: Array.isArray(payload.skills) ? payload.skills.map(String) : [],
          yearsExperience: Number(payload.yearsExperience ?? 0),
          level: String(payload.level ?? "junior"),
          role: String(payload.role ?? ""),
          company: String(payload.company ?? ""),
          jobDescription: String(payload.jobDescription ?? ""),
        });
        return NextResponse.json(result);
      }
      case "career-growth": {
        const result = await aiCareerGrowthPlan({
          profileJson: String(payload.profileJson ?? "{}"),
          applicationsJson: String(payload.applicationsJson ?? "[]"),
        });
        return NextResponse.json(result);
      }
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "CareerOS AI request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

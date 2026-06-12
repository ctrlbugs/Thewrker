import { NextResponse } from "next/server";

import { discoverRemoteJobs } from "@/lib/api/server/opportunities";
import { hasSerpApi } from "@/lib/api/server/env";
import type { EmploymentType, IndustryNiche, WorkMode } from "@/lib/careeros/types";

export async function POST(request: Request) {
  if (!hasSerpApi()) {
    return NextResponse.json(
      {
        error: "Job discovery is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }

  let body: {
    headline?: string;
    skills?: string[];
    level?: string;
    workMode?: WorkMode;
    employmentTypes?: EmploymentType[];
    industry?: IndustryNiche | "all";
    location?: string;
    query?: string;
    resumeText?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const opportunities = await discoverRemoteJobs({
      headline: String(body.headline ?? ""),
      skills: Array.isArray(body.skills) ? body.skills.map(String) : [],
      level: String(body.level ?? "junior"),
      workMode: body.workMode ?? "remote",
      employmentTypes: Array.isArray(body.employmentTypes) ? body.employmentTypes : ["full-time"],
      industry: body.industry ?? "all",
      location: body.location,
      query: body.query,
      resumeText: body.resumeText,
    });

    return NextResponse.json({ opportunities, provider: "serpapi" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Job discovery failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

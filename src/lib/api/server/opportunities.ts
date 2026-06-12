import "server-only";

import { scoreJobCompatibility } from "@/lib/careeros/analysis";
import { buildJobBoardQuery } from "@/lib/careeros/job-boards";
import type { CareerLevel, EmploymentType, IndustryNiche, WorkMode } from "@/lib/careeros/types";
import { hasSerpApi } from "./env";
import { getEnv } from "./env";

export interface RemoteOpportunity {
  id: string;
  title: string;
  company: string;
  url: string;
  snippet: string;
  source: string;
  matchScore?: number;
}

function parseCompanyFromTitle(title: string): string {
  const atMatch = title.match(/\s+at\s+(.+)$/i);
  if (atMatch) return atMatch[1].trim();
  const dashMatch = title.match(/^(.+?)\s+[-–|]\s+/);
  if (dashMatch) return dashMatch[1].trim();
  return "Company TBD";
}

function parseRoleFromTitle(title: string): string {
  const atIndex = title.search(/\s+at\s+/i);
  if (atIndex > 0) return title.slice(0, atIndex).trim();
  const dashParts = title.split(/\s+[-–|]\s+/);
  return dashParts[dashParts.length - 1]?.trim() || title;
}

const LEVEL_QUERY: Record<CareerLevel, string> = {
  entry: "entry level intern graduate",
  junior: "junior associate",
  intermediate: "mid level",
  senior: "senior",
  lead: "lead principal staff",
};

const EMPLOYMENT_QUERY: Record<EmploymentType, string> = {
  "full-time": "full time",
  "part-time": "part time",
  "contract": "contract freelance",
  internship: "internship",
};

export async function discoverRemoteJobs(input: {
  headline: string;
  skills: string[];
  level: string;
  workMode: WorkMode;
  employmentTypes?: EmploymentType[];
  industry?: IndustryNiche | "all";
  location?: string;
  query?: string;
  resumeText?: string;
  useJobBoards?: boolean;
}): Promise<RemoteOpportunity[]> {
  if (!hasSerpApi()) {
    throw new Error("Job discovery is temporarily unavailable.");
  }

  const apiKey = getEnv("SERPAPI_API_KEY")!;
  const skillHint = input.skills.slice(0, 4).join(" ");
  const roleHint = input.query?.trim() || input.headline || "professional";
  const mode = input.workMode === "onsite" ? "" : input.workMode;
  const levelHint = LEVEL_QUERY[input.level as CareerLevel] ?? input.level;
  const employmentHint = (input.employmentTypes ?? ["full-time"])
    .map((t) => EMPLOYMENT_QUERY[t])
    .join(" ");
  const locationHint = input.location?.trim() || "";
  const industryHint = input.industry && input.industry !== "all" ? input.industry : "";

  let query = [mode, roleHint, "jobs", skillHint, levelHint, employmentHint, locationHint, industryHint]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (input.useJobBoards !== false) {
    query = buildJobBoardQuery(query);
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("num", "12");

  const response = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!response.ok) {
    throw new Error(`Job search failed (${response.status}).`);
  }

  const data = (await response.json()) as {
    organic_results?: { title?: string; link?: string; snippet?: string; source?: string }[];
  };

  return (data.organic_results ?? [])
    .filter((item) => item.link && item.title)
    .map((item, index) => {
      const snippet = item.snippet ?? "";
      const matchScore = input.resumeText
        ? scoreJobCompatibility(input.resumeText, snippet, input.skills)
        : undefined;

      return {
        id: `opp-${index}-${Date.now()}`,
        title: parseRoleFromTitle(item.title ?? "Role"),
        company: parseCompanyFromTitle(item.title ?? ""),
        url: item.link ?? "",
        snippet,
        source: item.source ?? "Web",
        matchScore,
      };
    })
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    .slice(0, 12);
}

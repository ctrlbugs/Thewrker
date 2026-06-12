import type { CareerGrowthPlan, CareerProfile } from "./types";

const GROWTH_SKILLS_BY_LEVEL: Record<string, string[]> = {
  entry: ["git", "communication", "html", "css", "javascript basics"],
  junior: ["react", "typescript", "rest apis", "sql", "testing"],
  intermediate: ["system design", "ci/cd", "mentoring", "cloud (aws)", "performance"],
  senior: ["architecture", "technical leadership", "cross-team strategy", "hiring", "roadmapping"],
  lead: ["org strategy", "executive communication", "budgeting", "talent development", "vision"],
};

export function buildLocalGrowthPlan(profile: CareerProfile): CareerGrowthPlan {
  const targetRole =
    profile.headline.trim() ||
    `${profile.level === "entry" ? "Junior" : profile.level.charAt(0).toUpperCase() + profile.level.slice(1)} Professional`;

  const recommended = GROWTH_SKILLS_BY_LEVEL[profile.level] ?? GROWTH_SKILLS_BY_LEVEL.junior;
  const skillGaps = recommended.filter(
    (skill) => !profile.skills.some((existing) => existing.toLowerCase().includes(skill)),
  );

  return {
    targetRole,
    summary: `Focus on ${skillGaps.slice(0, 3).join(", ") || "deepening your core stack"} to progress from ${profile.level} toward your next remote role.`,
    skillGaps: skillGaps.length > 0 ? skillGaps : ["portfolio projects", "open source contributions"],
    milestones: [
      {
        title: "Strengthen core skills",
        timeframe: "4 weeks",
        actions: [
          `Complete one project showcasing ${skillGaps[0] ?? "your top skill"}`,
          "Update Resume Lab with measurable achievements",
        ],
        completed: false,
      },
      {
        title: "Expand application pipeline",
        timeframe: "8 weeks",
        actions: [
          "Apply to 5 roles/week with fit scores above 70%",
          "Use Opportunity Agent to discover remote openings",
        ],
        completed: false,
      },
      {
        title: "Interview readiness",
        timeframe: "12 weeks",
        actions: [
          "Run Interview Prep for each interview-stage application",
          "Practice 2 behavioral answers per week out loud",
        ],
        completed: false,
      },
    ],
    weeklyFocus: [
      "Update one resume bullet with metrics",
      "Save 3 new remote opportunities",
      "Complete one skill-building session (course, tutorial, or project)",
    ],
    updatedAt: new Date().toISOString(),
  };
}

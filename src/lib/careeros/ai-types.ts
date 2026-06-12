export interface AiAtsReport {
  atsScore: number;
  strengths: string[];
  improvements: string[];
  skills: string[];
  suggestedLevel: "entry" | "junior" | "intermediate" | "senior" | "lead";
  summary: string;
}

export interface AiTailoredResume {
  tailoredResume: string;
  changesSummary: string[];
}

export interface AiJobFit {
  score: number;
  rationale: string;
  gaps: string[];
  strengths: string[];
  recommendedLevel: "entry" | "junior" | "intermediate" | "senior" | "lead";
}

export interface AiResumeUpgrade {
  upgradedResume: string;
  atsScore: number;
  improvements: string[];
  suggestedLevel: "entry" | "junior" | "intermediate" | "senior" | "lead";
  headline: string;
}

export interface AiInterviewPrep {
  companyPrep: string[];
  questions: string[];
  salaryTips: string[];
}

export interface AiCareerInsights {
  summary: string;
  recommendations: string[];
}

export interface AiCareerGrowthPlan {
  targetRole: string;
  summary: string;
  skillGaps: string[];
  milestones: { title: string; timeframe: string; actions: string[] }[];
  weeklyFocus: string[];
}

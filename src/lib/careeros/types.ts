export type ApplicationStage = "saved" | "applied" | "interview" | "offer" | "rejected";

export type CareerLevel = "entry" | "junior" | "intermediate" | "senior" | "lead";

export type WorkMode = "remote" | "hybrid" | "onsite";

export type EmploymentType = "full-time" | "part-time" | "contract" | "internship";

export type ResumeTemplateId = "executive" | "modern" | "tech" | "creative";

export type IndustryNiche =
  | "technology"
  | "finance"
  | "healthcare"
  | "education"
  | "government"
  | "marketing"
  | "design"
  | "general";

export interface CareerDNA {
  careerLevel: CareerLevel;
  levelConfidence: number;
  industry: IndustryNiche;
  role: string;
  experienceYears: number;
  skills: string[];
  education: string[];
  certifications: string[];
  careerPath: string;
  updatedAt: string;
}

export interface ResumeContact {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface ResumeExperience {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  period: string;
}

export interface StructuredResume {
  templateId: ResumeTemplateId;
  name: string;
  headline: string;
  summary: string;
  contact: ResumeContact;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  projects: string[];
  certifications: string[];
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  workMode: WorkMode;
  jobDescription: string;
  stage: ApplicationStage;
  appliedAt?: string;
  followUpAt?: string;
  notes: string;
  compatibilityScore?: number;
  fitRationale?: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerProfile {
  name: string;
  headline: string;
  level: CareerLevel;
  skills: string[];
  resumeText: string;
  coverLetterText: string;
  yearsExperience: number;
  careerDNA: CareerDNA | null;
  structuredResume: StructuredResume | null;
  resumeTemplate: ResumeTemplateId;
}

export interface CareerReminder {
  id: string;
  applicationId: string;
  title: string;
  dueAt: string;
  completed: boolean;
}

export interface GrowthMilestone {
  title: string;
  timeframe: string;
  actions: string[];
  completed: boolean;
}

export interface CareerGrowthPlan {
  targetRole: string;
  summary: string;
  skillGaps: string[];
  milestones: GrowthMilestone[];
  weeklyFocus: string[];
  updatedAt: string;
}

export interface JobSearchFilters {
  workMode: WorkMode;
  employmentTypes: EmploymentType[];
  experienceLevels: CareerLevel[];
  industry: IndustryNiche | "all";
  salaryMin: number;
  salaryMax: number;
  location: string;
  query: string;
}

export interface CareerOSState {
  profile: CareerProfile;
  applications: JobApplication[];
  reminders: CareerReminder[];
  growthPlan: CareerGrowthPlan | null;
}

export const APPLICATION_STAGES: {
  id: ApplicationStage;
  label: string;
  color: string;
}[] = [
  { id: "saved", label: "Saved", color: "#94a3b8" },
  { id: "applied", label: "Applied", color: "#01F0D0" },
  { id: "interview", label: "Interview", color: "#6366f1" },
  { id: "offer", label: "Offer", color: "#22c55e" },
  { id: "rejected", label: "Rejected", color: "#ef4444" },
];

export const CAREER_LEVELS: { id: CareerLevel; label: string; years: string }[] = [
  { id: "entry", label: "Entry", years: "0–1 years" },
  { id: "junior", label: "Junior", years: "1–3 years" },
  { id: "intermediate", label: "Intermediate", years: "3–5 years" },
  { id: "senior", label: "Senior", years: "5–8 years" },
  { id: "lead", label: "Lead", years: "8+ years" },
];

export const EMPLOYMENT_TYPES: { id: EmploymentType; label: string }[] = [
  { id: "full-time", label: "Full time" },
  { id: "part-time", label: "Part time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
];

export const RESUME_TEMPLATES: { id: ResumeTemplateId; label: string; description: string }[] = [
  { id: "executive", label: "Executive", description: "Two-column profile with leadership focus" },
  { id: "modern", label: "Modern", description: "Clean single-column ATS layout" },
  { id: "tech", label: "Tech", description: "Projects, skills, and certifications first" },
  { id: "creative", label: "Creative", description: "Portfolio-forward for design roles" },
];

export const INDUSTRY_NICHES: { id: IndustryNiche; label: string }[] = [
  { id: "technology", label: "Technology" },
  { id: "finance", label: "Finance" },
  { id: "healthcare", label: "Healthcare" },
  { id: "education", label: "Education" },
  { id: "government", label: "Government" },
  { id: "marketing", label: "Marketing" },
  { id: "design", label: "Design" },
  { id: "general", label: "General" },
];

export const DEFAULT_JOB_FILTERS: JobSearchFilters = {
  workMode: "remote",
  employmentTypes: ["full-time"],
  experienceLevels: [],
  industry: "all",
  salaryMin: 0,
  salaryMax: 0,
  location: "",
  query: "",
};

/** Migrate legacy level values from older CareerOS saves */
export function normalizeCareerLevel(level: string): CareerLevel {
  if (level === "mid") return "intermediate";
  if (level === "expert") return "senior";
  const valid: CareerLevel[] = ["entry", "junior", "intermediate", "senior", "lead"];
  return valid.includes(level as CareerLevel) ? (level as CareerLevel) : "junior";
}

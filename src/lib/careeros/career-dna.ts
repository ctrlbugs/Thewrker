import { extractSkills, inferCareerLevelWithConfidence } from "./analysis";
import type { CareerDNA, CareerLevel, CareerProfile, IndustryNiche } from "./types";

const INDUSTRY_KEYWORDS: Record<IndustryNiche, string[]> = {
  technology: ["software", "developer", "engineer", "react", "javascript", "typescript", "api", "cloud", "devops"],
  finance: ["finance", "banking", "accounting", "investment", "fintech", "audit", "cpa"],
  healthcare: ["health", "clinical", "nurse", "medical", "patient", "hospital", "pharma"],
  education: ["teacher", "education", "curriculum", "university", "tutor", "academic"],
  government: ["government", "public sector", "policy", "civil service", "federal"],
  marketing: ["marketing", "seo", "content", "brand", "campaign", "social media", "growth"],
  design: ["design", "figma", "ui", "ux", "creative", "portfolio", "visual"],
  general: [],
};

const ROLE_PATTERNS = [
  /(?:^|\n)\s*(?:role|position|title)\s*[:\-]\s*(.+)/i,
  /(?:frontend|backend|full[- ]?stack|software|product|data|devops|mobile)\s+(?:developer|engineer|manager|designer)/i,
];

function detectIndustry(text: string, skills: string[]): IndustryNiche {
  const lower = text.toLowerCase();
  let best: IndustryNiche = "general";
  let bestScore = 0;

  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS) as [IndustryNiche, string[]][]) {
    if (industry === "general") continue;
    const score = keywords.filter((kw) => lower.includes(kw) || skills.some((s) => s.includes(kw))).length;
    if (score > bestScore) {
      bestScore = score;
      best = industry;
    }
  }

  return bestScore > 0 ? best : "technology";
}

function detectRole(text: string, headline: string): string {
  if (headline.trim()) return headline.trim();

  for (const pattern of ROLE_PATTERNS) {
    const match = text.match(pattern);
    if (match) return (match[1] ?? match[0]).trim();
  }

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const titleLine = lines.find((line) =>
    /developer|engineer|manager|designer|analyst|consultant|specialist/i.test(line),
  );
  return titleLine?.slice(0, 80) || "Professional";
}

function extractEducation(text: string): string[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const edu: string[] = [];
  const degreePattern = /(bachelor|master|mba|phd|b\.?sc|m\.?sc|b\.?a|m\.?a|diploma|degree)/i;

  for (const line of lines) {
    if (degreePattern.test(line) && line.length < 120) {
      edu.push(line);
    }
  }

  return [...new Set(edu)].slice(0, 4);
}

function extractCertifications(text: string): string[] {
  const lower = text.toLowerCase();
  const known = ["aws", "azure", "gcp", "pmp", "scrum", "cissp", "comptia", "cisco", "google cloud"];
  return known.filter((cert) => lower.includes(cert)).map((c) => c.toUpperCase());
}

function inferCareerPath(level: CareerLevel, role: string, industry: IndustryNiche): string {
  const industryLabel = industry === "general" ? "cross-industry" : industry;
  if (level === "entry") return `Entry-level ${role} in ${industryLabel}`;
  if (level === "lead") return `Leadership track — ${role}`;
  return `${level.charAt(0).toUpperCase() + level.slice(1)} ${role} in ${industryLabel}`;
}

export function buildCareerDNA(profile: CareerProfile): CareerDNA {
  const text = profile.resumeText;
  const skills = profile.skills.length > 0 ? profile.skills : extractSkills(text);
  const { level, confidence } = inferCareerLevelWithConfidence({
    ...profile,
    skills,
  });
  const industry = detectIndustry(text, skills);
  const role = detectRole(text, profile.headline);

  return {
    careerLevel: level,
    levelConfidence: confidence,
    industry,
    role,
    experienceYears: profile.yearsExperience,
    skills,
    education: extractEducation(text),
    certifications: extractCertifications(text),
    careerPath: inferCareerPath(level, role, industry),
    updatedAt: new Date().toISOString(),
  };
}

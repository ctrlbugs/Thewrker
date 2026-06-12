import type { CareerLevel, CareerProfile } from "./types";

const SKILL_KEYWORDS = [
  "javascript",
  "typescript",
  "react",
  "next.js",
  "node.js",
  "python",
  "java",
  "sql",
  "postgresql",
  "aws",
  "docker",
  "kubernetes",
  "figma",
  "git",
  "agile",
  "scrum",
  "communication",
  "leadership",
  "project management",
  "data analysis",
  "machine learning",
  "excel",
  "customer service",
  "sales",
  "marketing",
  "seo",
  "content writing",
  "ui/ux",
  "testing",
  "ci/cd",
];

const ACTION_VERBS = [
  "built",
  "led",
  "designed",
  "developed",
  "implemented",
  "improved",
  "managed",
  "created",
  "optimized",
  "delivered",
  "achieved",
  "reduced",
  "increased",
  "launched",
  "coordinated",
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .replace(/[^\w\s+#./-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

export function extractSkills(text: string): string[] {
  const lower = normalize(text);
  const found = SKILL_KEYWORDS.filter((skill) => lower.includes(skill));
  const extra = tokenize(text)
    .filter((word) => word.length > 4)
    .slice(0, 8);
  return [...new Set([...found, ...extra])].slice(0, 20);
}

export function inferCareerLevel(profile: CareerProfile): CareerLevel {
  return inferCareerLevelWithConfidence(profile).level;
}

export function inferCareerLevelWithConfidence(profile: CareerProfile): {
  level: CareerLevel;
  confidence: number;
} {
  const years = profile.yearsExperience;
  const resume = profile.resumeText;
  const wordCount = resume.trim() ? resume.trim().split(/\s+/).length : 0;
  const lower = normalize(resume);

  let level: CareerLevel;
  if (years <= 1 && wordCount < 300) level = "entry";
  else if (years <= 3) level = "junior";
  else if (years <= 5) level = "intermediate";
  else if (years <= 8) level = "senior";
  else level = "lead";

  let confidence = 72;
  if (/\b(senior|lead|principal|director|head of)\b/i.test(lower)) {
    if (level === "senior" || level === "lead") confidence += 15;
    else confidence -= 10;
  }
  if (/\b(intern|graduate|entry[- ]?level|junior)\b/i.test(lower)) {
    if (level === "entry" || level === "junior") confidence += 12;
  }
  if (wordCount > 400 && profile.skills.length >= 5) confidence += 8;
  if (years > 0 && wordCount > 200) confidence += 5;

  return { level, confidence: Math.max(55, Math.min(98, confidence)) };
}

export function scoreJobCompatibility(
  resumeText: string,
  jobDescription: string,
  profileSkills: string[],
): number {
  if (!resumeText.trim() || !jobDescription.trim()) return 0;

  const jobSkills = extractSkills(jobDescription);
  const resumeSkills = [...new Set([...profileSkills, ...extractSkills(resumeText)])];

  if (jobSkills.length === 0) return 55;

  let matched = 0;
  for (const skill of jobSkills) {
    if (resumeSkills.some((item) => item.includes(skill) || skill.includes(item))) {
      matched += 1;
    }
  }

  const skillRatio = matched / jobSkills.length;
  const resumeWords = new Set(tokenize(resumeText));
  const jobWords = tokenize(jobDescription);
  const overlap = jobWords.filter((word) => resumeWords.has(word)).length;
  const overlapRatio = jobWords.length > 0 ? overlap / jobWords.length : 0;

  const score = Math.round(skillRatio * 65 + overlapRatio * 35);
  return Math.max(10, Math.min(98, score));
}

export interface AtsReport {
  score: number;
  strengths: string[];
  improvements: string[];
}

export function analyzeAts(resumeText: string): AtsReport {
  const text = resumeText.trim();
  const strengths: string[] = [];
  const improvements: string[] = [];
  let score = 50;

  if (!text) {
    return {
      score: 0,
      strengths: [],
      improvements: ["Add resume content to run ATS analysis."],
    };
  }

  const words = text.split(/\s+/).length;
  const lower = normalize(text);
  const verbHits = ACTION_VERBS.filter((verb) => lower.includes(verb)).length;
  const hasEmail = /@/.test(text);
  const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const sections = ["experience", "education", "skills", "summary", "projects"].filter((section) =>
    lower.includes(section),
  );

  if (words >= 250 && words <= 800) {
    score += 12;
    strengths.push("Resume length is in a strong ATS-friendly range.");
  } else if (words < 200) {
    improvements.push("Resume may be too short — add measurable achievements.");
  } else if (words > 1000) {
    improvements.push("Resume may be too long — tighten to the most relevant experience.");
  }

  if (verbHits >= 4) {
    score += 15;
    strengths.push("Good use of action verbs.");
  } else {
    improvements.push("Add more action verbs (built, led, delivered, improved).");
  }

  if (sections.length >= 3) {
    score += 12;
    strengths.push("Clear section structure detected.");
  } else {
    improvements.push("Include clear sections: Summary, Experience, Skills, Education.");
  }

  if (hasEmail) score += 5;
  else improvements.push("Add a professional email address.");

  if (hasPhone) score += 3;

  const skills = extractSkills(text);
  if (skills.length >= 6) {
    score += 10;
    strengths.push(`Strong skill signals (${skills.length} detected).`);
  } else {
    improvements.push("Add a dedicated skills section with role-relevant keywords.");
  }

  return {
    score: Math.max(5, Math.min(100, score)),
    strengths,
    improvements,
  };
}

export function generateInterviewQuestions(
  role: string,
  company: string,
  jobDescription: string,
): string[] {
  const skills = extractSkills(jobDescription).slice(0, 4);
  const base = [
    `Tell me about yourself and why you're interested in the ${role} role at ${company || "this company"}.`,
    "Walk me through a project you're most proud of and your specific contribution.",
    "Describe a challenge you faced at work and how you resolved it.",
    "How do you prioritize tasks when juggling multiple deadlines?",
    "What does success look like for you in the first 90 days?",
    "Tell me about a time you received constructive feedback and what you changed.",
    "Why are you looking for a remote or hybrid opportunity right now?",
    "What questions do you have for us about the team or role?",
  ];

  for (const skill of skills) {
    base.push(`How have you used ${skill} in a real project? Give a specific example.`);
  }

  if (/senior|lead|manager/i.test(role)) {
    base.push("How do you mentor junior teammates and handle technical decisions?");
  }

  return base.slice(0, 12);
}

export function generateCoverLetter(
  profile: CareerProfile,
  company: string,
  role: string,
  jobDescription: string,
): string {
  const skills = extractSkills(jobDescription).slice(0, 5);
  const skillLine = skills.length > 0 ? skills.join(", ") : "the skills listed in your posting";
  const name = profile.name.trim() || "[Your Name]";
  const headline = profile.headline.trim() || "a motivated professional";

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. As ${headline}, I am excited about the opportunity to contribute to your team and grow in a remote-friendly environment.

In my experience, I have developed strengths across ${skillLine}. Based on your job description, I believe my background aligns well with your needs — particularly around delivering quality work, collaborating across teams, and learning quickly in fast-moving environments.

I would welcome the chance to discuss how my skills and career goals fit ${company}'s mission. Thank you for your time and consideration.

Sincerely,
${name}`;
}

export interface CareerInsight {
  label: string;
  value: string;
  detail: string;
}

export function buildCareerInsights(
  profile: CareerProfile,
  applications: { stage: string; compatibilityScore?: number }[],
): CareerInsight[] {
  const total = applications.length;
  const applied = applications.filter((app) => app.stage !== "saved").length;
  const interviews = applications.filter((app) => app.stage === "interview").length;
  const offers = applications.filter((app) => app.stage === "offer").length;
  const scores = applications
    .map((app) => app.compatibilityScore)
    .filter((score): score is number => typeof score === "number");
  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  const responseRate = applied > 0 ? Math.round((interviews / applied) * 100) : 0;

  return [
    {
      label: "Career level",
      value: profile.level.charAt(0).toUpperCase() + profile.level.slice(1),
      detail: "Based on experience and resume strength.",
    },
    {
      label: "Applications tracked",
      value: String(total),
      detail: `${applied} submitted beyond saved stage.`,
    },
    {
      label: "Interview rate",
      value: `${responseRate}%`,
      detail: `${interviews} interviews from ${applied} active applications.`,
    },
    {
      label: "Offers",
      value: String(offers),
      detail: offers > 0 ? "Keep momentum — review compensation and fit." : "Focus on targeted applications.",
    },
    {
      label: "Avg. job fit",
      value: avgScore > 0 ? `${avgScore}%` : "N/A",
      detail: "Compatibility score across tracked roles.",
    },
    {
      label: "Skills on profile",
      value: String(profile.skills.length),
      detail: "Keep skills aligned with target job descriptions.",
    },
  ];
}

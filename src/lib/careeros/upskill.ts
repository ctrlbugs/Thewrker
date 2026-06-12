import type { CareerDNA } from "./types";

export interface LearningResource {
  id: string;
  title: string;
  type: "youtube" | "course" | "docs" | "platform";
  skill: string;
  url: string;
  cost: "free" | "paid";
  provider: string;
}

export interface UpskillRoadmap {
  durationDays: 30 | 60 | 90;
  skillGaps: string[];
  weeks: { week: number; focus: string; resources: LearningResource[] }[];
}

const RESOURCE_CATALOG: LearningResource[] = [
  {
    id: "ts-handbook",
    title: "TypeScript Handbook",
    type: "docs",
    skill: "typescript",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    cost: "free",
    provider: "TypeScript",
  },
  {
    id: "react-docs",
    title: "React Official Docs",
    type: "docs",
    skill: "react",
    url: "https://react.dev/learn",
    cost: "free",
    provider: "Meta",
  },
  {
    id: "nextjs-learn",
    title: "Next.js Learn Course",
    type: "course",
    skill: "next.js",
    url: "https://nextjs.org/learn",
    cost: "free",
    provider: "Vercel",
  },
  {
    id: "testing-library",
    title: "Testing Library Docs",
    type: "docs",
    skill: "testing",
    url: "https://testing-library.com/docs/",
    cost: "free",
    provider: "Testing Library",
  },
  {
    id: "gh-actions",
    title: "GitHub Actions Quickstart",
    type: "docs",
    skill: "ci/cd",
    url: "https://docs.github.com/en/actions/quickstart",
    cost: "free",
    provider: "GitHub",
  },
  {
    id: "system-design",
    title: "System Design Primer",
    type: "docs",
    skill: "system design",
    url: "https://github.com/donnemartin/system-design-primer",
    cost: "free",
    provider: "GitHub",
  },
  {
    id: "figma-yt",
    title: "Figma UI Design Tutorial",
    type: "youtube",
    skill: "figma",
    url: "https://www.youtube.com/results?search_query=figma+ui+design+tutorial",
    cost: "free",
    provider: "YouTube",
  },
  {
    id: "nodejs-yt",
    title: "Node.js Full Course",
    type: "youtube",
    skill: "node.js",
    url: "https://www.youtube.com/results?search_query=node.js+full+course",
    cost: "free",
    provider: "YouTube",
  },
  {
    id: "aws-skillbuilder",
    title: "AWS Skill Builder",
    type: "platform",
    skill: "aws",
    url: "https://skillbuilder.aws",
    cost: "free",
    provider: "Amazon",
  },
  {
    id: "udemy",
    title: "Udemy Tech Courses",
    type: "platform",
    skill: "general",
    url: "https://www.udemy.com/courses/development/",
    cost: "paid",
    provider: "Udemy",
  },
];

const NICHE_SKILL_TARGETS: Record<string, string[]> = {
  technology: ["typescript", "react", "next.js", "testing", "ci/cd", "system design"],
  design: ["figma", "ui/ux", "design systems"],
  marketing: ["seo", "analytics", "content strategy"],
  finance: ["excel", "data analysis", "sql"],
  healthcare: ["data analysis", "compliance"],
  education: ["communication", "curriculum design"],
  government: ["project management", "communication"],
  general: ["communication", "project management", "excel"],
};

function findResourcesForSkill(skill: string): LearningResource[] {
  const lower = skill.toLowerCase();
  const matches = RESOURCE_CATALOG.filter(
    (r) => r.skill.includes(lower) || lower.includes(r.skill) || r.title.toLowerCase().includes(lower),
  );
  return matches.length > 0 ? matches : RESOURCE_CATALOG.filter((r) => r.skill === "general").slice(0, 1);
}

export function identifySkillGaps(dna: CareerDNA | null): string[] {
  if (!dna) return ["communication", "project management", "technical skills"];

  const targets = NICHE_SKILL_TARGETS[dna.industry] ?? NICHE_SKILL_TARGETS.general;
  const current = dna.skills.map((s) => s.toLowerCase());

  return targets.filter(
    (target) => !current.some((s) => s.includes(target) || target.includes(s)),
  ).slice(0, 6);
}

export function buildUpskillRoadmap(dna: CareerDNA | null, durationDays: 30 | 60 | 90): UpskillRoadmap {
  const skillGaps = identifySkillGaps(dna);
  const weeksCount = durationDays === 30 ? 4 : durationDays === 60 ? 8 : 12;
  const gapsPerWeek = Math.max(1, Math.ceil(skillGaps.length / weeksCount));

  const weeks: UpskillRoadmap["weeks"] = [];
  for (let w = 1; w <= weeksCount; w++) {
    const gapIndex = Math.min((w - 1) * gapsPerWeek, skillGaps.length - 1);
    const focus = skillGaps[gapIndex] ?? (w === weeksCount ? "Portfolio & applications" : "Career fundamentals");
    const resources = findResourcesForSkill(focus);
    weeks.push({ week: w, focus, resources });
  }

  return { durationDays, skillGaps, weeks };
}

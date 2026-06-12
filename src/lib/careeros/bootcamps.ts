import type { CareerDNA } from "./types";

export type BootcampType = "free" | "paid" | "scholarship";

export interface Bootcamp {
  id: string;
  name: string;
  type: BootcampType;
  focus: string[];
  duration: string;
  url: string;
  description: string;
  provider: string;
}

export const BOOTCAMPS: Bootcamp[] = [
  {
    id: "freecodecamp",
    name: "freeCodeCamp",
    type: "free",
    focus: ["javascript", "react", "node", "python", "data"],
    duration: "Self-paced",
    url: "https://www.freecodecamp.org",
    description: "Free certifications in web development, data science, and more.",
    provider: "freeCodeCamp",
  },
  {
    id: "theodinproject",
    name: "The Odin Project",
    type: "free",
    focus: ["javascript", "react", "node", "fullstack"],
    duration: "6–12 months",
    url: "https://www.theodinproject.com",
    description: "Open-source full-stack curriculum with projects.",
    provider: "The Odin Project",
  },
  {
    id: "cs50",
    name: "CS50 — Harvard",
    type: "free",
    focus: ["computer science", "python", "c"],
    duration: "12 weeks",
    url: "https://cs50.harvard.edu",
    description: "Harvard's introduction to computer science — free online.",
    provider: "Harvard / edX",
  },
  {
    id: "google-ux",
    name: "Google UX Design Certificate",
    type: "paid",
    focus: ["ui", "ux", "figma", "design"],
    duration: "6 months",
    url: "https://grow.google/certificates/ux-design",
    description: "Professional UX design certificate via Coursera.",
    provider: "Google / Coursera",
  },
  {
    id: "meta-frontend",
    name: "Meta Front-End Developer",
    type: "paid",
    focus: ["react", "javascript", "html", "css"],
    duration: "7 months",
    url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    description: "Meta-backed front-end developer professional certificate.",
    provider: "Meta / Coursera",
  },
  {
    id: "aws-restart",
    name: "AWS re/Start",
    type: "scholarship",
    focus: ["aws", "cloud", "linux"],
    duration: "12 weeks",
    url: "https://aws.amazon.com/training/restart",
    description: "Free cloud training for unemployed and underemployed individuals.",
    provider: "Amazon Web Services",
  },
  {
    id: "app-academy-open",
    name: "App Academy Open",
    type: "free",
    focus: ["javascript", "react", "node", "fullstack"],
    duration: "Self-paced",
    url: "https://open.appacademy.io",
    description: "Free full-stack curriculum — same content as paid bootcamp.",
    provider: "App Academy",
  },
  {
    id: "scrimba",
    name: "Scrimba Frontend Path",
    type: "paid",
    focus: ["javascript", "react", "typescript", "next"],
    duration: "4–6 months",
    url: "https://scrimba.com/frontend-path-c0j",
    description: "Interactive screencast-style frontend career path.",
    provider: "Scrimba",
  },
];

export function recommendBootcamps(dna: CareerDNA | null, type?: BootcampType): Bootcamp[] {
  let list = type ? BOOTCAMPS.filter((b) => b.type === type) : BOOTCAMPS;

  if (dna?.skills.length) {
    const skills = dna.skills.map((s) => s.toLowerCase());
    list = [...list].sort((a, b) => {
      const scoreA = a.focus.filter((f) => skills.some((s) => s.includes(f) || f.includes(s))).length;
      const scoreB = b.focus.filter((f) => skills.some((s) => s.includes(f) || f.includes(s))).length;
      return scoreB - scoreA;
    });
  }

  return list.slice(0, 8);
}

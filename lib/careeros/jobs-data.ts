export type JobSkill = {
  name: string;
  kind: "hard" | "soft" | "other";
  status: "match" | "partial" | "missing";
};

export type CareerJob = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  posted: string;
  salary: string;
  type: "Remote" | "Hybrid" | "On-site";
  employment: string;
  matchScore: number;
  about: string;
  requirements: string[];
  skills: JobSkill[];
  applyUrl?: string;
  source?: string;
  logoUrl?: string;
};

export const CAREER_JOBS: CareerJob[] = [
  {
    id: "1",
    title: "Frontend Engineer, Market Tech",
    company: "Northstar Labs",
    logo: "NL",
    location: "Remote",
    posted: "4d",
    salary: "$95k – $110k",
    type: "Remote",
    employment: "Contract",
    matchScore: 88,
    about:
      "You’ll ship polished product surfaces for a modern market platform — collaborating with design and backend to deliver fast, accessible experiences professionals love.",
    requirements: [
      "3+ years React / TypeScript experience",
      "Strong UI craft and design-system fluency",
      "Comfortable with APIs and performance tuning",
      "Excellent written communication",
    ],
    skills: [
      { name: "React", kind: "hard", status: "match" },
      { name: "TypeScript", kind: "hard", status: "match" },
      { name: "Design Systems", kind: "hard", status: "partial" },
      { name: "Communication", kind: "soft", status: "match" },
    ],
  },
  {
    id: "2",
    title: "Product Designer (UX/UI)",
    company: "Alcon Digital",
    logo: "AD",
    location: "Remote",
    posted: "2d",
    salary: "$110k – $135k",
    type: "Remote",
    employment: "Full-time",
    matchScore: 74,
    about:
      "Own end-to-end product design for B2B workflows. Pair research with crisp interfaces and partner closely with engineering.",
    requirements: [
      "Portfolio showing complex product work",
      "Figma mastery and design systems",
      "Experience with user research",
      "Comfortable in agile product teams",
    ],
    skills: [
      { name: "Figma", kind: "hard", status: "match" },
      { name: "UX Research", kind: "hard", status: "partial" },
      { name: "Design Systems", kind: "hard", status: "match" },
      { name: "Collaboration", kind: "soft", status: "match" },
    ],
  },
  {
    id: "3",
    title: "Full-Stack Engineer",
    company: "Cascade Health",
    logo: "CH",
    location: "Hybrid · NYC",
    posted: "1w",
    salary: "$130k – $160k",
    type: "Hybrid",
    employment: "Full-time",
    matchScore: 69,
    about:
      "Build reliable patient-facing products with Node, React, and cloud infrastructure. Quality, privacy, and calm UX matter here.",
    requirements: [
      "Node.js and React experience",
      "PostgreSQL / Prisma familiarity",
      "Security-minded engineering habits",
      "Empathy for healthcare users",
    ],
    skills: [
      { name: "Node.js", kind: "hard", status: "match" },
      { name: "PostgreSQL", kind: "hard", status: "partial" },
      { name: "React", kind: "hard", status: "match" },
      { name: "Empathy", kind: "soft", status: "match" },
    ],
  },
  {
    id: "4",
    title: "Customer Success Manager",
    company: "Orbit Cloud",
    logo: "OC",
    location: "Remote",
    posted: "3d",
    salary: "$75k – $95k",
    type: "Remote",
    employment: "Full-time",
    matchScore: 81,
    about:
      "Guide customers from onboarding to expansion. You’ll turn product value into lasting relationships and clear outcomes.",
    requirements: [
      "2+ years customer success experience",
      "Strong storytelling and demos",
      "CRM fluency (HubSpot / Salesforce)",
      "Comfortable with metrics and QBRs",
    ],
    skills: [
      { name: "CRM", kind: "hard", status: "match" },
      { name: "Presentations", kind: "soft", status: "match" },
      { name: "Analytics", kind: "hard", status: "partial" },
      { name: "Retention", kind: "other", status: "match" },
    ],
  },
  {
    id: "5",
    title: "AI Product Manager",
    company: "Lumen AI",
    logo: "LA",
    location: "Remote",
    posted: "5d",
    salary: "$140k – $170k",
    type: "Remote",
    employment: "Full-time",
    matchScore: 62,
    about:
      "Define AI-assisted workflows for knowledge workers. Translate model capabilities into product moments people trust.",
    requirements: [
      "Shipped AI or ML-adjacent products",
      "Clear product writing and prioritization",
      "Comfortable with evals and quality loops",
      "Cross-functional leadership",
    ],
    skills: [
      { name: "Product Strategy", kind: "hard", status: "partial" },
      { name: "AI Literacy", kind: "hard", status: "missing" },
      { name: "Roadmapping", kind: "hard", status: "match" },
      { name: "Leadership", kind: "soft", status: "match" },
    ],
  },
  {
    id: "6",
    title: "Digital Product Designer",
    company: "Vail Resorts Tech",
    logo: "VR",
    location: "Remote",
    posted: "1w",
    salary: "$105k – $125k",
    type: "Remote",
    employment: "Full-time",
    matchScore: 71,
    about:
      "Design delightful booking and membership experiences used by millions. Systems thinking and crisp visuals required.",
    requirements: [
      "Strong visual + interaction design",
      "Mobile-first product experience",
      "Design systems contribution",
      "Collaborative critique culture",
    ],
    skills: [
      { name: "UI Design", kind: "hard", status: "match" },
      { name: "Prototyping", kind: "hard", status: "match" },
      { name: "Mobile UX", kind: "hard", status: "partial" },
      { name: "Critique", kind: "soft", status: "match" },
    ],
  },
];

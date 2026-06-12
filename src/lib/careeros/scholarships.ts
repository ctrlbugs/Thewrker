import type { CareerDNA, IndustryNiche } from "./types";

export interface Scholarship {
  id: string;
  name: string;
  level: "undergraduate" | "masters" | "phd" | "professional";
  regions: string[];
  fields: IndustryNiche[];
  deadline: string;
  url: string;
  description: string;
  fullyFunded: boolean;
}

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "chevening",
    name: "Chevening Scholarship",
    level: "masters",
    regions: ["Global", "UK"],
    fields: ["general", "government", "technology", "education"],
    deadline: "November annually",
    url: "https://www.chevening.org/apply",
    description: "UK government scholarship for future leaders — fully funded master's degrees.",
    fullyFunded: true,
  },
  {
    id: "erasmus",
    name: "Erasmus Mundus Joint Masters",
    level: "masters",
    regions: ["Europe", "Global"],
    fields: ["technology", "education", "healthcare", "general"],
    deadline: "Varies by programme",
    url: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en",
    description: "EU-funded joint master's programmes across European universities.",
    fullyFunded: true,
  },
  {
    id: "commonwealth",
    name: "Commonwealth Scholarship",
    level: "masters",
    regions: ["Commonwealth countries"],
    fields: ["general", "healthcare", "education", "technology"],
    deadline: "December annually",
    url: "https://cscuk.fcdo.gov.uk/apply",
    description: "Fully funded study for Commonwealth citizens pursuing master's or PhD.",
    fullyFunded: true,
  },
  {
    id: "fulbright",
    name: "Fulbright Program",
    level: "masters",
    regions: ["USA", "Global"],
    fields: ["general", "education", "government", "technology"],
    deadline: "Varies by country",
    url: "https://fulbrightprogram.org",
    description: "International educational exchange for graduate study and research.",
    fullyFunded: true,
  },
  {
    id: "gates-cambridge",
    name: "Gates Cambridge Scholarship",
    level: "phd",
    regions: ["Global"],
    fields: ["technology", "healthcare", "education", "general"],
    deadline: "October / December",
    url: "https://www.gatescambridge.org/apply",
    description: "Full-cost scholarship for postgraduate study at the University of Cambridge.",
    fullyFunded: true,
  },
  {
    id: "daad",
    name: "DAAD Scholarships",
    level: "masters",
    regions: ["Germany", "Global"],
    fields: ["technology", "education", "general"],
    deadline: "Varies",
    url: "https://www.daad.de/en/study-and-research-in-germany/scholarships",
    description: "German Academic Exchange Service — study and research in Germany.",
    fullyFunded: true,
  },
  {
    id: "google-cert",
    name: "Google Career Certificates Scholarship",
    level: "professional",
    regions: ["Global"],
    fields: ["technology"],
    deadline: "Rolling",
    url: "https://grow.google/certificates",
    description: "Professional certificates in IT support, data analytics, UX, and more.",
    fullyFunded: false,
  },
  {
    id: "aws-educate",
    name: "AWS Educate / Cloud Credits",
    level: "professional",
    regions: ["Global"],
    fields: ["technology"],
    deadline: "Rolling",
    url: "https://aws.amazon.com/education/awseducate",
    description: "Cloud learning resources and credits for students and career changers.",
    fullyFunded: false,
  },
];

export function recommendScholarships(dna: CareerDNA | null): Scholarship[] {
  if (!dna) return SCHOLARSHIPS.slice(0, 5);

  const levelMap: Record<string, Scholarship["level"][]> = {
    entry: ["undergraduate", "professional"],
    junior: ["masters", "professional"],
    intermediate: ["masters", "professional"],
    senior: ["masters", "phd", "professional"],
    lead: ["phd", "professional"],
  };

  const preferredLevels = levelMap[dna.careerLevel] ?? ["masters", "professional"];

  return SCHOLARSHIPS.filter(
    (s) =>
      preferredLevels.includes(s.level) &&
      (s.fields.includes(dna.industry) || s.fields.includes("general")),
  ).slice(0, 6);
}

import type { CareerProfile, ResumeTemplateId, StructuredResume } from "./types";
import { extractSkills } from "./analysis";

function extractContact(text: string) {
  const email = text.match(/[\w.+-]+@[\w.-]+\.\w{2,}/)?.[0] ?? "";
  const phone = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] ?? "";
  const linkedin = text.match(/linkedin\.com\/in\/[\w-]+/i)?.[0] ?? "";
  const website = text.match(/https?:\/\/(?!linkedin)[\w./-]+/i)?.[0] ?? "";
  const location =
    text.match(/(?:location|address|city)\s*[:\-]\s*(.+)/i)?.[1]?.trim() ??
    text.match(/\b([A-Z][a-z]+(?:,\s*[A-Z]{2})?)\b/)?.[0] ??
    "";

  return { email, phone, location, linkedin, website };
}

function extractSummary(text: string): string {
  const lower = text.toLowerCase();
  const summaryIdx = lower.search(/\b(summary|profile|about)\b/);
  if (summaryIdx >= 0) {
    const chunk = text.slice(summaryIdx).split("\n").slice(1, 5).join(" ").trim();
    if (chunk.length > 40) return chunk.slice(0, 400);
  }

  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter((p) => p.length > 60);
  return paragraphs[0]?.slice(0, 400) ?? "";
}

function extractExperience(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const experiences: StructuredResume["experience"] = [];
  let current: StructuredResume["experience"][0] | null = null;

  const datePattern = /\b(20\d{2}|19\d{2})\s*[-–—]\s*(20\d{2}|19\d{2}|present|current)\b/i;
  const bulletPattern = /^[•\-*–]\s*/;

  for (const line of lines) {
    if (datePattern.test(line) && line.length < 80) {
      if (current) experiences.push(current);
      const parts = line.split(/\s+[-–|]\s+/);
      current = {
        role: parts[0]?.replace(datePattern, "").trim() || "Role",
        company: parts[1]?.trim() || "Company",
        period: line.match(datePattern)?.[0] ?? "",
        bullets: [],
      };
      continue;
    }

    if (bulletPattern.test(line) && current) {
      current.bullets.push(line.replace(bulletPattern, "").trim());
    }
  }

  if (current) experiences.push(current);
  return experiences.slice(0, 6);
}

function extractEducation(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const education: StructuredResume["education"] = [];
  const degreePattern = /(bachelor|master|mba|phd|b\.?sc|m\.?sc|university|college|school)/i;

  for (const line of lines) {
    if (degreePattern.test(line) && line.length < 120) {
      education.push({
        degree: line,
        institution: "",
        period: line.match(/\b20\d{2}\b/)?.[0] ?? "",
      });
    }
  }

  return education.slice(0, 3);
}

export function parseResumeToStructured(
  profile: CareerProfile,
  templateId: ResumeTemplateId = profile.resumeTemplate,
): StructuredResume {
  const text = profile.resumeText;
  const skills = profile.skills.length > 0 ? profile.skills : extractSkills(text);

  return {
    templateId,
    name: profile.name.trim() || "Your Name",
    headline: profile.headline.trim() || "Professional",
    summary: extractSummary(text) || `Results-driven ${profile.headline || "professional"} with ${profile.yearsExperience}+ years of experience.`,
    contact: extractContact(text),
    experience: extractExperience(text),
    education: extractEducation(text),
    skills,
    projects: [],
    certifications: [],
  };
}

export function structuredResumeToText(resume: StructuredResume): string {
  const lines: string[] = [
    resume.name.toUpperCase(),
    resume.headline,
    "",
  ];

  const contactParts = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.linkedin,
    resume.contact.website,
  ].filter(Boolean);
  if (contactParts.length) lines.push(contactParts.join(" | "));

  lines.push("", "PROFESSIONAL SUMMARY", resume.summary);

  if (resume.skills.length) {
    lines.push("", "CORE SKILLS", resume.skills.join(" • "));
  }

  if (resume.experience.length) {
    lines.push("", "PROFESSIONAL EXPERIENCE");
    for (const exp of resume.experience) {
      lines.push("", `${exp.role} | ${exp.company}`, exp.period);
      for (const bullet of exp.bullets) {
        lines.push(`• ${bullet}`);
      }
    }
  }

  if (resume.education.length) {
    lines.push("", "EDUCATION");
    for (const edu of resume.education) {
      lines.push(edu.degree, edu.institution, edu.period);
    }
  }

  if (resume.certifications.length) {
    lines.push("", "CERTIFICATIONS", resume.certifications.join(" • "));
  }

  return lines.filter((l, i, arr) => !(l === "" && arr[i - 1] === "")).join("\n");
}

export function upgradeResumeToStandard(profile: CareerProfile): {
  structured: StructuredResume;
  text: string;
} {
  const structured = parseResumeToStructured(profile, profile.resumeTemplate);
  const text = structuredResumeToText(structured);
  return { structured, text };
}

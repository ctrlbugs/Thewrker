export type ResumeSectionType =
  | "experience"
  | "education"
  | "skill"
  | "certification";

export interface ResumeSection {
  id: string;
  type: ResumeSectionType;
  title: string;
  organization?: string;
  period?: string;
  location?: string;
  description?: string;
  skills?: string[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  targetTitle: string;
  summary: string;
}

export type ResumeTemplateId = "plain" | "smooth";

export interface DesignSettings {
  templateId: ResumeTemplateId;
  accent: string;
  fontFamily: "Manrope" | "Georgia" | "Inter";
  lineHeight: number;
}

/** Migrate legacy template ids from earlier drafts */
export function normalizeTemplateId(
  id: string | undefined
): ResumeTemplateId {
  if (id === "smooth" || id === "modern") return "smooth";
  return "plain";
}

export interface CoverLetterDraft {
  jobTitle: string;
  company: string;
  body: string;
}

export interface ResumeDraft {
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  design: DesignSettings;
  coverLetter: CoverLetterDraft;
  sourceText?: string;
  importedAt?: number;
  fileName?: string;
}

export const RESUME_DRAFT_KEY = "thewrker.resume.draft";
export const RESUME_IMPORT_KEY = "thewrker.resume.import";

export const TEMPLATES: {
  id: ResumeTemplateId;
  name: string;
  blurb: string;
}[] = [
  {
    id: "plain",
    name: "Plain Template",
    blurb: "Classic black & white, serif body, ATS-clean",
  },
  {
    id: "smooth",
    name: "Smooth Template",
    blurb: "TheWrker navy & teal accents, polished layout",
  },
];

export const ACCENT_SWATCHES = [
  "#21386B",
  "#76BEC5",
  "#0f172a",
  "#64748b",
  "#c9a227",
  "#b45309",
  "#9f1239",
  "#1d4ed8",
  "#ea580c",
] as const;

export function emptyPersonalInfo(): PersonalInfo {
  return {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    targetTitle: "",
    summary: "",
  };
}

export function defaultDesign(): DesignSettings {
  return {
    templateId: "smooth",
    accent: "#21386B",
    fontFamily: "Georgia",
    lineHeight: 1.45,
  };
}

export function emptyDraft(): ResumeDraft {
  return {
    personalInfo: emptyPersonalInfo(),
    sections: [],
    design: defaultDesign(),
    coverLetter: { jobTitle: "", company: "", body: "" },
  };
}

export function loadDraft(): ResumeDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RESUME_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ResumeDraft;
    return {
      ...emptyDraft(),
      ...parsed,
      personalInfo: { ...emptyPersonalInfo(), ...parsed.personalInfo },
      design: {
        ...defaultDesign(),
        ...parsed.design,
        templateId: normalizeTemplateId(parsed.design?.templateId),
      },
      coverLetter: {
        ...emptyDraft().coverLetter,
        ...parsed.coverLetter,
      },
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
    };
  } catch {
    return null;
  }
}

export function saveDraft(draft: ResumeDraft) {
  try {
    localStorage.setItem(RESUME_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

function firstEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
}

function firstPhone(text: string) {
  return (
    text.match(
      /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/
    )?.[0] ?? ""
  );
}

function firstLinkedIn(text: string) {
  return (
    text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?/i)?.[0] ??
    ""
  );
}

/** Lightweight heuristic parser — good enough for import seeding */
export function parseResumeText(text: string, fileName?: string): ResumeDraft {
  const cleaned = text.replace(/\r/g, "").trim();
  const lines = cleaned
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const email = firstEmail(cleaned);
  const phone = firstPhone(cleaned);
  const linkedIn = firstLinkedIn(cleaned);

  const nameLine =
    lines.find(
      (l) =>
        l.length > 2 &&
        l.length < 48 &&
        !l.includes("@") &&
        !/experience|education|skills|summary|resume/i.test(l)
    ) ?? "Your Name";

  const summaryIdx = lines.findIndex((l) =>
    /^(professional\s+)?summary|profile|about/i.test(l)
  );
  let summary = "";
  if (summaryIdx >= 0) {
    summary = lines
      .slice(summaryIdx + 1, summaryIdx + 5)
      .filter((l) => !/^(experience|education|skills|work)/i.test(l))
      .join(" ")
      .slice(0, 520);
  } else {
    summary = lines.slice(1, 4).join(" ").slice(0, 420);
  }

  const expIdx = lines.findIndex((l) =>
    /^(work\s+)?experience|employment|professional experience/i.test(l)
  );
  const eduIdx = lines.findIndex((l) => /^education|academic/i.test(l));
  const skillsIdx = lines.findIndex((l) => /^skills|technical skills/i.test(l));

  const sections: ResumeSection[] = [];
  const expEnd =
    [eduIdx, skillsIdx].filter((i) => i > expIdx).sort((a, b) => a - b)[0] ??
    Math.min(lines.length, (expIdx >= 0 ? expIdx : 0) + 12);

  if (expIdx >= 0) {
    const block = lines.slice(expIdx + 1, expEnd);
    const title = block[0] || "Role title";
    const organization = block[1] || "Company";
    const period =
      block.find((l) => /\d{4}|present|current/i.test(l)) || "2022 – Present";
    const description = block
      .filter((l) => l !== title && l !== organization && l !== period)
      .slice(0, 6)
      .join("\n");
    sections.push({
      id: "exp-1",
      type: "experience",
      title: title.slice(0, 80),
      organization: organization.slice(0, 80),
      period,
      description:
        description ||
        "Refine impact bullets so they sound like you — metrics welcome.",
    });
  } else {
    sections.push({
      id: "exp-1",
      type: "experience",
      title: "Role title",
      organization: "Company",
      period: "2022 – Present",
      description:
        "Imported into CareerOS — edit each bullet so your story stays authentic.",
    });
  }

  if (eduIdx >= 0) {
    const block = lines.slice(eduIdx + 1, eduIdx + 5);
    sections.push({
      id: "edu-1",
      type: "education",
      title: block[0] || "Degree",
      organization: block[1] || "School",
      period: block.find((l) => /\d{4}/.test(l)) || "",
      description: "",
    });
  }

  if (skillsIdx >= 0) {
    const skillLine = lines
      .slice(skillsIdx + 1, skillsIdx + 4)
      .join(", ")
      .slice(0, 240);
    sections.push({
      id: "sk-1",
      type: "skill",
      title: "Core skills",
      description: skillLine || "List your strongest tools and strengths.",
    });
  }

  const titleGuess =
    lines.find((l) =>
      /designer|engineer|developer|manager|analyst|specialist|lead/i.test(l)
    ) ?? "";

  return {
    personalInfo: {
      fullName: nameLine,
      email,
      phone,
      location: "",
      linkedIn,
      targetTitle: titleGuess.slice(0, 60),
      summary:
        summary ||
        "Imported into TheWrker CareerOS — refine each section so your story stays authentic and job-ready.",
    },
    sections,
    design: defaultDesign(),
    coverLetter: { jobTitle: "", company: "", body: "" },
    sourceText: cleaned.slice(0, 12000),
    importedAt: Date.now(),
    fileName,
  };
}

export function seedFromImportMeta(meta: {
  mode?: string;
  fileName?: string;
  linkedIn?: string;
  paste?: string;
}): ResumeDraft {
  if (meta.paste && meta.paste.trim().length > 40) {
    return parseResumeText(meta.paste, meta.fileName);
  }
  const draft = emptyDraft();
  draft.personalInfo = {
    ...emptyPersonalInfo(),
    fullName: "Your Name",
    email: "you@email.com",
    location: "Remote",
    linkedIn: meta.linkedIn || "",
    summary:
      "Imported into TheWrker CareerOS — refine each section so your story stays authentic and job-ready.",
  };
  draft.sections = [
    {
      id: "1",
      type: "experience",
      title: "Role title",
      organization: "Company",
      period: "2022 – Present",
      description:
        "Describe impact with metrics. Toggle details per application from your master resume.",
    },
  ];
  draft.fileName = meta.fileName;
  draft.importedAt = Date.now();
  return draft;
}

/** Local “AI cleanup” — tighten wording without inventing facts */
export function aiCleanDraft(draft: ResumeDraft): ResumeDraft {
  const tidy = (s: string) =>
    s
      .replace(/\s+/g, " ")
      .replace(/\s+([,.!?;:])/g, "$1")
      .trim();

  const summary = tidy(draft.personalInfo.summary);
  const polishedSummary =
    summary.length > 40
      ? summary.replace(/\bi\b/gi, "I").replace(/\s+and\s+and\s+/gi, " and ")
      : summary;

  return {
    ...draft,
    personalInfo: {
      ...draft.personalInfo,
      fullName: tidy(draft.personalInfo.fullName),
      targetTitle: tidy(draft.personalInfo.targetTitle),
      summary: polishedSummary,
      email: tidy(draft.personalInfo.email),
      phone: tidy(draft.personalInfo.phone),
      location: tidy(draft.personalInfo.location),
    },
    sections: draft.sections.map((s) => ({
      ...s,
      title: tidy(s.title),
      organization: s.organization ? tidy(s.organization) : s.organization,
      period: s.period ? tidy(s.period) : s.period,
      description: s.description
        ? tidy(s.description)
            .split(/(?<=[.!?])\s+/)
            .filter(Boolean)
            .map((line) => (line.startsWith("•") ? line : line))
            .join(" ")
        : s.description,
    })),
  };
}

export function analyzeDraft(draft: ResumeDraft) {
  const checks = [
    {
      id: "name",
      label: "Full name present",
      ok: draft.personalInfo.fullName.trim().length > 1,
      weight: 10,
    },
    {
      id: "email",
      label: "Email address",
      ok: /@/.test(draft.personalInfo.email),
      weight: 12,
    },
    {
      id: "summary",
      label: "Professional summary (40+ chars)",
      ok: draft.personalInfo.summary.trim().length >= 40,
      weight: 14,
    },
    {
      id: "title",
      label: "Target title",
      ok: draft.personalInfo.targetTitle.trim().length > 2,
      weight: 8,
    },
    {
      id: "experience",
      label: "At least one experience entry",
      ok: draft.sections.some((s) => s.type === "experience" && s.title),
      weight: 18,
    },
    {
      id: "bullets",
      label: "Experience has detail (80+ chars)",
      ok: draft.sections.some(
        (s) => s.type === "experience" && (s.description?.length ?? 0) >= 80
      ),
      weight: 14,
    },
    {
      id: "education",
      label: "Education section",
      ok: draft.sections.some((s) => s.type === "education"),
      weight: 10,
    },
    {
      id: "skills",
      label: "Skills listed",
      ok: draft.sections.some((s) => s.type === "skill"),
      weight: 10,
    },
    {
      id: "contact",
      label: "Phone or location",
      ok: Boolean(
        draft.personalInfo.phone.trim() || draft.personalInfo.location.trim()
      ),
      weight: 4,
    },
  ];

  const earned = checks.filter((c) => c.ok).reduce((n, c) => n + c.weight, 0);
  const total = checks.reduce((n, c) => n + c.weight, 0);
  const score = Math.round((earned / total) * 100);
  const issues = checks.filter((c) => !c.ok);

  return { score, checks, issues, issueCount: issues.length };
}

export function matchJobKeywords(draft: ResumeDraft, jobText: string) {
  const corpus = [
    draft.personalInfo.summary,
    draft.personalInfo.targetTitle,
    ...draft.sections.map(
      (s) => `${s.title} ${s.organization ?? ""} ${s.description ?? ""}`
    ),
  ]
    .join(" ")
    .toLowerCase();

  const tokens = Array.from(
    new Set(
      jobText
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s-]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 3)
    )
  ).slice(0, 40);

  const important = tokens.filter((t) =>
    /react|typescript|design|figma|node|python|sql|aws|lead|agile|product|ui|ux|css|api|cloud|data|manage|communicat|collaborat/i.test(
      t
    )
  );
  const pool = important.length ? important : tokens.slice(0, 16);

  const rows = pool.map((keyword) => {
    const hit = corpus.includes(keyword);
    return {
      keyword,
      status: hit ? ("match" as const) : ("missing" as const),
    };
  });

  const matched = rows.filter((r) => r.status === "match").length;
  const score = rows.length
    ? Math.round((matched / rows.length) * 100)
    : 0;

  return { score, rows, matched, total: rows.length };
}

export function generateCoverLetter(
  draft: ResumeDraft,
  jobTitle: string,
  company: string
): string {
  const name = draft.personalInfo.fullName || "Your Name";
  const role = jobTitle || draft.personalInfo.targetTitle || "this role";
  const org = company || "your team";
  const highlight =
    draft.sections.find((s) => s.type === "experience")?.description?.slice(
      0,
      160
    ) ||
    draft.personalInfo.summary.slice(0, 160) ||
    "a track record of shipping clear, thoughtful work";

  return `Dear Hiring Manager,

I am writing to express my interest in the ${role} position at ${org}. With experience as ${
    draft.sections.find((s) => s.type === "experience")?.title ||
    draft.personalInfo.targetTitle ||
    "a dedicated professional"
  }, I bring clarity, ownership, and a calm approach to complex work.

Recently, ${highlight}${highlight.endsWith(".") ? "" : "."}

I would welcome the chance to contribute to ${org} and would be glad to share how my background aligns with your goals.

Sincerely,
${name}`;
}

import type {
  DesignSettings,
  PersonalInfo,
  ResumeSection,
  ResumeTemplateId,
} from "@/lib/careeros/resume-draft";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function contactLine(info: PersonalInfo) {
  return [info.email, info.linkedIn, info.phone, info.location]
    .map((v) => v.trim())
    .filter(Boolean)
    .join(" • ");
}

export function toBullets(description?: string): string[] {
  if (!description?.trim()) return [];
  const lines = description
    .split(/\r?\n|•|·|(?:^|\s)[-–—]\s+/)
    .map((l) => l.replace(/^[\s•·\-–—]+/, "").trim())
    .filter(Boolean);
  return lines.length ? lines : [description.trim()];
}

type Theme = {
  name: string;
  role: string;
  contact: string;
  section: string;
  rule: string;
  jobTitle: string;
  company: string;
  dates: string;
  body: string;
};

function themeFor(templateId: ResumeTemplateId): Theme {
  if (templateId === "smooth") {
    return {
      name: "#2f7f88",
      role: "#111111",
      contact: "#222222",
      section: "#76BEC5",
      rule: "transparent",
      jobTitle: "#111111",
      company: "#111111",
      dates: "#111111",
      body: "#111111",
    };
  }
  return {
    name: "#111111",
    role: "#555555",
    contact: "#333333",
    section: "#111111",
    rule: "#111111",
    jobTitle: "#555555",
    company: "#111111",
    dates: "#222222",
    body: "#111111",
  };
}

function sectionHtml(
  title: string,
  inner: string,
  t: Theme,
  templateId: ResumeTemplateId
) {
  if (!inner.trim()) return "";
  const heading =
    templateId === "smooth" ? title.toUpperCase() : title;
  return `
    <section class="rv-section">
      <h2 class="rv-section-title" style="color:${t.section}">${esc(heading)}</h2>
      ${
        templateId === "plain"
          ? `<hr class="rv-rule" style="border-color:${t.rule}" />`
          : `<div class="rv-section-gap"></div>`
      }
      ${inner}
    </section>`;
}

function experienceHtml(
  sections: ResumeSection[],
  t: Theme,
  templateId: ResumeTemplateId
) {
  return sections
    .map((s) => {
      const bullets = toBullets(s.description)
        .map((b) => `<li style="color:${t.body}">${esc(b)}</li>`)
        .join("");
      if (templateId === "smooth") {
        return `
        <div class="rv-job rv-job--smooth">
          <div class="rv-row">
            <span class="rv-company" style="color:${t.company}">${esc(s.organization || s.title || "")}</span>
            <span class="rv-dates" style="color:${t.dates}">${esc(s.period || "")}</span>
          </div>
          ${
            s.organization && s.title
              ? `<div class="rv-row">
                  <span class="rv-job-title" style="color:${t.jobTitle}">${esc(s.title)}</span>
                  <span class="rv-dates" style="color:${t.dates}">${esc(s.location || "")}</span>
                </div>`
              : ""
          }
          ${bullets ? `<ul class="rv-bullets">${bullets}</ul>` : ""}
        </div>`;
      }
      return `
        <div class="rv-job">
          ${s.title ? `<p class="rv-job-title" style="color:${t.jobTitle}">${esc(s.title)}</p>` : ""}
          <div class="rv-row">
            <span class="rv-company" style="color:${t.company}">${esc(s.organization || "")}</span>
            <span class="rv-dates" style="color:${t.dates}">${esc(s.period || "")}</span>
          </div>
          ${bullets ? `<ul class="rv-bullets">${bullets}</ul>` : ""}
        </div>`;
    })
    .join("");
}

function educationHtml(sections: ResumeSection[], t: Theme) {
  return sections
    .map(
      (s) => `
        <div class="rv-job">
          <div class="rv-row">
            <span class="rv-company" style="color:${t.company}">${esc(s.title || "")}</span>
            <span class="rv-dates" style="color:${t.dates}">${esc(s.period || "")}</span>
          </div>
          ${
            s.organization
              ? `<p class="rv-job-title" style="color:${t.jobTitle}">${esc(s.organization)}</p>`
              : ""
          }
        </div>`
    )
    .join("");
}

function skillsHtml(sections: ResumeSection[], t: Theme) {
  return sections
    .map(
      (s) =>
        `<p class="rv-summary" style="color:${t.body}">${esc(s.description || s.title)}</p>`
    )
    .join("");
}

/** Shared CSS for live preview + PDF capture (Letter width) */
export const RESUME_DOC_CSS = `
  .rv-page {
    width: 816px;
    min-height: 1056px;
    box-sizing: border-box;
    padding: 72px 70px 64px;
    background: #fff;
    color: #111;
    text-align: left;
  }
  .rv-page--plain {
    font-family: Georgia, "Times New Roman", Times, serif;
  }
  .rv-page--smooth {
    font-family: Arial, Helvetica, "Segoe UI", sans-serif;
  }
  .rv-header { margin-bottom: 8px; }
  .rv-header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 28px;
  }
  .rv-name {
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }
  .rv-page--plain .rv-name {
    font-family: Georgia, "Times New Roman", Times, serif;
  }
  .rv-page--smooth .rv-name {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 28px;
  }
  .rv-role {
    margin: 0;
    max-width: 46%;
    text-align: right;
    font-size: 12.5px;
    font-weight: 600;
    line-height: 1.4;
    font-family: Arial, Helvetica, sans-serif;
  }
  .rv-role--stack {
    display: block;
    max-width: 100%;
    text-align: left;
    margin: 10px 0 0;
    font-size: 14px;
    font-weight: 700;
    text-transform: none;
  }
  .rv-contact {
    margin: 10px 0 0;
    font-size: 11.5px;
    line-height: 1.45;
    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: 0.01em;
  }
  .rv-section { margin-top: 26px; }
  .rv-section-title {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }
  .rv-page--smooth .rv-section-title {
    font-size: 12px;
    font-weight: 650;
    letter-spacing: 0.12em;
  }
  .rv-rule {
    border: 0;
    border-top: 1.25px solid #111;
    margin: 7px 0 12px;
  }
  .rv-section-gap { height: 10px; }
  .rv-summary {
    margin: 0;
    font-size: 12.5px;
    line-height: 1.55;
    text-align: left;
  }
  .rv-page--plain .rv-summary {
    font-family: Georgia, "Times New Roman", Times, serif;
  }
  .rv-job { margin-bottom: 18px; }
  .rv-job:last-child { margin-bottom: 0; }
  .rv-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 20px;
  }
  .rv-job-title {
    margin: 2px 0 0;
    font-size: 12.5px;
    font-weight: 700;
    font-family: Arial, Helvetica, sans-serif;
  }
  .rv-company {
    font-size: 13px;
    font-weight: 700;
  }
  .rv-page--plain .rv-company {
    font-family: Georgia, "Times New Roman", Times, serif;
  }
  .rv-dates {
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
    text-align: right;
  }
  .rv-bullets {
    margin: 8px 0 0;
    padding: 0 0 0 18px;
  }
  .rv-bullets li {
    margin: 0 0 5px;
    font-size: 12.5px;
    line-height: 1.5;
    padding-left: 2px;
  }
  .rv-page--plain .rv-bullets li {
    font-family: Georgia, "Times New Roman", Times, serif;
  }
`;

export function buildResumeDocumentHtml(
  personalInfo: PersonalInfo,
  sections: ResumeSection[],
  design: DesignSettings
): string {
  const templateId = design.templateId === "smooth" ? "smooth" : "plain";
  const t = themeFor(templateId);
  const contact = contactLine(personalInfo);
  const experience = sections.filter((s) => s.type === "experience");
  const education = sections.filter((s) => s.type === "education");
  const skills = sections.filter((s) => s.type === "skill");
  const certs = sections.filter((s) => s.type === "certification");

  const header =
    templateId === "smooth"
      ? `
      <header class="rv-header">
        <h1 class="rv-name" style="color:${t.name}">${esc(personalInfo.fullName || "Your Name")}</h1>
        ${contact ? `<p class="rv-contact" style="color:${t.contact}">${esc(contact)}</p>` : ""}
        ${
          personalInfo.targetTitle
            ? `<p class="rv-role rv-role--stack" style="color:${t.role}">${esc(personalInfo.targetTitle)}</p>`
            : ""
        }
      </header>`
      : `
      <header class="rv-header">
        <div class="rv-header-row">
          <h1 class="rv-name" style="color:${t.name}">${esc(personalInfo.fullName || "Your Name")}</h1>
          ${
            personalInfo.targetTitle
              ? `<p class="rv-role" style="color:${t.role}">${esc(personalInfo.targetTitle)}</p>`
              : ""
          }
        </div>
        ${contact ? `<p class="rv-contact" style="color:${t.contact}">${esc(contact)}</p>` : ""}
      </header>`;

  return `
    <div class="rv-page rv-page--${templateId}" data-template="${templateId}">
      ${header}
      ${
        personalInfo.summary
          ? sectionHtml(
              templateId === "smooth" ? "Summary" : "Summary",
              `<p class="rv-summary" style="color:${t.body}">${esc(personalInfo.summary)}</p>`,
              t,
              templateId
            )
          : ""
      }
      ${sectionHtml(
        "Work Experience",
        experienceHtml(experience, t, templateId),
        t,
        templateId
      )}
      ${sectionHtml("Education", educationHtml(education, t), t, templateId)}
      ${sectionHtml("Skills", skillsHtml(skills, t), t, templateId)}
      ${sectionHtml("Certifications", educationHtml(certs, t), t, templateId)}
    </div>`;
}

export function buildResumeFullHtml(
  personalInfo: PersonalInfo,
  sections: ResumeSection[],
  design: DesignSettings
): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${esc(personalInfo.fullName || "Resume")} — TheWrker</title>
<style>
  @page { size: letter; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  ${RESUME_DOC_CSS}
</style>
</head>
<body>
${buildResumeDocumentHtml(personalInfo, sections, design)}
</body>
</html>`;
}

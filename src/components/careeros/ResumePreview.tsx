"use client";

import type { StructuredResume } from "@/lib/careeros/types";

interface ResumePreviewProps {
  resume: StructuredResume;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const isExecutive = resume.templateId === "executive";

  if (isExecutive) {
    return (
      <div className="pd-careeros-resume-preview pd-careeros-resume-preview--executive">
        <aside className="pd-careeros-resume-sidebar">
          <h2 className="pd-careeros-resume-name">{resume.name}</h2>
          <p className="pd-careeros-resume-headline">{resume.headline}</p>

          <div className="pd-careeros-resume-sidebar-section">
            <h3>Contact</h3>
            <ul>
              {resume.contact.email && <li>{resume.contact.email}</li>}
              {resume.contact.phone && <li>{resume.contact.phone}</li>}
              {resume.contact.location && <li>{resume.contact.location}</li>}
              {resume.contact.linkedin && <li>{resume.contact.linkedin}</li>}
              {resume.contact.website && <li>{resume.contact.website}</li>}
            </ul>
          </div>

          {resume.summary && (
            <div className="pd-careeros-resume-sidebar-section">
              <h3>Profile</h3>
              <p>{resume.summary}</p>
            </div>
          )}

          {resume.skills.length > 0 && (
            <div className="pd-careeros-resume-sidebar-section">
              <h3>Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.slice(0, 10).map((skill) => (
                  <span key={skill} className="pd-careeros-resume-skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="pd-careeros-resume-main">
          {resume.experience.length > 0 && (
            <section>
              <h3 className="pd-careeros-resume-section-title">Experience</h3>
              {resume.experience.map((exp, i) => (
                <div key={`${exp.company}-${i}`} className="pd-careeros-resume-exp-block">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="pd-careeros-resume-exp-role">{exp.role}</p>
                    <span className="pd-careeros-resume-exp-period">{exp.period}</span>
                  </div>
                  <p className="pd-careeros-resume-exp-company">{exp.company}</p>
                  <ul>
                    {exp.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {resume.education.length > 0 && (
            <section>
              <h3 className="pd-careeros-resume-section-title">Education</h3>
              {resume.education.map((edu, i) => (
                <div key={`${edu.degree}-${i}`} className="pd-careeros-resume-edu-block">
                  <p className="font-semibold">{edu.degree}</p>
                  {edu.institution && <p>{edu.institution}</p>}
                  {edu.period && <p className="text-sm opacity-70">{edu.period}</p>}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="pd-careeros-resume-preview pd-careeros-resume-preview--modern">
      <header className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="pd-careeros-resume-name text-slate-900">{resume.name}</h2>
        <p className="pd-careeros-resume-headline text-slate-600">{resume.headline}</p>
        <p className="mt-2 text-sm text-slate-500">
          {[resume.contact.email, resume.contact.phone, resume.contact.location]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {resume.summary && (
        <section className="mb-5">
          <h3 className="pd-careeros-resume-section-title text-slate-900">Summary</h3>
          <p className="text-sm leading-relaxed text-slate-700">{resume.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mb-5">
          <h3 className="pd-careeros-resume-section-title text-slate-900">Skills</h3>
          <p className="text-sm text-slate-700">{resume.skills.join(" · ")}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-5">
          <h3 className="pd-careeros-resume-section-title text-slate-900">Experience</h3>
          {resume.experience.map((exp, i) => (
            <div key={`${exp.company}-${i}`} className="mb-4">
              <p className="font-semibold text-slate-900">
                {exp.role} — {exp.company}
              </p>
              <p className="text-xs text-slate-500">{exp.period}</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                {exp.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

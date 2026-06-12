"use client";

import { forwardRef } from "react";

import type { StructuredResume } from "@/lib/careeros/types";

import ClassicResumeLayout from "./ClassicResumeLayout";

interface ResumePreviewProps {
  resume: StructuredResume;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(function ResumePreview(
  { resume },
  ref,
) {
  const isExecutive = resume.templateId === "executive";

  if (isExecutive) {
    return (
      <div ref={ref} className="pd-careeros-resume-preview pd-careeros-resume-preview--executive">
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
    <div ref={ref} className="pd-careeros-resume-preview pd-careeros-resume-preview--classic">
      <ClassicResumeLayout resume={resume} />
    </div>
  );
});

export default ResumePreview;

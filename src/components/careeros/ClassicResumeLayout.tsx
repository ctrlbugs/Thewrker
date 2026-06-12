import type { StructuredResume } from "@/lib/careeros/types";

interface ClassicResumeLayoutProps {
  resume: StructuredResume;
}

function contactItems(resume: StructuredResume): string[] {
  return [
    resume.contact.email,
    resume.contact.linkedin,
    resume.contact.website,
    resume.contact.phone,
    resume.contact.location,
  ].filter(Boolean);
}

export default function ClassicResumeLayout({ resume }: ClassicResumeLayoutProps) {
  const contacts = contactItems(resume);

  return (
    <>
      <header className="pd-careeros-resume-classic-header">
        <div className="pd-careeros-resume-classic-title-row">
          <h1 className="pd-careeros-resume-classic-name">{resume.name}</h1>
          <p className="pd-careeros-resume-classic-headline">{resume.headline}</p>
        </div>
        {contacts.length > 0 && (
          <p className="pd-careeros-resume-classic-contact">
            {contacts.map((item, index) => (
              <span key={item}>
                {index > 0 && <span className="pd-careeros-resume-classic-bullet"> • </span>}
                <span className="pd-careeros-resume-classic-link">{item}</span>
              </span>
            ))}
          </p>
        )}
      </header>

      {resume.summary && (
        <section className="pd-careeros-resume-classic-section">
          <h2 className="pd-careeros-resume-classic-section-title">Summary</h2>
          <p className="pd-careeros-resume-classic-body">{resume.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="pd-careeros-resume-classic-section">
          <h2 className="pd-careeros-resume-classic-section-title">Work Experience</h2>
          {resume.experience.map((exp, index) => (
            <div key={`${exp.company}-${exp.role}-${index}`} className="pd-careeros-resume-classic-exp">
              <div className="pd-careeros-resume-classic-exp-row">
                <p className="pd-careeros-resume-classic-exp-role">{exp.role}</p>
                {exp.period && <p className="pd-careeros-resume-classic-exp-period">{exp.period}</p>}
              </div>
              {exp.company && <p className="pd-careeros-resume-classic-exp-company">{exp.company}</p>}
              {exp.bullets.length > 0 && (
                <ul className="pd-careeros-resume-classic-list">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="pd-careeros-resume-classic-section">
          <h2 className="pd-careeros-resume-classic-section-title">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={`${edu.degree}-${index}`} className="pd-careeros-resume-classic-exp">
              <div className="pd-careeros-resume-classic-exp-row">
                <p className="pd-careeros-resume-classic-exp-role">{edu.degree}</p>
                {edu.period && <p className="pd-careeros-resume-classic-exp-period">{edu.period}</p>}
              </div>
              {edu.institution && <p className="pd-careeros-resume-classic-exp-company">{edu.institution}</p>}
            </div>
          ))}
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="pd-careeros-resume-classic-section">
          <h2 className="pd-careeros-resume-classic-section-title">Skills</h2>
          <p className="pd-careeros-resume-classic-body">{resume.skills.join(" • ")}</p>
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section className="pd-careeros-resume-classic-section">
          <h2 className="pd-careeros-resume-classic-section-title">Certifications</h2>
          <p className="pd-careeros-resume-classic-body">{resume.certifications.join(" • ")}</p>
        </section>
      )}
    </>
  );
}

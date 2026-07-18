"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Check,
  Trash2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toBullets } from "@/lib/careeros/resume-html";
import type {
  PersonalInfo,
  ResumeSection,
  ResumeSectionType,
} from "@/lib/careeros/resume-draft";

type AccordionId =
  | "contact"
  | "title"
  | "summary"
  | "experience"
  | "education"
  | "skills";

type Props = {
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  onPersonal: (updates: Partial<PersonalInfo>) => void;
  onAddSection: (type: ResumeSectionType) => void;
  onUpdateSection: (id: string, updates: Partial<ResumeSection>) => void;
  onRemoveSection: (id: string) => void;
};

function CheckMark() {
  return (
    <span className="rb-check" aria-hidden>
      <Check className="h-3 w-3" strokeWidth={2.5} />
    </span>
  );
}

export default function ContentEditor({
  personalInfo,
  sections,
  onPersonal,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
}: Props) {
  const [open, setOpen] = useState<Record<AccordionId, boolean>>({
    contact: true,
    title: false,
    summary: true,
    experience: true,
    education: false,
    skills: false,
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const toggle = (id: AccordionId) =>
    setOpen((s) => ({ ...s, [id]: !s[id] }));

  const experience = sections.filter((s) => s.type === "experience");
  const education = sections.filter((s) => s.type === "education");
  const skills = sections.filter((s) => s.type === "skill");

  const nameParts = personalInfo.fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  const setNamePart = (part: "first" | "last", value: string) => {
    if (part === "first") {
      onPersonal({ fullName: [value, lastName].filter(Boolean).join(" ") });
    } else {
      onPersonal({ fullName: [firstName, value].filter(Boolean).join(" ") });
    }
  };

  const setBullets = (section: ResumeSection, bullets: string[]) => {
    onUpdateSection(section.id, {
      description: bullets.filter((b) => b.trim()).join("\n"),
    });
  };

  return (
    <div className="rb-editor">
      {/* Contact */}
      <section className="rb-acc">
        <header className="rb-acc-head">
          <button
            type="button"
            className="rb-acc-toggle"
            onClick={() => toggle("contact")}
            aria-expanded={open.contact}
          >
            {open.contact ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span>Contact Information</span>
          </button>
        </header>
        {open.contact && (
          <div className="rb-acc-body">
            <div className="rb-inline-grid">
              <label className="rb-inline-field">
                <CheckMark />
                <input
                  value={firstName}
                  onChange={(e) => setNamePart("first", e.target.value)}
                  placeholder="First name"
                />
              </label>
              <label className="rb-inline-field">
                <CheckMark />
                <input
                  value={lastName}
                  onChange={(e) => setNamePart("last", e.target.value)}
                  placeholder="Last name"
                />
              </label>
              <label className="rb-inline-field rb-inline-field--full">
                <CheckMark />
                <input
                  value={personalInfo.email}
                  onChange={(e) => onPersonal({ email: e.target.value })}
                  placeholder="Email"
                />
              </label>
              <label className="rb-inline-field rb-inline-field--full">
                <CheckMark />
                <input
                  value={personalInfo.linkedIn}
                  onChange={(e) => onPersonal({ linkedIn: e.target.value })}
                  placeholder="LinkedIn URL"
                />
              </label>
              <label className="rb-inline-field">
                <CheckMark />
                <input
                  value={personalInfo.phone}
                  onChange={(e) => onPersonal({ phone: e.target.value })}
                  placeholder="Phone"
                />
              </label>
              <label className="rb-inline-field">
                <CheckMark />
                <input
                  value={personalInfo.location}
                  onChange={(e) => onPersonal({ location: e.target.value })}
                  placeholder="Location"
                />
              </label>
            </div>
          </div>
        )}
      </section>

      {/* Target title */}
      <section className="rb-acc">
        <header className="rb-acc-head">
          <button
            type="button"
            className="rb-acc-toggle"
            onClick={() => toggle("title")}
            aria-expanded={open.title}
          >
            {open.title ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span>Target Title</span>
          </button>
          {!open.title && (
            <button
              type="button"
              className="rb-acc-icon-btn"
              onClick={() => toggle("title")}
              aria-label="Add target title"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </header>
        {open.title && (
          <div className="rb-acc-body">
            <label className="rb-inline-field rb-inline-field--full">
              <CheckMark />
              <input
                value={personalInfo.targetTitle}
                onChange={(e) => onPersonal({ targetTitle: e.target.value })}
                placeholder="e.g. Product Designer | UI/UX"
              />
            </label>
          </div>
        )}
      </section>

      {/* Summary */}
      <section className="rb-acc">
        <header className="rb-acc-head">
          <button
            type="button"
            className="rb-acc-toggle"
            onClick={() => toggle("summary")}
            aria-expanded={open.summary}
          >
            {open.summary ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span>Professional Summary</span>
          </button>
        </header>
        {open.summary && (
          <div className="rb-acc-body">
            <label className="rb-inline-field rb-inline-field--full rb-inline-field--area">
              <CheckMark />
              <textarea
                rows={4}
                value={personalInfo.summary}
                onChange={(e) => onPersonal({ summary: e.target.value })}
                placeholder="A short professional summary…"
              />
            </label>
          </div>
        )}
      </section>

      {/* Experience */}
      <section className="rb-acc">
        <header className="rb-acc-head">
          <button
            type="button"
            className="rb-acc-toggle"
            onClick={() => toggle("experience")}
            aria-expanded={open.experience}
          >
            {open.experience ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span>Work Experience</span>
          </button>
          <div className="rb-acc-actions">
            <div className="rb-acc-menu-wrap">
              <button
                type="button"
                className="rb-acc-icon-btn rb-acc-icon-btn--box"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Add experience"
              >
                <Plus className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div className="rb-acc-menu">
                  <button
                    type="button"
                    onClick={() => {
                      onAddSection("experience");
                      setOpen((s) => ({ ...s, experience: true }));
                      setMenuOpen(false);
                    }}
                  >
                    + Add Company
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              className="rb-acc-icon-btn"
              aria-label="More"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </header>
        {open.experience && (
          <div className="rb-acc-body">
            {experience.length === 0 ? (
              <p className="rb-acc-hint">
                No roles yet. Use + to add a company.
              </p>
            ) : (
              experience.map((section) => {
                const bullets = toBullets(section.description);
                const lines = bullets.length ? bullets : [""];
                return (
                  <div key={section.id} className="rb-exp">
                    <div className="rb-exp-top">
                      <label className="rb-inline-field rb-inline-field--full">
                        <CheckMark />
                        <input
                          className="rb-input-strong"
                          value={section.organization || ""}
                          onChange={(e) =>
                            onUpdateSection(section.id, {
                              organization: e.target.value,
                            })
                          }
                          placeholder="Company name"
                        />
                      </label>
                      <button
                        type="button"
                        className="rb-acc-icon-btn"
                        onClick={() => onRemoveSection(section.id)}
                        aria-label="Remove company"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="rb-exp-nested">
                      <label className="rb-inline-field">
                        <CheckMark />
                        <input
                          value={section.title}
                          onChange={(e) =>
                            onUpdateSection(section.id, {
                              title: e.target.value,
                            })
                          }
                          placeholder="Job title"
                        />
                      </label>
                      <label className="rb-inline-field">
                        <CheckMark />
                        <input
                          value={section.location || ""}
                          onChange={(e) =>
                            onUpdateSection(section.id, {
                              location: e.target.value,
                            })
                          }
                          placeholder="Location (e.g. Remote)"
                        />
                      </label>
                      <label className="rb-inline-field">
                        <CheckMark />
                        <input
                          value={section.period || ""}
                          onChange={(e) =>
                            onUpdateSection(section.id, {
                              period: e.target.value,
                            })
                          }
                          placeholder="Dates (e.g. 01/2024 – Present)"
                        />
                      </label>
                      {lines.map((bullet, idx) => (
                        <label
                          key={`${section.id}-b-${idx}`}
                          className="rb-inline-field rb-inline-field--full"
                        >
                          <CheckMark />
                          <input
                            value={bullet}
                            onChange={(e) => {
                              const next = [...lines];
                              next[idx] = e.target.value;
                              setBullets(section, next);
                            }}
                            placeholder="Achievement or responsibility"
                          />
                        </label>
                      ))}
                      <button
                        type="button"
                        className="rb-add-bullet"
                        onClick={() => setBullets(section, [...lines, ""])}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Bullet
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>

      {/* Education */}
      <section className="rb-acc">
        <header className="rb-acc-head">
          <button
            type="button"
            className="rb-acc-toggle"
            onClick={() => toggle("education")}
            aria-expanded={open.education}
          >
            {open.education ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span>Education</span>
          </button>
          <button
            type="button"
            className="rb-acc-icon-btn rb-acc-icon-btn--box"
            onClick={() => {
              onAddSection("education");
              setOpen((s) => ({ ...s, education: true }));
            }}
            aria-label="Add education"
          >
            <Plus className="h-4 w-4" />
          </button>
        </header>
        {open.education && (
          <div className="rb-acc-body">
            {education.length === 0 ? (
              <p className="rb-acc-hint">Add a school or program.</p>
            ) : (
              education.map((section) => (
                <div key={section.id} className="rb-exp">
                  <label className="rb-inline-field rb-inline-field--full">
                    <CheckMark />
                    <input
                      className="rb-input-strong"
                      value={section.title}
                      onChange={(e) =>
                        onUpdateSection(section.id, { title: e.target.value })
                      }
                      placeholder="Degree / program"
                    />
                  </label>
                  <div className="rb-exp-nested">
                    <label className="rb-inline-field">
                      <CheckMark />
                      <input
                        value={section.organization || ""}
                        onChange={(e) =>
                          onUpdateSection(section.id, {
                            organization: e.target.value,
                          })
                        }
                        placeholder="School"
                      />
                    </label>
                    <label className="rb-inline-field">
                      <CheckMark />
                      <input
                        value={section.period || ""}
                        onChange={(e) =>
                          onUpdateSection(section.id, {
                            period: e.target.value,
                          })
                        }
                        placeholder="Years"
                      />
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Skills */}
      <section className="rb-acc">
        <header className="rb-acc-head">
          <button
            type="button"
            className="rb-acc-toggle"
            onClick={() => toggle("skills")}
            aria-expanded={open.skills}
          >
            {open.skills ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span>Skills</span>
          </button>
          <button
            type="button"
            className="rb-acc-icon-btn rb-acc-icon-btn--box"
            onClick={() => {
              onAddSection("skill");
              setOpen((s) => ({ ...s, skills: true }));
            }}
            aria-label="Add skills"
          >
            <Plus className="h-4 w-4" />
          </button>
        </header>
        {open.skills && (
          <div className="rb-acc-body">
            {skills.length === 0 ? (
              <p className="rb-acc-hint">List tools and strengths.</p>
            ) : (
              skills.map((section) => (
                <label
                  key={section.id}
                  className="rb-inline-field rb-inline-field--full"
                >
                  <CheckMark />
                  <input
                    value={section.description || section.title}
                    onChange={(e) =>
                      onUpdateSection(section.id, {
                        title: "Skills",
                        description: e.target.value,
                      })
                    }
                    placeholder="e.g. Figma, React, Design systems"
                  />
                </label>
              ))
            )}
          </div>
        )}
      </section>

      {!personalInfo.fullName && sections.length === 0 && (
        <div className="rb-empty">
          <FileText className="h-10 w-10" />
          <p>Import a resume or fill sections above to begin.</p>
          <Link href="/dashboard/careeros/resume" className="cos-btn cos-btn--primary">
            Import resume
          </Link>
        </div>
      )}
    </div>
  );
}

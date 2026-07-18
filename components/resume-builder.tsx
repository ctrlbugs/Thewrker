"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Sparkles,
  Plus,
  Palette,
  Gauge,
  ArrowLeftRight,
  Mail,
  CheckCircle2,
  AlertCircle,
  Upload,
  Menu,
} from "lucide-react";
import ResumePreview from "@/components/careeros/ResumePreview";
import ContentEditor from "@/components/careeros/ContentEditor";
import {
  ACCENT_SWATCHES,
  TEMPLATES,
  aiCleanDraft,
  analyzeDraft,
  emptyDraft,
  generateCoverLetter,
  loadDraft,
  matchJobKeywords,
  saveDraft,
  type DesignSettings,
  type PersonalInfo,
  type ResumeDraft,
  type ResumeSection,
  type ResumeSectionType,
} from "@/lib/careeros/resume-draft";
import { exportResumePdf } from "@/lib/careeros/export-resume-pdf";
import { cn } from "@/lib/utils";
import "@/app/careeros.css";

type StudioTab =
  | "content"
  | "designer"
  | "analyzer"
  | "matcher"
  | "cover";

const TABS: {
  id: StudioTab;
  label: string;
  icon: typeof FileText;
}[] = [
  { id: "content", label: "Content Editor", icon: FileText },
  { id: "designer", label: "Designer", icon: Palette },
  { id: "analyzer", label: "Analyzer", icon: Gauge },
  { id: "matcher", label: "Job Matcher", icon: ArrowLeftRight },
  { id: "cover", label: "Cover Letter", icon: Mail },
];

export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState<StudioTab>("content");
  const [designerPane, setDesignerPane] = useState<
    "presentation" | "sections" | "settings"
  >("presentation");
  const [draft, setDraft] = useState<ResumeDraft>(() => emptyDraft());
  const [hydrated, setHydrated] = useState(false);
  const [jobText, setJobText] = useState("");
  const [cleaning, setCleaning] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const existing = loadDraft();
    if (existing) setDraft(existing);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveDraft(draft);
  }, [draft, hydrated]);

  const analysis = useMemo(() => analyzeDraft(draft), [draft]);
  const match = useMemo(
    () => (jobText.trim().length > 20 ? matchJobKeywords(draft, jobText) : null),
    [draft, jobText]
  );

  const setPersonal = (updates: Partial<PersonalInfo>) =>
    setDraft((d) => ({
      ...d,
      personalInfo: { ...d.personalInfo, ...updates },
    }));

  const setDesign = (updates: Partial<DesignSettings>) =>
    setDraft((d) => ({ ...d, design: { ...d.design, ...updates } }));

  const addSection = (type: ResumeSectionType) => {
    const section: ResumeSection = {
      id: Date.now().toString(),
      type,
      title: "",
      organization: "",
      period: "",
      description: "",
    };
    setDraft((d) => ({ ...d, sections: [...d.sections, section] }));
    setActiveTab("content");
  };

  const removeSection = (id: string) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.filter((s) => s.id !== id),
    }));

  const updateSection = (id: string, updates: Partial<ResumeSection>) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));

  const runAiClean = async () => {
    setCleaning(true);
    await new Promise((r) => setTimeout(r, 450));
    setDraft((d) => aiCleanDraft(d));
    setCleaning(false);
  };

  const buildCover = () => {
    const body = generateCoverLetter(
      draft,
      draft.coverLetter.jobTitle,
      draft.coverLetter.company
    );
    setDraft((d) => ({
      ...d,
      coverLetter: { ...d.coverLetter, body },
    }));
  };

  const handleExportPDF = async () => {
    if (exporting) return;
    setExportError(null);
    setExporting(true);
    try {
      await exportResumePdf(draft);
    } catch {
      setExportError("PDF export failed. Allow pop-ups and try again.");
    } finally {
      setExporting(false);
    }
  };

  const showPreview =
    activeTab === "content" ||
    activeTab === "designer" ||
    activeTab === "analyzer";

  return (
    <div className="cos-root rb-studio">
      <header className="rb-studio-top">
        <div className="rb-studio-top-left">
          <input
            className="rb-doc-title"
            value={draft.personalInfo.fullName || "Untitled Resume"}
            onChange={(e) => setPersonal({ fullName: e.target.value })}
            aria-label="Resume title"
          />
          {draft.fileName && (
            <span className="rb-source-chip" title={draft.fileName}>
              <Upload className="h-3 w-3" />
              {draft.fileName}
            </span>
          )}
        </div>
        <div className="rb-studio-top-actions">
          <button
            type="button"
            onClick={runAiClean}
            disabled={cleaning}
            className="cos-btn cos-btn--ghost"
          >
            <Sparkles className="h-4 w-4" />
            {cleaning ? "Cleaning…" : "AI Clean"}
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={exporting}
            className="cos-btn cos-btn--primary"
          >
            <Download className="h-4 w-4" />
            {exporting ? "Exporting PDF…" : "Export PDF"}
          </button>
          <button
            type="button"
            className="rb-menu-btn sm:hidden"
            onClick={() => setMobileMenu((v) => !v)}
            aria-label="Tabs"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>
      {exportError && <p className="cos-import-error">{exportError}</p>}

      <nav
        className={cn("rb-tabs", mobileMenu && "is-open")}
        aria-label="Resume studio"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={cn("rb-tab", activeTab === id && "is-active")}
            onClick={() => {
              setActiveTab(id);
              setMobileMenu(false);
            }}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {id === "analyzer" && analysis.issueCount > 0 && (
              <em className="rb-tab-badge">{analysis.issueCount}</em>
            )}
            {id === "matcher" && match && match.score < 60 && (
              <em className="rb-tab-badge rb-tab-badge--warn">!</em>
            )}
          </button>
        ))}
      </nav>

      <div className={cn("rb-body", showPreview && "rb-body--split")}>
        <div className="rb-pane">
          {activeTab === "content" && (
            <div className="rb-panel">
              <ContentEditor
                personalInfo={draft.personalInfo}
                sections={draft.sections}
                onPersonal={setPersonal}
                onAddSection={addSection}
                onUpdateSection={updateSection}
                onRemoveSection={removeSection}
              />
            </div>
          )}

          {activeTab === "designer" && (
            <div className="rb-panel space-y-4">
              <div className="rb-subtabs">
                {(
                  [
                    ["presentation", "Presentation"],
                    ["sections", "Sections"],
                    ["settings", "Settings"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={cn(designerPane === id && "is-active")}
                    onClick={() => setDesignerPane(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {designerPane === "presentation" && (
                <>
                  <section className="rb-card">
                    <h3 className="rb-card-title">My Templates</h3>
                    <div className="rb-template-grid">
                      <Link
                        href="/dashboard/careeros/resume"
                        className="rb-template-browse"
                      >
                        <Plus className="h-6 w-6" />
                        Browse / re-import
                      </Link>
                      {TEMPLATES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={cn(
                            "rb-template-card",
                            draft.design.templateId === t.id && "is-selected"
                          )}
                          onClick={() =>
                            setDesign({
                              templateId: t.id,
                              accent: t.id === "smooth" ? "#21386B" : "#111111",
                              fontFamily: "Georgia",
                            })
                          }
                        >
                          <div
                            className={cn(
                              "rb-template-thumb",
                              `rb-template-thumb--${t.id}`
                            )}
                          />
                          <strong>{t.name}</strong>
                          <span>{t.blurb}</span>
                          {draft.design.templateId === t.id && (
                            <CheckCircle2 className="rb-template-check" />
                          )}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="rb-card">
                    <h3 className="rb-card-title">Styling</h3>
                    <label className="rb-field">
                      <span>Font</span>
                      <select
                        value={draft.design.fontFamily}
                        onChange={(e) =>
                          setDesign({
                            fontFamily: e.target
                              .value as DesignSettings["fontFamily"],
                          })
                        }
                      >
                        <option value="Manrope">Manrope</option>
                        <option value="Inter">Inter</option>
                        <option value="Georgia">Georgia</option>
                      </select>
                    </label>
                    <label className="rb-field mt-3">
                      <span>
                        Line height · {Math.round(draft.design.lineHeight * 100)}%
                      </span>
                      <input
                        type="range"
                        min={1.2}
                        max={1.8}
                        step={0.05}
                        value={draft.design.lineHeight}
                        onChange={(e) =>
                          setDesign({ lineHeight: Number(e.target.value) })
                        }
                      />
                    </label>
                    <div className="mt-3">
                      <span className="rb-label">Accent color</span>
                      <div className="rb-swatches">
                        {ACCENT_SWATCHES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            className={cn(
                              "rb-swatch",
                              draft.design.accent === c && "is-selected"
                            )}
                            style={{ background: c }}
                            onClick={() => setDesign({ accent: c })}
                            aria-label={c}
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              )}

              {designerPane === "sections" && (
                <section className="rb-card">
                  <h3 className="rb-card-title">Visible sections</h3>
                  <p className="rb-help">
                    Toggle content by editing or removing sections in Content
                    Editor. Current sections:
                  </p>
                  <ul className="rb-check-list">
                    {draft.sections.map((s) => (
                      <li key={s.id}>
                        <CheckCircle2 className="h-4 w-4 text-[#76BEC5]" />
                        {s.type} — {s.title || "Untitled"}
                      </li>
                    ))}
                    {draft.sections.length === 0 && (
                      <li className="rb-muted">No sections yet</li>
                    )}
                  </ul>
                  <button
                    type="button"
                    className="cos-btn cos-btn--primary mt-4"
                    onClick={() => setActiveTab("content")}
                  >
                    Edit content
                  </button>
                </section>
              )}

              {designerPane === "settings" && (
                <section className="rb-card">
                  <h3 className="rb-card-title">Document settings</h3>
                  <p className="rb-help">
                    Brand defaults: navy <code>#21386B</code> and teal{" "}
                    <code>#76BEC5</code>. Export uses your selected accent and
                    template.
                  </p>
                  <button
                    type="button"
                    className="cos-btn cos-btn--ghost mt-3"
                    onClick={() =>
                      setDesign({
                        accent: "#21386B",
                        templateId: "smooth",
                        fontFamily: "Georgia",
                        lineHeight: 1.45,
                      })
                    }
                  >
                    Reset to TheWrker brand
                  </button>
                </section>
              )}
            </div>
          )}

          {activeTab === "analyzer" && (
            <div className="rb-panel space-y-4">
              <section className="rb-card rb-score-card">
                <div
                  className="cos-match-ring"
                  style={{ ["--p" as string]: analysis.score }}
                >
                  <span>{analysis.score}%</span>
                </div>
                <div>
                  <h3>ATS readiness</h3>
                  <p className="rb-muted">
                    {analysis.issueCount === 0
                      ? "Looking strong — polish wording and export when ready."
                      : `${analysis.issueCount} items to improve before you apply.`}
                  </p>
                </div>
              </section>
              <section className="rb-card">
                <h3 className="rb-card-title">Checklist</h3>
                <ul className="rb-check-list">
                  {analysis.checks.map((c) => (
                    <li key={c.id}>
                      {c.ok ? (
                        <CheckCircle2 className="h-4 w-4 text-[#2f7f88]" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-[#dc2626]" />
                      )}
                      {c.label}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="cos-btn cos-btn--primary mt-4"
                  onClick={runAiClean}
                  disabled={cleaning}
                >
                  <Sparkles className="h-4 w-4" />
                  {cleaning ? "Cleaning…" : "Run AI cleanup"}
                </button>
              </section>
            </div>
          )}

          {activeTab === "matcher" && (
            <div className="rb-panel space-y-4">
              <section className="rb-card">
                <h3 className="rb-card-title">
                  Compare a job description to your resume
                </h3>
                <textarea
                  className="cos-import-textarea"
                  rows={8}
                  placeholder="Paste a job description…"
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                />
                {match ? (
                  <div className="mt-4 space-y-3">
                    <div className="rb-score-card">
                      <div
                        className="cos-match-ring"
                        style={{ ["--p" as string]: match.score }}
                      >
                        <span>{match.score}%</span>
                      </div>
                      <div>
                        <h3>Keyword match</h3>
                        <p className="rb-muted">
                          {match.matched} of {match.total} key terms found
                        </p>
                      </div>
                    </div>
                    <ul className="rb-check-list">
                      {match.rows.map((r) => (
                        <li key={r.keyword}>
                          {r.status === "match" ? (
                            <CheckCircle2 className="h-4 w-4 text-[#2f7f88]" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-[#dc2626]" />
                          )}
                          {r.keyword}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="rb-help mt-3">
                    Paste a role description to see keyword coverage against your
                    draft.
                  </p>
                )}
                <Link
                  href="/dashboard/careeros/jobs"
                  className="cos-btn cos-btn--ghost mt-4"
                >
                  Browse live jobs
                </Link>
              </section>
            </div>
          )}

          {activeTab === "cover" && (
            <div className="rb-panel space-y-4">
              <section className="rb-card rb-cover-intro">
                <h3 className="rb-card-title">
                  <Sparkles className="h-4 w-4" />
                  AI Cover Letter Generator
                </h3>
                <ol>
                  <li>Match a job to this resume</li>
                  <li>TheWrker generates cover letter text for you</li>
                  <li>Copy into email, Docs, or Word</li>
                </ol>
              </section>
              <section className="rb-card">
                <div className="rb-grid-2">
                  <label className="rb-field">
                    <span>Job title</span>
                    <input
                      value={draft.coverLetter.jobTitle}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          coverLetter: {
                            ...d.coverLetter,
                            jobTitle: e.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                  <label className="rb-field">
                    <span>Company</span>
                    <input
                      value={draft.coverLetter.company}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          coverLetter: {
                            ...d.coverLetter,
                            company: e.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                </div>
                <button
                  type="button"
                  className="cos-btn cos-btn--primary mt-4"
                  onClick={buildCover}
                >
                  Generate cover letter
                </button>
                <label className="rb-field mt-4">
                  <span>Cover letter</span>
                  <textarea
                    rows={12}
                    value={draft.coverLetter.body}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        coverLetter: {
                          ...d.coverLetter,
                          body: e.target.value,
                        },
                      }))
                    }
                    placeholder="Attach a job, then generate — or write your own."
                  />
                </label>
              </section>
            </div>
          )}
        </div>

        {showPreview && (
          <aside className="rb-preview-pane">
            <div className="rb-preview-scroll">
              <ResumePreview
                personalInfo={draft.personalInfo}
                sections={draft.sections}
                design={draft.design}
              />
            </div>
          </aside>
        )}

        {activeTab === "cover" && (
          <aside className="rb-preview-pane">
            <div className="rb-preview-scroll">
              {draft.coverLetter.body ? (
                <article className="rb-preview-paper rb-cover-paper">
                  <pre>{draft.coverLetter.body}</pre>
                </article>
              ) : (
                <div className="rb-cover-empty">
                  <FileText className="h-12 w-12" />
                  <h3>Build your cover letter</h3>
                  <p>
                    Attach a job to your resume, then write or generate one with
                    AI.
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}

        {activeTab === "matcher" && (
          <aside className="rb-preview-pane">
            <div className="rb-preview-scroll">
              <ResumePreview
                personalInfo={draft.personalInfo}
                sections={draft.sections}
                design={draft.design}
                compact
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

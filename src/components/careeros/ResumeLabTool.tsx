"use client";



import { useRef, useState } from "react";

import ActionButton from "@/components/ui/ActionButton";

import OperationStatus from "@/components/ui/OperationStatus";

import { useAsyncTask } from "@/hooks/useAsyncTask";

import { useApiIntegrations } from "@/hooks/useApiIntegrations";

import { aiAnalyzeResume, aiTailorResume, aiUpgradeResume, extractCvText } from "@/lib/api/careeros-client";

import { analyzeAts, extractSkills } from "@/lib/careeros/analysis";

import type { AtsReport } from "@/lib/careeros/analysis";

import {
  buildClassicStyledResumePdf,
  buildResumeDocx,
  buildResumePdf,
  getResumePlainText,
  resumeFileName,
} from "@/lib/careeros/resume-export";
import { parseResumeToStructured, upgradeResumeToStandard } from "@/lib/careeros/resume-template";
import { downloadBlob } from "@/lib/tools/archive";

import { CAREER_LEVELS, RESUME_TEMPLATES } from "@/lib/careeros/types";

import type { ResumeTemplateId } from "@/lib/careeros/types";

import CareerDNACard from "./CareerDNACard";

import ResumePreview from "./ResumePreview";

import { useCareerOSContext } from "./CareerOSProvider";



export default function ResumeLabTool() {

  const task = useAsyncTask();

  const fileRef = useRef<HTMLInputElement>(null);

  const { status: apiStatus } = useApiIntegrations();

  const { state, updateProfile } = useCareerOSContext();

  const { profile } = state;

  const [message, setMessage] = useState("");

  const [targetRole, setTargetRole] = useState("");

  const [targetCompany, setTargetCompany] = useState("");

  const [targetJobDescription, setTargetJobDescription] = useState("");

  const [atsReport, setAtsReport] = useState<AtsReport>(analyzeAts(profile.resumeText));

  const [tailoredResume, setTailoredResume] = useState("");

  const [tailorNotes, setTailorNotes] = useState<string[]>([]);

  const [showPreview, setShowPreview] = useState(true);



  const previewTemplateId: ResumeTemplateId =

    profile.resumeTemplate === "executive" ? "executive" : "classic";

  const structured = {

    ...parseResumeToStructured(profile, profile.resumeTemplate),

    templateId: previewTemplateId,

  };



  const handleUpload = async (file: File) => {

    await task.run("Reading your CV...", async (update) => {

      update(20, "Extracting text from document...");

      const text = await extractCvText(file);

      update(70, "Building career profile...");

      const skills = extractSkills(text);

      updateProfile({ resumeText: text, skills });

      setAtsReport(analyzeAts(text));

      setMessage("CV uploaded and parsed. Run ATS analysis or One-Click Upgrade next.");

      update(100, "Done.");

    });

  };



  const saveProfile = () => {

    const skills = extractSkills(profile.resumeText);

    const { structured: parsed, text } = upgradeResumeToStandard({ ...profile, skills });

    updateProfile({ skills, structuredResume: parsed, resumeText: profile.resumeText || text });

    setAtsReport(analyzeAts(profile.resumeText));

    setMessage("Profile saved. Career DNA updated automatically.");

  };



  const runAts = async () => {

    if (!profile.resumeText.trim()) {

      setMessage("Upload or paste your CV first.");

      return;

    }



    if (apiStatus.openai) {

      await task.run("Running ATS analysis...", async (update) => {

        update(30, "Analyzing resume structure...");

        const result = await aiAnalyzeResume({

          resumeText: profile.resumeText,

          name: profile.name,

          headline: profile.headline,

          yearsExperience: profile.yearsExperience,

        });

        update(90, "Applying insights...");

        setAtsReport({

          score: result.atsScore,

          strengths: result.strengths,

          improvements: result.improvements,

        });

        updateProfile({ skills: result.skills, level: result.suggestedLevel });

        setMessage(result.summary || "ATS analysis complete.");

        update(100, "Done.");

      });

      return;

    }



    setAtsReport(analyzeAts(profile.resumeText));

    setMessage("ATS analysis complete.");

  };



  const oneClickUpgrade = async () => {

    if (!profile.resumeText.trim()) {

      setMessage("Upload or paste your CV first.");

      return;

    }



    if (apiStatus.openai) {

      await task.run("Upgrading to standard format...", async (update) => {

        update(25, "Reformatting for ATS...");

        const result = await aiUpgradeResume({

          resumeText: profile.resumeText,

          name: profile.name,

          headline: profile.headline,

          yearsExperience: profile.yearsExperience,

          template: profile.resumeTemplate,

          industry: profile.careerDNA?.industry ?? "technology",

        });

        update(80, "Building preview...");

        const structuredResume = parseResumeToStructured(

          { ...profile, resumeText: result.upgradedResume, headline: result.headline },

          profile.resumeTemplate,

        );

        updateProfile({

          resumeText: result.upgradedResume,

          headline: result.headline || profile.headline,

          level: result.suggestedLevel,

          structuredResume,

        });

        setAtsReport({

          score: result.atsScore,

          strengths: ["Restructured to ATS-friendly format", "Clear section hierarchy"],

          improvements: result.improvements,

        });

        setMessage("Resume upgraded to standard format. Review the preview and export when ready.");

        update(100, "Done.");

      });

      return;

    }



    const { structured: upgraded, text } = upgradeResumeToStandard(profile);

    updateProfile({ resumeText: text, structuredResume: upgraded });

    setAtsReport(analyzeAts(text));

    setMessage("Resume restructured to standard format.");

  };



  const tailorResume = async () => {

    if (!profile.resumeText.trim() || !targetJobDescription.trim()) {

      setMessage("Resume and target job description are required.");

      return;

    }



    if (!apiStatus.openai) {

      setMessage("Resume tailoring isn't available right now. Please try again later.");

      return;

    }



    await task.run("Tailoring resume...", async (update) => {

      update(25, "Tailoring for this role...");

      const result = await aiTailorResume({

        resumeText: profile.resumeText,

        jobDescription: targetJobDescription,

        role: targetRole,

        company: targetCompany,

      });

      update(85, "Preparing tailored version...");

      setTailoredResume(result.tailoredResume);

      setTailorNotes(result.changesSummary);

      setMessage("Resume tailored for this role.");

      update(100, "Done.");

    });

  };



  type ResumeExportStyle = "classic" | "preview";

  const downloadPreviewPdf = async () => {

    await downloadResume("pdf", undefined, "preview");

  };



  const getExportResume = (textOverride?: string, style: ResumeExportStyle = "preview") => {

    const parsed = textOverride?.trim()
      ? parseResumeToStructured({ ...profile, resumeText: textOverride }, profile.resumeTemplate)
      : { ...structured };

    const templateId = style === "classic" ? "classic" : previewTemplateId;

    return { ...parsed, templateId };

  };



  const downloadResume = async (
    format: "pdf" | "docx",
    textOverride?: string,
    style: ResumeExportStyle = "preview",
  ) => {

    const exportResume = getExportResume(textOverride, style);

    const hasContent =

      exportResume.summary ||

      exportResume.experience.length > 0 ||

      getResumePlainText(exportResume, textOverride ?? profile.resumeText);

    if (!hasContent) {

      setMessage("Add resume content before downloading.");

      return;

    }

    const label = format === "pdf" ? "PDF" : "DOCX";

    await task.run(`Preparing ${label}...`, async (update) => {

      update(50, "Formatting your resume...");

      const blob =
        format === "pdf"
          ? style === "classic"
            ? await buildClassicStyledResumePdf(exportResume)
            : await buildResumePdf(exportResume)
          : await buildResumeDocx(exportResume);

      downloadBlob(blob, resumeFileName(profile.name, format));

      setMessage(
        style === "classic"
          ? `${label} downloaded (classic template).`
          : `${label} downloaded.`,
      );

      update(100, "Done.");

    });

  };



  return (

    <div className="space-y-6">

      <div className="pd-careeros-flow-hero">

        <p className="pd-careeros-kicker">Smart CV Builder</p>

        <h2 className="pd-careeros-section-title mt-1">Build a job-winning resume</h2>

        <p className="pd-careeros-muted mt-2 max-w-2xl">

          Upload your CV, get an ATS score, and upgrade to a premium standard format — structured like{" "}

          <a href="https://flowcv.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline">

            FlowCV

          </a>

          , tailored to your niche and experience.

        </p>

      </div>



      <OperationStatus

        active={task.active}

        progress={task.progress}

        message={task.message}

        error={task.error}

      />



      {message && !task.active && <p className="body-regular-14">{message}</p>}



      {profile.careerDNA && <CareerDNACard dna={profile.careerDNA} />}



      <div className="pd-careeros-upload-zone">

        <input

          ref={fileRef}

          type="file"

          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"

          className="hidden"

          onChange={(e) => {

            const file = e.target.files?.[0];

            if (file) void handleUpload(file);

            e.target.value = "";

          }}

        />

        <p className="body-emphasized-14pt">Upload existing CV</p>

        <p className="pd-careeros-muted mt-1 text-sm">PDF, DOCX, or image — we extract and analyze automatically</p>

        <div className="mt-4">
          <ActionButton variant="secondary" onClick={() => fileRef.current?.click()}>
            Choose file
          </ActionButton>
        </div>

      </div>



      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <label className="block">

          <span className="body-emphasized-14pt mb-1 block">Full name</span>

          <input

            className="pd-input"

            value={profile.name}

            onChange={(e) => updateProfile({ name: e.target.value })}

          />

        </label>

        <label className="block">

          <span className="body-emphasized-14pt mb-1 block">Headline / target role</span>

          <input

            className="pd-input"

            value={profile.headline}

            onChange={(e) => updateProfile({ headline: e.target.value })}

            placeholder="e.g. Frontend Developer"

          />

        </label>

        <label className="block">

          <span className="body-emphasized-14pt mb-1 block">Years of experience</span>

          <input

            type="number"

            min={0}

            max={40}

            className="pd-input"

            value={profile.yearsExperience}

            onChange={(e) => updateProfile({ yearsExperience: Number(e.target.value) })}

          />

        </label>

      </div>



      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <label className="block">

          <span className="body-emphasized-14pt mb-1 block">Template</span>

          <select

            className="pd-input"

            value={profile.resumeTemplate}

            onChange={(e) => {

              const templateId = e.target.value as ResumeTemplateId;

              updateProfile({

                resumeTemplate: templateId,

                structuredResume: parseResumeToStructured(profile, templateId),

              });

            }}

          >

            {RESUME_TEMPLATES.map((t) => (

              <option key={t.id} value={t.id}>

                {t.label} — {t.description}

              </option>

            ))}

          </select>

        </label>

        <label className="block">

          <span className="body-emphasized-14pt mb-1 block">Career level</span>

          <select

            className="pd-input"

            value={profile.level}

            onChange={(e) => updateProfile({ level: e.target.value as typeof profile.level })}

          >

            {CAREER_LEVELS.map((level) => (

              <option key={level.id} value={level.id}>

                {level.label} ({level.years})

              </option>

            ))}

          </select>

        </label>

      </div>



      <label className="block">

        <span className="body-emphasized-14pt mb-1 block">Resume content</span>

        <textarea

          className="pd-textarea min-h-[220px] font-[var(--font-manrope)] text-sm"

          value={profile.resumeText}

          onChange={(e) => updateProfile({ resumeText: e.target.value })}

          placeholder="Paste your resume text here, or upload a file above..."

        />

      </label>



      <div className="flex flex-wrap gap-3">

        <ActionButton loading={task.active} onClick={saveProfile}>

          Save profile

        </ActionButton>

        <ActionButton loading={task.active} variant="secondary" onClick={runAts}>

          Run ATS analysis

        </ActionButton>

        <ActionButton loading={task.active} onClick={oneClickUpgrade}>

          One-Click Upgrade ✨

        </ActionButton>

        {profile.resumeText && (

          <>

            <ActionButton

              loading={task.active}

              variant="secondary"

              onClick={() => downloadResume("pdf", undefined, "classic")}

            >

              Download PDF

            </ActionButton>

            <ActionButton

              loading={task.active}

              variant="secondary"

              onClick={() => downloadResume("docx", undefined, "classic")}

            >

              Download DOCX

            </ActionButton>

          </>

        )}

      </div>



      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">

        <div

          className={`pd-score-ring ${

            atsReport.score >= 75

              ? "pd-score-ring--good"

              : atsReport.score >= 50

                ? "pd-score-ring--warn"

                : "pd-score-ring--risk"

          }`}

        >

          <div className="text-center">

            <p className="text-30-extrabold">{atsReport.score}%</p>

            <p className="body-secondary-info-14pt">ATS Score</p>

          </div>

        </div>



        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <div className="pd-workspace-card p-4">

            <p className="body-emphasized-14pt mb-2">Strengths</p>

            <ul className="space-y-2">

              {atsReport.strengths.length === 0 ? (

                <li className="body-secondary-info-14pt">Run analysis to see strengths.</li>

              ) : (

                atsReport.strengths.map((item) => (

                  <li key={item} className="body-regular-14">

                    ✓ {item}

                  </li>

                ))

              )}

            </ul>

          </div>

          <div className="pd-workspace-card p-4">

            <p className="body-emphasized-14pt mb-2">Improvements</p>

            <ul className="space-y-2">

              {atsReport.improvements.map((item) => (

                <li key={item} className="body-regular-14">

                  → {item}

                </li>

              ))}

            </ul>

          </div>

        </div>

      </div>



      {profile.resumeText && (

        <div className="space-y-3">

          <div className="flex items-center justify-between gap-3">

            <p className="body-emphasized-14pt">Live preview</p>

            <div className="pd-careeros-preview-toolbar">

              {showPreview && (

                <button

                  type="button"

                  className="pd-careeros-preview-download"

                  aria-label="Download resume as PDF"

                  title="Download PDF"

                  disabled={task.active}

                  onClick={downloadPreviewPdf}

                >

                  <svg

                    width="18"

                    height="18"

                    viewBox="0 0 24 24"

                    fill="none"

                    stroke="currentColor"

                    strokeWidth="2"

                    strokeLinecap="round"

                    strokeLinejoin="round"

                    aria-hidden

                  >

                    <path d="M12 3v12" />

                    <path d="m7 11 5 5 5-5" />

                    <path d="M5 21h14" />

                  </svg>

                </button>

              )}

              <button

                type="button"

                className="pd-careeros-text-btn"

                onClick={() => setShowPreview((v) => !v)}

              >

                {showPreview ? "Hide" : "Show"} preview

              </button>

            </div>

          </div>

          {showPreview && <ResumePreview resume={structured} />}

        </div>

      )}



      <div className="pd-workspace-card space-y-4 p-5">

        <p className="body-emphasized-14pt">Tailor for a specific role</p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

          <label className="block">

            <span className="body-emphasized-14pt mb-1 block">Target role</span>

            <input className="pd-input" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />

          </label>

          <label className="block">

            <span className="body-emphasized-14pt mb-1 block">Target company</span>

            <input className="pd-input" value={targetCompany} onChange={(e) => setTargetCompany(e.target.value)} />

          </label>

        </div>

        <label className="block">

          <span className="body-emphasized-14pt mb-1 block">Job description</span>

          <textarea

            className="pd-textarea min-h-[120px]"

            value={targetJobDescription}

            onChange={(e) => setTargetJobDescription(e.target.value)}

          />

        </label>

        <ActionButton loading={task.active} onClick={tailorResume}>

          Tailor resume for role

        </ActionButton>

      </div>



      {tailoredResume && (

        <div className="space-y-3">

          {tailorNotes.length > 0 && (

            <div className="pd-workspace-card p-4">

              <p className="body-emphasized-14pt mb-2">Changes made</p>

              <ul className="space-y-1">

                {tailorNotes.map((note) => (

                  <li key={note} className="body-regular-14">

                    → {note}

                  </li>

                ))}

              </ul>

            </div>

          )}

          <label className="block">

            <span className="body-emphasized-14pt mb-1 block">Tailored resume</span>

            <textarea

              className="pd-textarea min-h-[280px] font-[var(--font-manrope)] text-sm"

              value={tailoredResume}

              onChange={(e) => setTailoredResume(e.target.value)}

            />

          </label>

          <div className="flex flex-wrap gap-3">

            <ActionButton

              loading={task.active}

              variant="secondary"

              onClick={() => downloadResume("pdf", tailoredResume, "classic")}

            >

              Download PDF

            </ActionButton>

            <ActionButton

              loading={task.active}

              variant="secondary"

              onClick={() => downloadResume("docx", tailoredResume, "classic")}

            >

              Download DOCX

            </ActionButton>

            <ActionButton

              variant="secondary"

              onClick={() => {

                updateProfile({ resumeText: tailoredResume });

                setMessage("Tailored resume applied to your profile.");

              }}

            >

              Apply to profile

            </ActionButton>

          </div>

        </div>

      )}

    </div>

  );

}



"use client";

import { useMemo } from "react";
import type { DesignSettings, PersonalInfo, ResumeSection } from "@/lib/careeros/resume-draft";
import {
  RESUME_DOC_CSS,
  buildResumeDocumentHtml,
} from "@/lib/careeros/resume-html";

type Props = {
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  design: DesignSettings;
  compact?: boolean;
};

export default function ResumePreview({
  personalInfo,
  sections,
  design,
  compact,
}: Props) {
  const html = useMemo(
    () => buildResumeDocumentHtml(personalInfo, sections, design),
    [personalInfo, sections, design]
  );

  const empty =
    !personalInfo.fullName &&
    !personalInfo.summary &&
    sections.length === 0;

  return (
    <div
      className={`rb-preview-frame${compact ? " rb-preview-frame--compact" : ""}`}
    >
      <style dangerouslySetInnerHTML={{ __html: RESUME_DOC_CSS }} />
      {empty ? (
        <p className="rb-preview-empty">
          Your live preview will appear here as you build.
        </p>
      ) : (
        <div className="rb-preview-sheet">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}
    </div>
  );
}

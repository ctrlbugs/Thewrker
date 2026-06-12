import JSZip from "jszip";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

import type { StructuredResume } from "./types";
import { structuredResumeToText } from "./resume-template";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BLACK = rgb(0, 0, 0);

const NAVY = rgb(0.027, 0.149, 0.208);
const TEAL = rgb(0.004, 0.941, 0.816);
const WHITE = rgb(1, 1, 1);
const WHITE_MUTED = rgb(0.72, 0.78, 0.82);
const SLATE_700 = rgb(0.2, 0.25, 0.33);
const SLATE_500 = rgb(0.39, 0.45, 0.55);
const SLATE_400 = rgb(0.58, 0.64, 0.72);

const SIDEBAR_W = 168;
const SIDEBAR_PAD = 16;
const MAIN_PAD = 20;
const MAIN_X = SIDEBAR_W + MAIN_PAD;
const MAIN_W = PAGE_WIDTH - MAIN_X - MAIN_PAD;
const TOP = PAGE_HEIGHT - 36;
const BOTTOM = 36;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapTextByWidth(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [""];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function contactLine(resume: StructuredResume): string {
  return [
    resume.contact.email,
    resume.contact.linkedin,
    resume.contact.website,
    resume.contact.phone,
    resume.contact.location,
  ]
    .filter(Boolean)
    .join("  •  ");
}

export function getResumePlainText(resume: StructuredResume, overrideText?: string): string {
  const text = overrideText?.trim() || structuredResumeToText(resume);
  return text.trim();
}

interface PdfWriter {
  page: PDFPage;
  y: number;
  regular: PDFFont;
  bold: PDFFont;
  doc: PDFDocument;
}

function createPdfWriter(doc: PDFDocument, regular: PDFFont, bold: PDFFont): PdfWriter {
  return {
    doc,
    page: doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]),
    y: PAGE_HEIGHT - MARGIN,
    regular,
    bold,
  };
}

function ensureSpace(writer: PdfWriter, height: number): void {
  if (writer.y - height >= MARGIN) return;
  writer.page = writer.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  writer.y = PAGE_HEIGHT - MARGIN;
}

function drawLine(writer: PdfWriter, thickness = 0.75): void {
  writer.page.drawLine({
    start: { x: MARGIN, y: writer.y },
    end: { x: PAGE_WIDTH - MARGIN, y: writer.y },
    thickness,
    color: BLACK,
  });
  writer.y -= 10;
}

function drawWrapped(
  writer: PdfWriter,
  text: string,
  size: number,
  font: PDFFont,
  lineGap: number,
  maxWidth = CONTENT_WIDTH,
): void {
  for (const line of wrapTextByWidth(text, font, size, maxWidth)) {
    ensureSpace(writer, lineGap);
    writer.page.drawText(line, {
      x: MARGIN,
      y: writer.y - size,
      size,
      font,
      color: BLACK,
    });
    writer.y -= lineGap;
  }
}

function drawSectionTitle(writer: PdfWriter, title: string): void {
  writer.y -= 4;
  ensureSpace(writer, 24);
  writer.page.drawText(title, {
    x: MARGIN,
    y: writer.y - 11,
    size: 11,
    font: writer.bold,
    color: BLACK,
  });
  writer.y -= 13;
  drawLine(writer);
}

function drawRolePeriodRow(writer: PdfWriter, role: string, period: string): void {
  ensureSpace(writer, 16);
  writer.page.drawText(role, {
    x: MARGIN,
    y: writer.y - 11,
    size: 11,
    font: writer.bold,
    color: BLACK,
  });

  if (period) {
    const periodWidth = writer.regular.widthOfTextAtSize(period, 10);
    writer.page.drawText(period, {
      x: PAGE_WIDTH - MARGIN - periodWidth,
      y: writer.y - 11,
      size: 10,
      font: writer.regular,
      color: BLACK,
    });
  }

  writer.y -= 14;
}

function drawBullets(writer: PdfWriter, bullets: string[], maxWidth = CONTENT_WIDTH - 8): void {
  for (const bullet of bullets) {
    for (const line of wrapTextByWidth(`• ${bullet}`, writer.regular, 10, maxWidth)) {
      ensureSpace(writer, 13);
      writer.page.drawText(line, {
        x: MARGIN + 4,
        y: writer.y - 10,
        size: 10,
        font: writer.regular,
        color: BLACK,
      });
      writer.y -= 13;
    }
  }
}

async function buildClassicResumePdf(resume: StructuredResume): Promise<Blob> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.TimesRoman);
  const bold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const writer = createPdfWriter(doc, regular, bold);

  ensureSpace(writer, 28);
  const headerLine = resume.headline
    ? `${resume.name}  |  ${resume.headline}`
    : resume.name;

  for (const line of wrapTextByWidth(headerLine, bold, 14, CONTENT_WIDTH)) {
    ensureSpace(writer, 18);
    writer.page.drawText(line, {
      x: MARGIN,
      y: writer.y - 14,
      size: 14,
      font: bold,
      color: BLACK,
    });
    writer.y -= 18;
  }

  writer.y -= 6;

  const contacts = contactLine(resume);
  if (contacts) {
    drawWrapped(writer, contacts, 9, regular, 12);
    writer.y -= 4;
  }

  if (resume.summary) {
    drawSectionTitle(writer, "Summary");
    drawWrapped(writer, resume.summary, 10, regular, 13);
  }

  if (resume.experience.length > 0) {
    drawSectionTitle(writer, "Work Experience");
    for (const exp of resume.experience) {
      drawRolePeriodRow(writer, exp.role, exp.period);
      if (exp.company) {
        ensureSpace(writer, 13);
        writer.page.drawText(exp.company, {
          x: MARGIN,
          y: writer.y - 10,
          size: 10,
          font: regular,
          color: BLACK,
        });
        writer.y -= 13;
      }
      drawBullets(writer, exp.bullets);
      writer.y -= 4;
    }
  }

  if (resume.education.length > 0) {
    drawSectionTitle(writer, "Education");
    for (const edu of resume.education) {
      drawRolePeriodRow(writer, edu.degree, edu.period);
      if (edu.institution) {
        ensureSpace(writer, 13);
        writer.page.drawText(edu.institution, {
          x: MARGIN,
          y: writer.y - 10,
          size: 10,
          font: regular,
          color: BLACK,
        });
        writer.y -= 13;
      }
      writer.y -= 2;
    }
  }

  if (resume.skills.length > 0) {
    drawSectionTitle(writer, "Skills");
    drawWrapped(writer, resume.skills.join(" • "), 10, regular, 13);
  }

  if (resume.certifications.length > 0) {
    drawSectionTitle(writer, "Certifications");
    drawWrapped(writer, resume.certifications.join(" • "), 10, regular, 13);
  }

  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

interface ExecutiveWriter {
  doc: PDFDocument;
  page: PDFPage;
  regular: PDFFont;
  bold: PDFFont;
  mainY: number;
  pageIndex: number;
  resume: StructuredResume;
}

function drawSidebarBackground(page: PDFPage): void {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: SIDEBAR_W,
    height: PAGE_HEIGHT,
    color: NAVY,
  });
}

function beginExecutiveContinuationPage(writer: ExecutiveWriter): void {
  writer.page = writer.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  writer.pageIndex += 1;
  drawSidebarBackground(writer.page);
  drawExecutiveSidebarContinuation(writer);
  writer.mainY = TOP;
}

function ensureMainSpace(writer: ExecutiveWriter, height: number): void {
  if (writer.mainY - height >= BOTTOM) return;
  beginExecutiveContinuationPage(writer);
}

function drawSidebarLabel(page: PDFPage, bold: PDFFont, text: string, y: number): void {
  page.drawText(text.toUpperCase(), {
    x: SIDEBAR_PAD,
    y: y - 7,
    size: 6.5,
    font: bold,
    color: WHITE_MUTED,
  });
}

function drawSidebarWrapped(
  writer: ExecutiveWriter,
  text: string,
  size: number,
  startY: number,
  lineGap: number,
): number {
  let y = startY;
  const maxW = SIDEBAR_W - SIDEBAR_PAD * 2;

  for (const line of wrapTextByWidth(text, writer.regular, size, maxW)) {
    writer.page.drawText(line, {
      x: SIDEBAR_PAD,
      y: y - size,
      size,
      font: writer.regular,
      color: WHITE,
    });
    y -= lineGap;
  }

  return y;
}

function drawSkillPills(writer: ExecutiveWriter, startY: number): number {
  const skills = writer.resume.skills.slice(0, 14);
  if (!skills.length) return startY;

  let x = SIDEBAR_PAD;
  let y = startY;
  const pillH = 12;
  const pillPad = 4;
  const fontSize = 6.5;
  const maxX = SIDEBAR_W - SIDEBAR_PAD;

  for (const skill of skills) {
    const textW = writer.regular.widthOfTextAtSize(skill, fontSize);
    const pillW = textW + pillPad * 2;

    if (x + pillW > maxX) {
      x = SIDEBAR_PAD;
      y -= pillH + 4;
    }

    writer.page.drawRectangle({
      x,
      y: y - pillH,
      width: pillW,
      height: pillH,
      color: rgb(0.14, 0.19, 0.24),
    });
    writer.page.drawText(skill, {
      x: x + pillPad,
      y: y - pillH + 3,
      size: fontSize,
      font: writer.regular,
      color: WHITE,
    });

    x += pillW + 4;
  }

  return y - pillH - 6;
}

function drawExecutiveSidebar(writer: ExecutiveWriter): void {
  const { resume, page, bold, regular } = writer;
  let sy = TOP;

  page.drawText(resume.name, {
    x: SIDEBAR_PAD,
    y: sy - 14,
    size: 13,
    font: bold,
    color: WHITE,
  });
  sy -= 18;

  if (resume.headline) {
    for (const line of wrapTextByWidth(resume.headline, regular, 8, SIDEBAR_W - SIDEBAR_PAD * 2)) {
      page.drawText(line, {
        x: SIDEBAR_PAD,
        y: sy - 8,
        size: 8,
        font: regular,
        color: WHITE_MUTED,
      });
      sy -= 11;
    }
    sy -= 6;
  }

  const contacts = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.linkedin,
    resume.contact.website,
  ].filter(Boolean);

  if (contacts.length > 0) {
    drawSidebarLabel(page, bold, "Contact", sy);
    sy -= 14;
    for (const item of contacts) {
      for (const line of wrapTextByWidth(item, regular, 7, SIDEBAR_W - SIDEBAR_PAD * 2)) {
        page.drawText(line, {
          x: SIDEBAR_PAD,
          y: sy - 7,
          size: 7,
          font: regular,
          color: WHITE,
        });
        sy -= 10;
      }
    }
    sy -= 4;
  }

  if (resume.summary) {
    drawSidebarLabel(page, bold, "Profile", sy);
    sy -= 14;
    sy = drawSidebarWrapped(writer, resume.summary, 7, sy, 10);
    sy -= 6;
  }

  if (resume.skills.length > 0) {
    drawSidebarLabel(page, bold, "Skills", sy);
    sy -= 14;
    drawSkillPills(writer, sy);
  }
}

function drawExecutiveSidebarContinuation(writer: ExecutiveWriter): void {
  const { resume, page, bold, regular } = writer;
  let sy = TOP;

  page.drawText(resume.name, {
    x: SIDEBAR_PAD,
    y: sy - 12,
    size: 11,
    font: bold,
    color: WHITE,
  });
  sy -= 16;

  if (resume.headline) {
    const line = wrapTextByWidth(resume.headline, regular, 7, SIDEBAR_W - SIDEBAR_PAD * 2)[0] ?? "";
    if (line) {
      page.drawText(line, {
        x: SIDEBAR_PAD,
        y: sy - 7,
        size: 7,
        font: regular,
        color: WHITE_MUTED,
      });
    }
  }
}

function drawExecutiveSectionTitle(writer: ExecutiveWriter, title: string): void {
  ensureMainSpace(writer, 28);
  writer.page.drawText(title.toUpperCase(), {
    x: MAIN_X,
    y: writer.mainY - 8,
    size: 7.5,
    font: writer.bold,
    color: NAVY,
  });
  writer.mainY -= 11;
  writer.page.drawLine({
    start: { x: MAIN_X, y: writer.mainY },
    end: { x: PAGE_WIDTH - MAIN_PAD, y: writer.mainY },
    thickness: 2,
    color: TEAL,
  });
  writer.mainY -= 14;
}

function drawMainWrapped(
  writer: ExecutiveWriter,
  text: string,
  size: number,
  font: PDFFont,
  color: ReturnType<typeof rgb>,
  lineGap: number,
): void {
  for (const line of wrapTextByWidth(text, font, size, MAIN_W)) {
    ensureMainSpace(writer, lineGap);
    writer.page.drawText(line, {
      x: MAIN_X,
      y: writer.mainY - size,
      size,
      font,
      color,
    });
    writer.mainY -= lineGap;
  }
}

function drawExecutiveBullets(writer: ExecutiveWriter, bullets: string[]): void {
  for (const bullet of bullets) {
    for (const line of wrapTextByWidth(`• ${bullet}`, writer.regular, 9, MAIN_W - 8)) {
      ensureMainSpace(writer, 12);
      writer.page.drawText(line, {
        x: MAIN_X + 4,
        y: writer.mainY - 9,
        size: 9,
        font: writer.regular,
        color: SLATE_500,
      });
      writer.mainY -= 12;
    }
  }
}

async function buildExecutiveResumePdf(resume: StructuredResume): Promise<Blob> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const writer: ExecutiveWriter = {
    doc,
    page: doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]),
    regular,
    bold,
    mainY: TOP,
    pageIndex: 0,
    resume,
  };

  drawSidebarBackground(writer.page);
  drawExecutiveSidebar(writer);
  writer.mainY = TOP;

  if (resume.experience.length > 0) {
    drawExecutiveSectionTitle(writer, "Experience");
    for (const exp of resume.experience) {
      ensureMainSpace(writer, 16);
      writer.page.drawText(exp.role, {
        x: MAIN_X,
        y: writer.mainY - 10,
        size: 10,
        font: bold,
        color: SLATE_700,
      });

      if (exp.period) {
        const periodWidth = regular.widthOfTextAtSize(exp.period, 8);
        writer.page.drawText(exp.period, {
          x: MAIN_X + MAIN_W - periodWidth,
          y: writer.mainY - 10,
          size: 8,
          font: regular,
          color: SLATE_400,
        });
      }

      writer.mainY -= 13;

      if (exp.company) {
        ensureMainSpace(writer, 12);
        writer.page.drawText(exp.company, {
          x: MAIN_X,
          y: writer.mainY - 9,
          size: 9,
          font: regular,
          color: SLATE_500,
        });
        writer.mainY -= 12;
      }

      drawExecutiveBullets(writer, exp.bullets);
      writer.mainY -= 6;
    }
  }

  if (resume.education.length > 0) {
    drawExecutiveSectionTitle(writer, "Education");
    for (const edu of resume.education) {
      ensureMainSpace(writer, 14);
      writer.page.drawText(edu.degree, {
        x: MAIN_X,
        y: writer.mainY - 10,
        size: 10,
        font: bold,
        color: SLATE_700,
      });
      writer.mainY -= 13;

      if (edu.institution) {
        drawMainWrapped(writer, edu.institution, 9, regular, SLATE_500, 12);
      }

      if (edu.period) {
        ensureMainSpace(writer, 11);
        writer.page.drawText(edu.period, {
          x: MAIN_X,
          y: writer.mainY - 8,
          size: 8,
          font: regular,
          color: SLATE_400,
        });
        writer.mainY -= 11;
      }

      writer.mainY -= 4;
    }
  }

  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

export async function buildClassicStyledResumePdf(resume: StructuredResume): Promise<Blob> {
  return buildClassicResumePdf(resume);
}

export async function buildResumePdf(resume: StructuredResume): Promise<Blob> {
  if (resume.templateId === "executive") {
    return buildExecutiveResumePdf(resume);
  }
  return buildClassicResumePdf(resume);
}

function docxParagraph(text: string, bold = false): string {
  const runProps = bold ? "<w:rPr><w:b/></w:rPr>" : "";
  const safe = escapeXml(text || " ");
  return `<w:p><w:r>${runProps}<w:t xml:space="preserve">${safe}</w:t></w:r></w:p>`;
}

function docxSectionTitle(title: string): string {
  return `${docxParagraph(title, true)}<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="000000"/></w:pBdr></w:pPr></w:p>`;
}

export async function buildResumeDocx(resume: StructuredResume): Promise<Blob> {
  const parts: string[] = [];

  const headerLine = resume.headline ? `${resume.name}  |  ${resume.headline}` : resume.name;
  parts.push(docxParagraph(headerLine, true));

  const contacts = contactLine(resume);
  if (contacts) parts.push(docxParagraph(contacts));

  if (resume.summary) {
    parts.push(docxSectionTitle("Summary"));
    parts.push(docxParagraph(resume.summary));
  }

  if (resume.experience.length > 0) {
    parts.push(docxSectionTitle("Work Experience"));
    for (const exp of resume.experience) {
      parts.push(docxParagraph(`${exp.role}${exp.period ? `\t${exp.period}` : ""}`, true));
      if (exp.company) parts.push(docxParagraph(exp.company));
      for (const bullet of exp.bullets) {
        parts.push(docxParagraph(`• ${bullet}`));
      }
    }
  }

  if (resume.education.length > 0) {
    parts.push(docxSectionTitle("Education"));
    for (const edu of resume.education) {
      parts.push(docxParagraph(`${edu.degree}${edu.period ? `\t${edu.period}` : ""}`, true));
      if (edu.institution) parts.push(docxParagraph(edu.institution));
    }
  }

  if (resume.skills.length > 0) {
    parts.push(docxSectionTitle("Skills"));
    parts.push(docxParagraph(resume.skills.join(" • ")));
  }

  if (resume.certifications.length > 0) {
    parts.push(docxSectionTitle("Certifications"));
    parts.push(docxParagraph(resume.certifications.join(" • ")));
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${parts.join("")}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
  );
  zip.folder("_rels")!.file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
  );
  zip.folder("word")!.folder("_rels")!.file(
    "document.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`,
  );
  zip.folder("word")!.file("document.xml", documentXml);

  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

export function resumeFileName(name: string, extension: "pdf" | "docx"): string {
  const base = (name.trim() || "resume")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 48);
  return `${base}-thewrker.${extension}`;
}

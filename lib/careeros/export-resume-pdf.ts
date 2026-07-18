import type { ResumeDraft } from "@/lib/careeros/resume-draft";
import {
  RESUME_DOC_CSS,
  buildResumeDocumentHtml,
} from "@/lib/careeros/resume-html";

function slugName(name: string) {
  return (
    name
      .trim()
      .replace(/[^\w\s-]+/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 48) || "Resume"
  );
}

/**
 * Renders the selected template to a real PDF, opens a preview tab,
 * and starts a download of the same file.
 */
export async function exportResumePdf(draft: ResumeDraft): Promise<void> {
  const [{ jsPDF }, html2canvasMod] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);
  const html2canvas = html2canvasMod.default;

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText =
    "position:fixed;left:-10000px;top:0;width:816px;background:#fff;z-index:-1;pointer-events:none;";

  const style = document.createElement("style");
  style.textContent = RESUME_DOC_CSS;
  host.appendChild(style);

  const mount = document.createElement("div");
  mount.innerHTML = buildResumeDocumentHtml(
    draft.personalInfo,
    draft.sections,
    draft.design
  );
  host.appendChild(mount);
  document.body.appendChild(host);

  const page = mount.querySelector(".rv-page") as HTMLElement | null;
  if (!page) {
    host.remove();
    throw new Error("Could not render resume for PDF export.");
  }

  try {
    await document.fonts?.ready.catch(() => undefined);
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));

    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 816,
      windowWidth: 816,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "letter",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    while (heightLeft > 2) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= pageHeight;
    }

    const fileName = `${slugName(draft.personalInfo.fullName || "Resume")}-${
      draft.design.templateId === "smooth" ? "Smooth" : "Plain"
    }.pdf`;

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank", "noopener,noreferrer");

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } finally {
    host.remove();
  }
}

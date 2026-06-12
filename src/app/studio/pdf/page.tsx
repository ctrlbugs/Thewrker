import ToolShell from "@/components/tools/ToolShell";
import PdfStudioTool from "@/components/tools/PdfStudioTool";

export default function PdfStudioPage() {
  return (
    <ToolShell
      title="PDF Studio"
      description="Merge multiple PDFs or split a PDF by page range or individual pages."
    >
      <PdfStudioTool />
    </ToolShell>
  );
}

export type PdfToolId =
  | "merge"
  | "split"
  | "extract"
  | "delete"
  | "rotate"
  | "reorder"
  | "insert"
  | "number"
  | "crop"
  | "edit"
  | "to-word"
  | "to-excel"
  | "to-ppt"
  | "to-jpg"
  | "to-png"
  | "from-word"
  | "from-excel"
  | "from-ppt"
  | "from-jpg"
  | "from-png";

export type PdfTool = {
  id: PdfToolId;
  label: string;
  title: string;
  subtitle: string;
  cta: string;
  multiple?: boolean;
  ready?: boolean;
  heroIcon: string;
  group: "edit" | "convert-to" | "convert-from";
};

export const PDF_EDIT_TOOLS: PdfTool[] = [
  {
    id: "merge",
    label: "Merge PDFs",
    title: "Merge PDF files",
    subtitle:
      "Quickly combine multiple PDFs into one clean file. Select files, reorder if needed, then download.",
    cta: "Select files",
    multiple: true,
    ready: true,
    heroIcon: "/icons/merger.png",
    group: "edit",
  },
  {
    id: "split",
    label: "Split PDF",
    title: "Split PDF files",
    subtitle:
      "Drag and drop a PDF, then separate it into multiple files with our PDF splitter.",
    cta: "Select a file",
    ready: true,
    heroIcon: "/icons/split.png",
    group: "edit",
  },
  {
    id: "extract",
    label: "Extract PDF pages",
    title: "Extract PDF pages",
    subtitle: "Drag and drop a PDF file, then extract the pages you need.",
    cta: "Select a file",
    ready: true,
    heroIcon: "/icons/extract.png",
    group: "edit",
  },
  {
    id: "delete",
    label: "Delete PDF pages",
    title: "Delete PDF pages",
    subtitle: "Drag and drop a file, then remove pages from your PDF.",
    cta: "Select a file",
    ready: true,
    heroIcon: "/icons/Delete.png",
    group: "edit",
  },
  {
    id: "rotate",
    label: "Rotate PDF pages",
    title: "Rotate PDF pages",
    subtitle: "Drag and drop a PDF, then rotate pages left or right.",
    cta: "Select a file",
    ready: true,
    heroIcon: "/icons/Rotate.png",
    group: "edit",
  },
  {
    id: "reorder",
    label: "Organize PDF pages",
    title: "Organize PDF pages",
    subtitle: "Drag and drop a PDF to reorder or rearrange the pages.",
    cta: "Select a file",
    ready: true,
    heroIcon: "/icons/reorder.png",
    group: "edit",
  },
  {
    id: "insert",
    label: "Insert PDF pages",
    title: "Add pages to a PDF",
    subtitle: "Choose a base PDF, then insert pages from another PDF.",
    cta: "Select files",
    multiple: true,
    ready: true,
    heroIcon: "/icons/Insert.png",
    group: "edit",
  },
  {
    id: "number",
    label: "Number PDF pages",
    title: "Add page numbers to a PDF",
    subtitle: "Drag and drop a PDF to add clean page numbers.",
    cta: "Select a file",
    ready: true,
    heroIcon: "/icons/pages.png",
    group: "edit",
  },
  {
    id: "crop",
    label: "Crop PDF",
    title: "Crop PDF pages",
    subtitle: "Trim equal margins from every page in your PDF.",
    cta: "Select a file",
    ready: true,
    heroIcon: "/icons/pages.png",
    group: "edit",
  },
  {
    id: "edit",
    label: "Edit PDF",
    title: "Edit PDF",
    subtitle: "Stamp a short note or watermark across every page.",
    cta: "Select a file",
    ready: true,
    heroIcon: "/icons/pdf.png",
    group: "edit",
  },
];

export const PDF_CONVERT_TO: PdfTool[] = [
  {
    id: "from-word",
    label: "Convert Word to PDF",
    title: "Convert Word to PDF",
    subtitle: "Turn Word documents into polished PDFs without leaving your workspace.",
    cta: "Select a file",
    heroIcon: "/icons/pdf.png",
    group: "convert-to",
  },
  {
    id: "from-excel",
    label: "Convert Excel to PDF",
    title: "Convert Excel to PDF",
    subtitle: "Export spreadsheets to clean, shareable PDF files.",
    cta: "Select a file",
    heroIcon: "/icons/pdf.png",
    group: "convert-to",
  },
  {
    id: "from-ppt",
    label: "Convert PPT to PDF",
    title: "Convert PowerPoint to PDF",
    subtitle: "Convert decks into PDF for easy sharing and review.",
    cta: "Select a file",
    heroIcon: "/icons/pdf.png",
    group: "convert-to",
  },
  {
    id: "from-jpg",
    label: "Convert JPG to PDF",
    title: "Convert JPG to PDF",
    subtitle: "Combine images into a single PDF in a few clicks.",
    cta: "Select files",
    multiple: true,
    ready: true,
    heroIcon: "/icons/pdf.png",
    group: "convert-to",
  },
  {
    id: "from-png",
    label: "Convert PNG to PDF",
    title: "Convert PNG to PDF",
    subtitle: "Turn PNG images into a tidy PDF document.",
    cta: "Select files",
    multiple: true,
    ready: true,
    heroIcon: "/icons/pdf.png",
    group: "convert-to",
  },
];

export const PDF_CONVERT_FROM: PdfTool[] = [
  {
    id: "to-word",
    label: "Convert PDF to Word",
    title: "Convert PDF to Word",
    subtitle: "Export PDF content into an editable Word document.",
    cta: "Select a file",
    heroIcon: "/icons/pdf.png",
    group: "convert-from",
  },
  {
    id: "to-excel",
    label: "Convert PDF to Excel",
    title: "Convert PDF to Excel",
    subtitle: "Pull tables and data from a PDF into Excel.",
    cta: "Select a file",
    heroIcon: "/icons/pdf.png",
    group: "convert-from",
  },
  {
    id: "to-ppt",
    label: "Convert PDF to PPT",
    title: "Convert PDF to PowerPoint",
    subtitle: "Turn PDF pages into editable slides.",
    cta: "Select a file",
    heroIcon: "/icons/pdf.png",
    group: "convert-from",
  },
  {
    id: "to-jpg",
    label: "Convert PDF to JPG",
    title: "Convert PDF to JPG",
    subtitle: "Export PDF pages as high-quality JPG images.",
    cta: "Select a file",
    heroIcon: "/icons/pdf.png",
    group: "convert-from",
  },
  {
    id: "to-png",
    label: "Convert PDF to PNG",
    title: "Convert PDF to PNG",
    subtitle: "Export PDF pages as crisp PNG images.",
    cta: "Select a file",
    heroIcon: "/icons/pdf.png",
    group: "convert-from",
  },
];

export const ALL_PDF_TOOLS: PdfTool[] = [
  ...PDF_EDIT_TOOLS,
  ...PDF_CONVERT_TO,
  ...PDF_CONVERT_FROM,
];

export function getPdfTool(id: PdfToolId): PdfTool {
  return ALL_PDF_TOOLS.find((t) => t.id === id) ?? PDF_EDIT_TOOLS[0];
}

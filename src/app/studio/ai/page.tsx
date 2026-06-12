import ToolShell from "@/components/tools/ToolShell";
import PlagiarismStudioTool from "@/components/tools/PlagiarismStudioTool";

export default function AiStudioPage() {
  return (
    <ToolShell
      title="AI Studio — Plagiarism Checker"
      description="Upload documents or paste text to analyze originality, repetition, and online matches."
    >
      <PlagiarismStudioTool />
    </ToolShell>
  );
}

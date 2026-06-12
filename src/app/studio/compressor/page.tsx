import ToolShell from "@/components/tools/ToolShell";
import CompressorStudioTool from "@/components/tools/CompressorStudioTool";

export default function CompressorStudioPage() {
  return (
    <ToolShell
      title="Compressor Studio"
      description="Compress images, audio, and video files in your browser with progress tracking and size savings."
    >
      <CompressorStudioTool />
    </ToolShell>
  );
}

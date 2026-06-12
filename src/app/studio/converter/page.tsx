import ToolShell from "@/components/tools/ToolShell";
import ConverterHubTool from "@/components/tools/ConverterHubTool";

export default function ConverterPage() {
  return (
    <ToolShell
      title="Converter Hub"
      description="Convert MP3, WAV, AAC, MP4, MOV, and AVI files directly in your browser."
    >
      <ConverterHubTool />
    </ToolShell>
  );
}

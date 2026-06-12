import ToolShell from "@/components/tools/ToolShell";
import ArchiveStudioTool from "@/components/tools/ArchiveStudioTool";

export default function ArchiveStudioPage() {
  return (
    <ToolShell
      title="Archive Studio"
      description="Create ZIP archives from your files or extract files from existing ZIP archives."
    >
      <ArchiveStudioTool />
    </ToolShell>
  );
}

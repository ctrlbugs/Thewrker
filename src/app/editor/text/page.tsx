import ToolShell from "@/components/tools/ToolShell";
import TextEditorTool from "@/components/tools/TextEditorTool";

export default function TextEditorPage() {
  return (
    <ToolShell
      title="Text Editor"
      description="Write, search, replace, and track document stats with auto-save."
    >
      <TextEditorTool />
    </ToolShell>
  );
}

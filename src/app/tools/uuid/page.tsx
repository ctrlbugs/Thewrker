import ToolShell from "@/components/tools/ToolShell";
import UuidTool from "@/components/tools/UuidTool";

export default function UuidPage() {
  return (
    <ToolShell
      title="UUID Generator"
      description="Generate unique identifiers for apps, databases, and APIs."
    >
      <UuidTool />
    </ToolShell>
  );
}

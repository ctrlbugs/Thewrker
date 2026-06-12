import ToolShell from "@/components/tools/ToolShell";
import JsonFormatterTool from "@/components/tools/JsonFormatterTool";

export default function JsonFormatterPage() {
  return (
    <ToolShell
      title="JSON Formatter"
      description="Format, minify, and validate JSON inside your workspace."
    >
      <JsonFormatterTool />
    </ToolShell>
  );
}

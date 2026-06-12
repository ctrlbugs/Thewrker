import ToolShell from "@/components/tools/ToolShell";
import RegexTool from "@/components/tools/RegexTool";

export default function RegexPage() {
  return (
    <ToolShell
      title="Regex Tester"
      description="Test regular expressions, preview matches, and run replacements."
    >
      <RegexTool />
    </ToolShell>
  );
}

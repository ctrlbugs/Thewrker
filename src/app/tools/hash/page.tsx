import ToolShell from "@/components/tools/ToolShell";
import HashTool from "@/components/tools/HashTool";

export default function HashPage() {
  return (
    <ToolShell
      title="Hash Generator"
      description="Create SHA-256, SHA-384, and SHA-512 hashes from any text."
    >
      <HashTool />
    </ToolShell>
  );
}

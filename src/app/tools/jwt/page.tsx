import ToolShell from "@/components/tools/ToolShell";
import JwtTool from "@/components/tools/JwtTool";

export default function JwtPage() {
  return (
    <ToolShell
      title="JWT Decoder"
      description="Inspect JSON Web Token headers and payloads without sending data anywhere."
    >
      <JwtTool />
    </ToolShell>
  );
}

import ToolShell from "@/components/tools/ToolShell";
import Base64Tool from "@/components/tools/Base64Tool";

export default function Base64Page() {
  return (
    <ToolShell
      title="Base64 Encoder"
      description="Encode plain text to Base64 or decode Base64 back to text."
    >
      <Base64Tool />
    </ToolShell>
  );
}

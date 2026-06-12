import ToolShell from "@/components/tools/ToolShell";
import ImageStudioTool from "@/components/tools/ImageStudioTool";

export default function ImageStudioPage() {
  return (
    <ToolShell
      title="Image Studio"
      description="Resize, compress, convert, and remove backgrounds from images in your workspace."
    >
      <ImageStudioTool />
    </ToolShell>
  );
}

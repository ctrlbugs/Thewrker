import CareerOSPageShell from "@/components/careeros/CareerOSPageShell";
import ResumeLabTool from "@/components/careeros/ResumeLabTool";

export default function ResumeLabPage() {
  return (
    <CareerOSPageShell
      title="Smart CV Builder"
      description="Upload your CV, get an ATS score, and upgrade to a premium standard format tailored to your niche."
    >
      <ResumeLabTool />
    </CareerOSPageShell>
  );
}

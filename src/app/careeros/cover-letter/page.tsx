import CareerOSPageShell from "@/components/careeros/CareerOSPageShell";
import CoverLetterStudioTool from "@/components/careeros/CoverLetterStudioTool";

export default function CoverLetterPage() {
  return (
    <CareerOSPageShell
      title="Cover Letter Studio"
      description="Generate personalized, role-specific cover letters tailored to your profile and the job description."
    >
      <CoverLetterStudioTool />
    </CareerOSPageShell>
  );
}

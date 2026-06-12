import CareerOSPageShell from "@/components/careeros/CareerOSPageShell";
import InterviewPrepTool from "@/components/careeros/InterviewPrepTool";

export default function InterviewPrepPage() {
  return (
    <CareerOSPageShell
      title="Interview Prep"
      description="AI-generated interview questions, company preparation tips, and salary planning for your target roles."
    >
      <InterviewPrepTool />
    </CareerOSPageShell>
  );
}

import CareerOSPageShell from "@/components/careeros/CareerOSPageShell";
import UpskillEngineTool from "@/components/careeros/UpskillEngineTool";

export default function UpskillPage() {
  return (
    <CareerOSPageShell
      title="Upskill Engine"
      description="Personalized 30, 60, and 90-day learning roadmaps based on your skill gaps."
    >
      <UpskillEngineTool />
    </CareerOSPageShell>
  );
}

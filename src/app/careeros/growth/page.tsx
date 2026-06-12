import CareerGrowthTool from "@/components/careeros/CareerGrowthTool";
import CareerOSPageShell from "@/components/careeros/CareerOSPageShell";

export default function CareerGrowthPage() {
  return (
    <CareerOSPageShell
      title="Career Growth Agent"
      description="Long-term skill progression with personalized milestones, gap analysis, and weekly focus — powered by your profile and application history."
    >
      <CareerGrowthTool />
    </CareerOSPageShell>
  );
}

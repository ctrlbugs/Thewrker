import CareerInsightsTool from "@/components/careeros/CareerInsightsTool";
import CareerOSPageShell from "@/components/careeros/CareerOSPageShell";

export default function CareerInsightsPage() {
  return (
    <CareerOSPageShell
      title="Career Insights"
      description="Career analytics, qualification scoring, pipeline visibility, and growth recommendations from your application data."
    >
      <CareerInsightsTool />
    </CareerOSPageShell>
  );
}

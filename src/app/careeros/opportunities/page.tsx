import CareerOSPageShell from "@/components/careeros/CareerOSPageShell";
import OpportunityAgentTool from "@/components/careeros/OpportunityAgentTool";

export default function OpportunitiesPage() {
  return (
    <CareerOSPageShell
      title="Job Search"
      description="Intelligent job matching across LinkedIn, Wellfound, Remote OK, and more — filtered by level, type, and industry."
    >
      <OpportunityAgentTool />
    </CareerOSPageShell>
  );
}

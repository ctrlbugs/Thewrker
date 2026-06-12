import ApplicationTrackerTool from "@/components/careeros/ApplicationTrackerTool";
import CareerOSPageShell from "@/components/careeros/CareerOSPageShell";

export default function ApplicationsPage() {
  return (
    <CareerOSPageShell
      title="Application Tracker"
      description="Track jobs across Saved, Applied, Interview, Offer, and Rejected — with compatibility scoring and follow-up reminders."
    >
      <ApplicationTrackerTool />
    </CareerOSPageShell>
  );
}

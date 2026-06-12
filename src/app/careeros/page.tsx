import CareerOSDashboard from "@/components/careeros/CareerOSDashboard";
import CareerOSPageShell from "@/components/careeros/CareerOSPageShell";

export default function CareerOSHomePage() {
  return (
    <CareerOSPageShell
      title="Dashboard"
      description="Your centralized career overview — applications, reminders, AI agents, and quick actions to move from apply to offer."
    >
      <CareerOSDashboard />
    </CareerOSPageShell>
  );
}

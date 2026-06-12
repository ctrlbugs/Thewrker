import CareerOSPageShell from "@/components/careeros/CareerOSPageShell";
import ScholarshipsTool from "@/components/careeros/ScholarshipsTool";

export default function ScholarshipsPage() {
  return (
    <CareerOSPageShell
      title="Scholarships"
      description="Curated funding opportunities matched to your profile and career level."
    >
      <ScholarshipsTool />
    </CareerOSPageShell>
  );
}

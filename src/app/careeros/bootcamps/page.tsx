import CareerOSPageShell from "@/components/careeros/CareerOSPageShell";
import BootcampsTool from "@/components/careeros/BootcampsTool";

export default function BootcampsPage() {
  return (
    <CareerOSPageShell
      title="Bootcamps"
      description="Free, scholarship, and paid programs to accelerate your career."
    >
      <BootcampsTool />
    </CareerOSPageShell>
  );
}

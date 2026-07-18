import { redirect } from "next/navigation";

/** Legacy talent jobs → CareerOS job search */
export default function TalentJobsRedirectPage() {
  redirect("/dashboard/careeros/jobs");
}

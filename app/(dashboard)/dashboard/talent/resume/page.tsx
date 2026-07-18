import { redirect } from "next/navigation";

/** Legacy resume route → CareerOS builder (import lives at /careeros/resume only) */
export default function TalentResumeRedirectPage({
  searchParams,
}: {
  searchParams: { imported?: string };
}) {
  const imported = searchParams?.imported === "1" ? "?imported=1" : "";
  redirect(`/dashboard/careeros/builder${imported}`);
}

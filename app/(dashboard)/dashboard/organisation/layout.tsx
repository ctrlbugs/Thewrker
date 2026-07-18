"use client";

import { OrganisationProvider } from "@/lib/organisation/store";
import OrganisationShell from "@/components/organisation/OrganisationShell";

export default function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrganisationProvider>
      <OrganisationShell>{children}</OrganisationShell>
    </OrganisationProvider>
  );
}

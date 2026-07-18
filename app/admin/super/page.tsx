import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Super Admin",
  robots: { index: false, follow: false },
};

export default function SuperAdminShellPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-primary px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-6 flex justify-center">
          <BrandLogo size="lg" variant="dark" />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">
          app.thewrker.com
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Console</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Platform control for TheWrker. This shell is ready for the super-admin dashboard
          integration — organisations, billing, and global settings land here.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
        >
          Back to user sign in
        </Link>
      </div>
    </div>
  );
}

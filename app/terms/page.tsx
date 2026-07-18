import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for TheWrker workspace and job search platform.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/login" className="text-sm font-semibold text-brand-primary hover:underline">
        ← Back
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Terms of Service</h1>
      <p className="mt-4 text-gray-600">
        Full legal terms will live here. By using TheWrker you agree to use the platform
        responsibly for workspace collaboration and job searching.
      </p>
    </main>
  );
}

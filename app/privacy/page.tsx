import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for TheWrker workspace and job search platform.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/login" className="text-sm font-semibold text-brand-primary hover:underline">
        ← Back
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-4 text-gray-600">
        Full privacy details will live here. TheWrker protects account, organisation, and
        career data in line with modern platform standards.
      </p>
    </main>
  );
}

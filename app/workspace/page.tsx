"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand-logo";

function slugifyOrg(value: string) {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.includes("@")) {
    const domain = trimmed.split("@")[1] || "";
    const root = domain.split(".")[0] || "";
    return root.replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  }

  return trimmed
    .replace(/^https?:\/\//, "")
    .replace(/\.thewrker\.com.*$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function WorkspaceFindPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const slug = slugifyOrg(input);
    if (!slug) {
      setError("Enter your organisation workspace name or email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/org/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: input.trim(),
          slug,
        }),
      });

      const data = await response.json();

      if (data.slug || response.ok) {
        router.push(`/workspace/${data.slug || slug}`);
        return;
      }

      // Frontend-first: still route to the workspace URL for UX
      router.push(`/workspace/${slug}`);
    } catch {
      router.push(`/workspace/${slug}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-10 sm:py-16">
        <div className="mb-10 flex justify-center">
          <Link href="/login" aria-label="Back to TheWrker login">
            <BrandLogo size="lg" variant="dark" />
          </Link>
        </div>

        <div className="animate-fade-up text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Sign in to your workspace
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Enter your organisation name or work email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 animate-fade-up-delay space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="workspace" className="mb-2 block text-sm font-semibold text-gray-700">
              Workspace
            </label>
            <input
              id="workspace"
              name="workspace"
              type="text"
              autoComplete="organization"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              placeholder="tradepat or name@company.com"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            />
            <p className="mt-2 text-xs text-gray-400">
              Your team URL will look like{" "}
              <span className="font-medium text-gray-600">thewrker.com/workspace/your-org</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-primary px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Finding workspace…" : "Continue"}
          </button>
        </form>

        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Or sign in with
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 px-4 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Link>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don&apos;t know your workspace?{" "}
          <Link href="/login" className="font-semibold text-brand-primary hover:underline">
            Sign in as an individual
          </Link>
        </p>
      </div>
    </div>
  );
}

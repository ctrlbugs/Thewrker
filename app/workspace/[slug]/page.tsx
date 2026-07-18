"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BrandLogo from "@/components/brand-logo";

export default function OrganisationLoginPage() {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(() => decodeURIComponent(params.slug || ""), [params.slug]);
  const orgLabel = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/org/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        window.location.href = data.redirectUrl || `/workspace/${slug}/dashboard`;
        return;
      }

      setMessage(
        data.message ||
          "Organisation login endpoint is ready. Backend auth will be connected next."
      );
    } catch {
      setError("Unable to sign in right now. Please try again.");
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
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">
            Organisation workspace
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Sign in to {orgLabel || "your workspace"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Managers and heads of department use their organisation email
          </p>
          <p className="mt-1 text-xs text-gray-400">thewrker.com/workspace/{slug}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 animate-fade-up-delay space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-xl border border-brand-secondary/30 bg-brand-secondary/10 px-4 py-3 text-sm text-brand-primary">
              {message}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
              Organisation email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@work-email.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3.5 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3.5 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-[3.15rem] w-full items-center justify-center rounded-xl bg-[#1a2d56] px-4 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(33,56,107,0.22)] transition-all duration-200 ease-out hover:bg-[#152447] hover:shadow-[0_10px_26px_rgba(33,56,107,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign In With Email"}
          </button>
        </form>

        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Or sign in with
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={async () => {
            const response = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ intent: "org_login", slug }),
            });
            const data = await response.json();
            setMessage(
              data.message || "Google organisation sign-in will connect with OAuth next."
            );
          }}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 px-4 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Google
        </button>

        <p className="mt-10 text-center text-sm text-gray-500">
          Wrong workspace?{" "}
          <Link href="/workspace" className="font-semibold text-[#21386B] hover:underline">
            Find another organisation
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-gray-500">
          Signing in as an individual?{" "}
          <Link href="/login/email" className="font-semibold text-[#21386B] hover:underline">
            Sign in with email
          </Link>
        </p>
      </div>
    </div>
  );
}

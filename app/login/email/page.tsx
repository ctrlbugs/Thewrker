"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand-logo";
import DashboardLoader from "@/components/workspace/DashboardLoader";
import { Check, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

export default function EmailLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [entering, setEntering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      const role = data.user?.role?.toLowerCase();
      const href = role === "recruiter" ? "/dashboard/recruiter" : "/dashboard";

      setEntering(true);
      try {
        sessionStorage.setItem("thewrker.dashGate", "1");
      } catch {
        /* ignore */
      }
      await new Promise((r) => setTimeout(r, 420));
      router.push(href);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
      setEntering(false);
    }
  };

  if (entering) {
    return <DashboardLoader title="Workspace" subtitle="Loading your dashboard" />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, #4A6FA5 0%, #21386B 48%, #162a4f 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 py-12">
        <div className="w-full rounded-2xl bg-white p-7 text-gray-900 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <Link href="/login" aria-label="Back to TheWrker sign in">
              <BrandLogo size="md" variant="dark" priority />
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Sign in with email</h1>
          <p className="mt-1 text-sm text-gray-500">
            Use your TheWrker account credentials
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-12 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="flex h-[3.15rem] w-full items-center justify-center rounded-xl bg-[#76bec5] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(118,190,197,0.28)] transition-all duration-200 ease-out hover:bg-[#68b0b7] hover:shadow-[0_10px_24px_rgba(118,190,197,0.34)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" aria-hidden />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link href="/login" className="font-semibold text-brand-primary hover:underline">
              Back to sign-in options
            </Link>
          </p>
        </div>

        <ul className="mt-10 flex flex-nowrap items-center justify-center gap-4 text-[11px] text-white/85 sm:gap-8 sm:text-sm">
          {[
            "Organisation workspaces",
            "AI-ready job search",
            "Digital career tools",
          ].map((item) => (
            <li key={item} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap sm:gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-white sm:h-4 sm:w-4" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

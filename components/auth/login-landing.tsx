"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand-logo";
import DashboardLoader from "@/components/workspace/DashboardLoader";
import { Check, Loader2 } from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
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
  );
}

export default function LoginLanding() {
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [entering, setEntering] = useState(false);
  const [googleMessage, setGoogleMessage] = useState("");

  const enterDashboard = async (href = "/dashboard") => {
    setEntering(true);
    try {
      sessionStorage.setItem("thewrker.dashGate", "1");
    } catch {
      /* ignore */
    }
    // Let the branded gate paint before route change
    await new Promise((r) => setTimeout(r, 420));
    router.push(href);
  };

  const handleGoogleContinue = async () => {
    setGoogleLoading(true);
    setGoogleMessage("");

    // Local staging: sign in as default demo user (no OAuth yet)
    if (process.env.NEXT_PUBLIC_LOCAL_STAGING === "true") {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "user@thewrker.com",
            password: "user123",
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Local login failed");
        if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
        await enterDashboard("/dashboard");
        return;
      } catch {
        setGoogleMessage("Local staging login failed. Try Sign in with email.");
        setGoogleLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "user_login" }),
      });
      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      setGoogleMessage(
        data.message || "Google sign-in will be available once OAuth is connected."
      );
    } catch {
      setGoogleMessage("Unable to start Google sign-in right now. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (entering) {
    return <DashboardLoader title="Workspace" subtitle="Loading your dashboard" />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Jobbyo-style soft gradient, TheWrker brand colors */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, #4A6FA5 0%, #21386B 48%, #162a4f 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(118,190,197,0.22),transparent_50%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-12">
        {/* Hero — forced 2-line headline */}
        <div className="mb-8 w-full text-center animate-fade-up sm:mb-10">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70 sm:text-xs">
            Workspace + Job Search
          </p>
          <h1 className="mx-auto max-w-xl text-[1.85rem] font-bold leading-[1.2] tracking-tight sm:text-4xl md:text-[2.65rem]">
            <span className="block">The future of Workspace and</span>
            <span className="block">
              Job Searching Made{" "}
              <span className="relative inline-block pb-1.5">
                Simple.
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-brand-secondary"
                />
              </span>
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
            Let TheWrker handle digital work and career moves while you focus on what matters.
          </p>
        </div>

        {/* Auth card — Jobbyo structure */}
        <div className="w-full max-w-[400px] animate-fade-up-delay rounded-2xl bg-white px-7 py-8 text-gray-900 shadow-2xl shadow-black/20 sm:px-9 sm:py-9">
          <div className="mb-7 flex flex-col items-center text-center">
            <BrandLogo className="mb-5" size="md" variant="dark" priority />
            <h2 className="text-[1.35rem] font-bold tracking-tight text-gray-900">
              Welcome to TheWrker
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">Sign in to get started</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleContinue}
            disabled={googleLoading}
            aria-busy={googleLoading}
            className="group flex h-[3.15rem] w-full items-center justify-center gap-3 rounded-xl border border-[#e4e9ef] bg-[#fafbfc] px-4 text-sm font-semibold text-[#2f3d52] transition-all duration-200 ease-out hover:border-[#76bec5]/55 hover:bg-[#eef7f8] hover:text-[#21386B] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-[#76bec5]" aria-hidden />
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          {googleMessage && (
            <p className="mt-3 text-center text-xs text-gray-500">{googleMessage}</p>
          )}

          <button
            type="button"
            onClick={() => router.push("/workspace")}
            className="mt-4 w-full text-center text-sm font-semibold text-brand-primary transition hover:text-brand-primary-light"
          >
            Sign in with your organisation email
          </button>

          <p className="mt-3 text-center text-sm text-gray-500">
            Prefer email?{" "}
            <Link
              href="/login/email"
              className="font-semibold text-brand-primary underline underline-offset-2 hover:text-brand-primary-light"
            >
              Sign in with email
            </Link>
          </p>

          <p className="mt-7 text-center text-xs leading-relaxed text-gray-400">
            By continuing, you agree to the{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-gray-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-gray-600">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Footer checks — Jobbyo style */}
        <ul className="mt-10 flex flex-nowrap items-center justify-center gap-4 text-[11px] text-white/85 animate-fade-up-delay-2 sm:mt-12 sm:gap-8 sm:text-sm">
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

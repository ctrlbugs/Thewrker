"use client";

import {
  FormEvent,
  KeyboardEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BrandLogo from "@/components/brand-logo";
import { ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

function maskEmail(value: string) {
  const [user, domain] = value.split("@");
  if (!user || !domain) return value;
  if (user.length <= 2) return `${user[0] || "*"}***@${domain}`;
  return `${user.slice(0, 2)}${"•".repeat(Math.min(user.length - 2, 4))}@${domain}`;
}

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim() || "";
  const slug = searchParams.get("slug")?.trim() || "";

  const orgLabel = useMemo(
    () =>
      slug
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
    [slug]
  );

  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: CODE_LENGTH }, () => "")
  );
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join("");
  const isComplete = code.length === CODE_LENGTH;

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const updateDigit = useCallback((index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    const chars = clean.split("");
    setDigits((prev) => {
      const next = [...prev];
      let cursor = index;
      for (const char of chars) {
        if (cursor >= CODE_LENGTH) break;
        next[cursor] = char;
        cursor += 1;
      }
      return next;
    });

    const nextIndex = Math.min(index + chars.length, CODE_LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();
    setError("");
    setStatus("idle");
  }, []);

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setDigits((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array.from({ length: CODE_LENGTH }, (_, i) => pasted[i] || "");
    setDigits(next);
    setError("");
    setStatus("idle");
    const focusAt = Math.min(pasted.length, CODE_LENGTH) - 1;
    inputsRef.current[Math.max(focusAt, 0)]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isComplete) {
      setError("Enter the 6-digit code from your email.");
      inputsRef.current[code.length]?.focus();
      return;
    }

    setLoading(true);
    // Stub — backend OTP verification lands later
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setStatus("success");
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    setError("");
    setStatus("idle");
    setResendIn(RESEND_SECONDS);
    setDigits(Array.from({ length: CODE_LENGTH }, () => ""));
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f5f8] text-gray-900">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(33,56,107,0.12), transparent 55%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-8 sm:py-12">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/login" aria-label="TheWrker home">
            <BrandLogo size="md" variant="dark" />
          </Link>
          <button
            type="button"
            onClick={() => router.push("/workspace")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748b] transition hover:text-[#21386B]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
        </div>

        <div className="mx-auto w-full max-w-[420px] animate-fade-up rounded-2xl border border-[#e6ebf2] bg-white p-6 shadow-[0_18px_50px_rgba(33,56,107,0.08)] sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef2f8] text-[#21386B] ring-1 ring-[#21386B]/10">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#76bec5]">
              Secure verification
            </p>
            <h1 className="mt-2 text-[1.65rem] font-bold tracking-tight text-[#152447] sm:text-[1.85rem]">
              Check your email
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#64748b]">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-[#21386B]">
                {email ? maskEmail(email) : "your work email"}
              </span>
              {orgLabel ? (
                <>
                  {" "}
                  for <span className="font-semibold text-[#334155]">{orgLabel}</span>
                </>
              ) : null}
              .
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error ? (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-center text-sm text-red-700"
              >
                {error}
              </div>
            ) : null}

            {status === "success" ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-[#76bec5]/35 bg-[#eef9fa] px-3.5 py-3 text-left text-sm text-[#1f5f66]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  Code accepted on the frontend. Email delivery and verification
                  will connect next.
                </span>
              </div>
            ) : null}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-semibold text-[#334155]">
                  Verification code
                </label>
                <span className="text-xs text-[#94a3b8]">Expires in 10 min</span>
              </div>

              <div className="flex justify-between gap-2 sm:gap-2.5">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputsRef.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    aria-label={`Digit ${index + 1}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => updateDigit(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={(e) => e.target.select()}
                    className="h-12 w-10 rounded-xl border border-[#d8dee8] bg-[#fbfcfe] text-center text-lg font-semibold text-[#152447] outline-none transition focus:border-[#21386B] focus:bg-white focus:ring-2 focus:ring-[#21386B]/15 sm:h-14 sm:w-12 sm:text-xl"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isComplete}
              aria-busy={loading}
              className="flex h-[3.15rem] w-full items-center justify-center rounded-xl bg-[#1a2d56] px-4 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(33,56,107,0.22)] transition-all duration-200 ease-out hover:bg-[#152447] hover:shadow-[0_10px_26px_rgba(33,56,107,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#93a0b8] disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" aria-hidden />
              ) : (
                "Verify & continue"
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-[#eef1f5] pt-5 text-center">
            <p className="text-sm text-[#64748b]">
              Didn&apos;t get a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendIn > 0}
                className="font-semibold text-[#21386B] transition hover:text-[#152447] disabled:cursor-not-allowed disabled:text-[#94a3b8]"
              >
                {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
              </button>
            </p>
            {email ? (
              <p className="mt-2 text-xs text-[#94a3b8]">
                Sent to {email}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[420px] space-y-3 text-center text-sm text-[#64748b]">
          <p>
            Wrong email?{" "}
            <Link
              href="/workspace"
              className="font-semibold text-[#21386B] hover:underline"
            >
              Use a different address
            </Link>
          </p>
          <p>
            Signing in as an individual?{" "}
            <Link
              href="/login/email"
              className="font-semibold text-[#21386B] hover:underline"
            >
              Sign in with email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WorkspaceOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f3f5f8] text-sm text-[#64748b]">
          Loading verification…
        </div>
      }
    >
      <OtpForm />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles, Upload } from "lucide-react";
import ResumeBuilder from "@/components/resume-builder";
import "@/app/careeros.css";

function BuilderInner() {
  const params = useSearchParams();
  const imported = params.get("imported") === "1";

  return (
    <div className="cos-root space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/careeros"
          className="inline-flex items-center text-sm font-medium text-[#5b6b85] transition hover:text-brand-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          CareerOS
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {imported && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5f7] px-3 py-1 text-xs font-bold text-[#2f7f88]">
              <Sparkles className="h-3.5 w-3.5" />
              Import ready — refine your story
            </span>
          )}
          <Link
            href="/dashboard/careeros/resume"
            className="cos-btn cos-btn--ghost"
          >
            <Upload className="h-4 w-4" />
            Re-import
          </Link>
        </div>
      </div>
      <ResumeBuilder />
    </div>
  );
}

export default function CareerOSBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-secondary border-t-transparent" />
        </div>
      }
    >
      <BuilderInner />
    </Suspense>
  );
}

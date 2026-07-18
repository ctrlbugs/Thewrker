import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import "@/app/careeros.css";

export default function AcademyPage() {
  return (
    <div className="cos-root space-y-6">
      <section className="cos-card px-6 py-8 sm:px-8">
        <Link
          href="/dashboard/careeros"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f6b63] transition hover:text-[#0b524c]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CareerOS
        </Link>

        <div className="mt-6 flex items-start gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff4e5] text-[#c27803]">
            <GraduationCap className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
              TheWrker Academy ⭐
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#64748b]">
              Master in-demand skills through expert-led courses, practical projects,
              and professional certifications that prepare you for real-world careers.
            </p>
            <p className="mt-5 text-sm font-medium text-[#94a3b8]">
              Courses and certifications are coming soon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

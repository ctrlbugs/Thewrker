import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  FileText,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import "@/app/careeros.css";

const pillars = [
  {
    name: "Job Search",
    description:
      "Split-pane discovery with live match scores, filters, and apply actions — built for focus.",
    href: "/dashboard/careeros/jobs",
    icon: Briefcase,
    cta: "Open job search",
    tone: "bg-[#e6f5f3] text-[#0f6b63]",
  },
  {
    name: "Resume Builder",
    description:
      "Start by uploading your resume, then refine with live preview, section control, and AI bullets.",
    href: "/dashboard/careeros/resume",
    icon: FileText,
    cta: "Import resume",
    tone: "bg-[#eef3ff] text-[#3b5bdb]",
  },
  {
    name: "TheWrker Academy ⭐",
    description:
      "Master in-demand skills through expert-led courses, practical projects, and professional certifications that prepare you for real-world careers.",
    href: "/dashboard/careeros/academy",
    icon: GraduationCap,
    cta: "Explore Academy",
    tone: "bg-[#fff4e5] text-[#c27803]",
  },
  {
    name: "Resume Editor",
    description:
      "Refine sections, preview, and export — after a single clean import step.",
    href: "/dashboard/careeros/builder",
    icon: Sparkles,
    cta: "Open editor",
    tone: "bg-[#f3e8ff] text-[#7c3aed]",
  },
];

export default function CareerOSPage() {
  return (
    <div className="cos-root space-y-6">
      <section className="cos-card overflow-hidden">
        <div className="relative px-6 py-7 sm:px-8 sm:py-9">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(15,107,99,0.14),transparent_68%)]"
            aria-hidden
          />
          <span className="inline-flex rounded-full bg-[#e6f5f3] px-3 py-1 text-xs font-bold text-[#0f6b63]">
            CareerOS
          </span>
          <h1 className="mt-3 max-w-2xl text-[clamp(1.7rem,3.5vw,2.4rem)] font-bold tracking-tight text-[#0f172a]">
            Your career, powered by one calm workspace
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#64748b]">
            Search smarter, build resumes that sound like you, and match every
            application with clarity — then return to Studios without switching tools.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/careeros/jobs"
              className="cos-btn cos-btn--primary cos-btn--equal"
            >
              Browse jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/careeros/resume"
              className="cos-btn cos-btn--ghost cos-btn--equal"
            >
              Upload resume
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {pillars.map(({ name, description, href, icon: Icon, cta, tone }) => (
          <Link
            key={name}
            href={href}
            className="cos-card group block p-6 no-underline transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-[#0f172a]">{name}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#64748b]">
              {description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#0f6b63]">
              {cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

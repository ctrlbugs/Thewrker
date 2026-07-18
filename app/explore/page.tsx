import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import AnimatedStats from "@/components/animated-stats";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  Instagram,
  Linkedin,
  Shield,
  Twitter,
  Users,
  Youtube,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Explore TheWrker",
  description:
    "Train, get hired, and work remotely with TheWrker — the digital workspace and job search platform.",
  alternates: { canonical: "/explore" },
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary/5 via-brand-secondary/10 to-brand-primary/5 px-4 pb-0 pt-24 sm:px-6 sm:pt-32 lg:px-8">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 translate-x-1/3 rounded-full bg-gradient-to-br from-[#76BEC5]/30 via-transparent to-[#76BEC5]/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tr from-[#21386B]/30 via-transparent to-[#76BEC5]/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Train. Get hired.{" "}
                <span className="text-brand-secondary">Work remotely.</span>
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-gray-700">
                TheWrker is a remote workforce platform that trains, verifies, and connects
                professionals to global jobs. Build skills, prove your expertise, and land
                your next remote opportunity.
              </p>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-secondary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-secondary/30 transition hover:bg-brand-secondary/90"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-brand-primary shadow-md transition hover:bg-gray-50"
                >
                  Sign In
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 sm:justify-start sm:gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span>1,500+ Active Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-brand-secondary" />
                  <span>Certified Talent</span>
                </div>
              </div>
            </div>
            <div className="relative mt-8 hidden lg:mt-16 lg:block">
              <Image
                src="/images/cs4.png"
                alt="TheWrker professional at work"
                width={2800}
                height={2800}
                className="h-auto w-full rounded-2xl object-cover"
                priority
              />
            </div>
            <div className="mb-4 mt-8 flex justify-center lg:hidden">
              <Image
                src="/images/cs4.png"
                alt="TheWrker professional at work"
                width={600}
                height={600}
                className="h-auto w-full max-w-md rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <AnimatedStats />

      <section id="how-it-works" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              From training to your next remote role — one clear path.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Train",
                text: "Build job-ready skills with guided tracks designed for remote work.",
              },
              {
                icon: Shield,
                title: "Get Verified",
                text: "Earn badges that prove what you can do — no inflated CVs required.",
              },
              {
                icon: Briefcase,
                title: "Get Hired",
                text: "Match with global employers looking for verified TheWrker talent.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10">
                  <Icon className="h-7 w-7 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Find a job faster</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Browse roles, apply in one click, and move from verified to hired.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Zap, title: "Browse roles", text: "Discover remote opportunities matched to your skills." },
              { icon: CheckCircle, title: "One-click apply", text: "Use your TheWrker profile to apply without friction." },
              { icon: Users, title: "Hired fast", text: "Stand out with verified badges employers trust." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <Icon className="mb-4 h-6 w-6 text-brand-secondary" />
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center rounded-lg bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary/90"
            >
              Browse Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-primary px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            The future of Workspace and Job Searching Made Simple
          </h2>
          <p className="mt-4 text-blue-100">
            Join TheWrker — digital work, organisation workspaces, and career growth in one place.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-brand-secondary px-8 py-4 font-semibold text-white transition hover:bg-brand-secondary/90"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#162a4f] px-4 py-12 text-blue-100 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/logo-white.png" alt="theWRKER" className="h-9 w-auto" />
          </div>
          <div className="flex gap-4">
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-white">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-white">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-white">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="hover:text-white">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
          <p className="text-sm text-blue-200/70">© {new Date().getFullYear()} TheWrker</p>
        </div>
      </footer>
    </div>
  );
}

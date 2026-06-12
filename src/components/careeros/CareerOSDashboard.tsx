"use client";



import Link from "next/link";

import CareerDNACard from "./CareerDNACard";

import { useCareerOSContext } from "./CareerOSProvider";

import { APPLICATION_STAGES, CAREER_LEVELS } from "@/lib/careeros/types";



const QUICK_LINKS = [

  { label: "Upload & upgrade CV", href: "/careeros/resume", icon: "📄" },

  { label: "Search jobs", href: "/careeros/opportunities", icon: "🔍" },

  { label: "Scholarships", href: "/careeros/scholarships", icon: "🎓" },

  { label: "Bootcamps", href: "/careeros/bootcamps", icon: "🚀" },

  { label: "Upskill roadmap", href: "/careeros/upskill", icon: "📈" },

  { label: "Track applications", href: "/careeros/applications", icon: "📋" },

];



export default function CareerOSDashboard() {

  const { state } = useCareerOSContext();

  const { profile, applications, reminders } = state;



  const stageCounts = APPLICATION_STAGES.map((stage) => ({

    ...stage,

    count: applications.filter((app) => app.stage === stage.id).length,

  }));



  const upcomingReminders = reminders

    .filter((item) => !item.completed)

    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))

    .slice(0, 5);



  const recentApps = [...applications]

    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

    .slice(0, 5);



  const levelLabel = CAREER_LEVELS.find((l) => l.id === profile.level)?.label ?? profile.level;



  return (

    <div className="space-y-5">

      <div className="pd-careeros-hero">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="pd-careeros-kicker">The Operating System For Career Growth</p>

            <h3 className="pd-careeros-hero-title mt-1">

              {profile.name.trim() ? `Welcome back, ${profile.name}` : "Your career command center"}

            </h3>

            <p className="pd-careeros-hero-text mt-2 max-w-2xl">

              Analyze your profile, upgrade your CV, match jobs and scholarships, build a learning roadmap,

              and land your next opportunity — all in one place.

            </p>

          </div>

          <div className="pd-careeros-level-badge">

            <p className="pd-careeros-hero-muted">Career level</p>

            <p className="pd-careeros-hero-title text-2xl">{levelLabel}</p>

            {profile.careerDNA && (

              <p className="pd-careeros-hero-muted mt-1 text-xs">

                {profile.careerDNA.levelConfidence}% confidence

              </p>

            )}

          </div>

        </div>

      </div>



      {profile.careerDNA ? (

        <CareerDNACard dna={profile.careerDNA} />

      ) : (

        <div className="pd-careeros-flow-hero">

          <p className="pd-careeros-kicker">Get started</p>

          <h3 className="pd-careeros-section-title mt-1">Upload your CV to unlock Career DNA</h3>

          <p className="pd-careeros-muted mt-2 max-w-xl">

            CareerOS will detect your level, industry, skills, and role — then personalize jobs, scholarships,

            bootcamps, and your upskill roadmap.

          </p>

          <Link href="/careeros/resume" className="pd-btn-primary mt-4 inline-flex items-center px-5 py-2.5 text-sm">

            Go to Resume Lab

          </Link>

        </div>

      )}



      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

        {stageCounts.map((stage) => (

          <div key={stage.id} className="pd-careeros-stat-card">

            <p className="body-secondary-info-14pt">{stage.label}</p>

            <p className="text-22-bold" style={{ color: stage.color }}>

              {stage.count}

            </p>

          </div>

        ))}

      </div>



      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        <div className="pd-workspace-card p-5 lg:col-span-2">

          <p className="body-emphasized-14pt mb-3">Quick actions</p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {QUICK_LINKS.map((link) => (

              <Link key={link.href} href={link.href} className="pd-careeros-quick-link">

                <span aria-hidden>{link.icon}</span>

                <span className="body-emphasized-14pt">{link.label}</span>

              </Link>

            ))}

          </div>

        </div>



        <div className="pd-workspace-card p-5">

          <p className="body-emphasized-14pt mb-3">Reminders</p>

          {upcomingReminders.length === 0 ? (

            <p className="body-secondary-info-14pt">No follow-ups scheduled yet.</p>

          ) : (

            <ul className="space-y-2">

              {upcomingReminders.map((item) => (

                <li key={item.id} className="rounded-xl bg-page-bg px-3 py-2">

                  <p className="body-emphasized-14pt">{item.title}</p>

                  <p className="body-secondary-info-14pt">

                    {new Date(item.dueAt).toLocaleDateString()}

                  </p>

                </li>

              ))}

            </ul>

          )}

        </div>

      </div>



      <div className="pd-workspace-card p-5">

        <p className="body-emphasized-14pt mb-3">Recent applications</p>

        {recentApps.length === 0 ? (

          <p className="body-secondary-info-14pt">

            No applications yet.{" "}

            <Link href="/careeros/opportunities" className="font-semibold text-primary underline-offset-2 hover:underline">

              Search jobs

            </Link>

          </p>

        ) : (

          <ul className="space-y-3">

            {recentApps.map((app) => (

              <li

                key={app.id}

                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-page-bg px-4 py-3"

              >

                <div className="min-w-0">

                  <p className="body-emphasized-14pt truncate">{app.role}</p>

                  <p className="body-secondary-info-14pt truncate">{app.company}</p>

                </div>

                <div className="flex items-center gap-2">

                  {app.compatibilityScore && (

                    <span className="pd-careeros-match-badge pd-careeros-match-badge--sm">

                      {app.compatibilityScore}%

                    </span>

                  )}

                  <span className="pd-careeros-stage-pill capitalize">{app.stage}</span>

                </div>

              </li>

            ))}

          </ul>

        )}

      </div>

    </div>

  );

}



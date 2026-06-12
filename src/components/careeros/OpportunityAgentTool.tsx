"use client";



import { useState } from "react";

import ActionButton from "@/components/ui/ActionButton";

import OperationStatus from "@/components/ui/OperationStatus";

import { useAsyncTask } from "@/hooks/useAsyncTask";

import { useApiIntegrations } from "@/hooks/useApiIntegrations";

import { discoverOpportunities, type RemoteOpportunity } from "@/lib/api/careeros-client";

import { JOB_BOARDS } from "@/lib/careeros/job-boards";

import {

  CAREER_LEVELS,

  DEFAULT_JOB_FILTERS,

  EMPLOYMENT_TYPES,

  INDUSTRY_NICHES,

} from "@/lib/careeros/types";

import type { CareerLevel, EmploymentType, IndustryNiche, JobSearchFilters, WorkMode } from "@/lib/careeros/types";

import { useCareerOSContext } from "./CareerOSProvider";



export default function OpportunityAgentTool() {

  const task = useAsyncTask();

  const { status: apiStatus } = useApiIntegrations();

  const { state, upsertApplication } = useCareerOSContext();

  const { profile } = state;

  const [filters, setFilters] = useState<JobSearchFilters>({

    ...DEFAULT_JOB_FILTERS,

    experienceLevels: profile.level ? [profile.level] : [],

    query: profile.headline,

  });

  const [opportunities, setOpportunities] = useState<RemoteOpportunity[]>([]);

  const [message, setMessage] = useState("");

  const [showFilters, setShowFilters] = useState(false);



  const toggleEmployment = (type: EmploymentType) => {

    setFilters((f) => ({

      ...f,

      employmentTypes: f.employmentTypes.includes(type)

        ? f.employmentTypes.filter((t) => t !== type)

        : [...f.employmentTypes, type],

    }));

  };



  const toggleLevel = (level: CareerLevel) => {

    setFilters((f) => ({

      ...f,

      experienceLevels: f.experienceLevels.includes(level)

        ? f.experienceLevels.filter((l) => l !== level)

        : [...f.experienceLevels, level],

    }));

  };



  const discover = async () => {

    await task.run("Searching jobs...", async (update) => {

      if (!apiStatus.serpapi) {

        throw new Error("Job discovery isn't available right now. Please try again later.");

      }



      update(25, "Matching roles to your Career DNA...");

      const level = filters.experienceLevels[0] ?? profile.level;

      const result = await discoverOpportunities({

        headline: profile.headline,

        skills: profile.skills,

        level,

        workMode: filters.workMode,

        employmentTypes: filters.employmentTypes,

        industry: filters.industry,

        location: filters.location,

        query: filters.query,

        resumeText: profile.resumeText,

      });

      update(100, "Done.");

      setOpportunities(result.opportunities);

      setMessage(

        result.opportunities.length > 0

          ? `Found ${result.opportunities.length} matches across ${JOB_BOARDS.length} job sources.`

          : "No matches found. Try broadening filters or updating your Resume Lab profile.",

      );

    });

  };



  const saveToTracker = (opp: RemoteOpportunity) => {

    const now = new Date().toISOString();

    upsertApplication({

      id: crypto.randomUUID(),

      company: opp.company,

      role: opp.title,

      location: filters.workMode === "remote" ? "Remote" : filters.location || "Hybrid",

      workMode: filters.workMode,

      jobDescription: opp.snippet,

      stage: "saved",

      notes: "Discovered by Opportunity Agent",

      compatibilityScore: opp.matchScore,

      url: opp.url,

      createdAt: now,

      updatedAt: now,

    });

    setMessage(`Saved "${opp.title}" to Application Tracker.`);

  };



  return (

    <div className="space-y-6">

      <div className="pd-careeros-flow-hero">

        <p className="pd-careeros-kicker">Intelligent Job Matching</p>

        <h2 className="pd-careeros-section-title mt-1">Find what&apos;s next</h2>

        <p className="pd-careeros-muted mt-2 max-w-2xl">

          CareerOS maps your CV to the right roles and searches across LinkedIn, Wellfound, Remote OK, and more —

          ranked by match score.

        </p>

      </div>



      <div className="pd-careeros-search-bar">

        <div className="pd-careeros-search-field flex-1">

          <span aria-hidden className="opacity-50">

            🔍

          </span>

          <input

            className="w-full border-0 bg-transparent outline-none"

            placeholder="Job title or role"

            value={filters.query}

            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}

          />

        </div>

        <div className="pd-careeros-search-divider" />

        <div className="pd-careeros-search-field flex-1">

          <span aria-hidden className="opacity-50">

            📍

          </span>

          <input

            className="w-full border-0 bg-transparent outline-none"

            placeholder="Location (optional)"

            value={filters.location}

            onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}

          />

        </div>

        <ActionButton loading={task.active} onClick={discover}>

          Search

        </ActionButton>

      </div>



      <div className="flex flex-wrap items-center gap-3">

        <select

          className="pd-input min-w-[120px]"

          value={filters.workMode}

          onChange={(e) => setFilters((f) => ({ ...f, workMode: e.target.value as WorkMode }))}

        >

          <option value="remote">Remote</option>

          <option value="hybrid">Hybrid</option>

          <option value="onsite">On-site</option>

        </select>

        <button

          type="button"

          className="pd-careeros-filter-btn"

          onClick={() => setShowFilters((v) => !v)}

        >

          Filters {showFilters ? "▲" : "▼"}

        </button>

        {profile.careerDNA && (

          <span className="pd-careeros-stage-pill capitalize">

            {profile.careerDNA.careerLevel} · {profile.careerDNA.role}

          </span>

        )}

      </div>



      {showFilters && (

        <div className="pd-careeros-filter-panel space-y-5">

          <div>

            <p className="body-emphasized-14pt mb-2">Experience level</p>

            <div className="flex flex-wrap gap-2">

              {CAREER_LEVELS.map((level) => (

                <button

                  key={level.id}

                  type="button"

                  className={`pd-careeros-filter-pill ${filters.experienceLevels.includes(level.id) ? "pd-careeros-filter-pill--active" : ""}`}

                  onClick={() => toggleLevel(level.id)}

                >

                  {level.label}

                </button>

              ))}

            </div>

          </div>



          <div>

            <p className="body-emphasized-14pt mb-2">Employment type</p>

            <div className="flex flex-wrap gap-2">

              {EMPLOYMENT_TYPES.map((type) => (

                <button

                  key={type.id}

                  type="button"

                  className={`pd-careeros-filter-pill ${filters.employmentTypes.includes(type.id) ? "pd-careeros-filter-pill--active" : ""}`}

                  onClick={() => toggleEmployment(type.id)}

                >

                  {type.label}

                </button>

              ))}

            </div>

          </div>



          <div>

            <p className="body-emphasized-14pt mb-2">Industry</p>

            <select

              className="pd-input max-w-xs"

              value={filters.industry}

              onChange={(e) =>

                setFilters((f) => ({ ...f, industry: e.target.value as IndustryNiche | "all" }))

              }

            >

              <option value="all">All industries</option>

              {INDUSTRY_NICHES.map((n) => (

                <option key={n.id} value={n.id}>

                  {n.label}

                </option>

              ))}

            </select>

          </div>

        </div>

      )}



      <OperationStatus

        active={task.active}

        progress={task.progress}

        message={task.message}

        error={task.error}

      />



      {message && !task.active && <p className="body-regular-14">{message}</p>}



      {opportunities.length > 0 && (

        <ul className="space-y-3">

          {opportunities.map((opp) => (

            <li key={opp.id} className="pd-careeros-job-card">

              <div className="mb-2 flex flex-wrap items-start justify-between gap-3">

                <div className="min-w-0">

                  <p className="pd-careeros-job-title">{opp.title}</p>

                  <p className="pd-careeros-muted">{opp.company}</p>

                </div>

                <div className="flex flex-wrap items-center gap-2">

                  {typeof opp.matchScore === "number" && (

                    <span className="pd-careeros-match-badge pd-careeros-match-badge--sm">

                      {opp.matchScore}% match

                    </span>

                  )}

                  <span className="pd-careeros-stage-pill">{opp.source}</span>

                </div>

              </div>

              <p className="body-regular-14 mb-4 text-slate-600">{opp.snippet}</p>

              <div className="flex flex-wrap gap-2">

                <ActionButton variant="secondary" onClick={() => saveToTracker(opp)}>

                  Save

                </ActionButton>

                <a

                  href={opp.url}

                  target="_blank"

                  rel="noopener noreferrer"

                  className="pd-btn-primary inline-flex items-center px-4 py-2 text-sm"

                >

                  Apply

                </a>

              </div>

            </li>

          ))}

        </ul>

      )}



      <div className="pd-workspace-card p-5">

        <p className="body-emphasized-14pt mb-3">Job sources we search</p>

        <div className="flex flex-wrap gap-2">

          {JOB_BOARDS.map((board) => (

            <a

              key={board.id}

              href={board.url}

              target="_blank"

              rel="noopener noreferrer"

              className="pd-careeros-board-pill"

              title={board.focus}

            >

              {board.name}

            </a>

          ))}

        </div>

      </div>

    </div>

  );

}



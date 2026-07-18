"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  CheckCircle2,
  ExternalLink,
  FilePlus2,
  Filter,
  Info,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Share2,
  SlidersHorizontal,
  X,
  XCircle,
} from "lucide-react";
import { CAREER_JOBS, type CareerJob } from "@/lib/careeros/jobs-data";
import { cn } from "@/lib/utils";
import "@/app/careeros.css";

function MatchGauge({ score }: { score: number }) {
  return (
    <div className="cos-match">
      <div className="cos-match-ring" style={{ ["--p" as string]: score }}>
        <span>{score}%</span>
      </div>
      <p className="text-[11px] font-semibold text-brand-primary">Match</p>
    </div>
  );
}

function SkillStatus({ status }: { status: CareerJob["skills"][number]["status"] }) {
  if (status === "match") {
    return (
      <span className="cos-status cos-status--match">
        <CheckCircle2 className="h-3.5 w-3.5" /> Match
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className="cos-status cos-status--partial">
        <Info className="h-3.5 w-3.5" /> Partial
      </span>
    );
  }
  return (
    <span className="cos-status cos-status--missing">
      <XCircle className="h-3.5 w-3.5" /> Missing
    </span>
  );
}

export default function JobSearchWorkspace() {
  const [query, setQuery] = useState("frontend");
  const [location, setLocation] = useState("Remote");
  const [remoteOnly, setRemoteOnly] = useState(true);
  const [draftQuery, setDraftQuery] = useState("frontend");
  const [draftLocation, setDraftLocation] = useState("Remote");
  const [jobs, setJobs] = useState<CareerJob[]>(CAREER_JOBS);
  const [selectedId, setSelectedId] = useState(CAREER_JOBS[0]?.id ?? "");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [mobilePane, setMobilePane] = useState<"list" | "detail">("list");

  const runSearch = useCallback(async (q: string, loc: string, remote: boolean) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      params.set("limit", "50");
      const res = await fetch(`/api/jobs/live?${params.toString()}`);
      const data = (await res.json()) as {
        jobs: CareerJob[];
        live?: boolean;
      };
      let next = data.jobs || [];
      const locNeedle = loc.trim().toLowerCase();
      if (locNeedle) {
        next = next.filter(
          (j) =>
            j.location.toLowerCase().includes(locNeedle) ||
            j.type.toLowerCase().includes(locNeedle)
        );
      }
      if (remote) next = next.filter((j) => j.type === "Remote");
      setJobs(next);
      setLive(Boolean(data.live));
      setSelectedId(next[0]?.id ?? "");
      if (next[0]) setMobilePane("list");
    } catch {
      setJobs(CAREER_JOBS);
      setLive(false);
      setSelectedId(CAREER_JOBS[0]?.id ?? "");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void runSearch(query, location, remoteOnly);
  }, [query, location, remoteOnly, runSearch]);

  const selected = jobs.find((j) => j.id === selectedId) ?? jobs[0] ?? null;

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setQuery(draftQuery);
    setLocation(draftLocation);
  };

  return (
    <div className="cos-root space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a97ab]">
            CareerOS
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-brand-primary sm:text-2xl">
            Job Search
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#5b6b85]">
            Live roles, instant match signals, and apply actions — all inside TheWrker.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {live ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5f7] px-2.5 py-1 text-[11px] font-bold text-[#2f7f88]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live jobs
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-bold text-[#64748b]">
              Sample feed
            </span>
          )}
          <Link href="/dashboard/careeros/resume" className="cos-btn cos-btn--ghost">
            <FilePlus2 className="h-4 w-4" />
            Resume
          </Link>
        </div>
      </div>

      <section className="cos-card">
        <form onSubmit={submitSearch} className="cos-search-bar">
          <label className="cos-field">
            <Search className="h-4 w-4 shrink-0 text-[#8a97ab]" />
            <input
              value={draftQuery}
              onChange={(e) => setDraftQuery(e.target.value)}
              placeholder="Search by title, skill, or company"
              aria-label="Search jobs"
            />
          </label>
          <label className="cos-field">
            <MapPin className="h-4 w-4 shrink-0 text-[#8a97ab]" />
            <input
              value={draftLocation}
              onChange={(e) => setDraftLocation(e.target.value)}
              placeholder="City, ZIP, or Remote"
              aria-label="Location"
            />
          </label>
          <button type="submit" className="cos-btn cos-btn--primary cos-btn--search">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </button>
        </form>

        <div className="cos-filter-row">
          <button type="button" className="cos-chip cos-chip--muted">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Sort
          </button>
          <button type="button" className="cos-chip cos-chip--muted">
            Date
          </button>
          <button type="button" className="cos-chip cos-chip--muted">
            Salary
          </button>
          {remoteOnly && (
            <button
              type="button"
              className="cos-chip"
              onClick={() => setRemoteOnly(false)}
            >
              Remote
              <X className="h-3 w-3" />
            </button>
          )}
          {!remoteOnly && (
            <button
              type="button"
              className="cos-chip cos-chip--muted"
              onClick={() => setRemoteOnly(true)}
            >
              + Remote
            </button>
          )}
          {query && (
            <button
              type="button"
              className="cos-chip"
              onClick={() => {
                setDraftQuery("");
                setQuery("");
              }}
            >
              {query}
              <X className="h-3 w-3" />
            </button>
          )}
          <button
            type="button"
            className="cos-link-btn ml-auto"
            onClick={() => {
              setDraftQuery("");
              setDraftLocation("");
              setQuery("");
              setLocation("");
              setRemoteOnly(false);
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="cos-chip cos-chip--muted"
            onClick={() => void runSearch(query, location, remoteOnly)}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Update
          </button>
          <button type="button" className="cos-chip cos-chip--muted">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>
      </section>

      {/* Mobile pane switcher */}
      <div className="grid grid-cols-2 gap-2 lg:hidden">
        <button
          type="button"
          className={cn(
            "cos-btn cos-btn--equal",
            mobilePane === "list" ? "cos-btn--primary" : "cos-btn--ghost"
          )}
          onClick={() => setMobilePane("list")}
        >
          Results ({jobs.length})
        </button>
        <button
          type="button"
          className={cn(
            "cos-btn cos-btn--equal",
            mobilePane === "detail" ? "cos-btn--primary" : "cos-btn--ghost"
          )}
          onClick={() => setMobilePane("detail")}
          disabled={!selected}
        >
          Details
        </button>
      </div>

      <div className="cos-workspace">
        <aside
          className={cn(
            "cos-card cos-list",
            mobilePane !== "list" && "hidden lg:flex"
          )}
        >
          <div className="border-b border-[rgba(33,56,107,0.08)] px-4 py-3">
            <p className="text-sm font-semibold text-brand-primary">
              {loading ? "Searching…" : `${jobs.length} roles`}
              {query ? ` for “${query}”` : ""}
            </p>
            <p className="mt-0.5 text-xs text-[#8a97ab]">
              {live
                ? "Live feed · results refresh every few minutes"
                : "Curated sample while live feed reconnects"}
            </p>
          </div>
          <div className="cos-list-scroll">
            {loading && jobs.length === 0 ? (
              <div className="flex items-center justify-center gap-2 px-4 py-16 text-sm text-[#5b6b85]">
                <Loader2 className="h-4 w-4 animate-spin text-brand-secondary" />
                Loading live jobs…
              </div>
            ) : jobs.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-[#5b6b85]">
                No roles match. Clear filters or try another title.
              </div>
            ) : (
              jobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(job.id);
                    setMobilePane("detail");
                  }}
                  className={cn(
                    "cos-job-row",
                    selected?.id === job.id && "is-active"
                  )}
                >
                  <span className="cos-logo">{job.logo}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#21386B]">
                      {job.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-[#5b6b85]">
                      {job.company} · {job.location} · {job.posted}
                    </span>
                    <span className="mt-1 block text-xs font-medium text-[#2f7f88]">
                      {job.salary} · {job.type}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-[#e8f5f7] px-2 py-0.5 text-[11px] font-bold text-[#2f7f88]">
                    {job.matchScore}%
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        <section
          className={cn(
            "cos-card cos-detail",
            mobilePane !== "detail" && "hidden lg:flex"
          )}
        >
          {!selected ? (
            <div className="grid flex-1 place-items-center px-6 text-center">
              <div>
                <p className="text-lg font-semibold text-brand-primary">Select a role</p>
                <p className="mt-1 text-sm text-[#5b6b85]">
                  Choose a job to preview details, match score, and apply.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-[rgba(33,56,107,0.08)] px-4 py-4 sm:px-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold tracking-tight text-brand-primary sm:text-2xl">
                      {selected.title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-[#3d4d68]">
                      {selected.company}
                    </p>
                    <p className="mt-1 text-sm text-[#5b6b85]">
                      {selected.posted} · {selected.salary} · {selected.type} ·{" "}
                      {selected.employment}
                    </p>
                  </div>
                  <MatchGauge score={selected.matchScore} />
                </div>

                <div className="cos-action-row mt-4">
                  {selected.applyUrl ? (
                    <a
                      href={selected.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cos-btn cos-btn--primary cos-btn--equal"
                    >
                      Apply
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <button type="button" className="cos-btn cos-btn--primary cos-btn--equal">
                      Apply
                    </button>
                  )}
                  <button
                    type="button"
                    className="cos-btn cos-btn--ghost cos-btn--equal"
                    onClick={() => toggleSave(selected.id)}
                  >
                    <Bookmark
                      className={cn(
                        "h-4 w-4",
                        saved.has(selected.id) && "fill-current"
                      )}
                    />
                    {saved.has(selected.id) ? "Saved" : "Save job"}
                  </button>
                  <Link
                    href="/dashboard/careeros/resume"
                    className="cos-btn cos-btn--ghost cos-btn--equal"
                  >
                    <FilePlus2 className="h-4 w-4" />
                    Create resume
                  </Link>
                  <button
                    type="button"
                    className="cos-icon-btn"
                    aria-label="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="cos-detail-scroll">
                <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-[#8a97ab]">
                      About the position
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#3d4d68]">
                      {selected.about}
                    </p>

                    <h3 className="mt-7 text-xs font-bold uppercase tracking-[0.1em] text-[#8a97ab]">
                      Requirements
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {selected.requirements.map((req) => (
                        <li
                          key={req}
                          className="flex items-start gap-2.5 text-[15px] text-[#3d4d68]"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <aside className="rounded-2xl border border-[rgba(33,56,107,0.08)] bg-[#f7fafb] p-4">
                    <h3 className="text-sm font-bold text-brand-primary">
                      Resume ↔ Job match
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#5b6b85]">
                      Align skills before you apply. Open Resume Builder to emphasize
                      the right details.
                    </p>
                    <div className="mt-3">
                      {selected.skills.map((skill) => (
                        <div key={skill.name} className="cos-skill">
                          <div>
                            <p className="font-medium text-[#21386B]">{skill.name}</p>
                            <p className="text-[11px] uppercase tracking-wide text-[#8a97ab]">
                              {skill.kind} skill
                            </p>
                          </div>
                          <SkillStatus status={skill.status} />
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/dashboard/careeros/resume"
                      className="cos-btn cos-btn--primary cos-btn--equal mt-4 w-full"
                    >
                      Improve with Resume Builder
                    </Link>
                    {selected.source === "Remotive" && selected.applyUrl && (
                      <p className="mt-3 text-center text-[11px] text-[#8a97ab]">
                        Listing via{" "}
                        <a
                          href={selected.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-brand-primary underline-offset-2 hover:underline"
                        >
                          Remotive
                        </a>
                      </p>
                    )}
                  </aside>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

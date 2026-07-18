import { NextRequest, NextResponse } from "next/server";
import { CAREER_JOBS, type CareerJob, type JobSkill } from "@/lib/careeros/jobs-data";

type RemotiveJob = {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string | null;
  category?: string;
  job_type?: string;
  publication_date?: string;
  candidate_required_location?: string;
  salary?: string;
  description?: string;
  tags?: string[];
};

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

function postedLabel(iso?: string) {
  if (!iso) return "Recently";
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  if (days <= 0) return "Today";
  if (days === 1) return "1d";
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  return `${Math.floor(days / 30)}mo`;
}

function mapJobType(raw?: string, location?: string): CareerJob["type"] {
  const blob = `${raw ?? ""} ${location ?? ""}`.toLowerCase();
  if (blob.includes("hybrid")) return "Hybrid";
  if (blob.includes("on-site") || blob.includes("onsite") || blob.includes("office"))
    return "On-site";
  return "Remote";
}

function buildSkills(tags: string[] = []): JobSkill[] {
  const picked = tags.slice(0, 4);
  if (picked.length === 0) {
    return [
      { name: "Remote Collaboration", kind: "soft", status: "match" },
      { name: "Communication", kind: "soft", status: "match" },
    ];
  }
  return picked.map((tag, i) => ({
    name: tag,
    kind: i % 2 === 0 ? "hard" : "soft",
    status: i === 3 ? "partial" : "match",
  }));
}

function mapRemotive(job: RemotiveJob): CareerJob {
  const plain = stripHtml(job.description || "");
  const about = plain.slice(0, 420) + (plain.length > 420 ? "…" : "");
  const reqLines = plain
    .split(/\. |\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 28 && s.length < 140)
    .slice(0, 4);

  return {
    id: `live-${job.id}`,
    title: job.title,
    company: job.company_name,
    logo: initials(job.company_name || "TW"),
    location: job.candidate_required_location || "Worldwide · Remote",
    posted: postedLabel(job.publication_date),
    salary: job.salary?.trim() || "Competitive",
    type: mapJobType(job.job_type, job.candidate_required_location),
    employment: job.job_type || "Full-time",
    matchScore: 62 + (Math.abs(job.id) % 31),
    about:
      about ||
      `${job.title} at ${job.company_name}. Explore the full role and apply with your CareerOS resume.`,
    requirements:
      reqLines.length > 0
        ? reqLines
        : [
            "Relevant experience for this role",
            "Strong written communication",
            "Comfortable working remotely",
            "Ownership and collaboration mindset",
          ],
    skills: buildSkills(job.tags),
    applyUrl: job.url,
    source: "Remotive",
    logoUrl: job.company_logo || undefined,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(Number(searchParams.get("limit") || 40), 80);

  try {
    const url = new URL("https://remotive.com/api/remote-jobs");
    if (q) url.searchParams.set("search", q);
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`Remotive ${res.status}`);

    const data = (await res.json()) as { jobs?: RemotiveJob[] };
    const live = (data.jobs || []).map(mapRemotive);

    if (live.length === 0) {
      return NextResponse.json({
        jobs: filterFallback(q),
        source: "fallback",
        live: false,
      });
    }

    return NextResponse.json({
      jobs: live,
      source: "remotive",
      live: true,
      attribution: "Jobs via Remotive",
    });
  } catch {
    return NextResponse.json({
      jobs: filterFallback(q),
      source: "fallback",
      live: false,
    });
  }
}

function filterFallback(q: string): CareerJob[] {
  const needle = q.toLowerCase();
  if (!needle) return CAREER_JOBS;
  return CAREER_JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(needle) ||
      j.company.toLowerCase().includes(needle) ||
      j.about.toLowerCase().includes(needle)
  );
}

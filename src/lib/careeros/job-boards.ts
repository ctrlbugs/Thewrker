export interface JobBoard {
  id: string;
  name: string;
  url: string;
  focus: string;
  domains: string[];
}

/** Curated job boards for multi-source discovery */
export const JOB_BOARDS: JobBoard[] = [
  {
    id: "linkedin",
    name: "LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs",
    focus: "Global professional network",
    domains: ["linkedin.com"],
  },
  {
    id: "wellfound",
    name: "Wellfound",
    url: "https://wellfound.com/jobs",
    focus: "Startup & tech roles",
    domains: ["wellfound.com", "angel.co"],
  },
  {
    id: "indeed",
    name: "Indeed",
    url: "https://www.indeed.com",
    focus: "Broad job marketplace",
    domains: ["indeed.com"],
  },
  {
    id: "glassdoor",
    name: "Glassdoor",
    url: "https://www.glassdoor.com/Job",
    focus: "Salary insights & reviews",
    domains: ["glassdoor.com"],
  },
  {
    id: "remoteok",
    name: "Remote OK",
    url: "https://remoteok.com",
    focus: "Remote-first roles",
    domains: ["remoteok.com"],
  },
  {
    id: "weworkremotely",
    name: "We Work Remotely",
    url: "https://weworkremotely.com",
    focus: "Remote jobs",
    domains: ["weworkremotely.com"],
  },
  {
    id: "flexjobs",
    name: "FlexJobs",
    url: "https://www.flexjobs.com",
    focus: "Remote & flexible work",
    domains: ["flexjobs.com"],
  },
  {
    id: "otta",
    name: "Otta",
    url: "https://otta.com",
    focus: "Curated tech startups",
    domains: ["otta.com"],
  },
  {
    id: "himalayas",
    name: "Himalayas",
    url: "https://himalayas.app",
    focus: "Remote jobs worldwide",
    domains: ["himalayas.app"],
  },
  {
    id: "arbeitnow",
    name: "Arbeitnow",
    url: "https://www.arbeitnow.com",
    focus: "Visa sponsorship & remote EU",
    domains: ["arbeitnow.com"],
  },
  {
    id: "jobgether",
    name: "Jobgether",
    url: "https://jobgether.com",
    focus: "Remote & hybrid global",
    domains: ["jobgether.com"],
  },
  {
    id: "remotive",
    name: "Remotive",
    url: "https://remotive.com",
    focus: "Remote tech jobs",
    domains: ["remotive.com"],
  },
];

export function buildJobBoardQuery(baseQuery: string, boardIds?: string[]): string {
  const boards = boardIds?.length
    ? JOB_BOARDS.filter((b) => boardIds.includes(b.id))
    : JOB_BOARDS.slice(0, 6);

  const siteClause = boards.map((b) => `site:${b.domains[0]}`).join(" OR ");
  return `${baseQuery} (${siteClause})`;
}

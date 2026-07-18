export const ORG_PILLARS = [
  {
    id: "structure",
    title: "Organization Structure",
    summary: "Hierarchy, departments, teams, branches, and roles in one place.",
    points: [
      "Organization profile & org chart",
      "Departments, business units & teams",
      "Branch offices & employee directory",
      "HODs, team leads, titles & RBAC",
    ],
  },
  {
    id: "employees",
    title: "Employee Management",
    summary: "Every person, profile, and status from a single dashboard.",
    points: [
      "Profiles, IDs, skills & certifications",
      "Managers, teams & employment status",
      "Attendance, leave & performance",
      "Contact info & directory search",
    ],
  },
  {
    id: "tasks",
    title: "Smart Task Management",
    summary: "Assign work to people or teams with full visibility.",
    points: [
      "Priority, due dates & attachments",
      "Progress, time tracking & comments",
      "Statuses from New to Archived",
      "Activity history & notes",
    ],
  },
  {
    id: "collab",
    title: "Team Collaboration",
    summary: "Chat, channels, files, and mentions without leaving work.",
    points: [
      "Team chat & department channels",
      "DMs, threads & reactions",
      "File, image & voice sharing",
      "Mentions & group discussions",
    ],
  },
  {
    id: "meetings",
    title: "Meetings & Briefings",
    summary: "Schedule, join, and follow up from the same workspace.",
    points: [
      "Meet, Teams & Zoom links",
      "Agenda, notes & attendance",
      "Calendar invites & reminders",
      "Recordings & follow-up tasks",
    ],
  },
  {
    id: "performance",
    title: "Performance & OKRs",
    summary: "Goals, KPIs, and progress that leaders can act on.",
    points: [
      "Company → individual goals",
      "Productivity & KPI dashboards",
      "Reviews, feedback & rankings",
      "Trends and workload views",
    ],
  },
  {
    id: "hr",
    title: "Leave & Attendance",
    summary: "Clock in, request leave, approve, and report cleanly.",
    points: [
      "Clock in/out & timesheets",
      "Leave requests & balances",
      "Manager approvals",
      "Attendance history & reports",
    ],
  },
  {
    id: "files",
    title: "Files & Announcements",
    summary: "Secure documents plus company-wide communication.",
    points: [
      "Shared & department files",
      "Versioning & access control",
      "Approvals & signatures",
      "News, policy & HR updates",
    ],
  },
] as const;

export const ORG_DASHBOARD_PREVIEWS = [
  {
    title: "Employee Dashboard",
    items: [
      "Welcome & today's schedule",
      "My tasks & deadlines",
      "Meetings & calendar",
      "Announcements & leave balance",
      "AI assistant & quick actions",
    ],
  },
  {
    title: "Manager / HOD Dashboard",
    items: [
      "Department overview & KPIs",
      "Team performance & workload",
      "Task assignment & approvals",
      "Meetings & attendance",
      "Reports & recognition",
    ],
  },
  {
    title: "Executive Insights",
    items: [
      "Org-wide productivity",
      "Department comparisons",
      "Project & task health",
      "Engagement trends",
      "Custom executive views",
    ],
  },
] as const;

export const ORG_AI_CAPABILITIES = [
  "Summarize meetings",
  "Generate reports",
  "Create task lists",
  "Draft emails",
  "Suggest deadlines",
  "Answer HR questions",
  "Search company knowledge",
  "Recommend documents",
  "Analyze productivity",
  "Generate meeting minutes",
] as const;

export const ORG_INTEGRATIONS = [
  "Google Workspace",
  "Microsoft 365",
  "Slack",
  "Zoom",
  "Google Meet",
  "Microsoft Teams",
  "Jira",
  "Trello",
  "GitHub",
  "Dropbox",
  "OneDrive",
  "Google Drive",
  "Outlook Calendar",
  "Google Calendar",
] as const;

export const ORG_SECURITY = [
  "Role-Based Access Control",
  "Two-Factor Authentication",
  "Single Sign-On (SSO)",
  "Audit Logs",
  "Activity Monitoring",
  "Data Encryption",
  "Device Management",
  "Backup & Recovery",
] as const;

export const ORG_FUTURE = [
  "AI workload balancing",
  "Predictive performance analytics",
  "Digital onboarding",
  "Recognition & rewards",
  "Learning Management System",
  "Internal job mobility",
  "Company knowledge wiki",
  "No-code workflow automation",
  "Expense management",
  "Asset tracking",
  "Shift scheduling",
  "Payroll & ATS integrations",
  "Engagement & wellness",
  "Native iOS & Android apps",
  "AI meeting transcription",
] as const;

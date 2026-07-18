import Link from "next/link";
import { Briefcase, CheckCircle2, Layers, Sparkles } from "lucide-react";
import { DEV_TOOLS, WORKSPACE_MODULES } from "@/lib/workspace-data";

const stats = [
  {
    title: "Total Studios",
    value: String(WORKSPACE_MODULES.length),
    badge: `${WORKSPACE_MODULES.length} ready`,
    href: "#quick-start",
    icon: Layers,
    tone: "teal",
  },
  {
    title: "Dev Tools",
    value: String(DEV_TOOLS.length),
    badge: "On demand",
    href: "#devtools",
    icon: Sparkles,
    tone: "gold",
  },
  {
    title: "CareerOS",
    value: "Live",
    badge: "Jobs & resume",
    href: "/dashboard/careeros",
    icon: Briefcase,
    tone: "blue",
  },
  {
    title: "AI Assist",
    value: "Ready",
    badge: "In-browser",
    href: "/dashboard/studios/ai",
    icon: CheckCircle2,
    tone: "purple",
  },
] as const;

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const inner = (
          <article className={`ws-stat-velonic ws-stat-velonic--${stat.tone}`}>
            <div className="ws-stat-velonic-body">
              <p className="ws-stat-velonic-title">{stat.title}</p>
              <p className="ws-stat-velonic-value">{stat.value}</p>
              <span className="ws-stat-velonic-badge">{stat.badge}</span>
            </div>
            <div className="ws-stat-velonic-aside" aria-hidden>
              <span className="ws-stat-velonic-icon">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </span>
            </div>
          </article>
        );

        if (stat.href.startsWith("#")) {
          return (
            <a key={stat.title} href={stat.href} className="block no-underline">
              {inner}
            </a>
          );
        }

        return (
          <Link key={stat.title} href={stat.href} className="block no-underline">
            {inner}
          </Link>
        );
      })}
    </div>
  );
}

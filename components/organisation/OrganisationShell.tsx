"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  RotateCcw,
} from "lucide-react";
import { ORG_NAV } from "@/lib/organisation/nav";
import { useOrganisation } from "@/lib/organisation/store";
import { cn } from "@/lib/utils";
import "@/app/organisation.css";

export default function OrganisationShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { me, unreadCount, state, switchUser, resetDemo, markAllNotificationsRead } =
    useOrganisation();

  return (
    <div className="org-root org-app">
      <header className="org-card org-app-header">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <span className="org-feature-icon !mb-0 !h-10 !w-10">
            <Building2 className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8a97ab]">
              Organisation HQ
            </p>
            <h1 className="truncate text-lg font-bold text-[#21386B]">
              Welcome, {me.firstName}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-[rgba(33,56,107,0.1)] bg-[#f7fafb] px-3 py-2 text-xs font-semibold text-[#5b6b85]">
            Act as
            <select
              value={me.id}
              onChange={(e) => switchUser(e.target.value)}
              className="bg-transparent text-sm font-bold text-[#21386B] outline-none"
            >
              {state.employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName}
                  {e.isManager ? " (Manager)" : ""}
                </option>
              ))}
            </select>
          </label>

          <Link
            href="/dashboard/organisation"
            className="org-icon-pill"
            title="Notifications"
            onClick={() => markAllNotificationsRead()}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && <span className="org-badge-count">{unreadCount}</span>}
          </Link>

          <button
            type="button"
            onClick={resetDemo}
            className="org-btn org-btn--ghost !min-h-10 !px-3 text-xs"
            title="Reset demo data"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </header>

      <nav className="org-card org-subnav" aria-label="Organisation modules">
        <div className="org-subnav-track">
          {ORG_NAV.map((item) => {
            const active =
              item.href === "/dashboard/organisation"
                ? pathname === item.href
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("org-subnav-link", active && "is-active")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="org-app-body">{children}</div>
    </div>
  );
}

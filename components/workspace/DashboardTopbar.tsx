"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, LogOut, Menu, Moon, Search, Sparkles, Sun, UserRound } from "lucide-react";
import { DEV_TOOLS, WORKSPACE_MODULES } from "@/lib/workspace-data";
import { searchProfiles } from "@/lib/profile/store";
import { cn } from "@/lib/utils";
import { useDashboardUiOptional } from "./dashboard-ui-context";

type DashboardTopbarProps = {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  sidebarCollapsed?: boolean;
  onMenuClick: () => void;
  onLogout: () => void;
};

function pageTitle(pathname: string | null) {
  if (!pathname) return "Workspace";
  if (pathname === "/dashboard") return "Overview";
  if (pathname.startsWith("/dashboard/careeros/jobs")) return "Job Search";
  if (pathname.startsWith("/dashboard/careeros/resume")) return "Import Resume";
  if (pathname.startsWith("/dashboard/careeros/builder")) return "Resume Builder";
  if (pathname.startsWith("/dashboard/careeros")) return "CareerOS";
  if (pathname.startsWith("/dashboard/talent/profile")) return "Profile";
  if (pathname.startsWith("/dashboard/trainee/profile")) return "Profile";
  if (pathname?.startsWith("/dashboard/organisation/tasks")) return "Org Tasks";
  if (pathname?.startsWith("/dashboard/organisation/directory")) return "Directory";
  if (pathname?.startsWith("/dashboard/organisation/leave")) return "Leave";
  if (pathname?.startsWith("/dashboard/organisation/meetings")) return "Meetings";
  if (pathname?.startsWith("/dashboard/organisation/chat")) return "Team Chat";
  if (pathname?.startsWith("/dashboard/organisation/structure")) return "Org Structure";
  if (pathname?.startsWith("/dashboard/organisation/performance")) return "Performance";
  if (pathname?.startsWith("/dashboard/organisation/announcements"))
    return "Announcements";
  if (pathname?.startsWith("/dashboard/organisation")) return "Organisation";
  if (pathname?.startsWith("/dashboard/files")) return "Vault";
  if (pathname.includes("/studios/")) {
    const slug = pathname.split("/").pop();
    const mod = WORKSPACE_MODULES.find((m) => m.href.endsWith(`/${slug}`));
    return mod?.title ?? "Studio";
  }
  if (pathname.includes("/tools/")) {
    const slug = pathname.split("/").pop();
    const tool = DEV_TOOLS.find((t) => t.href.endsWith(`/${slug}`));
    return tool?.title ?? "Developer Tool";
  }
  return "Workspace";
}

export default function DashboardTopbar({
  user,
  sidebarCollapsed = false,
  onMenuClick,
  onLogout,
}: DashboardTopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const ui = useDashboardUiOptional();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const studios = WORKSPACE_MODULES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.formats.some((f) => f.toLowerCase().includes(q))
    ).map((m) => ({ type: "Studio" as const, title: m.title, href: m.href }));
    const tools = DEV_TOOLS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    ).map((t) => ({ type: "Tool" as const, title: t.title, href: t.href }));
    const extras = [
      { type: "Workspace" as const, title: "Overview", href: "/dashboard" },
      { type: "Career" as const, title: "CareerOS", href: "/dashboard/careeros" },
      {
        type: "Organisation" as const,
        title: "Organisation",
        href: "/dashboard/organisation",
      },
      { type: "Files" as const, title: "Vault", href: "/dashboard/files" },
      { type: "Organisation" as const, title: "Org Tasks", href: "/dashboard/organisation/tasks" },
      {
        type: "Organisation" as const,
        title: "Directory",
        href: "/dashboard/organisation/directory",
      },
      {
        type: "Profile" as const,
        title: "My Profile",
        href: "/dashboard/talent/profile",
      },
    ].filter((item) => item.title.toLowerCase().includes(q));

    const people = searchProfiles(q)
      .slice(0, 6)
      .map((p) => ({
        type: "People" as const,
        title: `${p.firstName} ${p.lastName}`,
        subtitle: `@${p.username} · ${p.roleLabel}`,
        meta: `${p.followers.length} followers`,
        href: `/u/${p.username}`,
      }));

    const workspace = [...extras, ...studios, ...tools].map((item) => ({
      ...item,
      subtitle: undefined as string | undefined,
      meta: undefined as string | undefined,
    }));

    // People first when query looks like a username / person search
    const personFirst = q.startsWith("@") || !q.includes(" ");
    return personFirst
      ? [...people, ...workspace].slice(0, 10)
      : [...workspace, ...people].slice(0, 10);
  }, [query]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setSearchOpen(false);
        setProfileOpen(false);
        setNotesOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` || "TW";

  return (
    <header className="ds-topbar">
      <div
        ref={rootRef}
        className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8"
      >
        <button
          type="button"
          onClick={onMenuClick}
          className="ds-icon-btn"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ds-muted)]">
            Workspace
          </p>
          <h1 className="truncate text-base font-semibold text-[var(--ds-ink)]">
            {pageTitle(pathname)}
          </h1>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <label className="ds-search">
            <Search className="h-4 w-4 shrink-0 text-[#8a97ab]" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search @username, people, studios…"
              aria-label="Search workspace and people"
            />
          </label>
          {searchOpen && query.trim() && (
            <div className="ds-dropdown ds-search-panel">
              {results.length === 0 ? (
                <p className="px-4 py-5 text-sm text-[#8a97ab]">No matches found.</p>
              ) : (
                results.map((item) => (
                  <button
                    key={`${item.type}-${item.href}`}
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition hover:bg-[#f4f7f9]"
                    onClick={() => {
                      router.push(item.href);
                      setQuery("");
                      setSearchOpen(false);
                    }}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-[var(--ds-ink)]">
                        {item.title}
                      </span>
                      {"subtitle" in item && item.subtitle ? (
                        <span className="mt-0.5 block truncate text-xs text-[var(--ds-muted)]">
                          {item.subtitle}
                        </span>
                      ) : null}
                    </span>
                    <span className="shrink-0 text-xs text-[var(--ds-muted)]">
                      {"meta" in item && item.meta ? item.meta : item.type}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {ui ? (
            <button
              type="button"
              className="ds-icon-btn ds-theme-btn"
              aria-label={ui.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={ui.theme === "dark" ? "Light mode" : "Dark mode"}
              onClick={() => ui.toggleTheme()}
            >
              <Sun className="ds-theme-icon ds-theme-icon--sun h-4 w-4" />
              <Moon className="ds-theme-icon ds-theme-icon--moon h-4 w-4" />
            </button>
          ) : null}

          <Link
            href="/dashboard/careeros"
            className="ds-icon-btn hidden sm:inline-flex"
            title="Open CareerOS"
          >
            <Sparkles className="h-4 w-4" />
          </Link>

          <div className="relative">
            <button
              type="button"
              className="ds-icon-btn"
              aria-label="Notifications"
              onClick={() => {
                setNotesOpen((v) => !v);
                setProfileOpen(false);
              }}
            >
              <Bell className="h-4 w-4" />
            </button>
            {notesOpen && (
              <div className="ds-dropdown w-[280px]">
                <div className="border-b border-[var(--ds-border)] px-4 py-3">
                  <p className="text-sm font-semibold text-[var(--ds-ink)]">Notifications</p>
                </div>
                <div className="px-4 py-6 text-center">
                  <p className="text-sm font-medium text-[var(--ds-ink)]">You&apos;re all caught up</p>
                  <p className="mt-1 text-xs text-[var(--ds-muted)]">
                    Job matches and workspace updates will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotesOpen(false);
              }}
              className={cn(
                "ml-1 flex items-center gap-2 rounded-full border border-[var(--ds-border)] bg-[var(--ds-surface)] py-1 pl-1 pr-2.5 transition hover:bg-[var(--ds-hover)]",
                profileOpen && "ring-2 ring-[#76bec5]/30"
              )}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#21386B] text-xs font-semibold text-white">
                {initials}
              </span>
              <span className="hidden max-w-[110px] truncate text-sm font-medium text-[var(--ds-ink)] md:inline">
                {user.firstName || "Member"}
              </span>
            </button>
            {profileOpen && (
              <div className="ds-dropdown">
                <div className="border-b border-[var(--ds-border)] px-4 py-3">
                  <p className="truncate text-sm font-semibold text-[var(--ds-ink)]">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-[var(--ds-muted)]">{user.email}</p>
                </div>
                <Link
                  href="/dashboard/talent/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--ds-ink-soft)] transition hover:bg-[var(--ds-hover)]"
                >
                  <UserRound className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-[var(--ds-ink-soft)] transition hover:bg-[var(--ds-hover)]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Building2,
  Cloud,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Archive,
  RefreshCw,
  Minimize2,
  Wand2,
  Braces,
  Binary,
  Hash,
  KeyRound,
  Fingerprint,
  Regex,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import BrandLogo from "@/components/brand-logo";
import DashboardLoader from "@/components/workspace/DashboardLoader";
import {
  DashboardShellSkeleton,
  useCompactViewport,
} from "@/components/workspace/DashboardSkeleton";
import {
  DashboardUiProvider,
  useDashboardUi,
} from "@/components/workspace/dashboard-ui-context";
import DashboardTopbar from "@/components/workspace/DashboardTopbar";
import { WORKSPACE_NAV, type WorkspaceNavItem } from "@/lib/workspace-nav";
import { navCustomIconSrc } from "@/lib/workspace-icons";
import { cn } from "@/lib/utils";
import "@/app/dashboard-shell.css";

const ALWAYS_OPEN_SECTIONS = new Set(["Workspace"]);
const NAV_OPEN_STORAGE_KEY = "thewrker.nav.sections";
const SIDEBAR_COLLAPSED_KEY = "thewrker.nav.collapsed";

const legacyNavigation = {
  trainee: [
    { name: "Dashboard", href: "/dashboard/trainee", icon: LayoutDashboard },
    { name: "Training", href: "/dashboard/trainee/training", icon: BookOpen },
    { name: "Certificates", href: "/dashboard/trainee/certificates", icon: BookOpen },
    { name: "Profile", href: "/dashboard/trainee/profile", icon: User },
    { name: "Settings", href: "/dashboard/trainee/settings", icon: Settings },
  ],
  recruiter: [
    { name: "Dashboard", href: "/dashboard/recruiter", icon: LayoutDashboard },
    { name: "Post Job", href: "/dashboard/recruiter/jobs/new", icon: Briefcase },
    { name: "My Jobs", href: "/dashboard/recruiter/jobs", icon: Briefcase },
    { name: "Talent", href: "/dashboard/recruiter/talent", icon: User },
    { name: "Settings", href: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { name: "Admin Panel", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Workspace", href: "/dashboard", icon: LayoutDashboard },
    { name: "CareerOS", href: "/dashboard/careeros", icon: Sparkles },
    { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
};

const workspaceIcons: Record<
  WorkspaceNavItem["icon"],
  React.ComponentType<{ className?: string }>
> = {
  overview: LayoutDashboard,
  careeros: Sparkles,
  organisation: Building2,
  files: Cloud,
  text: FileText,
  pdf: FileText,
  image: ImageIcon,
  archive: Archive,
  convert: RefreshCw,
  compress: Minimize2,
  ai: Wand2,
  json: Braces,
  base64: Binary,
  uuid: Fingerprint,
  hash: Hash,
  jwt: KeyRound,
  regex: Regex,
};

function usesWorkspaceShell(role: string) {
  return role === "talent" || role === "trainee" || role === "admin";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fromLoginGate] = useState(() => {
    try {
      if (typeof window === "undefined") return false;
      return sessionStorage.getItem("thewrker.dashGate") === "1";
    } catch {
      return false;
    }
  });
  const compactViewport = useCompactViewport();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NAV_OPEN_STORAGE_KEY);
      if (raw) {
        setOpenSections(JSON.parse(raw) as Record<string, boolean>);
      }
      setSidebarCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const handleMenuClick = () => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      toggleSidebarCollapsed();
      return;
    }
    setSidebarOpen(true);
  };

  useEffect(() => {
    // Close mobile drawer when navigating between pages
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!pathname) return;
    setOpenSections((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const section of WORKSPACE_NAV) {
        if (ALWAYS_OPEN_SECTIONS.has(section.title)) continue;
        const inSection = section.items.some(
          (item) =>
            pathname === item.href || pathname.startsWith(`${item.href}/`)
        );
        if (inSection && next[section.title] !== true) {
          next[section.title] = true;
          changed = true;
        }
      }
      if (changed) {
        try {
          localStorage.setItem(NAV_OPEN_STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
      }
      return changed ? next : prev;
    });
  }, [pathname]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = { ...prev, [title]: !prev[title] };
      try {
        localStorage.setItem(NAV_OPEN_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  useEffect(() => {
    const startedAt = Date.now();
    try {
      if (sessionStorage.getItem("thewrker.dashGate") === "1") {
        sessionStorage.removeItem("thewrker.dashGate");
      }
    } catch {
      /* ignore */
    }
    // Branded gate only after sign-in; otherwise shell skeleton is enough
    const minMs = fromLoginGate ? 1100 : 0;

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/login");
          return;
        }

        if (token.startsWith("local.")) {
          try {
            const raw = token.slice("local.".length);
            const padded = raw.replace(/-/g, "+").replace(/_/g, "/");
            const pad =
              padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
            const json = decodeURIComponent(escape(atob(padded + pad)));
            setUser(JSON.parse(json));
          } catch {
            localStorage.removeItem("accessToken");
            router.push("/login");
            return;
          }
        } else {
          const response = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            router.push("/login");
            return;
          }

          const data = await response.json();
          setUser(data.user);
        }
      } catch {
        router.push("/login");
      } finally {
        const wait = Math.max(0, minMs - (Date.now() - startedAt));
        if (wait > 0) {
          await new Promise((r) => setTimeout(r, wait));
        }
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, fromLoginGate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("localUser");
    router.push("/login");
  };

  if (loading) {
    // After sign-in: short branded gate
    if (fromLoginGate) {
      return <DashboardLoader title="Workspace" subtitle="Loading your dashboard" />;
    }
    // Skeleton only on phones / iPads — skip on laptop & desktop
    if (compactViewport) {
      return <DashboardShellSkeleton />;
    }
    return (
      <div
        className="min-h-screen bg-[#eaf1f3]"
        aria-busy="true"
        aria-label="Loading workspace"
      />
    );
  }

  if (!user) return null;

  const role = String(user.role || "").toLowerCase();
  const workspaceMode = usesWorkspaceShell(role);

  return (
    <DashboardUiProvider user={user}>
      <DashboardShell
        workspaceMode={workspaceMode}
        sidebarCollapsed={sidebarCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        role={role}
        pathname={pathname}
        openSections={openSections}
        toggleSection={toggleSection}
        handleMenuClick={handleMenuClick}
        handleLogout={handleLogout}
      >
        {children}
      </DashboardShell>
    </DashboardUiProvider>
  );
}

function DashboardShell({
  workspaceMode,
  sidebarCollapsed,
  sidebarOpen,
  setSidebarOpen,
  user,
  role,
  pathname,
  openSections,
  toggleSection,
  handleMenuClick,
  handleLogout,
  children,
}: {
  workspaceMode: boolean;
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
  role: string;
  pathname: string | null;
  openSections: Record<string, boolean>;
  toggleSection: (title: string) => void;
  handleMenuClick: () => void;
  handleLogout: () => void;
  children: React.ReactNode;
}) {
  const { theme } = useDashboardUi();
  const logoVariant = theme === "dark" ? "white" : "dark";

  return (
    <div
      className={cn(
        workspaceMode ? "ds-shell" : "min-h-screen bg-[#F7F8FA]",
        workspaceMode && sidebarCollapsed && "is-sidebar-collapsed"
      )}
      data-theme={workspaceMode ? theme : undefined}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-[#21386B]/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex max-w-[320px] transform flex-col transition-[width,transform] duration-200 ease-in-out lg:translate-x-0",
          workspaceMode
            ? cn("ds-sidebar", sidebarCollapsed && "is-collapsed")
            : "w-[min(16rem,86vw)] border-r border-gray-200 bg-white",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div
          className={cn(
            "flex items-center px-5",
            workspaceMode ? "ds-brand" : "h-16 border-b border-gray-200",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link
            href="/dashboard"
            className="flex items-center justify-center"
            title="theWRKER"
          >
            <BrandLogo
              size="sm"
              variant={workspaceMode ? logoVariant : "dark"}
              markOnly={workspaceMode && sidebarCollapsed}
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "rounded-lg p-2 hover:bg-gray-100 lg:hidden",
              sidebarCollapsed && "hidden"
            )}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav
          className={cn(
            "flex-1 overflow-y-auto py-4",
            sidebarCollapsed ? "px-2" : "px-3"
          )}
        >
          {workspaceMode ? (
            <div className="space-y-5">
              {WORKSPACE_NAV.map((section) => {
                const alwaysOpen = ALWAYS_OPEN_SECTIONS.has(section.title);
                const isOpen =
                  sidebarCollapsed ||
                  alwaysOpen ||
                  Boolean(openSections[section.title]);

                return (
                  <div key={section.title}>
                    {alwaysOpen ? (
                      <p className="ds-nav-label mb-2 px-3">{section.title}</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleSection(section.title)}
                        aria-expanded={isOpen}
                        className="ds-section-toggle mb-1 flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left transition hover:bg-[var(--ds-hover)]"
                      >
                        <span className="ds-nav-label">{section.title}</span>
                        {isOpen ? (
                          <ChevronUp className="h-3.5 w-3.5 text-[#8a97ab]" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-[#8a97ab]" />
                        )}
                      </button>
                    )}

                    {isOpen && (
                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const Icon = workspaceIcons[item.icon];
                          const customIcon = navCustomIconSrc(item.icon);
                          const isActive =
                            item.href === "/dashboard"
                              ? pathname === "/dashboard"
                              : pathname === item.href ||
                                pathname?.startsWith(`${item.href}/`);
                          return (
                            <div key={item.href} className="ds-nav-item">
                              <Link
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                title={sidebarCollapsed ? item.name : undefined}
                                className={cn(
                                  "ds-nav-link",
                                  isActive && "is-active"
                                )}
                              >
                                {customIcon ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={customIcon}
                                    alt=""
                                    width={16}
                                    height={16}
                                    className="h-4 w-4 shrink-0 object-contain"
                                    aria-hidden
                                  />
                                ) : (
                                  <Icon className="h-4 w-4 shrink-0" />
                                )}
                                <span className="ds-nav-text">{item.name}</span>
                              </Link>
                              {sidebarCollapsed && (
                                <span className="ds-tooltip" aria-hidden>
                                  {item.name}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {(legacyNavigation[role as keyof typeof legacyNavigation] || []).map(
                (item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                        isActive
                          ? "bg-brand-secondary/15 font-semibold text-brand-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                }
              )}
            </div>
          )}
        </nav>

        <div className="border-t border-[var(--ds-border,rgba(33,56,107,0.08))] p-3">
          {!workspaceMode && (
            <div className="mb-3 flex items-center gap-3 px-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                <span className="font-semibold text-brand-primary">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? "Sign Out" : undefined}
            className="ds-signout flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--ds-ink-soft)] transition hover:bg-[var(--ds-hover)]"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="ds-nav-text">Sign Out</span>
          </button>
        </div>
      </aside>

      <div className={workspaceMode ? "ds-main" : "lg:pl-64"}>
        {workspaceMode ? (
          <DashboardTopbar
            user={user}
            sidebarCollapsed={sidebarCollapsed}
            onMenuClick={handleMenuClick}
            onLogout={handleLogout}
          />
        ) : (
          <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded p-2 hover:bg-gray-100 lg:hidden"
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex-1" />
              <span className="text-sm capitalize text-gray-600">{role}</span>
            </div>
          </header>
        )}

        <main className={workspaceMode ? "ds-content" : "p-4 sm:p-6 lg:p-8"}>
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getAllNavItemsForPath,
  getNavForPath,
  isNavItemActive,
} from "@/lib/navigation";
import { BRAND } from "@/lib/brand";
import { USER_PROFILE } from "@/lib/constants";

interface SidebarNavProps {
  onNavigate?: () => void;
  scrollable?: boolean;
}

function NavLinkList({
  items,
  pathname,
  onNavigate,
}: {
  items: { label: string; href: string; icon: string }[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="pd-sidebar-section-list">
      {items.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`pd-sidebar-link ${active ? "pd-sidebar-link--active" : ""}`}
            >
              <Image
                src={item.icon}
                alt=""
                width={18}
                height={18}
                aria-hidden
                className="shrink-0"
              />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SidebarNav({ onNavigate, scrollable = true }: SidebarNavProps) {
  const pathname = usePathname();
  const navSections = getNavForPath(pathname);

  return (
    <nav
      className={`flex flex-col gap-5 ${
        scrollable
          ? "flex-1 overflow-y-auto custom-scrollbar"
          : "pd-sidebar-nav--desktop"
      }`}
    >
      {navSections.map((section) => (
        <div key={section.id} className="pd-sidebar-section">
          <p className="pd-sidebar-section-title">{section.title}</p>
          <NavLinkList items={section.items} pathname={pathname} onNavigate={onNavigate} />
          {section.subsections?.map((subsection) => (
            <div key={subsection.title} className="pd-sidebar-subsection">
              <p className="pd-sidebar-section-title pd-sidebar-subsection-title">
                {subsection.title}
              </p>
              <NavLinkList items={subsection.items} pathname={pathname} onNavigate={onNavigate} />
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}

export function SidebarUser({ variant = "default" }: { variant?: "default" | "desktop" }) {
  const isDesktop = variant === "desktop";

  return (
    <div className={isDesktop ? "pd-sidebar-footer" : undefined}>
      <div
        className={`pd-sidebar-user-card ${isDesktop ? "pd-sidebar-user-card--desktop" : ""}`}
      >
        <Image
          src={USER_PROFILE.avatar}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-accent-light bg-white p-1"
          aria-hidden
        />
        <div className="min-w-0">
          <p className="body-emphasized-14pt truncate">{USER_PROFILE.name}</p>
          <p className="body-secondary-info-14pt truncate">{USER_PROFILE.role}</p>
        </div>
      </div>
    </div>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      {open ? (
        <path
          d="M6 6L18 18M6 18L18 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

interface WorkspaceShellProps {
  children: React.ReactNode;
}

export default function WorkspaceShell({ children }: WorkspaceShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const desktopNav = window.matchMedia("(hover: hover) and (pointer: fine)");
    const closeOnDesktop = () => {
      if (desktopNav.matches) setMenuOpen(false);
    };
    desktopNav.addEventListener("change", closeOnDesktop);
    closeOnDesktop();
    return () => desktopNav.removeEventListener("change", closeOnDesktop);
  }, []);

  const inCareerOS = pathname === "/careeros" || pathname.startsWith("/careeros/");
  const currentSection =
    getAllNavItemsForPath(pathname).find((item) => isNavItemActive(pathname, item.href))?.label ??
    (inCareerOS ? "CareerOS" : BRAND.name);

  return (
    <div className="pd-workspace">
      <aside className="pd-sidebar pd-sidebar--desktop">
        <Link href="/" className="pd-sidebar-brand">
          <Image
            src={BRAND.logo}
            alt={BRAND.name}
            width={200}
            height={44}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <div className="pd-sidebar-nav-wrap">
          <SidebarNav scrollable={false} />
        </div>
        <SidebarUser variant="desktop" />
      </aside>

      <div className="pd-workspace-main">
        <header className="pd-topbar">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="pd-mobile-header">
              <button
                type="button"
                className="pd-icon-btn"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <BurgerIcon open={menuOpen} />
              </button>
              <div className="min-w-0 flex-1">
                <Image
                  src={BRAND.logo}
                  alt={BRAND.name}
                  width={160}
                  height={36}
                  className="h-8 w-auto"
                />
                {currentSection !== BRAND.name && (
                  <p className="body-secondary-info-14pt mt-0.5 truncate">{currentSection}</p>
                )}
              </div>
            </div>
            <div className="pd-desktop-topbar">
              <p className="body-secondary-info-14pt">{inCareerOS ? "CareerOS" : "Workspace"}</p>
              <h1 className="text-22-bold truncate">{currentSection}</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="pd-tag">Online</span>
          </div>
        </header>

        <main className="pd-workspace-content custom-scrollbar">{children}</main>
      </div>

      <div
        className={`pd-drawer-overlay ${menuOpen ? "pd-drawer-overlay--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="pd-drawer-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <aside className={`pd-drawer ${menuOpen ? "pd-drawer--open" : ""}`}>
          <div className="mb-5 flex items-center justify-between">
            <Image
              src={BRAND.logo}
              alt={BRAND.name}
              width={180}
              height={40}
              className="h-8 w-auto"
            />
            <button
              type="button"
              className="pd-icon-btn"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <BurgerIcon open />
            </button>
          </div>
          <SidebarUser />
          <div className="mt-5 flex flex-1 flex-col overflow-hidden">
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
        </aside>
      </div>
    </div>
  );
}

import { CAREEROS_NAV } from "./careeros-navigation";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface NavSubsection {
  title: string;
  items: NavItem[];
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
  subsections?: NavSubsection[];
}

export const SIDEBAR_NAV: NavSection[] = [
  {
    id: "workspace",
    title: "Workspace",
    items: [
      {
        label: "Overview",
        href: "/",
        icon: "/assets/icons/workspace.svg",
      },
      {
        label: "CareerOS",
        href: "/careeros",
        icon: "/assets/icons/ai.svg",
      },
    ],
  },
  {
    id: "studios",
    title: "Studios",
    items: [
      {
        label: "Text Editor",
        href: "/editor/text",
        icon: "/assets/icons/text-editor.svg",
      },
      {
        label: "PDF Studio",
        href: "/studio/pdf",
        icon: "/assets/icons/pdf-acrobat.svg",
      },
      {
        label: "Image Studio",
        href: "/studio/image",
        icon: "/assets/icons/image.svg",
      },
      {
        label: "Archive Studio",
        href: "/studio/archive",
        icon: "/assets/icons/archive.svg",
      },
      {
        label: "Converter Hub",
        href: "/studio/converter",
        icon: "/assets/icons/converter.svg",
      },
      {
        label: "Compressor Studio",
        href: "/studio/compressor",
        icon: "/assets/icons/files.svg",
      },
      {
        label: "AI Studio",
        href: "/studio/ai",
        icon: "/assets/icons/ai.svg",
      },
    ],
    subsections: [
      {
        title: "Developer Tools",
        items: [
          {
            label: "JSON Formatter",
            href: "/tools/json-formatter",
            icon: "/assets/icons/json.svg",
          },
          {
            label: "Base64 Encoder",
            href: "/tools/base64",
            icon: "/assets/icons/base64.svg",
          },
          {
            label: "UUID Generator",
            href: "/tools/uuid",
            icon: "/assets/icons/uuid.svg",
          },
          {
            label: "Hash Generator",
            href: "/tools/hash",
            icon: "/assets/icons/hash.svg",
          },
          {
            label: "JWT Decoder",
            href: "/tools/jwt",
            icon: "/assets/icons/jwt.svg",
          },
          {
            label: "Regex Tester",
            href: "/tools/regex",
            icon: "/assets/icons/regex.svg",
          },
        ],
      },
    ],
  },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/careeros") return pathname === "/careeros";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getNavForPath(pathname: string): NavSection[] {
  if (pathname === "/careeros" || pathname.startsWith("/careeros/")) {
    return CAREEROS_NAV;
  }
  return SIDEBAR_NAV;
}

export function getAllNavItemsForPath(pathname: string): NavItem[] {
  return getNavForPath(pathname).flatMap((section) => [
    ...section.items,
    ...(section.subsections?.flatMap((subsection) => subsection.items) ?? []),
  ]);
}

export function getAllNavItems(): NavItem[] {
  return SIDEBAR_NAV.flatMap((section) => [
    ...section.items,
    ...(section.subsections?.flatMap((subsection) => subsection.items) ?? []),
  ]);
}

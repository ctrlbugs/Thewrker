import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  FileText,
  Image as ImageIcon,
  Minimize2,
  RefreshCw,
  Sparkles,
  Type,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { customIconSrc } from "@/lib/workspace-icons";

const actions: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  customIconKey?: string;
  badge: string;
  badgeTone: string;
  iconTone: string;
}[] = [
  {
    title: "Open PDF Studio",
    description: "Merge, split, and manage documents",
    href: "/dashboard/studios/pdf",
    icon: FileText,
    customIconKey: "pdf",
    badge: "Popular",
    badgeTone: "ws-badge--rose",
    iconTone: "ws-soft-icon--rose",
  },
  {
    title: "Edit an image",
    description: "Resize, compress, remove backgrounds",
    href: "/dashboard/studios/image",
    icon: ImageIcon,
    customIconKey: "image",
    badge: "Fast",
    badgeTone: "ws-badge--purple",
    iconTone: "ws-soft-icon--purple",
  },
  {
    title: "Text Editor",
    description: "Write markdown, notes, and configs",
    href: "/dashboard/studios/text",
    icon: Type,
    customIconKey: "text-editor",
    badge: "Write",
    badgeTone: "ws-badge--info",
    iconTone: "ws-soft-icon--navy",
  },
  {
    title: "Archive Studio",
    description: "Create, extract, and compress ZIPs",
    href: "/dashboard/studios/archive",
    icon: Archive,
    customIconKey: "archive",
    badge: "ZIP",
    badgeTone: "ws-badge--teal",
    iconTone: "ws-soft-icon--teal",
  },
  {
    title: "Converter Hub",
    description: "Convert audio and video formats",
    href: "/dashboard/studios/converter",
    icon: RefreshCw,
    customIconKey: "converter",
    badge: "Media",
    badgeTone: "ws-badge--purple",
    iconTone: "ws-soft-icon--purple",
  },
  {
    title: "Compressor Studio",
    description: "Shrink image, audio, and video files",
    href: "/dashboard/studios/compressor",
    icon: Minimize2,
    customIconKey: "compressor",
    badge: "Save",
    badgeTone: "ws-badge--warn",
    iconTone: "ws-soft-icon--teal",
  },
  {
    title: "AI Studio",
    description: "Check originality and similarity",
    href: "/dashboard/studios/ai",
    icon: Wand2,
    customIconKey: "ai",
    badge: "AI",
    badgeTone: "ws-badge--teal",
    iconTone: "ws-soft-icon--teal",
  },
  {
    title: "Explore CareerOS",
    description: "Jobs, resume, and career momentum",
    href: "/dashboard/careeros",
    icon: Sparkles,
    customIconKey: "careeros",
    badge: "Career",
    badgeTone: "ws-badge--teal",
    iconTone: "ws-soft-icon--teal",
  },
];

export default function QuickActions() {
  return (
    <section id="quick-start" className="ws-soft-card scroll-mt-24">
      <header className="ws-soft-card-head ws-soft-card-head--panel">
        <div>
          <h2 className="ws-soft-card-title">Quick start</h2>
          <p className="ws-soft-card-sub">
            Jump into the tools people open most.
            <br />
            Open, edit, convert, and manage every file type from one workspace.
          </p>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 md:p-5 md:items-stretch">
        {actions.map((action) => {
          const Icon = action.icon;
          const customSrc = action.customIconKey
            ? customIconSrc(action.customIconKey)
            : null;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="ws-soft-tile group h-full"
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`ws-soft-icon ${action.iconTone}`}>
                  {customSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={customSrc}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                      aria-hidden
                    />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#b0b8c6] transition group-hover:text-[#76bec5]" />
              </div>
              <div className="mt-4 flex min-w-0 items-center gap-2">
                <h3 className="truncate text-[0.95rem] font-semibold text-[#3b4758]">
                  {action.title}
                </h3>
                <span className={`ws-badge shrink-0 ${action.badgeTone}`}>
                  {action.badge}
                </span>
              </div>
              <p className="ws-soft-tile-desc mt-1.5">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

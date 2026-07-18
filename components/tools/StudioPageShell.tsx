import Image from "next/image";
import ToolErrorBoundary from "@/components/ui/ToolErrorBoundary";
import "@/app/studio-shell.css";

type StudioPageShellProps = {
  brand: string;
  title: string;
  description: string;
  iconSrc?: string;
  children: React.ReactNode;
};

export default function StudioPageShell({
  brand,
  title,
  description,
  iconSrc,
  children,
}: StudioPageShellProps) {
  return (
    <div className="studio-shell">
      <section className="studio-shell-hero">
        <div>
          <div className="studio-shell-brand">
            {iconSrc ? (
              <Image src={iconSrc} alt="" width={32} height={32} unoptimized />
            ) : (
              <span className="studio-shell-brand-fallback" aria-hidden>
                ◆
              </span>
            )}
            <span>{brand}</span>
          </div>
          <h1 className="studio-shell-title">{title}</h1>
          <p className="studio-shell-sub">{description}</p>
        </div>
        <div className="studio-shell-art" aria-hidden>
          <div className="studio-shell-art-frame">
            {iconSrc ? (
              <Image src={iconSrc} alt="" width={220} height={220} unoptimized />
            ) : (
              <span className="studio-shell-brand-fallback" style={{ width: 72, height: 72 }}>
                ◆
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="studio-shell-panel">
        <div className="studio-shell-panel-body">
          <ToolErrorBoundary toolName={title}>{children}</ToolErrorBoundary>
        </div>
      </section>
    </div>
  );
}

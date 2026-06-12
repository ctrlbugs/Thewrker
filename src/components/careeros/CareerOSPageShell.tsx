import ToolErrorBoundary from "@/components/ui/ToolErrorBoundary";

interface CareerOSPageShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function CareerOSPageShell({
  title,
  description,
  children,
}: CareerOSPageShellProps) {
  return (
    <section className="pd-panel pd-careeros-panel">
      <header className="pd-panel-header pd-careeros-header">
        <p className="pd-careeros-kicker">CareerOS</p>
        <h2 className="card-title-24pt pd-careeros-header-title">{title}</h2>
        <p className="body-secondary-info-14pt mt-1 max-w-3xl">{description}</p>
      </header>
      <div className="pd-panel-body">
        <ToolErrorBoundary toolName={title}>{children}</ToolErrorBoundary>
      </div>
    </section>
  );
}

import ToolErrorBoundary from "@/components/ui/ToolErrorBoundary";

interface ToolShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolShell({
  title,
  description,
  children,
}: ToolShellProps) {
  return (
    <section className="pd-panel">
      <header className="pd-panel-header">
        <h2 className="card-title-24pt">{title}</h2>
        <p className="body-secondary-info-14pt mt-1 max-w-2xl">{description}</p>
      </header>
      <div className="pd-panel-body">
        <ToolErrorBoundary toolName={title}>{children}</ToolErrorBoundary>
      </div>
    </section>
  );
}

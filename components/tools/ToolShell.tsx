import StudioPageShell from "@/components/tools/StudioPageShell";

interface ToolShellProps {
  title: string;
  description: string;
  brand?: string;
  iconSrc?: string;
  children: React.ReactNode;
}

export default function ToolShell({
  title,
  description,
  brand = "TheWrker Studio",
  iconSrc,
  children,
}: ToolShellProps) {
  return (
    <StudioPageShell
      brand={brand}
      title={title}
      description={description}
      iconSrc={iconSrc}
    >
      {children}
    </StudioPageShell>
  );
}

import Image from "next/image";
import { BRAND } from "@/lib/brand";
import "@/app/dashboard-shell.css";

type DashboardLoaderProps = {
  title?: string;
  subtitle?: string;
};

export default function DashboardLoader({
  title = "Workspace",
  subtitle = "Loading your dashboard",
}: DashboardLoaderProps) {
  return (
    <div className="ds-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="ds-loader-glow" aria-hidden />
      <div className="ds-loader-stage">
        <div className="ds-loader-ring" aria-hidden>
          <div className="ds-loader-logo">
            <Image
              src={BRAND.logoWhite}
              alt={BRAND.name}
              width={804}
              height={183}
              priority
              className="ds-loader-logo-img"
            />
          </div>
        </div>
        <h1 className="ds-loader-title">{title}</h1>
        <p className="ds-loader-sub">{subtitle}</p>
      </div>
    </div>
  );
}

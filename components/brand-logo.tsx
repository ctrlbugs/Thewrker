import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Display sizes for full logo (icon + theWRKER):
 * sm 32px · md 40px (nav) · lg 48px (login) · xl 56px
 * markOnly: circular W mark only (no wordmark)
 */
type LogoSize = "sm" | "md" | "lg" | "xl";
type LogoVariant = "dark" | "white";

const FULL_LOGO_CLASS: Record<LogoSize, string> = {
  sm: "h-8 w-auto",
  md: "h-10 w-auto",
  lg: "h-12 w-auto",
  xl: "h-14 w-auto",
};

const MARK_CLASS: Record<LogoSize, string> = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
};

type BrandLogoProps = {
  className?: string;
  /** dark = for light backgrounds; white = for dark backgrounds */
  variant?: LogoVariant;
  size?: LogoSize;
  priority?: boolean;
  /** Show only the circular W mark (collapsed sidebar) */
  markOnly?: boolean;
};

export default function BrandLogo({
  className,
  variant = "dark",
  size = "md",
  priority = false,
  markOnly = false,
}: BrandLogoProps) {
  if (markOnly) {
    return (
      <div className={cn("inline-flex items-center justify-center", className)}>
        <Image
          src="/logo/apple-touch-icon.png"
          alt="theWRKER"
          width={180}
          height={180}
          priority={priority}
          className={cn(MARK_CLASS[size], "rounded-full object-cover")}
        />
      </div>
    );
  }

  const src =
    variant === "white" ? "/logo/logo-white.png" : "/logo/logo-dark.png";

  return (
    <div className={cn("inline-flex items-center", className)}>
      <Image
        src={src}
        alt="theWRKER"
        width={804}
        height={183}
        priority={priority}
        className={FULL_LOGO_CLASS[size]}
      />
    </div>
  );
}

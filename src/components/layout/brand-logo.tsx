import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  showScos?: boolean;
  tone?: "light" | "dark";
  className?: string;
  onClick?: () => void;
};

const sizes = {
  sm: { mark: 32, scos: "text-sm", iou: "text-[10px]" },
  md: { mark: 36, scos: "text-sm", iou: "text-[10px]" },
  lg: { mark: 48, scos: "text-lg", iou: "text-xs" },
};

export function BrandLogo({
  href = "/",
  size = "md",
  showWordmark = true,
  showScos = true,
  tone = "light",
  className,
  onClick,
}: BrandLogoProps) {
  const config = sizes[size];
  const iouClass =
    tone === "dark"
      ? "text-brand-200"
      : "text-ink-500";
  const scosClass =
    tone === "dark"
      ? "text-white"
      : "text-ink-900";

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/brand/iou-logo.png"
        alt="IOU"
        width={config.mark}
        height={config.mark}
        className="shrink-0"
        priority
      />
      {(showWordmark || showScos) && (
        <div className="flex min-w-0 flex-col leading-tight">
          {showWordmark && (
            <span
              className={cn(
                "truncate font-medium uppercase tracking-[0.14em]",
                config.iou,
                iouClass,
              )}
            >
              International Open University
            </span>
          )}
          {showScos && (
            <span className={cn("font-semibold tracking-tight", config.scos, scosClass)}>
              SCOS
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="transition-opacity hover:opacity-85"
    >
      {content}
    </Link>
  );
}

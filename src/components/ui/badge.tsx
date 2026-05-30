import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "active" | "inactive" | "outline";
  className?: string;
};

export function Badge({ children, variant = "active", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "active" && "bg-green-100 text-green-800",
        variant === "inactive" && "bg-amber-100 text-amber-800",
        variant === "outline" && "border border-ink-200 bg-white text-ink-700",
        className,
      )}
    >
      {children}
    </span>
  );
}

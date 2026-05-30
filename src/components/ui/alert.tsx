import { cn } from "@/lib/utils";

type AlertProps = {
  children: React.ReactNode;
  variant?: "info" | "warning" | "success" | "error";
  className?: string;
};

export function Alert({ children, variant = "info", className }: AlertProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg border px-4 py-3 text-sm",
        variant === "info" && "border-blue-200 bg-blue-50 text-blue-950",
        variant === "warning" && "border-amber-200 bg-amber-50 text-amber-950",
        variant === "success" && "border-green-200 bg-green-50 text-green-950",
        variant === "error" && "border-red-200 bg-red-50 text-red-950",
        className,
      )}
      role="alert"
    >
      {children}
    </div>
  );
}

export function AlertTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)}>
      {children}
    </h5>
  );
}

export function AlertDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-sm", className)}>
      {children}
    </div>
  );
}

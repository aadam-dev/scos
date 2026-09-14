import { cn } from "@/lib/utils";

type PlatformDisclaimerProps = {
  variant?: "compact" | "full";
  className?: string;
};

const COMPACT_TEXT =
  "SCOS is an independent platform and is not affiliated with, endorsed by, or operated by International Open University (IOU). It was initially developed by IT support for the Ghana Accra Student Committee.";

const FULL_TEXT = (
  <>
    SCOS is an independent software project. It is not affiliated with, endorsed by, or
    officially operated by International Open University (IOU) or any of its departments.
    <br />
    <br />
    The platform was first built by IT support for the Ghana Accra Student Committee to
    replace scattered spreadsheets and informal record-keeping. Other student
    committees may adopt it at their own discretion; use of SCOS does not imply IOU
    approval of committee operations or recorded service hours.
  </>
);

export function PlatformDisclaimer({
  variant = "compact",
  className,
}: PlatformDisclaimerProps) {
  if (variant === "full") {
    return (
      <aside
        className={cn(
          "rounded-xl border border-ink-200 bg-ink-50/80 px-5 py-4 text-sm leading-relaxed text-ink-600",
          className,
        )}
        aria-label="Platform disclaimer"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-700">
          Disclaimer
        </p>
        <p>{FULL_TEXT}</p>
      </aside>
    );
  }

  return (
    <p
      className={cn("text-xs leading-relaxed text-ink-500", className)}
      aria-label="Platform disclaimer"
    >
      {COMPACT_TEXT}
    </p>
  );
}

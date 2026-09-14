import { PlatformDisclaimer } from "@/components/layout/platform-disclaimer";

const AADAM_URL = "https://aadambuilds.dev";

export function PoweredByAadam() {
  return (
    <footer className="border-t border-ink-200 bg-white py-4">
      <div className="mx-auto w-full max-w-6xl space-y-3 px-4">
        <PlatformDisclaimer className="text-center" />
        <p className="text-center text-xs text-ink-500">
          powered by{" "}
          <a
            href={AADAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 transition-colors hover:text-brand-800 hover:decoration-brand-500"
            aria-label="Visit aadam builds"
          >
            aadam
          </a>
        </p>
      </div>
    </footer>
  );
}

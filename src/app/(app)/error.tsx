"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-950">Something went wrong</h2>
      <p className="mt-1 text-sm text-red-800">Try again or contact the committee administrator.</p>
      <Button className="mt-4" onClick={() => reset()}>
        Try Again
      </Button>
    </div>
  );
}

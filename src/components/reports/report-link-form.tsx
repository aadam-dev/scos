"use client";

import type { Profile } from "@/lib/types";

export function ReportLinkForm({ profile }: { profile: Profile }) {
  return (
    <div>
      <a
        href={`/api/reports/${profile.id}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-10 items-center justify-center rounded-md bg-blue-900 px-4 text-sm font-medium text-white hover:bg-blue-800"
      >
        Download My Report
      </a>
    </div>
  );
}

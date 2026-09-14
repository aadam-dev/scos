"use client";

import type { Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ReportLinkForm({ profile }: { profile: Profile }) {
  return (
    <a href={`/api/reports/${profile.id}`} target="_blank" rel="noreferrer">
      <Button className="w-full bg-brand-700 text-white hover:bg-brand-800">
        <Download className="mr-2 h-4 w-4" />
        Download community service PDF
      </Button>
    </a>
  );
}

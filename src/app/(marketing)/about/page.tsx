import type { Metadata } from "next";
import Image from "next/image";
import { Target, Shield, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PlatformDisclaimer } from "@/components/layout/platform-disclaimer";

export const metadata: Metadata = {
  title: "About SCOS | Student Committee Operating System",
  description:
    "What SCOS is, where it started, and how student committees use it for meetings, logs, and reports.",
};

const values = [
  {
    icon: Target,
    title: "Committee-first",
    description:
      "Modules match real workflows: plan a campaign, run a meeting, log hours, export a PDF.",
  },
  {
    icon: Shield,
    title: "Access control",
    description:
      "Supabase row-level security keeps each committee's data separate. Roles decide who can approve or admin.",
  },
  {
    icon: Layers,
    title: "Structured records",
    description:
      "Minutes, attendance, and activity entries stay in one place instead of scattered chats and sheets.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-ink-200 pattern-diamond">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-100/60 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="caption mb-4 text-brand-700">About</p>
            <h1 className="heading-1 mb-6 text-ink-900">Software for student committees</h1>
            <p className="body-large text-ink-600">
              SCOS (Student Committee Operating System) covers meetings, activity logs, planning,
              and PDF exports. IT support built the first version for the Ghana Accra Student
              Committee. It remains an independent project, not an official IOU product.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="caption mb-4 text-brand-700">Why it exists</p>
              <h2 className="heading-2 mb-4 text-ink-900">Less admin, clearer records</h2>
              <div className="space-y-4 leading-relaxed text-ink-600">
                <p>
                  Committees coordinate events, support students, and keep logs for review periods.
                  Most of that work still lives in WhatsApp threads and spreadsheets that are hard
                  to search later.
                </p>
                <p>
                  SCOS puts planning, meetings, approvals, and exports in one workspace so chairs
                  and secretaries spend less time chasing files.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-900 to-brand-700 p-8 text-white">
              <div className="mb-6 flex items-center gap-4">
                <Image src="/brand/iou-logo.png" alt="" width={48} height={48} />
                <div>
                  <p className="font-semibold">SCOS</p>
                  <p className="text-sm text-brand-100/80">Student committee operations</p>
                </div>
              </div>
              <p className="text-lg font-medium leading-relaxed text-brand-50">
                Built to match how committees actually work through a term, not how slide decks
                describe them.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-200 bg-brand-50/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="caption mb-4 text-brand-700">Principles</p>
            <h2 className="heading-2 text-ink-900">What we optimize for</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title} className="border-ink-200 bg-white">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <value.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="heading-4 mb-2 text-ink-900">{value.title}</h3>
                  <p className="body-small text-ink-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="caption mb-4 text-brand-700">Origin</p>
            <h2 className="heading-2 mb-4 text-ink-900">
              Started in Accra, open to other committees
            </h2>
            <p className="body-large mb-8 text-ink-600">
              The Ghana Accra Student Committee needed a single place for minutes, service logs,
              and semester exports. IT support built SCOS for that. Other committees may adopt it,
              but the platform is community-maintained and separate from university administration.
            </p>
            <PlatformDisclaimer variant="full" />
          </div>
        </div>
      </section>
    </div>
  );
}

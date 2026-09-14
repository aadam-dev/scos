import type { Metadata } from "next";
import {
  BookOpen,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center | SCOS",
  description:
    "Documentation and guides for using SCOS - the Student Committee Operating System.",
};

const helpCategories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "New to SCOS? Start here for onboarding guides and platform overview.",
    articles: [
      "How to sign in with Google",
      "Understanding your dashboard",
      "Completing orientation",
      "Navigating the platform",
    ],
  },
  {
    icon: Calendar,
    title: "Meetings",
    description: "Learn how to schedule meetings, track attendance, and manage minutes.",
    articles: [
      "Scheduling a meeting",
      "Taking attendance",
      "Creating meeting minutes",
      "Publishing and sharing minutes",
    ],
  },
  {
    icon: ClipboardList,
    title: "Activities",
    description: "Track and log your community service activities with evidence.",
    articles: [
      "Logging a new activity",
      "Uploading evidence",
      "Understanding approval status",
      "Viewing your hours summary",
    ],
  },
  {
    icon: Users,
    title: "Member Management",
    description: "Guides for chairs and secretaries on managing committee members.",
    articles: [
      "Managing the committee roster",
      "Approving join requests",
      "Reviewing member participation",
      "Exporting member reports",
    ],
  },
  {
    icon: FileText,
    title: "Reports",
    description: "Generate and export reports for IOU review and personal records.",
    articles: [
      "Generating your activity report",
      "Exporting committee logbook",
      "Downloading meeting minutes",
      "Understanding report formats",
    ],
  },
  {
    icon: HelpCircle,
    title: "Troubleshooting",
    description: "Common issues and solutions for platform problems.",
    articles: [
      "Can&apos;t sign in with Google",
      "Upload failed - what to do",
      "Missing data or records",
      "Contacting support",
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-100/50 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="caption text-brand-700 mb-4">Help Center</p>
            <h1 className="heading-1 text-ink-900 mb-6">
              How can we help?
            </h1>
            <p className="body-large text-ink-600">
              Find guides, documentation, and answers to common questions about using SCOS.
            </p>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {helpCategories.map((category) => (
              <Card
                key={category.title}
                className="border-ink-200 bg-ink-50/30 transition-all hover:border-brand-300"
              >
                <CardHeader className="pb-3">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 text-brand-700">
                    <category.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="heading-4 text-ink-900">{category.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="body-small text-ink-600 mb-4">
                    {category.description}
                  </p>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li
                        key={article}
                        className="text-sm text-ink-500 hover:text-brand-700 cursor-pointer transition-colors"
                      >
                        {article}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="border-t border-ink-200 bg-ink-50/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-8 md:p-12 text-center">
            <div className="mx-auto max-w-2xl">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white">
                  <MessageSquare className="h-6 w-6" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="heading-2 text-white mb-4">
                Can&apos;t find what you need?
              </h2>
              <p className="body-large text-ink-400 mb-6">
                Our support team is here to help. Reach out and we&apos;ll get back to you
                as soon as possible.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-ink-900 hover:bg-ink-100 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

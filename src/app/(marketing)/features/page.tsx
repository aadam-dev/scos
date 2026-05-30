import type { Metadata } from "next";
import {
  CalendarDays,
  ClipboardList,
  Target,
  FileBarChart,
  Users,
  Shield,
  Bell,
  Download,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Features | SCOS Platform Capabilities",
  description:
    "Explore SCOS features - meeting management, activity tracking, strategic planning, and report generation.",
};

const featureCategories = [
  {
    title: "Meeting Management",
    icon: CalendarDays,
    description: "Comprehensive tools for organizing and documenting committee meetings.",
    features: [
      {
        icon: CalendarDays,
        title: "Meeting Scheduling",
        description:
          "Schedule recurring and one-time meetings with agenda planning. Set locations, times, and notify members automatically.",
      },
      {
        icon: Clock,
        title: "Attendance Tracking",
        description:
          "Record attendance with present, absent, and excused statuses. Track attendance rates across semesters.",
      },
      {
        icon: ClipboardList,
        title: "Structured Minutes",
        description:
          "Create detailed meeting minutes per agenda item. Record discussions, decisions, and action items with assigned owners.",
      },
      {
        icon: Bell,
        title: "Automated Reminders",
        description:
          "Never miss publishing minutes. Automated reminders notify secretaries when meetings close without published minutes.",
      },
    ],
  },
  {
    title: "Activity & Service Tracking",
    icon: Target,
    description: "Log and track community service activities with evidence and approval workflows.",
    features: [
      {
        icon: ClipboardList,
        title: "Activity Logging",
        description:
          "Members log activities with descriptions, dates, hours, and evidence uploads. Support for multiple activity types.",
      },
      {
        icon: CheckCircle,
        title: "Approval Workflows",
        description:
          "Chairs and secretaries review and approve activity submissions. Clear status tracking from pending to approved.",
      },
      {
        icon: Clock,
        title: "Hours Tracking",
        description:
          "Automatic accumulation of service hours. Track progress toward degree requirements (216h, 108h, 72h targets).",
      },
      {
        icon: Download,
        title: "Evidence Management",
        description:
          "Upload photos, documents, and supporting evidence. Secure Supabase Storage with RLS protection.",
      },
    ],
  },
  {
    title: "Planning & Strategy",
    icon: Target,
    description: "Strategic planning tools to align committee activities with objectives.",
    features: [
      {
        icon: Target,
        title: "Planning Boards",
        description:
          "Create and manage planning items with status tracking (backlog, todo, in-progress, done).",
      },
      {
        icon: ClipboardList,
        title: "Agenda Integration",
        description:
          "Sync planning items directly to meeting agendas. Convert discussions into actionable planning board items.",
      },
      {
        icon: CheckCircle,
        title: "Action Item Tracking",
        description:
          "Extract and track action items from meeting minutes. Link tasks to planning board for seamless workflow.",
      },
      {
        icon: Users,
        title: "Member Assignment",
        description:
          "Assign planning items and action items to specific members. Track ownership and accountability.",
      },
    ],
  },
  {
    title: "Reporting & Analytics",
    icon: FileBarChart,
    description: "Generate professional reports and gain insights into committee performance.",
    features: [
      {
        icon: FileBarChart,
        title: "Community Service Reports",
        description:
          "Generate individual member reports with all activities, hours, and evidence. PDF export with official branding.",
      },
      {
        icon: ClipboardList,
        title: "Committee Logbooks",
        description:
          "Export complete committee activity records. Excel format for IOU review and archival purposes.",
      },
      {
        icon: Users,
        title: "Member Analytics",
        description:
          "View participation rates, attendance trends, and engagement patterns. Identify members who may need support.",
      },
      {
        icon: Download,
        title: "Meeting Minutes Export",
        description:
          "Download structured meeting minutes as formatted documents. Professional layout for official records.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-clay-100/50 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="caption text-clay-700 mb-4">Platform Features</p>
            <h1 className="heading-1 text-ink-900 mb-6">
              Everything committees need to excel
            </h1>
            <p className="body-large text-ink-600">
              SCOS provides a complete toolkit for Student Committee governance — from
              planning to reporting, all in one integrated platform.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {featureCategories.map((category, categoryIndex) => (
              <div key={category.title}>
                <div className="mb-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-clay-700 to-clay-600 text-white">
                    <category.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h2 className="heading-2 text-ink-900 mb-2">{category.title}</h2>
                  <p className="body-large text-ink-600">{category.description}</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {category.features.map((feature) => (
                    <Card
                      key={feature.title}
                      className="border-ink-200 bg-ink-50/30 transition-all hover:border-clay-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-clay-700 shadow-sm">
                          <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="heading-4 text-ink-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="body-small text-ink-600">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {categoryIndex < featureCategories.length - 1 && (
                  <Separator className="mt-16 bg-ink-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="border-t border-ink-200 bg-ink-50/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-50 text-green-700">
                <Shield className="h-6 w-6" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="heading-2 text-ink-900 mb-4">
              Security you can trust
            </h2>
            <p className="body-large text-ink-600">
              SCOS is built on Supabase with enterprise-grade security. Row-Level Security
              (RLS) ensures members only see their own data. Google OAuth integration
              provides secure authentication. All data is encrypted at rest and in transit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

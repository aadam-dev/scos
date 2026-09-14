import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLowActivityMembers } from "@/lib/data";
import {
  Target,
  ClipboardList,
  CalendarDays,
  Users,
  FileText,
  Bell,
  Settings,
  ChevronRight,
  AlertTriangle,
  Video,
  Inbox,
  Archive,
} from "lucide-react";

const adminLinks = [
  {
    href: "/admin/planning",
    label: "Planning Board",
    description: "Plan committee activities and track progress",
    icon: Target,
  },
  {
    href: "/admin/activities",
    label: "General SC Logs",
    description: "Review team records and IOU submission status",
    icon: ClipboardList,
  },
  {
    href: "/admin/webinars",
    label: "Webinars",
    description: "Publish upcoming webinars and events with join links",
    icon: Video,
  },
  {
    href: "/admin/intake",
    label: "Intake inbox",
    description: "Internship interest and outreach signups",
    icon: Inbox,
  },
  {
    href: "/admin/outreach",
    label: "Outreach listings",
    description: "Publish Accra SC outreach opportunities",
    icon: ClipboardList,
  },
  {
    href: "/admin/archive",
    label: "Asset archive",
    description: "Upload legacy files for the next SC generation",
    icon: Archive,
  },
  {
    href: "/admin/meetings",
    label: "Meetings",
    description: "Open and close attendance sessions",
    icon: CalendarDays,
  },
  {
    href: "/admin/attendance",
    label: "Attendance Review",
    description: "Correct absences and excused statuses",
    icon: Users,
  },
  {
    href: "/admin/members",
    label: "Members",
    description: "Review roster and active-member risk",
    icon: Users,
  },
  {
    href: "/admin/reports",
    label: "Reports",
    description: "Generate member PDF reports",
    icon: FileText,
  },
  {
    href: "/notifications",
    label: "Notifications",
    description: "Review reminders and platform updates",
    icon: Bell,
  },
  {
    href: "/admin/committee",
    label: "Committee Settings",
    description: "Review semester and branding settings",
    icon: Settings,
  },
];

export default async function AdminPage() {
  const lowActivity = await getLowActivityMembers();

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="heading-3 text-ink-900">Admin Workspace</h1>
          <Badge variant="outline" className="bg-brand-50 text-brand-800 border-brand-200">
            Chair/Secretary
          </Badge>
        </div>
        <p className="body-small text-ink-600">
          Governance tools for committee leadership
        </p>
      </div>

      {/* Alert for low activity members */}
      {lowActivity.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink-900">
                {lowActivity.length} member{lowActivity.length === 1 ? "" : "s"} below active thresholds
              </p>
              <p className="text-sm text-ink-600">
                Review member participation in the Members section
              </p>
            </div>
            <Link href="/admin/members">
              <Button variant="outline" size="sm" className="border-amber-300 text-amber-800 hover:bg-amber-100">
                Review
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Admin Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="h-full border-ink-200 hover:border-brand-300 transition-all hover:shadow-md group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700 group-hover:bg-brand-700 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <ChevronRight className="h-5 w-5 text-ink-400 group-hover:text-brand-700 transition-colors" />
                  </div>
                  <CardTitle className="text-lg mt-3">{link.label}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

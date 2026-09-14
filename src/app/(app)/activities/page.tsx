import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { getMemberActivities, getMySemesterStats } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profile";
import { progressToHoursGoal } from "@/lib/compliance";
import {
  Plus,
  Activity,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Clock3,
  Download,
} from "lucide-react";

type ActivitiesPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function ActivitiesPage({ searchParams }: ActivitiesPageProps) {
  const profile = await requireProfile();
  const [activities, params, stats] = await Promise.all([
    getMemberActivities(),
    searchParams,
    getMySemesterStats(),
  ]);

  const supabase = await createClient();
  const { data: profileExtras } = await supabase
    .from("profiles")
    .select("target_hours")
    .eq("id", profile.id)
    .single();

  const targetHours = Number(profileExtras?.target_hours ?? 10);
  const progress = progressToHoursGoal(stats.total_hours, targetHours);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock3 className="h-4 w-4 text-amber-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="heading-3 text-ink-900">Service hours logbook</h1>
          <p className="body-small mt-1 text-ink-600">
            Build claimed hours across the semester, then export the PDF for submission.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/api/reports/${profile.id}`} target="_blank">
            <Button variant="outline" className="border-ink-300">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </Link>
          <Link href="/activities/new">
            <Button className="bg-brand-700 text-white hover:bg-brand-800">
              <Plus className="mr-2 h-4 w-4" />
              Add entry
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-ink-200 bg-ink-950 text-white">
        <CardContent className="grid gap-6 py-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-400">
              Semester claimed total
            </p>
            <p className="mt-2 font-mono text-4xl tabular-nums">
              {stats.total_hours.toFixed(2)}
              <span className="text-lg text-ink-400"> / {targetHours}h</span>
            </p>
            <Progress value={progress} className="mt-4 h-2 bg-ink-800" />
          </div>
          <div className="text-sm text-ink-300">
            <p>Status: {stats.member_status}</p>
            <p className="mt-1">Attendance: {stats.attendance_rate.toFixed(1)}%</p>
            <p className="mt-1">{activities.length} logbook entries</p>
          </div>
        </CardContent>
      </Card>

      {params.message ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{params.message}</AlertDescription>
        </Alert>
      ) : null}

      {activities.length === 0 ? (
        <Card className="border-ink-200">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
              <Activity className="h-8 w-8 text-brand-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-ink-900">Logbook is empty</h3>
            <p className="mx-auto mb-4 max-w-sm text-sm text-ink-600">
              Add your first service activity with evidence so chair or secretary can review it.
            </p>
            <Link href="/activities/new">
              <Button variant="outline" className="border-brand-300 text-brand-700 hover:bg-brand-50">
                <Plus className="mr-2 h-4 w-4" />
                Log your first entry
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <Card key={activity.id} className="border-ink-200">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    <CardDescription className="mt-1 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {activity.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {activity.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {(activity.claimed_hours ?? activity.submitted_hours ?? 0).toFixed(2)}h
                        claimed
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusVariant(activity.status ?? "pending")}>
                      <span className="mr-1 inline-flex">{getStatusIcon(activity.status ?? "pending")}</span>
                      {activity.status ?? "pending"}
                    </Badge>
                    {activity.lifecycle_status ? (
                      <Badge variant="outline" className="border-ink-200 font-mono text-[10px] uppercase">
                        {activity.lifecycle_status}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-ink-600">
                {activity.category} · {activity.participation_type}
                {activity.approved_hours ? (
                  <span className="ml-2 font-mono text-ink-800">
                    · {activity.approved_hours.toFixed(2)}h approved
                  </span>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

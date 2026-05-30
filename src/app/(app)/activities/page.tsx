import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMemberActivities } from "@/lib/data";
import { Plus, Activity, Calendar, MapPin, Clock, CheckCircle, XCircle, Clock3 } from "lucide-react";

type ActivitiesPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function ActivitiesPage({ searchParams }: ActivitiesPageProps) {
  const [activities, params] = await Promise.all([getMemberActivities(), searchParams]);

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
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="heading-3 text-ink-900">My Activities</h1>
          <p className="body-small text-ink-600 mt-1">
            Track submissions, evidence, and approved hours
          </p>
        </div>
        <Link href="/activities/new">
          <Button className="bg-clay-700 text-white hover:bg-clay-800">
            <Plus className="mr-2 h-4 w-4" />
            Log Activity
          </Button>
        </Link>
      </div>

      {/* Alert */}
      {params.message ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{params.message}</AlertDescription>
        </Alert>
      ) : null}

      {/* Activities List */}
      {activities.length === 0 ? (
        <Card className="border-ink-200">
          <CardContent className="py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-clay-100 mb-4">
              <Activity className="h-8 w-8 text-clay-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900 mb-2">No activities yet</h3>
            <p className="text-sm text-ink-600 max-w-sm mx-auto mb-4">
              Submit your first service activity with evidence so it can be reviewed by your committee.
            </p>
            <Link href="/activities/new">
              <Button variant="outline" className="border-clay-300 text-clay-700 hover:bg-clay-50">
                <Plus className="mr-2 h-4 w-4" />
                Log your first activity
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="border-ink-200 hover:border-clay-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {activity.location}
                      </span>
                      <span className="capitalize">{activity.category}</span>
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1.5 ${getStatusVariant(
                      activity.status ?? "pending"
                    )}`}
                  >
                    {getStatusIcon(activity.status ?? "pending")}
                    <span className="capitalize">{activity.status ?? "pending"}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3 text-sm">
                  <div className="flex items-center gap-2 text-ink-600">
                    <Clock className="h-4 w-4 text-clay-600" />
                    <span>
                      <span className="font-medium text-ink-900">
                        {activity.claimed_hours?.toFixed(2) ?? "0.00"}h
                      </span>{" "}
                      claimed
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-600">
                    <Activity className="h-4 w-4 text-clay-600" />
                    <span className="capitalize">{activity.participation_type === "on_ground" ? "On-ground" : "Virtual"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-600">
                    <CheckCircle className="h-4 w-4 text-clay-600" />
                    <span className="capitalize">{activity.lifecycle_status ?? "logged"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

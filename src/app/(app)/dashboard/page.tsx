import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  getActiveMeetings,
  getLeaderboard,
  getMemberActivities,
  getMySemesterStats,
} from "@/lib/data";
import { progressToHoursGoal } from "@/lib/compliance";
import { getCurrentProfile, isActiveMember } from "@/lib/profile";
import {
  Plus,
  Clock,
  Users,
  Calendar,
  ArrowRight,
  TrendingUp,
  Activity,
  FileText,
  ChevronRight,
} from "lucide-react";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();

  // If not logged in, the middleware should redirect to /orientation
  // But as a fallback, show a welcome state
  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-600 text-white shadow-xl">
          <Activity className="h-10 w-10" strokeWidth={1.5} />
        </div>
        <h1 className="heading-2 text-ink-900 mb-2">Welcome to SCOS</h1>
        <p className="body-large text-ink-600 mb-6 max-w-md">
          The Student Committee Operating System for IOU committees.
        </p>
        <Link href="/login">
          <Button size="lg" className="bg-brand-700 text-white hover:bg-brand-800">
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  if (!isActiveMember(profile)) {
    redirect("/membership");
  }

  const [stats, leaderboard, activities, activeMeetings] = await Promise.all([
    getMySemesterStats(),
    getLeaderboard(),
    getMemberActivities(),
    getActiveMeetings(),
  ]);

  const progress = progressToHoursGoal(stats.total_hours);
  const isStatusActive = stats.member_status === "active";
  const userInitials = profile.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="space-y-6 animate-in">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border border-ink-200">
            <AvatarFallback className="bg-gradient-to-br from-brand-700 to-brand-600 text-white font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="heading-3 text-ink-900">
              Welcome back, {profile.full_name?.split(" ")[0] || "Member"}
            </h1>
            <p className="body-small text-ink-600">
              Here&apos;s your committee activity overview
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/academy">
            <Button variant="outline" className="border-ink-300">
              Role academy
            </Button>
          </Link>
          <Badge
            variant="outline"
            className={`${
              isStatusActive
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            <span
              className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                isStatusActive ? "bg-green-600" : "bg-amber-600"
              }`}
            />
            {isStatusActive ? "Active Member" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-ink-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-500">Claimed Hours</p>
                <p className="mt-1 text-3xl font-bold text-ink-900">
                  {Number(stats.total_hours).toFixed(1)}h
                </p>
                <p className="mt-1 text-xs text-ink-500">Target: 10h</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Clock className="h-6 w-6" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-ink-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-500">Attendance</p>
                <p className="mt-1 text-3xl font-bold text-ink-900">
                  {Number(stats.attendance_rate).toFixed(0)}%
                </p>
                <p className="mt-1 text-xs text-ink-500">Target: 60%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Users className="h-6 w-6" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs">
              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              <span className="text-green-600 font-medium">On track</span>
              <span className="text-ink-400">this semester</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-ink-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-500">Active Meetings</p>
                <p className="mt-1 text-3xl font-bold text-ink-900">
                  {activeMeetings.length}
                </p>
                <p className="mt-1 text-xs text-ink-500">Open now</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Calendar className="h-6 w-6" strokeWidth={1.5} />
              </div>
            </div>
            {activeMeetings.length > 0 && (
              <div className="mt-4">
                <Link
                  href={`/meetings/${activeMeetings[0].id}`}
                  className="text-xs font-medium text-brand-700 hover:underline flex items-center gap-1"
                >
                  Join {activeMeetings[0].title}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-ink-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-500">Activities</p>
                <p className="mt-1 text-3xl font-bold text-ink-900">
                  {activities.length}
                </p>
                <p className="mt-1 text-xs text-ink-500">Logged this semester</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Activity className="h-6 w-6" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/activities/new"
                className="text-xs font-medium text-brand-700 hover:underline flex items-center gap-1"
              >
                Log new activity
                <Plus className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/activities/new">
          <Button
            variant="outline"
            className="w-full justify-start border-ink-200 text-ink-700 hover:bg-ink-50 hover:text-brand-700"
          >
            <Plus className="mr-2 h-4 w-4 text-brand-600" />
            Log Activity
          </Button>
        </Link>
        <Link href="/meetings">
          <Button
            variant="outline"
            className="w-full justify-start border-ink-200 text-ink-700 hover:bg-ink-50 hover:text-brand-700"
          >
            <Calendar className="mr-2 h-4 w-4 text-brand-600" />
            View Meetings
          </Button>
        </Link>
        <Link href="/reports">
          <Button
            variant="outline"
            className="w-full justify-start border-ink-200 text-ink-700 hover:bg-ink-50 hover:text-brand-700"
          >
            <FileText className="mr-2 h-4 w-4 text-brand-600" />
            Generate Report
          </Button>
        </Link>
        <Link href="/planning">
          <Button
            variant="outline"
            className="w-full justify-start border-ink-200 text-ink-700 hover:bg-ink-50 hover:text-brand-700"
          >
            <Clock className="mr-2 h-4 w-4 text-brand-600" />
            Planning Board
          </Button>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-ink-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest logged activities</CardDescription>
              </div>
              <Link href="/activities">
                <Button variant="ghost" size="sm" className="text-brand-700">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="rounded-lg border border-dashed border-ink-300 bg-ink-50/50 p-8 text-center">
                <Activity className="mx-auto h-8 w-8 text-ink-400 mb-2" />
                <p className="text-sm font-medium text-ink-700">No activities yet</p>
                <p className="text-xs text-ink-500 mt-1">
                  Start logging your community service activities
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg border border-ink-200 p-3 hover:bg-ink-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-900">{activity.title}</p>
                        <p className="text-xs text-ink-500">
                          {activity.claimed_hours?.toFixed(1) ?? "0.0"} hours • {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        activity.status === "approved"
                          ? "border-green-200 bg-green-50 text-green-800"
                          : activity.status === "rejected"
                          ? "border-red-200 bg-red-50 text-red-800"
                          : "border-amber-200 bg-amber-50 text-amber-800"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="border-ink-200">
          <CardHeader className="pb-4">
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Top contributors this semester</CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="rounded-lg border border-dashed border-ink-300 bg-ink-50/50 p-6 text-center">
                <Users className="mx-auto h-6 w-6 text-ink-400 mb-2" />
                <p className="text-xs text-ink-500">No data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : index === 1
                          ? "bg-slate-200 text-slate-700"
                          : index === 2
                          ? "bg-amber-100 text-amber-800"
                          : "bg-ink-100 text-ink-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8 border border-ink-200">
                      <AvatarFallback className="bg-gradient-to-br from-ink-200 to-ink-100 text-ink-700 text-xs">
                        {member.full_name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">
                        {member.full_name}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-brand-700">
                      {Number(member.total_hours).toFixed(1)}h
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

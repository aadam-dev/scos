import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMeetings } from "@/lib/data";
import { CalendarDays, MapPin, ChevronRight, Radio, Clock, Calendar, CheckCircle } from "lucide-react";

export default async function MeetingsPage() {
  const meetings = await getMeetings();

  const getStatusBadge = (meeting: {
    closed_at?: string | null;
    opened_at?: string | null;
    scheduled_at: string;
  }) => {
    if (meeting.closed_at) {
      return (
        <Badge variant="outline" className="bg-ink-50 text-ink-700 border-ink-200">
          <CheckCircle className="mr-1 h-3 w-3" />
          Closed
        </Badge>
      );
    }
    if (meeting.opened_at) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
          <Radio className="mr-1 h-3 w-3 animate-pulse" />
          Open for attendance
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
        <Calendar className="mr-1 h-3 w-3" />
        Scheduled
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="heading-3 text-ink-900">Meetings</h1>
          <p className="body-small text-ink-600 mt-1">
            View active, upcoming, and past committee sessions
          </p>
        </div>
        <Link href="/meetings/live">
          <Button className="bg-brand-700 text-white hover:bg-brand-800">
            <Radio className="mr-2 h-4 w-4" />
            Join Active Session
          </Button>
        </Link>
      </div>

      {/* Meetings List */}
      {meetings.length === 0 ? (
        <Card className="border-ink-200">
          <CardContent className="py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 mb-4">
              <CalendarDays className="h-8 w-8 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900 mb-2">No meetings yet</h3>
            <p className="text-sm text-ink-600 max-w-sm mx-auto">
              Meeting sessions will appear here after they are scheduled by your committee chair or secretary.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <Card
              key={meeting.id}
              className="border-ink-200 hover:border-brand-300 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1">{meeting.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(meeting.scheduled_at).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {meeting.location}
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(meeting)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-ink-600">
                    {meeting.closed_at
                      ? "Meeting completed"
                      : meeting.opened_at
                      ? "Meeting is currently open for attendance"
                      : "Meeting scheduled - awaiting opening"}
                  </p>
                  <Link href={`/meetings/${meeting.id}`}>
                    <Button variant="ghost" size="sm" className="text-brand-700 hover:text-brand-800 hover:bg-brand-50">
                      View details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/profile";
import { getMeetingDetail } from "@/lib/data";
import type { AgendaItem, StructuredMinutes } from "@/lib/meeting-minutes";

type MeetingDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string }>;
};

export default async function MeetingDetailPage({ params, searchParams }: MeetingDetailPageProps) {
  const { id } = await params;
  const [meeting, profile, query] = await Promise.all([
    getMeetingDetail(id),
    getCurrentProfile(),
    searchParams,
  ]);

  if (!meeting) notFound();

  const isAdmin = profile?.role === "chair" || profile?.role === "secretary";
  const minutes = meeting.minutes as {
    summary?: string;
    published_at?: string | null;
    structured_minutes?: StructuredMinutes;
    attendees_present?: string[];
  } | null;
  const published = Boolean(minutes?.published_at);
  const structured = minutes?.structured_minutes;
  const agenda = (meeting.agenda_items ?? []) as AgendaItem[];

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <Link href="/meetings" className="text-sm text-blue-800 hover:underline">
            Back to meetings
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{meeting.title}</h1>
          <p className="text-sm text-slate-600">
            {new Date(meeting.scheduled_at).toLocaleString()} / {meeting.location}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin ? (
            <Link
              href={`/admin/meetings/${meeting.id}/minutes`}
              className="inline-flex h-10 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              {published ? "Edit minutes" : "Write minutes"}
            </Link>
          ) : null}
          {published ? (
            <a
              href={`/api/exports/meeting-minutes/${meeting.id}`}
              className="inline-flex h-10 items-center rounded-md bg-blue-900 px-4 text-sm font-medium text-white hover:bg-blue-800"
            >
              Download PDF
            </a>
          ) : null}
        </div>
      </div>

      {query.message ? <Alert variant="success">{query.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>
            {meeting.closed_at ? "Meeting closed" : meeting.opened_at ? "Session active or ended" : "Scheduled"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant={published ? "active" : "inactive"}>
            {published ? "Minutes published" : "Minutes pending"}
          </Badge>
        </CardContent>
      </Card>

      {agenda.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Agenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            {agenda.map((item) => (
              <p key={item.order}>
                {item.order}. {item.topic}
              </p>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {published && structured ? (
        <div className="space-y-3">
          {structured.agenda_items.map((item) => (
            <Card key={item.order}>
              <CardHeader>
                <CardTitle className="text-base">
                  {item.order}. {item.topic}
                </CardTitle>
                {item.speaker || item.time_noted ? (
                  <CardDescription>
                    {[item.speaker, item.time_noted].filter(Boolean).join(" / ")}
                  </CardDescription>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                {item.discussion ? (
                  <div>
                    <p className="font-medium text-slate-900">Discussion</p>
                    <p className="whitespace-pre-wrap">{item.discussion}</p>
                  </div>
                ) : null}
                {item.decisions ? (
                  <div>
                    <p className="font-medium text-slate-900">Decisions</p>
                    <p className="whitespace-pre-wrap">{item.decisions}</p>
                  </div>
                ) : null}
                {item.action_items ? (
                  <div>
                    <p className="font-medium text-slate-900">Action items</p>
                    <p className="whitespace-pre-wrap">{item.action_items}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
          {structured.closing_notes ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Closing notes</CardTitle>
              </CardHeader>
              <CardContent className="whitespace-pre-wrap text-sm text-slate-700">
                {structured.closing_notes}
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : published && minutes?.summary ? (
        <Card>
          <CardHeader>
            <CardTitle>Minutes</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm text-slate-700">{minutes.summary}</CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-sm text-slate-600">
            Minutes are not published yet. The Secretary will post them after the meeting.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredMinutesForm } from "@/components/meetings/structured-minutes-form";
import { SyncActionsPanel } from "@/components/meetings/sync-actions-panel";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getCommitteeMembers, getMeetingDetail } from "@/lib/data";
import { requireAdminProfile } from "@/lib/profile";
import type { AgendaItem, StructuredMinutes } from "@/lib/meeting-minutes";

type AdminMinutesPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string }>;
};

export default async function AdminMeetingMinutesPage({ params, searchParams }: AdminMinutesPageProps) {
  const { id } = await params;
  const [, meeting, members, query] = await Promise.all([
    requireAdminProfile(),
    getMeetingDetail(id),
    getCommitteeMembers(),
    searchParams,
  ]);

  if (!meeting) notFound();

  const agenda = (meeting.agenda_items ?? []) as AgendaItem[];
  const resolvedAgenda =
    agenda.length > 0 ? agenda : [{ order: 1, topic: "General business" }];
  const minutes = meeting.minutes as {
    structured_minutes?: StructuredMinutes;
    attendees_present?: string[];
    published_at?: string | null;
    actions_synced_at?: string | null;
  } | null;
  const structured = (minutes?.structured_minutes ?? null) as StructuredMinutes | null;

  const supabase = await createClient();
  const { data: syncedItems } = await supabase
    .from("planning_items")
    .select("source_agenda_order")
    .eq("source_meeting_id", meeting.id);
  const existingSyncedOrders = (syncedItems ?? [])
    .map((row) => row.source_agenda_order)
    .filter((order): order is number => typeof order === "number");

  return (
    <div className="space-y-4">
      <div>
        <Link href="/admin/meetings" className="text-sm text-blue-800 hover:underline">
          Back to meetings
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Meeting Minutes</h1>
        <p className="text-sm text-slate-600">
          {meeting.title} / {new Date(meeting.scheduled_at).toLocaleString()} / {meeting.location}
        </p>
      </div>

      {query.message ? <Alert variant="success">{query.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Planning follow-up</CardTitle>
          <CardDescription>Push action items from published minutes to the planning board.</CardDescription>
        </CardHeader>
        <CardContent>
          <SyncActionsPanel
            meetingId={meeting.id}
            meetingTitle={meeting.title}
            published={Boolean(minutes?.published_at)}
            actionsSyncedAt={minutes?.actions_synced_at ?? null}
            structured={structured}
            existingSyncedOrders={existingSyncedOrders}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agenda</CardTitle>
          <CardDescription>
            {resolvedAgenda.map((item) => `${item.order}. ${item.topic}`).join(" / ")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StructuredMinutesForm
            meetingId={meeting.id}
            agenda={resolvedAgenda}
            existing={structured}
            attendeesPresent={minutes?.attendees_present ?? []}
            members={members}
            published={Boolean(minutes?.published_at)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { closeMeetingSession, openMeetingSession } from "@/actions/meetings";
import { AgendaPlanningPicker } from "@/components/meetings/agenda-planning-picker";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getMeetings, getPlanningItemsForAgenda } from "@/lib/data";

type AdminMeetingsPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function AdminMeetingsPage({ searchParams }: AdminMeetingsPageProps) {
  const [meetings, planningItems, params] = await Promise.all([
    getMeetings(),
    getPlanningItemsForAgenda(),
    searchParams,
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Meeting Administration</h1>
        <p className="text-sm text-slate-600">
          Pull agenda items from planning, open attendance, then publish structured minutes.
        </p>
      </div>
      {params.message ? <Alert variant="success">{params.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Open Meeting Session</CardTitle>
          <CardDescription>
            Select planning items and/or type extra agenda lines. The Secretary uses the same topics when writing minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={openMeetingSession} className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div>
              <Label htmlFor="scheduledAt">Scheduled At</Label>
              <Input id="scheduledAt" name="scheduledAt" type="datetime-local" required />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" required />
            </div>
            <div className="md:col-span-2">
              <AgendaPlanningPicker items={planningItems} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="agenda">Additional agenda lines (one per line)</Label>
              <Textarea
                id="agenda"
                name="agenda"
                rows={4}
                placeholder={"Opening and attendance\nAny item not on the planning board"}
              />
            </div>
            <div>
              <Label htmlFor="attendanceMode">Mode</Label>
              <Select id="attendanceMode" name="attendanceMode" defaultValue="button">
                <option value="button">Secure button</option>
                <option value="code">Session code</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="sessionMinutes">Session Minutes</Label>
              <Input id="sessionMinutes" name="sessionMinutes" type="number" min={5} max={180} defaultValue={20} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="sessionCode">Session Code (for code mode)</Label>
              <Input id="sessionCode" name="sessionCode" />
            </div>
            <div className="md:col-span-2">
              <FormSubmitButton pendingLabel="Opening...">Open Session</FormSubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {meetings.map((meeting) => (
          <Card key={meeting.id}>
            <CardHeader>
              <CardTitle>{meeting.title}</CardTitle>
              <CardDescription>{new Date(meeting.scheduled_at).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">{meeting.closed_at ? "Closed" : "Open or scheduled"}</p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/meetings/${meeting.id}`}
                  className="inline-flex h-9 items-center rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  View
                </Link>
                <Link
                  href={`/admin/meetings/${meeting.id}/minutes`}
                  className="inline-flex h-9 items-center rounded-md bg-blue-900 px-3 text-sm font-medium text-white hover:bg-blue-800"
                >
                  Minutes
                </Link>
                {!meeting.closed_at ? (
                  <form action={closeMeetingSession}>
                    <input type="hidden" name="meetingId" value={meeting.id} />
                    <FormSubmitButton variant="outline" pendingLabel="Closing...">
                      Close
                    </FormSubmitButton>
                  </form>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

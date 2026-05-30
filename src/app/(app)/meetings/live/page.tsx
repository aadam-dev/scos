import { markPresent } from "@/actions/meetings";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getActiveMeetings } from "@/lib/data";

type LiveMeetingPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function LiveMeetingPage({ searchParams }: LiveMeetingPageProps) {
  const [meetings, params] = await Promise.all([getActiveMeetings(), searchParams]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Live Attendance</h1>
        <p className="text-sm text-slate-600">Mark presence during an active meeting window.</p>
      </div>
      {params.message ? <Alert>{params.message}</Alert> : null}

      {meetings.length === 0 ? (
        <EmptyState
          title="No active meeting"
          description="When the chair or secretary opens Meeting Mode, it will appear here."
        />
      ) : (
        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id}>
              <CardHeader>
                <CardTitle>{meeting.title}</CardTitle>
                <CardDescription>
                  {meeting.location} / closes {meeting.session_expires_at ? new Date(meeting.session_expires_at).toLocaleTimeString() : "when ended"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={markPresent} className="space-y-3">
                  <input type="hidden" name="meetingId" value={meeting.id} />
                  <input type="hidden" name="markedVia" value={meeting.attendance_mode} />
                  {meeting.attendance_mode === "code" ? (
                    <div>
                      <Label htmlFor={`code-${meeting.id}`}>Session Code</Label>
                      <Input id={`code-${meeting.id}`} name="sessionCode" required />
                    </div>
                  ) : null}
                  <FormSubmitButton className="w-full" pendingLabel="Marking...">
                    Mark Present
                  </FormSubmitButton>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

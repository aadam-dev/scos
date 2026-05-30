import { updateAttendanceStatus } from "@/actions/meetings";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getCommitteeMembers, getMeetings } from "@/lib/data";

type AdminAttendancePageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function AdminAttendancePage({ searchParams }: AdminAttendancePageProps) {
  const [members, meetings, params] = await Promise.all([
    getCommitteeMembers(),
    getMeetings(),
    searchParams,
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Attendance Review</h1>
        <p className="text-sm text-slate-600">Record present, absent, or excused status for members.</p>
      </div>
      {params.message ? <Alert variant="success">{params.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Update Attendance</CardTitle>
          <CardDescription>Use this for corrections and excused absences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateAttendanceStatus} className="grid gap-3 md:grid-cols-3">
            <div>
              <Label htmlFor="meetingId">Meeting</Label>
              <Select id="meetingId" name="meetingId" required>
                {meetings.map((meeting) => (
                  <option key={meeting.id} value={meeting.id}>
                    {meeting.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="memberId">Member</Label>
              <Select id="memberId" name="memberId" required>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue="present">
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="excused">Excused</option>
              </Select>
            </div>
            <div className="md:col-span-3">
              <FormSubmitButton pendingLabel="Updating...">Update Attendance</FormSubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

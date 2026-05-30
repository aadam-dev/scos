import { markActivitySubmittedToIou } from "@/actions/activities";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { getCommitteeActivityLogs } from "@/lib/data";

type AdminActivitiesPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function AdminActivitiesPage({ searchParams }: AdminActivitiesPageProps) {
  const [rows, params] = await Promise.all([getCommitteeActivityLogs(), searchParams]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">General SC Logs</h1>
        <p className="text-sm text-slate-600">Review committee activity logs and mark exports submitted to IOU.</p>
      </div>
      <a
        href="/api/exports/committee-logbook"
        className="inline-flex h-10 items-center justify-center rounded-md bg-blue-900 px-4 text-sm font-medium text-white hover:bg-blue-800"
      >
        Download Committee Excel Logbook
      </a>
      {params.message ? <Alert variant="success">{params.message}</Alert> : null}

      {rows.length === 0 ? (
        <EmptyState title="No activity logs" description="General SC logs will appear here after members or admins record activity." />
      ) : (
        <div className="grid gap-4">
          {rows.map((row) => {
            const activity = Array.isArray(row.activities) ? row.activities[0] : row.activities;
            const member = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
            return (
              <Card key={`${activity?.id}-${row.member_id}`}>
                <CardHeader>
                  <CardTitle>{activity?.title ?? "Activity"}</CardTitle>
                  <CardDescription>
                    {member?.full_name ?? "Member"} claimed {Number(row.claimed_minutes ?? row.submitted_minutes ?? 0) / 60}h / {activity?.lifecycle_status ?? "logged"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600">
                    {activity?.date} / {activity?.category} / {activity?.location}
                  </p>
                  <form action={markActivitySubmittedToIou}>
                    <input type="hidden" name="activityId" value={activity?.id ?? ""} />
                    <FormSubmitButton variant="outline" pendingLabel="Marking...">
                      Mark Submitted to IOU
                    </FormSubmitButton>
                  </form>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { requireAdminProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { updateIntakeStatus } from "@/actions/public-tools";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Select } from "@/components/ui/select";

type Props = { searchParams: Promise<{ message?: string }> };

export default async function AdminIntakePage({ searchParams }: Props) {
  await requireAdminProfile();
  const { message } = await searchParams;
  const supabase = await createClient();

  const [{ data: internships }, { data: signups }] = await Promise.all([
    supabase
      .from("internship_applications")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("outreach_signups")
      .select("*, outreach_opportunities(title)")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="heading-3 text-ink-900">Intake inbox</h1>
        <p className="body-small mt-1 text-ink-600">
          Internship interest and outreach signups from the public site.
        </p>
      </div>

      {message ? <Alert variant="success">{message}</Alert> : null}

      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle>Internship applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(internships ?? []).length === 0 ? (
            <p className="text-sm text-ink-500">No applications yet.</p>
          ) : (
            (internships ?? []).map((row) => (
              <div key={row.id} className="rounded-xl border border-ink-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink-900">{row.full_name}</p>
                    <p className="text-sm text-ink-600">
                      {row.email}
                      {row.phone ? ` · ${row.phone}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-ink-500">
                      {row.track} · {row.school_program || "No school listed"}
                    </p>
                  </div>
                  <Badge variant="outline">{row.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-ink-700">{row.motivation}</p>
                <form action={updateIntakeStatus} className="mt-3 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="kind" value="internship" />
                  <input type="hidden" name="id" value={row.id} />
                  <Select name="status" defaultValue={row.status} className="w-40">
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="accepted">accepted</option>
                    <option value="declined">declined</option>
                  </Select>
                  <FormSubmitButton pendingLabel="Saving...">Update</FormSubmitButton>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle>Outreach signups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(signups ?? []).length === 0 ? (
            <p className="text-sm text-ink-500">No signups yet.</p>
          ) : (
            (signups ?? []).map((row) => {
              const opportunity = Array.isArray(row.outreach_opportunities)
                ? row.outreach_opportunities[0]
                : row.outreach_opportunities;
              return (
                <div key={row.id} className="rounded-xl border border-ink-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-ink-900">{row.full_name}</p>
                      <p className="text-sm text-ink-600">
                        {row.email}
                        {row.phone ? ` · ${row.phone}` : ""}
                      </p>
                      <p className="mt-1 text-xs text-ink-500">
                        For: {opportunity?.title ?? "Outreach opportunity"}
                      </p>
                    </div>
                    <Badge variant="outline">{row.status}</Badge>
                  </div>
                  {row.note ? <p className="mt-3 text-sm text-ink-700">{row.note}</p> : null}
                  <form action={updateIntakeStatus} className="mt-3 flex flex-wrap items-end gap-2">
                    <input type="hidden" name="kind" value="outreach" />
                    <input type="hidden" name="id" value={row.id} />
                    <Select name="status" defaultValue={row.status} className="w-40">
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="accepted">accepted</option>
                      <option value="declined">declined</option>
                    </Select>
                    <FormSubmitButton pendingLabel="Saving...">Update</FormSubmitButton>
                  </form>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-ink-500">
        Manage published outreach listings on{" "}
        <Link href="/admin/outreach" className="text-brand-700 underline">
          Admin Outreach
        </Link>
        .
      </p>
    </div>
  );
}

import { requireAdminProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { upsertOutreachOpportunity } from "@/actions/public-tools";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = { searchParams: Promise<{ message?: string }> };

export default async function AdminOutreachPage({ searchParams }: Props) {
  await requireAdminProfile();
  const { message } = await searchParams;
  const supabase = await createClient();
  const { data: opportunities } = await supabase
    .from("outreach_opportunities")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="heading-3 text-ink-900">Outreach listings</h1>
        <p className="body-small mt-1 text-ink-600">
          Publish shifts that appear on the public outreach page.
        </p>
      </div>

      {message ? <Alert variant="success">{message}</Alert> : null}

      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle>New opportunity</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertOutreachOpportunity} className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" name="summary" required rows={3} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" />
            </div>
            <div>
              <Label htmlFor="hoursEstimate">Hours estimate</Label>
              <Input id="hoursEstimate" name="hoursEstimate" type="number" step="0.25" />
            </div>
            <div>
              <Label htmlFor="startsOn">Starts on</Label>
              <Input id="startsOn" name="startsOn" type="date" />
            </div>
            <div>
              <Label htmlFor="endsOn">Ends on</Label>
              <Input id="endsOn" name="endsOn" type="date" />
            </div>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" name="published" />
              Publish on public outreach page
            </label>
            <div className="md:col-span-2">
              <FormSubmitButton pendingLabel="Saving...">Save opportunity</FormSubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {(opportunities ?? []).map((op) => (
          <Card key={op.id} className="border-ink-200">
            <CardContent className="flex flex-wrap items-start justify-between gap-3 py-5">
              <div>
                <p className="font-semibold text-ink-900">{op.title}</p>
                <p className="mt-1 text-sm text-ink-600">{op.summary}</p>
              </div>
              <Badge variant="outline">{op.published ? "published" : "draft"}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

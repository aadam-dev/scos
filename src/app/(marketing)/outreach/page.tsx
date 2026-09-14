import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitOutreachSignup } from "@/actions/public-tools";

export const metadata: Metadata = {
  title: "Outreach - Ghana Accra Student Committee",
  description: "Join Accra SC outreach shifts and build toward community service hours.",
};

type Props = { searchParams: Promise<{ message?: string }> };

async function getPublishedOutreach() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("outreach_opportunities")
      .select("id, title, summary, location, hours_estimate, starts_on, ends_on")
      .eq("published", true)
      .order("starts_on", { ascending: true, nullsFirst: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function OutreachPage({ searchParams }: Props) {
  const [{ message }, opportunities] = await Promise.all([searchParams, getPublishedOutreach()]);

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">Outreach</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-ink-950 md:text-5xl">
          Link up with Accra SC on the ground
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-600">
          Sign up for published shifts. The committee contacts you first. Community service hours
          start after you become a member and log the activity in SCOS.
        </p>

        {message ? (
          <Alert className="mt-6" variant="success">
            {message}
          </Alert>
        ) : null}

        <div className="mt-12 space-y-8">
          {opportunities.length === 0 ? (
            <Card className="border-ink-200">
              <CardContent className="py-10 text-center text-sm text-ink-600">
                No outreach openings are published right now. Check back soon or contact Accra SC.
              </CardContent>
            </Card>
          ) : (
            opportunities.map((op) => (
              <Card key={op.id} className="border-ink-200">
                <CardHeader>
                  <CardTitle>{op.title}</CardTitle>
                  <CardDescription>{op.summary}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 lg:grid-cols-2">
                  <dl className="space-y-2 text-sm text-ink-700">
                    {op.location ? (
                      <div>
                        <dt className="font-mono text-xs uppercase text-ink-500">Location</dt>
                        <dd>{op.location}</dd>
                      </div>
                    ) : null}
                    {op.hours_estimate != null ? (
                      <div>
                        <dt className="font-mono text-xs uppercase text-ink-500">Hours estimate</dt>
                        <dd>{op.hours_estimate}h</dd>
                      </div>
                    ) : null}
                    {op.starts_on || op.ends_on ? (
                      <div>
                        <dt className="font-mono text-xs uppercase text-ink-500">Window</dt>
                        <dd>
                          {op.starts_on ?? "TBC"}
                          {op.ends_on ? ` to ${op.ends_on}` : ""}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  <form action={submitOutreachSignup} className="grid gap-3">
                    <input type="hidden" name="opportunityId" value={op.id} />
                    <div>
                      <Label htmlFor={`name-${op.id}`}>Full name</Label>
                      <Input id={`name-${op.id}`} name="fullName" required />
                    </div>
                    <div>
                      <Label htmlFor={`email-${op.id}`}>Email</Label>
                      <Input id={`email-${op.id}`} name="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor={`phone-${op.id}`}>Phone</Label>
                      <Input id={`phone-${op.id}`} name="phone" />
                    </div>
                    <div>
                      <Label htmlFor={`note-${op.id}`}>Note</Label>
                      <Textarea id={`note-${op.id}`} name="note" rows={3} />
                    </div>
                    <div className="hidden" aria-hidden="true">
                      <Input name="website" tabIndex={-1} autoComplete="off" />
                    </div>
                    <FormSubmitButton pendingLabel="Sending...">Sign up for this shift</FormSubmitButton>
                  </form>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

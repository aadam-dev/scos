import { requireAdminProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { deleteWebinar, upsertWebinar } from "@/actions/public-tools";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = { searchParams: Promise<{ message?: string }> };

export default async function AdminWebinarsPage({ searchParams }: Props) {
  await requireAdminProfile();
  const { message } = await searchParams;
  const supabase = await createClient();
  const { data: webinars } = await supabase
    .from("sc_webinars")
    .select("*")
    .order("starts_at", { ascending: true });

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="heading-3 text-ink-900">Webinars and events</h1>
        <p className="body-small mt-1 text-ink-600">
          Publish upcoming sessions with join links. They appear on the public webinars board for
          every SC visitor.
        </p>
      </div>

      {message ? <Alert variant="success">{message}</Alert> : null}

      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle>Post a session</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertWebinar} className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" name="summary" required rows={3} />
            </div>
            <div>
              <Label htmlFor="hostLabel">Host label (optional)</Label>
              <Input
                id="hostLabel"
                name="hostLabel"
                placeholder="Defaults to your committee name"
              />
            </div>
            <div>
              <Label htmlFor="format">Format</Label>
              <Select id="format" name="format" defaultValue="webinar">
                <option value="webinar">Webinar</option>
                <option value="workshop">Workshop</option>
                <option value="info_session">Info session</option>
                <option value="meeting">Open meeting</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="startsAt">Starts at</Label>
              <Input id="startsAt" name="startsAt" type="datetime-local" required />
            </div>
            <div>
              <Label htmlFor="endsAt">Ends at</Label>
              <Input id="endsAt" name="endsAt" type="datetime-local" />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" name="timezone" defaultValue="Africa/Accra" />
            </div>
            <div>
              <Label htmlFor="audience">Audience</Label>
              <Input id="audience" name="audience" placeholder="IOU students, public, etc." />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="joinUrl">Join URL</Label>
              <Input id="joinUrl" name="joinUrl" type="url" required placeholder="https://" />
            </div>
            <div>
              <Label htmlFor="registrationUrl">Registration URL</Label>
              <Input id="registrationUrl" name="registrationUrl" type="url" placeholder="https://" />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input id="contactEmail" name="contactEmail" type="email" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="location">Location / platform note</Label>
              <Input id="location" name="location" placeholder="Zoom, Meet, Accra venue..." />
            </div>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" name="published" defaultChecked />
              Publish on /webinars
            </label>
            <div className="md:col-span-2">
              <FormSubmitButton pendingLabel="Saving...">Publish session</FormSubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {(webinars ?? []).map((event) => (
          <Card key={event.id} className="border-ink-200">
            <CardContent className="flex flex-wrap items-start justify-between gap-3 py-5">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{event.format}</Badge>
                  <Badge variant="outline">{event.published ? "published" : "draft"}</Badge>
                </div>
                <p className="mt-2 font-semibold text-ink-900">{event.title}</p>
                <p className="mt-1 text-sm text-ink-600">
                  {new Date(event.starts_at).toLocaleString()} · {event.timezone}
                </p>
                <a
                  href={event.join_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-brand-700 underline"
                >
                  Join link
                </a>
              </div>
              <form action={deleteWebinar}>
                <input type="hidden" name="id" value={event.id} />
                <FormSubmitButton pendingLabel="Removing...">Remove</FormSubmitButton>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { createActivity } from "@/actions/activities";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type NewActivityPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function NewActivityPage({ searchParams }: NewActivityPageProps) {
  const { message } = await searchParams;

  return (
    <div className="space-y-4">
      {message ? <Alert variant="warning">{message}</Alert> : null}
      <Card>
        <CardHeader>
          <CardTitle>Activity Submission</CardTitle>
          <CardDescription>
            Submit activity details and evidence. Hours are credited after chair or secretary review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createActivity} className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select id="category" name="category" defaultValue="Outreach">
                <option>Outreach</option>
                <option>Webinar</option>
                <option>Mentorship</option>
                <option>Community Visit</option>
                <option>Administration</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="durationMinutes">Duration (minutes)</Label>
              <Input id="durationMinutes" name="durationMinutes" type="number" min={1} required />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="participationType">Participation Type</Label>
              <Select id="participationType" name="participationType" defaultValue="on_ground">
                <option value="on_ground">On-ground</option>
                <option value="virtual">Virtual</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="file">Evidence (optional)</Label>
              <Input id="file" name="file" type="file" accept="image/*,.pdf" />
              <p className="mt-1 text-xs text-slate-500">
                Upload a photo or PDF that helps verify participation.
              </p>
            </div>
            <div className="md:col-span-2">
              <FormSubmitButton pendingLabel="Submitting...">Submit for Review</FormSubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

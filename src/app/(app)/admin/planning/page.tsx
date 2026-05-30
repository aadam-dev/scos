import Link from "next/link";
import { createPlanningItem, updatePlanningItemStatus } from "@/actions/planning";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getPlanningItems } from "@/lib/data";

type PlanningPageProps = {
  searchParams: Promise<{ message?: string }>;
};

const statusOptions = ["idea", "planned", "scheduled", "active", "completed", "archived"] as const;

export default async function AdminPlanningPage({ searchParams }: PlanningPageProps) {
  const [items, params] = await Promise.all([getPlanningItems(), searchParams]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Planning Board</h1>
        <p className="text-sm text-slate-600">
          Plan SC activities. Items can be pulled into meeting agendas and created from published minutes.
        </p>
      </div>
      {params.message ? <Alert variant="success">{params.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Create Plan Item</CardTitle>
          <CardDescription>Use this for Awareness Month, booths, info sessions, webinars, and calling tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPlanningItem} className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select id="category" name="category" defaultValue="Outreach">
                <option>Outreach</option>
                <option>Awareness Month</option>
                <option>Meeting</option>
                <option>Webinar</option>
                <option>Social Media</option>
                <option>Calling Task</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue="planned">
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input id="targetDate" name="targetDate" type="date" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" />
            </div>
            <div>
              <Label htmlFor="expectedMinutes">Expected Minutes</Label>
              <Input id="expectedMinutes" name="expectedMinutes" type="number" min={0} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>
            <div className="md:col-span-2">
              <FormSubmitButton pendingLabel="Creating...">Create Plan Item</FormSubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="No planned work" description="Add the next committee activity to start building the operations board." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  {item.category}
                  {item.synced_from_minutes_at ? " / from minutes" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>{item.description}</p>
                <p>{item.target_date ?? "No date"} / {item.location ?? "No location"}</p>
                {item.source_meeting_id ? (
                  <Link href={`/meetings/${item.source_meeting_id}`} className="font-medium text-blue-800 hover:underline">
                    View source meeting
                  </Link>
                ) : null}
                <form action={updatePlanningItemStatus} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="itemId" value={item.id} />
                  <div className="min-w-[140px]">
                    <Label htmlFor={`status-${item.id}`}>Status</Label>
                    <Select id={`status-${item.id}`} name="status" defaultValue={item.status}>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <FormSubmitButton variant="outline" pendingLabel="Updating...">
                    Update
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

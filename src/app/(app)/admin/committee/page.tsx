import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCommitteeSettings } from "@/lib/data";

export default async function AdminCommitteePage() {
  const committee = await getCommitteeSettings();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Committee Settings</h1>
        <p className="text-sm text-slate-600">Review branding, signatories, and reporting period.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{committee?.name ?? "Committee"}</CardTitle>
          <CardDescription>{committee?.location ?? "Location not configured"}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <p>Chair: {committee?.chair_name ?? "Not set"}</p>
          <p>Secretary: {committee?.secretary_name ?? "Not set"}</p>
          <p>Semester Start: {committee?.semester_start ?? "Not set"}</p>
          <p>Semester End: {committee?.semester_end ?? "Not set"}</p>
        </CardContent>
      </Card>
    </div>
  );
}

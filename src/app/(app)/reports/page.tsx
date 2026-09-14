import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportLinkForm } from "@/components/reports/report-link-form";
import { requireProfile } from "@/lib/profile";
import { getMemberActivities, getMySemesterStats } from "@/lib/data";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

export default async function ReportsPage() {
  const profile = await requireProfile();
  const [stats, activities] = await Promise.all([getMySemesterStats(), getMemberActivities()]);

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="heading-3 text-ink-900">Reports</h1>
        <p className="body-small mt-1 text-ink-600">
          Preview your logbook, then download the PDF submission template.
        </p>
      </div>

      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle>Logbook preview</CardTitle>
          <CardDescription>
            Matches what goes into the community service PDF for this semester.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-ink-50 p-4">
              <p className="font-mono text-xs uppercase text-ink-500">Claimed hours</p>
              <p className="mt-1 font-mono text-2xl tabular-nums text-ink-950">
                {stats.total_hours.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl bg-ink-50 p-4">
              <p className="font-mono text-xs uppercase text-ink-500">Attendance</p>
              <p className="mt-1 font-mono text-2xl tabular-nums text-ink-950">
                {stats.attendance_rate.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-xl bg-ink-50 p-4">
              <p className="font-mono text-xs uppercase text-ink-500">Entries</p>
              <p className="mt-1 font-mono text-2xl tabular-nums text-ink-950">
                {activities.length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-ink-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Activity</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2 text-right">Hours</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-ink-500">
                      No activities yet. Add entries in the logbook first.
                    </td>
                  </tr>
                ) : (
                  activities.map((a) => (
                    <tr key={a.id} className="border-t border-ink-100">
                      <td className="px-3 py-2 font-mono text-xs">{a.date}</td>
                      <td className="px-3 py-2">{a.title}</td>
                      <td className="px-3 py-2 text-ink-600">{a.category}</td>
                      <td className="px-3 py-2 text-right font-mono">
                        {(a.claimed_hours ?? a.approved_hours ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-ink-200">
          <CardHeader className="pb-4">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              <FileText className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <CardTitle>Community Service PDF</CardTitle>
            <CardDescription>
              Letterhead logbook with running total and chair/secretary sign-off lines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportLinkForm profile={profile} />
          </CardContent>
        </Card>

        <Card className="border-ink-200">
          <CardHeader className="pb-4">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <FileSpreadsheet className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <CardTitle>Excel Logbook</CardTitle>
            <CardDescription>
              Spreadsheet export for detailed committee review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/api/exports/individual-logbook">
              <Button variant="outline" className="w-full border-ink-300 text-ink-700 hover:bg-ink-50">
                <Download className="mr-2 h-4 w-4" />
                Download Excel Logbook
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      <Card className="border-ink-200 bg-ink-50/50">
        <CardContent className="pt-6">
          <p className="text-sm text-ink-600">
            <span className="font-medium text-ink-900">Note:</span> Final approval of community
            service hours is completed by IOU outside SCOS. Use the PDF as your local submission
            pack after chair or secretary review.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

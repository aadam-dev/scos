import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportLinkForm } from "@/components/reports/report-link-form";
import { requireProfile } from "@/lib/profile";
import { FileText, Download, FileSpreadsheet } from "lucide-react";

export default async function ReportsPage() {
  const profile = await requireProfile();

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="heading-3 text-ink-900">Reports</h1>
        <p className="body-small text-ink-600 mt-1">
          Generate and download your community service documentation
        </p>
      </div>

      {/* Report Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-ink-200">
          <CardHeader className="pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-clay-100 text-clay-700 mb-4">
              <FileText className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <CardTitle>Community Service Report</CardTitle>
            <CardDescription>
              Download your current semester community service report as a formatted PDF.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportLinkForm profile={profile} />
          </CardContent>
        </Card>

        <Card className="border-ink-200">
          <CardHeader className="pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 mb-4">
              <FileSpreadsheet className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <CardTitle>Excel Logbook</CardTitle>
            <CardDescription>
              Download your complete activity log as an Excel spreadsheet for detailed review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/api/exports/individual-logbook">
              <Button
                variant="outline"
                className="w-full border-ink-300 text-ink-700 hover:bg-ink-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Excel Logbook
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="border-ink-200 bg-ink-50/50">
        <CardContent className="pt-6">
          <p className="text-sm text-ink-600">
            <span className="font-medium text-ink-900">Note:</span> Reports include only
            approved activities. Pending or rejected activities will not appear in your
            final community service report. Contact your chair or secretary if you
            have questions about activity status.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

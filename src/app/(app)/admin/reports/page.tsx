import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberReportForm } from "@/components/reports/member-report-form";
import { getCommitteeMembers } from "@/lib/data";

export default async function AdminReportsPage() {
  const members = await getCommitteeMembers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Reports</CardTitle>
        <CardDescription>Generate branded community service reports for committee members.</CardDescription>
      </CardHeader>
      <CardContent>
        <MemberReportForm members={members} />
      </CardContent>
    </Card>
  );
}

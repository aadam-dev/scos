import { NextResponse } from "next/server";
import { getReportContext } from "@/actions/reports";
import { buildCommunityServiceReport } from "@/lib/pdf/community-service-report";

type RouteParams = {
  params: Promise<{ memberId: string }>;
};

export async function GET(_req: Request, { params }: RouteParams) {
  const { memberId } = await params;
  let report;

  try {
    report = await getReportContext(memberId);
  } catch {
    return NextResponse.json({ message: "Report not available." }, { status: 403 });
  }

  const semesterStart = report.committee?.semester_start
    ? new Date(report.committee.semester_start).getTime()
    : null;
  const semesterEnd = report.committee?.semester_end
    ? new Date(report.committee.semester_end).getTime()
    : null;
  const activities = report.activities
    .map((row) => {
      const activity = Array.isArray(row.activities) ? row.activities[0] : row.activities;
      return {
        date: String(activity?.date ?? ""),
        title: String(activity?.title ?? "Activity"),
        category: String(activity?.category ?? ""),
        location: String(activity?.location ?? ""),
        participationType: String(activity?.participation_type ?? ""),
        hours: Number(row.claimed_minutes ?? row.approved_minutes ?? 0) / 60,
      };
    })
    .filter((activity) => {
      if (!semesterStart || !semesterEnd || !activity.date) return true;
      const activityTime = new Date(activity.date).getTime();
      return activityTime >= semesterStart && activityTime <= semesterEnd;
    });

  const pdf = await buildCommunityServiceReport({
    memberName: report.profile.full_name,
    memberRole: report.profile.role,
    joinedDate: report.profile.joined_date,
    committeeName: report.committee?.name ?? "Committee",
    committeeLocation: report.committee?.location ?? "",
    reportPeriod:
      report.committee?.semester_start && report.committee?.semester_end
        ? `${report.committee.semester_start} to ${report.committee.semester_end}`
        : "Current semester",
    attendanceRate: Number(report.stats?.attendance_rate ?? 0),
    totalHours: Number(report.stats?.total_hours ?? 0),
    memberStatus: String(report.stats?.member_status ?? "inactive"),
    chairName: report.committee?.chair_name ?? "Chair",
    secretaryName: report.committee?.secretary_name ?? "Secretary",
    activities,
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="community-service-${memberId}.pdf"`,
    },
  });
}

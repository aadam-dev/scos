import { NextResponse } from "next/server";
import { getCommitteeActivityLogs, getCommitteeSettings } from "@/lib/data";
import { buildCommitteeLogbook } from "@/lib/export/logbook";
import { requireAdminProfile } from "@/lib/profile";

export async function GET() {
  await requireAdminProfile();
  const [settings, rows] = await Promise.all([getCommitteeSettings(), getCommitteeActivityLogs()]);

  const normalizedRows = rows.map((row) => {
    const activity = Array.isArray(row.activities) ? row.activities[0] : row.activities;
    const member = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      memberName: member?.full_name ?? "Member",
      title: activity?.title ?? "Activity",
      date: activity?.date ?? "",
      category: activity?.category ?? "",
      location: activity?.location ?? "",
      claimedHours: Number(row.claimed_minutes ?? row.submitted_minutes ?? 0) / 60,
      lifecycleStatus: activity?.lifecycle_status ?? "logged",
    };
  });

  const workbook = await buildCommitteeLogbook({
    committeeName: settings?.name ?? "Student Committee",
    rows: normalizedRows,
  });

  return new NextResponse(new Uint8Array(workbook as ArrayBuffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="scos-committee-logbook.xlsx"`,
    },
  });
}

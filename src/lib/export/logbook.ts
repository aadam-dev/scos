import ExcelJS from "exceljs";
import type { ActivitySummary, Profile } from "@/lib/types";

export async function buildIndividualLogbook({
  profile,
  activities,
}: {
  profile: Profile;
  activities: ActivitySummary[];
}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SCOS";
  workbook.created = new Date();

  const summary = workbook.addWorksheet("Member Summary");
  summary.columns = [
    { header: "Field", key: "field", width: 24 },
    { header: "Value", key: "value", width: 40 },
  ];
  summary.addRows([
    { field: "Member", value: profile.full_name },
    { field: "Email", value: profile.email },
    { field: "Role", value: profile.role },
    { field: "Joined Date", value: profile.joined_date },
    { field: "Total Claimed Hours", value: activities.reduce((sum, item) => sum + (item.claimed_hours ?? 0), 0) },
    { field: "Review Note", value: "SCOS records claimed hours. Final approval is completed by IOU." },
  ]);

  const log = workbook.addWorksheet("Personal Log");
  log.columns = [
    { header: "Date", key: "date", width: 16 },
    { header: "Activity", key: "title", width: 32 },
    { header: "Category", key: "category", width: 20 },
    { header: "Location", key: "location", width: 24 },
    { header: "Participation Type", key: "participation_type", width: 20 },
    { header: "Claimed Hours", key: "claimed_hours", width: 16 },
    { header: "Lifecycle Status", key: "lifecycle_status", width: 20 },
  ];
  log.addRows(activities);

  return workbook.xlsx.writeBuffer();
}

export async function buildCommitteeLogbook({
  committeeName,
  rows,
}: {
  committeeName: string;
  rows: Array<{
    memberName: string;
    title: string;
    date: string;
    category: string;
    location: string;
    claimedHours: number;
    lifecycleStatus: string;
  }>;
}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SCOS";
  workbook.created = new Date();

  const summary = workbook.addWorksheet("Committee Summary");
  summary.columns = [
    { header: "Field", key: "field", width: 24 },
    { header: "Value", key: "value", width: 40 },
  ];
  summary.addRows([
    { field: "Committee", value: committeeName },
    { field: "General Logs", value: rows.length },
    { field: "Total Claimed Hours", value: rows.reduce((sum, row) => sum + row.claimedHours, 0) },
    { field: "Review Note", value: "SCOS records claimed hours. Final approval is completed by IOU." },
  ]);

  const log = workbook.addWorksheet("General SC Logs");
  log.columns = [
    { header: "Date", key: "date", width: 16 },
    { header: "Activity", key: "title", width: 32 },
    { header: "Member", key: "memberName", width: 24 },
    { header: "Category", key: "category", width: 20 },
    { header: "Location", key: "location", width: 24 },
    { header: "Claimed Hours", key: "claimedHours", width: 16 },
    { header: "Status", key: "lifecycleStatus", width: 20 },
  ];
  log.addRows(rows);

  return workbook.xlsx.writeBuffer();
}

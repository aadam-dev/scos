import { minutesToHours } from "@/lib/utils";

export function semesterKeyFromDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const month = d.getUTCMonth() + 1;
  const semester = month <= 6 ? "S1" : "S2";
  return `${d.getUTCFullYear()}-${semester}`;
}

export function computeApprovedHours(approvedMinutes: number) {
  return minutesToHours(approvedMinutes);
}

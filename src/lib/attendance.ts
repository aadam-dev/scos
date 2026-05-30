import type { AttendanceStatus } from "@/lib/types";

export function attendanceRate(statuses: AttendanceStatus[]) {
  const eligible = statuses.filter((status) => status !== "excused");
  if (eligible.length === 0) return 0;
  const present = eligible.filter((status) => status === "present").length;
  return Math.round((present / eligible.length) * 10000) / 100;
}

export function isMeetingSessionOpen(sessionExpiresAt: string | null) {
  if (!sessionExpiresAt) return true;
  return new Date(sessionExpiresAt).getTime() > Date.now();
}

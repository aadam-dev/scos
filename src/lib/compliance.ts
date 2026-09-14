export const ACTIVE_ATTENDANCE_THRESHOLD = 60;
export const ACTIVE_HOURS_THRESHOLD = 10;

export function isMemberActive(attendanceRate: number, totalHours: number) {
  return (
    attendanceRate >= ACTIVE_ATTENDANCE_THRESHOLD &&
    totalHours >= ACTIVE_HOURS_THRESHOLD
  );
}

export function progressToHoursGoal(totalHours: number, targetHours = ACTIVE_HOURS_THRESHOLD) {
  const goal = targetHours > 0 ? targetHours : ACTIVE_HOURS_THRESHOLD;
  return Math.max(0, Math.min(100, (totalHours / goal) * 100));
}

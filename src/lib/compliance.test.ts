import { describe, expect, it } from "vitest";
import { isMemberActive, progressToHoursGoal } from "@/lib/compliance";
import { attendanceRate } from "@/lib/attendance";
import { semesterKeyFromDate } from "@/lib/hours";

describe("SCOS compliance rules", () => {
  it("requires both attendance and hours thresholds", () => {
    expect(isMemberActive(60, 10)).toBe(true);
    expect(isMemberActive(59, 10)).toBe(false);
    expect(isMemberActive(60, 9.99)).toBe(false);
  });

  it("calculates attendance excluding excused meetings", () => {
    expect(attendanceRate(["present", "absent", "excused"])).toBe(50);
    expect(attendanceRate(["excused"])).toBe(0);
  });

  it("caps hour progress at 100 percent", () => {
    expect(progressToHoursGoal(5)).toBe(50);
    expect(progressToHoursGoal(12)).toBe(100);
  });

  it("builds semester keys from dates", () => {
    expect(semesterKeyFromDate("2026-02-01")).toBe("2026-S1");
    expect(semesterKeyFromDate("2026-08-01")).toBe("2026-S2");
  });
});

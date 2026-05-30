import { describe, expect, it } from "vitest";
import { meetingNeedsMinutesReminder } from "@/lib/meeting-reminders";

describe("meetingNeedsMinutesReminder", () => {
  it("returns true when closed 48h+ ago without published minutes", () => {
    const closedAt = new Date(Date.now() - 49 * 60 * 60 * 1000).toISOString();
    expect(
      meetingNeedsMinutesReminder({
        closed_at: closedAt,
        minutes_reminder_sent_at: null,
        hasPublishedMinutes: false,
      }),
    ).toBe(true);
  });

  it("returns false when minutes already published", () => {
    const closedAt = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
    expect(
      meetingNeedsMinutesReminder({
        closed_at: closedAt,
        minutes_reminder_sent_at: null,
        hasPublishedMinutes: true,
      }),
    ).toBe(false);
  });
});

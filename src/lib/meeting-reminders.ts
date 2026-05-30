const REMINDER_AFTER_MS = 48 * 60 * 60 * 1000;

export type MeetingNeedingMinutesReminder = {
  id: string;
  title: string;
  committee_id: string;
  closed_at: string;
};

export function meetingNeedsMinutesReminder(meeting: {
  closed_at: string | null;
  minutes_reminder_sent_at: string | null;
  hasPublishedMinutes: boolean;
}): boolean {
  if (!meeting.closed_at || meeting.minutes_reminder_sent_at || meeting.hasPublishedMinutes) {
    return false;
  }

  const closedAt = new Date(meeting.closed_at).getTime();
  return Date.now() - closedAt >= REMINDER_AFTER_MS;
}

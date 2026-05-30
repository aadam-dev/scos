import { createAdminClient } from "@/lib/supabase/admin";
import { meetingNeedsMinutesReminder } from "@/lib/meeting-reminders";

export async function processMeetingMinutesReminders() {
  const supabase = createAdminClient();

  const { data: meetings } = await supabase
    .from("meetings")
    .select("id, title, committee_id, closed_at, minutes_reminder_sent_at, meeting_minutes(published_at)")
    .not("closed_at", "is", null)
    .is("minutes_reminder_sent_at", null)
    .limit(50);

  let reminded = 0;

  for (const meeting of meetings ?? []) {
    const minutes = Array.isArray(meeting.meeting_minutes)
      ? meeting.meeting_minutes[0]
      : meeting.meeting_minutes;

    const needsReminder = meetingNeedsMinutesReminder({
      closed_at: meeting.closed_at,
      minutes_reminder_sent_at: meeting.minutes_reminder_sent_at,
      hasPublishedMinutes: Boolean(minutes?.published_at),
    });

    if (!needsReminder) continue;

    const { data: admins } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("committee_id", meeting.committee_id)
      .in("role", ["chair", "secretary"]);

    if (admins?.length) {
      await supabase.from("notifications").insert(
        admins.map((admin) => ({
          committee_id: meeting.committee_id,
          recipient_id: admin.id,
          type: "minutes_reminder",
          title: "Meeting minutes pending",
          body: `Publish minutes for "${meeting.title}".`,
          href: `/admin/meetings/${meeting.id}/minutes`,
        })),
      );

      await supabase.from("email_events").insert(
        admins.map((admin) => ({
          committee_id: meeting.committee_id,
          recipient_id: admin.id,
          to_email: admin.email,
          subject: `SCOS: Publish minutes for ${meeting.title}`,
          template: "meeting_minutes_reminder",
          payload: {
            title: meeting.title,
            href: `/admin/meetings/${meeting.id}/minutes`,
          },
          status: "queued",
        })),
      );
    }

    await supabase
      .from("meetings")
      .update({ minutes_reminder_sent_at: new Date().toISOString() })
      .eq("id", meeting.id);

    reminded += 1;
  }

  return reminded;
}

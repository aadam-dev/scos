import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { processMeetingMinutesReminders } from "@/lib/cron/meeting-minutes-reminders";
import { sendEmailEvent } from "@/lib/email";

export async function POST(request: Request) {
  const secret = request.headers.get("x-scos-cron-secret");

  if (!process.env.SCOS_CRON_SECRET || secret !== process.env.SCOS_CRON_SECRET) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminClient();
  const { data: events } = await supabase
    .from("email_events")
    .select("id")
    .eq("status", "queued")
    .lte("scheduled_for", new Date().toISOString())
    .limit(25);

  for (const event of events ?? []) {
    await sendEmailEvent(event.id);
  }

  const minutesReminders = await processMeetingMinutesReminders();

  return NextResponse.json({
    processed: events?.length ?? 0,
    minutesReminders,
  });
}

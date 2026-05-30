import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profile";
import { buildMeetingMinutesPdf } from "@/lib/pdf/meeting-minutes-report";
import type { StructuredMinutes } from "@/lib/meeting-minutes";

type RouteParams = {
  params: Promise<{ meetingId: string }>;
};

export async function GET(_req: Request, { params }: RouteParams) {
  const { meetingId } = await params;

  try {
    await requireProfile();
  } catch {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const supabase = await createClient();

  const { data: meeting } = await supabase
    .from("meetings")
    .select("id, title, scheduled_at, location, committee_id")
    .eq("id", meetingId)
    .single();

  if (!meeting) {
    return NextResponse.json({ message: "Meeting not found." }, { status: 404 });
  }

  const { data: minutes } = await supabase
    .from("meeting_minutes")
    .select("summary, published_at, structured_minutes, attendees_present, created_by")
    .eq("meeting_id", meetingId)
    .single();

  if (!minutes?.published_at) {
    return NextResponse.json({ message: "Minutes not published." }, { status: 403 });
  }

  const [{ data: committee }, { data: secretary }] = await Promise.all([
    supabase.from("committees").select("name").eq("id", meeting.committee_id).single(),
    minutes.created_by
      ? supabase.from("profiles").select("full_name").eq("id", minutes.created_by).single()
      : Promise.resolve({ data: null }),
  ]);

  let attendeeNames: string[] = [];
  const attendeeIds = (minutes.attendees_present ?? []) as string[];
  if (attendeeIds.length) {
    const { data: profiles } = await supabase.from("profiles").select("full_name").in("id", attendeeIds);
    attendeeNames = (profiles ?? []).map((row) => row.full_name);
  }

  const structured = (minutes.structured_minutes ?? { agenda_items: [] }) as StructuredMinutes;

  const pdf = await buildMeetingMinutesPdf({
    committeeName: committee?.name ?? "Student Committee",
    meetingTitle: meeting.title,
    scheduledAt: new Date(meeting.scheduled_at).toLocaleString(),
    location: meeting.location,
    publishedAt: new Date(minutes.published_at).toLocaleString(),
    secretaryName: secretary?.full_name ?? "Secretary",
    attendees: attendeeNames,
    summary: minutes.summary ?? "",
    structured,
  });

  const filename = `meeting-minutes-${meeting.id.slice(0, 8)}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

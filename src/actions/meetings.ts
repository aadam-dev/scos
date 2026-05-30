"use server";

import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { parseAgendaLines } from "@/lib/meeting-minutes";
import { mergeAgendaFromPlanningAndText, parsePlanningItemIds } from "@/lib/planning-sync";
import { requireAdminProfile, requireProfile } from "@/lib/profile";

const meetingSchema = z.object({
  title: z.string().min(3),
  scheduledAt: z.string().min(1),
  location: z.string().min(2),
  attendanceMode: z.enum(["button", "code"]),
  sessionMinutes: z.coerce.number().min(5).max(180),
});

export async function openMeetingSession(formData: FormData) {
  const parsed = meetingSchema.safeParse({
    title: formData.get("title"),
    scheduledAt: formData.get("scheduledAt"),
    location: formData.get("location"),
    attendanceMode: formData.get("attendanceMode"),
    sessionMinutes: formData.get("sessionMinutes"),
  });

  if (!parsed.success) return redirect("/admin/meetings?message=Check meeting details.");

  const code = String(formData.get("sessionCode") || "");
  const agendaText = String(formData.get("agenda") || "");
  const planningItemIds = parsePlanningItemIds(formData);
  const supabase = await createClient();
  const profile = await requireAdminProfile();

  let planningTitles: string[] = [];
  if (planningItemIds.length) {
    const { data: planningItems } = await supabase
      .from("planning_items")
      .select("id, title")
      .in("id", planningItemIds)
      .eq("committee_id", profile.committee_id);

    planningTitles = (planningItems ?? []).map((item) => item.title);

    await supabase
      .from("planning_items")
      .update({ status: "scheduled" })
      .in("id", planningItemIds)
      .eq("committee_id", profile.committee_id);
  }

  const agendaItems =
    planningTitles.length > 0
      ? mergeAgendaFromPlanningAndText(planningTitles, agendaText)
      : parseAgendaLines(agendaText);

  const expiresAt = new Date(Date.now() + parsed.data.sessionMinutes * 60 * 1000).toISOString();
  const codeHash =
    parsed.data.attendanceMode === "code" && code
      ? createHash("sha256").update(code).digest("hex")
      : null;

  const { data, error } = await supabase
    .from("meetings")
    .insert({
      committee_id: profile.committee_id,
      title: parsed.data.title,
      scheduled_at: parsed.data.scheduledAt,
      location: parsed.data.location,
      attendance_mode: parsed.data.attendanceMode,
      session_code_hash: codeHash,
      opened_at: new Date().toISOString(),
      session_expires_at: expiresAt,
      agenda_items: agendaItems,
      linked_planning_item_ids: planningItemIds,
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (error || !data) return redirect("/admin/meetings?message=Could not open session.");
  revalidatePath("/meetings");
  return redirect("/admin/meetings?message=Meeting session opened.");
}

export async function markPresent(formData: FormData) {
  const meetingId = String(formData.get("meetingId") || "");
  const sessionCode = String(formData.get("sessionCode") || "");
  const markedVia = String(formData.get("markedVia") || "button");

  if (!meetingId) return redirect("/meetings/live?message=Choose an active meeting.");

  const supabase = await createClient();
  const profile = await requireProfile();

  const { data: meeting } = await supabase
    .from("meetings")
    .select("attendance_mode, session_code_hash, session_expires_at, closed_at")
    .eq("id", meetingId)
    .single();

  if (!meeting || meeting.closed_at) return redirect("/meetings/live?message=Session is closed.");
  if (meeting.session_expires_at && new Date(meeting.session_expires_at).getTime() < Date.now()) {
    return redirect("/meetings/live?message=Session expired.");
  }

  if (meeting.attendance_mode === "code") {
    const inputHash = createHash("sha256").update(sessionCode).digest("hex");
    if (!meeting.session_code_hash || inputHash !== meeting.session_code_hash) {
      return redirect("/meetings/live?message=Invalid session code.");
    }
  }

  const { error } = await supabase.from("attendance").insert({
      meeting_id: meetingId,
      member_id: profile.id,
      status: "present",
      marked_via: markedVia === "code" ? "code" : "button",
      marked_at: new Date().toISOString(),
    });

  if (error) return redirect("/meetings/live?message=Attendance already recorded or unavailable.");
  revalidatePath("/");
  return redirect("/meetings/live?message=Attendance marked.");
}

export async function closeMeetingSession(formData: FormData) {
  const meetingId = String(formData.get("meetingId") || "");
  if (!meetingId) return redirect("/admin/meetings?message=Missing meeting.");

  const supabase = await createClient();
  await requireAdminProfile();
  await supabase
    .from("meetings")
    .update({ closed_at: new Date().toISOString() })
    .eq("id", meetingId);

  revalidatePath("/meetings");
  revalidatePath("/admin/meetings");
  return redirect("/admin/meetings?message=Meeting closed.");
}

export async function updateAttendanceStatus(formData: FormData) {
  const meetingId = String(formData.get("meetingId") || "");
  const memberId = String(formData.get("memberId") || "");
  const status = String(formData.get("status") || "");

  if (!meetingId || !memberId || !["present", "absent", "excused"].includes(status)) {
    return redirect("/admin/attendance?message=Missing attendance data.");
  }

  const supabase = await createClient();
  await requireAdminProfile();
  await supabase.from("attendance").upsert(
    {
      meeting_id: meetingId,
      member_id: memberId,
      status,
      marked_via: "button",
      marked_at: new Date().toISOString(),
    },
    { onConflict: "meeting_id,member_id" },
  );

  revalidatePath("/admin/attendance");
  return redirect("/admin/attendance?message=Attendance updated.");
}

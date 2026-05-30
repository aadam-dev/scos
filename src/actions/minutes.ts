"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  buildMinutesActionItems,
  buildMinutesDecisions,
  buildMinutesSummary,
  parseAttendeeIds,
  parseStructuredMinutesFromForm,
  type AgendaItem,
  type StructuredMinutes,
} from "@/lib/meeting-minutes";
import { extractPlanningActionCandidates } from "@/lib/planning-sync";
import { requireAdminProfile } from "@/lib/profile";

const meetingIdSchema = z.string().uuid();

async function loadMeetingAgenda(supabase: Awaited<ReturnType<typeof createClient>>, meetingId: string) {
  const { data } = await supabase
    .from("meetings")
    .select("agenda_items")
    .eq("id", meetingId)
    .single();

  const agenda = (data?.agenda_items ?? []) as AgendaItem[];
  return agenda.length ? agenda : [{ order: 1, topic: "General business" }];
}

async function upsertMinutes(
  meetingId: string,
  structured: StructuredMinutes,
  attendeesPresent: string[],
  published: boolean,
  createdBy: string,
) {
  const supabase = await createClient();
  const summary = buildMinutesSummary(structured);

  await supabase.from("meeting_minutes").upsert(
    {
      meeting_id: meetingId,
      summary,
      decisions: buildMinutesDecisions(structured),
      action_items: buildMinutesActionItems(structured),
      structured_minutes: structured,
      attendees_present: attendeesPresent,
      published_at: published ? new Date().toISOString() : null,
      created_by: createdBy,
    },
    { onConflict: "meeting_id" },
  );
}

export async function saveMeetingMinutesDraft(formData: FormData) {
  const meetingId = String(formData.get("meetingId") || "");
  const parsedId = meetingIdSchema.safeParse(meetingId);
  if (!parsedId.success) {
    return redirect("/admin/meetings?message=Invalid meeting.");
  }

  const supabase = await createClient();
  const profile = await requireAdminProfile();
  const agenda = await loadMeetingAgenda(supabase, parsedId.data);
  const structured = parseStructuredMinutesFromForm(formData, agenda);
  const attendeesPresent = parseAttendeeIds(formData);

  await upsertMinutes(parsedId.data, structured, attendeesPresent, false, profile.id);

  revalidatePath(`/admin/meetings/${parsedId.data}/minutes`);
  revalidatePath(`/meetings/${parsedId.data}`);
  return redirect(`/admin/meetings/${parsedId.data}/minutes?message=Draft saved.`);
}

export async function publishStructuredMeetingMinutes(formData: FormData) {
  const meetingId = String(formData.get("meetingId") || "");
  const parsedId = meetingIdSchema.safeParse(meetingId);
  if (!parsedId.success) {
    return redirect("/admin/meetings?message=Invalid meeting.");
  }

  const supabase = await createClient();
  const profile = await requireAdminProfile();
  const agenda = await loadMeetingAgenda(supabase, parsedId.data);
  const structured = parseStructuredMinutesFromForm(formData, agenda);

  const hasContent = structured.agenda_items.some(
    (item) => item.discussion?.trim() || item.decisions?.trim(),
  );
  if (!hasContent && !structured.closing_notes?.trim()) {
    return redirect(
      `/admin/meetings/${parsedId.data}/minutes?message=Add discussion or decisions before publishing.`,
    );
  }

  const attendeesPresent = parseAttendeeIds(formData);
  await upsertMinutes(parsedId.data, structured, attendeesPresent, true, profile.id);

  const { data: members } = await supabase
    .from("profiles")
    .select("id")
    .eq("committee_id", profile.committee_id);

  if (members?.length) {
    await supabase.from("notifications").insert(
      members.map((member) => ({
        committee_id: profile.committee_id,
        recipient_id: member.id,
        type: "meeting_minutes",
        title: "Meeting minutes published",
        body: "Structured minutes are now available for members.",
        href: `/meetings/${parsedId.data}`,
      })),
    );
  }

  revalidatePath("/meetings");
  revalidatePath("/admin/meetings");
  revalidatePath(`/meetings/${parsedId.data}`);
  return redirect(`/meetings/${parsedId.data}?message=Minutes published.`);
}

export async function syncMinuteActionsToPlanning(formData: FormData) {
  const meetingId = String(formData.get("meetingId") || "");
  const parsedId = meetingIdSchema.safeParse(meetingId);
  if (!parsedId.success) {
    return redirect("/admin/meetings?message=Invalid meeting.");
  }

  const supabase = await createClient();
  const profile = await requireAdminProfile();

  const { data: meeting } = await supabase
    .from("meetings")
    .select("id, title, meeting_minutes(structured_minutes, published_at, actions_synced_at)")
    .eq("id", parsedId.data)
    .single();

  const minutes = Array.isArray(meeting?.meeting_minutes)
    ? meeting.meeting_minutes[0]
    : meeting?.meeting_minutes;

  if (!meeting || !minutes?.published_at) {
    return redirect(
      `/admin/meetings/${parsedId.data}/minutes?message=Publish minutes before syncing action items.`,
    );
  }

  const structured = (minutes.structured_minutes ?? { agenda_items: [] }) as StructuredMinutes;
  const candidates = extractPlanningActionCandidates(structured, meeting.title);

  if (!candidates.length) {
    return redirect(
      `/admin/meetings/${parsedId.data}/minutes?message=No action items found in minutes.`,
    );
  }

  const { data: existing } = await supabase
    .from("planning_items")
    .select("source_agenda_order")
    .eq("source_meeting_id", parsedId.data);

  const existingOrders = new Set((existing ?? []).map((row) => row.source_agenda_order));
  const toCreate = candidates.filter((item) => !existingOrders.has(item.sourceAgendaOrder));

  if (toCreate.length) {
    await supabase.from("planning_items").insert(
      toCreate.map((item) => ({
        committee_id: profile.committee_id,
        title: item.title,
        category: item.category,
        description: item.description,
        status: "planned",
        owner_id: profile.id,
        created_by: profile.id,
        source_meeting_id: parsedId.data,
        source_agenda_order: item.sourceAgendaOrder,
        synced_from_minutes_at: new Date().toISOString(),
      })),
    );
  }

  await supabase
    .from("meeting_minutes")
    .update({ actions_synced_at: new Date().toISOString() })
    .eq("meeting_id", parsedId.data);

  revalidatePath("/admin/planning");
  revalidatePath("/planning");
  revalidatePath(`/admin/meetings/${parsedId.data}/minutes`);

  const createdCount = toCreate.length;
  const skippedCount = candidates.length - createdCount;

  return redirect(
    `/admin/meetings/${parsedId.data}/minutes?message=${createdCount} action item(s) added to planning.${skippedCount ? ` ${skippedCount} already synced.` : ""}`,
  );
}

/** @deprecated Use structured minutes flow instead. */
export async function publishMeetingMinutes(formData: FormData) {
  const meetingId = String(formData.get("meetingId") || "");
  const summary = String(formData.get("summary") || "");
  if (!meetingId || summary.length < 10) {
    return redirect("/admin/meetings?message=Check meeting minutes.");
  }

  const supabase = await createClient();
  const profile = await requireAdminProfile();

  await supabase.from("meeting_minutes").upsert(
    {
      meeting_id: meetingId,
      summary,
      decisions: String(formData.get("decisions") || "") || null,
      action_items: String(formData.get("actionItems") || "") || null,
      published_at: new Date().toISOString(),
      created_by: profile.id,
    },
    { onConflict: "meeting_id" },
  );

  revalidatePath("/meetings");
  revalidatePath("/admin/meetings");
  return redirect("/admin/meetings?message=Minutes published.");
}

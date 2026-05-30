"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profile";

const activitySchema = z.object({
  title: z.string().min(3),
  date: z.string().min(1),
  category: z.string().min(2),
  description: z.string().min(10),
  durationMinutes: z.coerce.number().min(1),
  location: z.string().min(2),
  participationType: z.enum(["on_ground", "virtual"]),
});

export async function createActivity(formData: FormData) {
  const parsed = activitySchema.safeParse({
    title: formData.get("title"),
    date: formData.get("date"),
    category: formData.get("category"),
    description: formData.get("description"),
    durationMinutes: formData.get("durationMinutes"),
    location: formData.get("location"),
    participationType: formData.get("participationType"),
  });

  if (!parsed.success) {
    return redirect("/activities/new?message=Check the activity details and try again.");
  }

  const supabase = await createClient();
  const profile = await requireProfile();

  const { data: activity, error } = await supabase
    .from("activities")
    .insert({
      committee_id: profile.committee_id,
      title: parsed.data.title,
      date: parsed.data.date,
      category: parsed.data.category,
      description: parsed.data.description,
      duration_minutes: parsed.data.durationMinutes,
      location: parsed.data.location,
      participation_type: parsed.data.participationType,
      created_by: profile.id,
      status: "approved",
      lifecycle_status: "logged",
      expected_minutes: parsed.data.durationMinutes,
    })
    .select("id")
    .single();

  if (error || !activity) {
    return redirect("/activities/new?message=Could not submit activity.");
  }

  await supabase.from("activity_participants").insert({
    activity_id: activity.id,
    member_id: profile.id,
    submitted_minutes: parsed.data.durationMinutes,
    claimed_minutes: parsed.data.durationMinutes,
    approved_minutes: parsed.data.durationMinutes,
  });

  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    await storeActivityMedia(activity.id, file);
  }

  revalidatePath("/activities");
  revalidatePath("/admin/activities");
  return redirect("/activities?message=Activity logged. Export it when ready for IOU review.");
}

async function storeActivityMedia(activityId: string, file: File) {
  const supabase = await createClient();
  const profile = await requireProfile();

  const { data: activity } = await supabase
    .from("activities")
    .select("id, committee_id, created_by")
    .eq("id", activityId)
    .single();

  if (!activity || activity.committee_id !== profile.committee_id) return;

  const fileExt = file.name.split(".").pop() || "bin";
  const storagePath = `${activityId}/${crypto.randomUUID()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from("activity-media")
    .upload(storagePath, file, { upsert: false });

  if (uploadError) return;

  await supabase.from("activity_media").insert({
    activity_id: activityId,
    storage_path: storagePath,
    public_url: null,
    mime_type: file.type || "application/octet-stream",
    uploaded_by: profile.id,
  });
}

export async function uploadActivityMedia(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");
  const file = formData.get("file");

  if (!activityId || !(file instanceof File)) {
    return redirect("/activities?message=Missing upload data.");
  }

  await storeActivityMedia(activityId, file);
  revalidatePath("/activities");
  return redirect(`/activities?message=Evidence uploaded.`);
}

export async function markActivitySubmittedToIou(formData: FormData) {
  const activityId = String(formData.get("activityId") || "");

  if (!activityId) {
    return redirect("/admin/activities?message=Missing log data.");
  }

  const supabase = await createClient();
  const profile = await requireProfile();

  const { data: activity } = await supabase
    .from("activities")
    .select("committee_id")
    .eq("id", activityId)
    .single();

  if (!activity || activity.committee_id !== profile.committee_id) {
    return redirect("/admin/activities?message=Log is outside your committee.");
  }

  await supabase
    .from("activities")
    .update({
      lifecycle_status: "submitted_to_iou",
      submitted_to_iou_at: new Date().toISOString(),
    })
    .eq("id", activityId);

  revalidatePath("/");
  revalidatePath("/admin/activities");
  return redirect("/admin/activities?message=Log marked as submitted to IOU.");
}

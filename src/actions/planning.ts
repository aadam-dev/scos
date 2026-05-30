"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/lib/profile";
import { queueCommitteeEmail } from "@/lib/email";

const planningSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  description: z.string().min(5),
  status: z.enum(["idea", "planned", "scheduled", "active", "completed", "archived"]),
  targetDate: z.string().optional(),
  location: z.string().optional(),
  expectedMinutes: z.coerce.number().min(0).optional(),
});

export async function createPlanningItem(formData: FormData) {
  const parsed = planningSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    status: formData.get("status") || "planned",
    targetDate: formData.get("targetDate") || undefined,
    location: formData.get("location") || undefined,
    expectedMinutes: formData.get("expectedMinutes") || undefined,
  });

  if (!parsed.success) {
    return redirect("/admin/planning?message=Check planning details.");
  }

  const supabase = await createClient();
  const profile = await requireAdminProfile();
  const { error } = await supabase.from("planning_items").insert({
    committee_id: profile.committee_id,
    title: parsed.data.title,
    category: parsed.data.category,
    description: parsed.data.description,
    status: parsed.data.status,
    target_date: parsed.data.targetDate || null,
    location: parsed.data.location || null,
    expected_minutes: parsed.data.expectedMinutes ?? null,
    created_by: profile.id,
    owner_id: profile.id,
  });

  if (error) {
    return redirect("/admin/planning?message=Could not create plan item.");
  }

  await queueCommitteeEmail({
    committeeId: profile.committee_id,
    template: "planned_activity_created",
    subject: `SCOS: Planned Activity - ${parsed.data.title}`,
    payload: {
      title: parsed.data.title,
      date: parsed.data.targetDate,
      location: parsed.data.location,
    },
  });

  revalidatePath("/admin/planning");
  revalidatePath("/planning");
  return redirect("/admin/planning?message=Planning item created.");
}

export async function updatePlanningItemStatus(formData: FormData) {
  const itemId = String(formData.get("itemId") || "");
  const status = String(formData.get("status") || "");

  if (!itemId || !["idea", "planned", "scheduled", "active", "completed", "archived"].includes(status)) {
    return redirect("/admin/planning?message=Invalid status update.");
  }

  const supabase = await createClient();
  const profile = await requireAdminProfile();

  const { error } = await supabase
    .from("planning_items")
    .update({ status })
    .eq("id", itemId)
    .eq("committee_id", profile.committee_id);

  if (error) {
    return redirect("/admin/planning?message=Could not update status.");
  }

  revalidatePath("/admin/planning");
  revalidatePath("/planning");
  return redirect("/admin/planning?message=Status updated.");
}

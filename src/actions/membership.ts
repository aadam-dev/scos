"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/lib/profile";

const rosterSchema = z.object({
  email: z.string().email(),
  fullName: z.string().optional(),
  suggestedRole: z.enum(["chair", "secretary", "member"]).default("member"),
  notes: z.string().optional(),
});

const requestSchema = z.object({
  committeeId: z.string().uuid(),
  message: z.string().min(10).max(500),
});

export async function addRosterInvite(formData: FormData) {
  const parsed = rosterSchema.safeParse({
    email: String(formData.get("email") || "").trim().toLowerCase(),
    fullName: String(formData.get("fullName") || "").trim() || undefined,
    suggestedRole: String(formData.get("suggestedRole") || "member"),
    notes: String(formData.get("notes") || "").trim() || undefined,
  });

  if (!parsed.success) {
    return redirect("/admin/members?message=Check roster invite details.");
  }

  const supabase = await createClient();
  const profile = await requireAdminProfile();

  const { error } = await supabase.from("committee_roster").upsert(
    {
      committee_id: profile.committee_id,
      email: parsed.data.email,
      full_name: parsed.data.fullName ?? null,
      suggested_role: parsed.data.suggestedRole,
      status: "invited",
      invited_by: profile.id,
      notes: parsed.data.notes ?? null,
      claimed_by: null,
      claimed_at: null,
    },
    { onConflict: "committee_id,email" },
  );

  if (error) {
    return redirect("/admin/members?message=Could not save roster invite.");
  }

  revalidatePath("/admin/members");
  return redirect("/admin/members?message=Roster invite saved.");
}

export async function revokeRosterInvite(formData: FormData) {
  const rosterId = String(formData.get("rosterId") || "");
  if (!rosterId) return redirect("/admin/members?message=Missing roster row.");

  const supabase = await createClient();
  const profile = await requireAdminProfile();

  await supabase
    .from("committee_roster")
    .update({ status: "revoked" })
    .eq("id", rosterId)
    .eq("committee_id", profile.committee_id);

  revalidatePath("/admin/members");
  return redirect("/admin/members?message=Roster invite revoked.");
}

export async function requestCommitteeMembership(formData: FormData) {
  const parsed = requestSchema.safeParse({
    committeeId: String(formData.get("committeeId") || ""),
    message: String(formData.get("message") || "").trim(),
  });

  if (!parsed.success) {
    return redirect("/membership?message=Select a committee and add a short introduction.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_status, committee_id")
    .eq("id", user.id)
    .single();

  if (!profile || profile.membership_status !== "pending_review" || profile.committee_id) {
    return redirect("/membership?message=You already have committee access or a request in progress.");
  }

  const { error } = await supabase.from("membership_requests").upsert(
    {
      committee_id: parsed.data.committeeId,
      user_id: user.id,
      status: "pending",
      message: parsed.data.message,
      reviewed_by: null,
      reviewed_at: null,
    },
    { onConflict: "committee_id,user_id" },
  );

  if (error) {
    return redirect("/membership?message=Could not submit request.");
  }

  revalidatePath("/membership");
  revalidatePath("/admin/members");
  return redirect("/membership?message=Request submitted. Your chair or secretary will review it.");
}

export async function reviewMembershipRequest(formData: FormData) {
  const requestId = String(formData.get("requestId") || "");
  const decision = String(formData.get("decision") || "");

  if (!requestId || !["approved", "rejected"].includes(decision)) {
    return redirect("/admin/members?message=Invalid review action.");
  }

  const supabase = await createClient();
  const admin = await requireAdminProfile();

  const { data: request } = await supabase
    .from("membership_requests")
    .select("id, user_id, committee_id, status")
    .eq("id", requestId)
    .eq("committee_id", admin.committee_id)
    .single();

  if (!request || request.status !== "pending") {
    return redirect("/admin/members?message=Request not found or already reviewed.");
  }

  const now = new Date().toISOString();

  await supabase
    .from("membership_requests")
    .update({
      status: decision,
      reviewed_by: admin.id,
      reviewed_at: now,
    })
    .eq("id", requestId);

  if (decision === "approved") {
    await supabase
      .from("profiles")
      .update({
        committee_id: request.committee_id,
        membership_status: "active",
        joined_date: now.slice(0, 10),
      })
      .eq("id", request.user_id);

    await supabase.from("notifications").insert({
      committee_id: admin.committee_id,
      recipient_id: request.user_id,
      type: "membership_approved",
      title: "SC membership approved",
      body: "You can now complete orientation and access SCOS.",
      href: "/orientation",
    });
  } else {
    await supabase.from("notifications").insert({
      committee_id: admin.committee_id,
      recipient_id: request.user_id,
      type: "membership_rejected",
      title: "SC membership request update",
      body: "Your join request was not approved. Contact your SC leadership if this is unexpected.",
      href: "/membership",
    });
  }

  revalidatePath("/admin/members");
  revalidatePath("/membership");
  return redirect(`/admin/members?message=Request ${decision}.`);
}

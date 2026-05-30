"use server";

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profile";

export async function getReportContext(memberId: string) {
  const supabase = await createClient();
  const viewer = await requireProfile();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, joined_date, committee_id")
    .eq("id", memberId)
    .single();

  if (!profile) {
    throw new Error("Member not found.");
  }

  const isAdmin = viewer.role === "chair" || viewer.role === "secretary";
  if (viewer.id !== memberId && (!isAdmin || viewer.committee_id !== profile.committee_id)) {
    throw new Error("Forbidden.");
  }

  const { data: committee } = await supabase
    .from("committees")
    .select("name, location, chair_name, secretary_name, logo_url, semester_start, semester_end")
    .eq("id", profile.committee_id)
    .single();

  const { data: stats } = await supabase
    .from("member_semester_stats")
    .select("attendance_rate, total_hours, member_status")
    .eq("member_id", memberId)
    .single();

  const { data: activities } = await supabase
    .from("activity_participants")
    .select(
      "approved_minutes, submitted_minutes, claimed_minutes, activities(date, title, category, location, participation_type, status, lifecycle_status)",
    )
    .eq("member_id", memberId)
    .gt("claimed_minutes", 0);

  return {
    profile,
    committee,
    stats,
    activities: activities ?? [],
  };
}

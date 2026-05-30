import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CommitteeRole, Profile } from "@/lib/types";
import { isActiveMember, type ActiveProfile } from "./profile-client";

export { isActiveMember, type ActiveProfile };

const PROFILE_FIELDS =
  "id, committee_id, full_name, email, role, joined_date, bio, orientation_completed_at, membership_status";

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

export async function getAuthProfileState() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("id", user.id)
    .single();

  return { user, profile: profile as Profile | null };
}


export async function requireProfile(): Promise<ActiveProfile> {
  const { user, profile } = await getAuthProfileState();
  if (!user) redirect("/login");
  if (!profile) redirect("/login?message=Profile not ready. Try signing in again.");
  if (!isActiveMember(profile)) redirect("/membership");
  return profile;
}

export async function requireAdminProfile() {
  const profile = await requireProfile();
  if (!["chair", "secretary"].includes(profile.role as CommitteeRole)) {
    redirect("/");
  }
  return profile;
}

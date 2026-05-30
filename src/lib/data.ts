import { createClient } from "@/lib/supabase/server";
import type { ActivitySummary, MemberSemesterStats } from "@/lib/types";
import { requireAdminProfile, requireProfile } from "@/lib/profile";

export async function getMySemesterStats() {
  const supabase = await createClient();
  const profile = await requireProfile();

  const { data } = await supabase
    .from("member_semester_stats")
    .select("*")
    .eq("member_id", profile.id)
    .single();

  return (
    (data as MemberSemesterStats | null) ?? {
      member_id: profile.id,
      full_name: profile.full_name,
      attendance_rate: 0,
      total_hours: 0,
      member_status: "inactive",
    }
  );
}

export async function getLowActivityMembers() {
  const supabase = await createClient();
  await requireAdminProfile();
  const { data } = await supabase.from("low_activity_members").select("*").limit(10);
  return data ?? [];
}

export async function getLeaderboard() {
  const supabase = await createClient();
  const profile = await requireProfile();
  const { data } = await supabase
    .from("member_semester_stats")
    .select("member_id, full_name, total_hours, attendance_rate, joined_date")
    .eq("committee_id", profile.committee_id)
    .order("total_hours", { ascending: false })
    .order("attendance_rate", { ascending: false })
    .order("joined_date", { ascending: true })
    .order("full_name", { ascending: true })
    .limit(10);

  return data ?? [];
}

export async function getMemberActivities(memberId?: string) {
  const supabase = await createClient();
  const profile = await requireProfile();
  const targetMemberId = memberId ?? profile.id;
  const isAdmin = profile.role === "chair" || profile.role === "secretary";

  if (targetMemberId !== profile.id && !isAdmin) return [];

  const { data } = await supabase
    .from("activity_participants")
    .select(
        "activity_id, submitted_minutes, claimed_minutes, approved_minutes, activities(title, date, location, category, participation_type, status, lifecycle_status)",
    )
    .eq("member_id", targetMemberId);

  return (
    data?.map((row) => {
      const activity = Array.isArray(row.activities) ? row.activities[0] : row.activities;
      return {
        id: row.activity_id as string,
        title: (activity?.title as string) ?? "Activity",
        date: (activity?.date as string) ?? "",
        location: (activity?.location as string) ?? "",
        category: (activity?.category as string) ?? "",
        participation_type: (activity?.participation_type as "on_ground" | "virtual") ?? "virtual",
        status: activity?.status as ActivitySummary["status"],
        lifecycle_status: activity?.lifecycle_status as ActivitySummary["lifecycle_status"],
        submitted_hours: Number(row.submitted_minutes ?? 0) / 60,
        claimed_hours: Number(row.claimed_minutes ?? row.submitted_minutes ?? 0) / 60,
        approved_hours: Number(row.approved_minutes ?? 0) / 60,
      };
    }) ?? []
  );
}

export async function getCommitteeActivityLogs() {
  const supabase = await createClient();
  await requireAdminProfile();
  const { data } = await supabase
    .from("activity_participants")
    .select(
      "member_id, submitted_minutes, claimed_minutes, approved_minutes, activities(id, title, date, category, location, status, lifecycle_status, profiles:created_by(full_name)), profiles:member_id(full_name)",
    )
    .order("created_at", { ascending: true });

  return data ?? [];
}

export const getPendingActivities = getCommitteeActivityLogs;

export async function getActiveMeetings() {
  const supabase = await createClient();
  await requireProfile();
  const { data } = await supabase
    .from("meetings")
    .select("id, title, scheduled_at, location, attendance_mode, session_expires_at, opened_at, closed_at")
    .not("opened_at", "is", null)
    .is("closed_at", null)
    .order("scheduled_at", { ascending: true });

  return data ?? [];
}

export async function getMeetings() {
  const supabase = await createClient();
  await requireProfile();
  const { data } = await supabase
    .from("meetings")
    .select(
      "id, title, scheduled_at, location, attendance_mode, session_expires_at, opened_at, closed_at, agenda_items",
    )
    .order("scheduled_at", { ascending: false })
    .limit(25);

  return data ?? [];
}

export async function getMeetingDetail(meetingId: string) {
  const supabase = await createClient();
  await requireProfile();

  const { data: meeting } = await supabase
    .from("meetings")
    .select(
      "id, title, scheduled_at, location, closed_at, opened_at, agenda_items, committee_id, meeting_minutes(*)",
    )
    .eq("id", meetingId)
    .single();

  if (!meeting) return null;

  const minutes = Array.isArray(meeting.meeting_minutes)
    ? meeting.meeting_minutes[0]
    : meeting.meeting_minutes;

  const { data: attendance } = await supabase
    .from("attendance")
    .select("member_id, status, profiles(full_name)")
    .eq("meeting_id", meetingId);

  return {
    ...meeting,
    minutes: minutes ?? null,
    attendance: attendance ?? [],
  };
}

export async function getCommitteeMembers() {
  const supabase = await createClient();
  await requireAdminProfile();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, joined_date")
    .eq("membership_status", "active")
    .order("full_name", { ascending: true });

  return data ?? [];
}

export async function getCommitteeSettings() {
  const supabase = await createClient();
  const profile = await requireAdminProfile();
  const { data } = await supabase
    .from("committees")
    .select("name, location, logo_url, chair_name, secretary_name, semester_start, semester_end")
    .eq("id", profile.committee_id)
    .single();

  return data;
}

export async function getPlanningItems() {
  const supabase = await createClient();
  await requireProfile();
  const { data } = await supabase
    .from("planning_items")
    .select(
      "id, title, category, description, status, target_date, location, expected_minutes, source_meeting_id, source_agenda_order, synced_from_minutes_at",
    )
    .order("target_date", { ascending: true });

  return data ?? [];
}

export async function getPlanningItemsForAgenda() {
  const supabase = await createClient();
  await requireAdminProfile();
  const { data } = await supabase
    .from("planning_items")
    .select("id, title, category, status, target_date")
    .in("status", ["idea", "planned", "scheduled", "active"])
    .order("target_date", { ascending: true, nullsFirst: false });

  return data ?? [];
}

export async function getProfileOrientationStatus() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { completed: true };

  const { data } = await supabase
    .from("profiles")
    .select("orientation_completed_at, full_name, joined_date")
    .eq("id", user.id)
    .single();

  return {
    completed: Boolean(data?.orientation_completed_at),
    needsOnboarding: !data?.full_name || !data?.joined_date,
  };
}

export async function getNotifications() {
  const supabase = await createClient();
  const profile = await requireProfile();
  const { data } = await supabase
    .from("notifications")
    .select("id, type, title, body, href, read_at, created_at")
    .eq("recipient_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(30);

  return data ?? [];
}

export async function getActiveCommittees() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("committees")
    .select("id, name, location, country, region")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return data ?? [];
}

export async function getMyMembershipRequest() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("membership_requests")
    .select("id, status, message, committee_id, committees(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  const committee = Array.isArray(data.committees) ? data.committees[0] : data.committees;

  return {
    id: data.id,
    status: data.status as string,
    message: data.message as string,
    committee_name: committee?.name ?? null,
  };
}

export async function getCommitteeRoster() {
  const supabase = await createClient();
  await requireAdminProfile();
  const { data } = await supabase
    .from("committee_roster")
    .select("id, email, full_name, suggested_role, status, claimed_at")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getPendingMembershipRequests() {
  const supabase = await createClient();
  await requireAdminProfile();
  const { data } = await supabase
    .from("membership_requests")
    .select("id, message, user_id, profiles(full_name, email)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (data ?? []).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      message: row.message as string,
      full_name: profile?.full_name ?? "Unknown",
      email: profile?.email ?? "",
    };
  });
}

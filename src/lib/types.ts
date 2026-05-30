export type CommitteeRole = "chair" | "secretary" | "member";
export type AttendanceStatus = "present" | "absent" | "excused";
export type AttendanceMode = "button" | "code";
export type ParticipationType = "on_ground" | "virtual";
export type ActivityStatus = "pending" | "approved" | "rejected" | "needs_revision";
export type LogLifecycleStatus = "draft" | "logged" | "exported" | "submitted_to_iou" | "iou_reviewed";
export type PlanningStatus = "idea" | "planned" | "scheduled" | "active" | "completed" | "archived";

export type Profile = {
  id: string;
  committee_id: string | null;
  full_name: string;
  email: string;
  role: CommitteeRole;
  joined_date: string | null;
  bio: string | null;
  orientation_completed_at?: string | null;
  membership_status?: "pending_review" | "active" | "suspended";
};

export type MemberSemesterStats = {
  member_id: string;
  full_name: string;
  attendance_rate: number;
  total_hours: number;
  member_status: "active" | "inactive";
};

export type ActivitySummary = {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  participation_type: ParticipationType;
  status?: ActivityStatus;
  lifecycle_status?: LogLifecycleStatus;
  submitted_hours?: number;
  claimed_hours?: number;
  approved_hours: number;
};

export type ActionResult = {
  ok: boolean;
  message: string;
};

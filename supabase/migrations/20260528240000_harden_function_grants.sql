revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.prevent_profile_privilege_escalation() from public, anon, authenticated;
revoke all on function public.refresh_hours_log_for_activity_trigger() from public, anon, authenticated;
revoke all on function public.refresh_hours_log_for_activity(uuid) from public, anon, authenticated;
grant execute on function public.refresh_hours_log_for_activity(uuid) to service_role;

alter function public.touch_updated_at() set search_path = public;
alter function public.current_user_committee_id() set search_path = public;
alter function public.current_user_role() set search_path = public;
alter function public.is_committee_admin() set search_path = public;
alter function public.calculate_member_attendance_rate(uuid, uuid) set search_path = public;

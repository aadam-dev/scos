do $$
begin
  if not exists (select 1 from pg_type where typname = 'activity_status') then
    create type public.activity_status as enum ('pending', 'approved', 'rejected', 'needs_revision');
  end if;
end
$$;

alter table public.activities
  add column if not exists status public.activity_status not null default 'pending';

alter table public.activity_participants
  add column if not exists submitted_minutes int not null default 0 check (submitted_minutes >= 0),
  add column if not exists reviewed_by uuid references public.profiles (id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists review_notes text;

update public.activity_participants
set submitted_minutes = approved_minutes
where submitted_minutes = 0 and approved_minutes > 0;

create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id and not public.is_committee_admin() then
    if new.role <> old.role or new.committee_id <> old.committee_id or new.email <> old.email then
      raise exception 'Members cannot change role, committee, or email directly.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_profiles_prevent_privilege_escalation on public.profiles;
create trigger trg_profiles_prevent_privilege_escalation
before update on public.profiles
for each row execute function public.prevent_profile_privilege_escalation();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_committee_id uuid;
begin
  select id into default_committee_id
  from public.committees
  order by created_at asc
  limit 1;

  if default_committee_id is null then
    insert into public.committees (
      name,
      location,
      chair_name,
      secretary_name,
      semester_start,
      semester_end
    )
    values (
      'Accra Student Committee',
      'Accra, Ghana',
      'Chair Placeholder',
      'Secretary Placeholder',
      date_trunc('year', now())::date,
      (date_trunc('year', now()) + interval '6 months' - interval '1 day')::date
    )
    returning id into default_committee_id;
  end if;

  insert into public.profiles (
    id,
    committee_id,
    full_name,
    email,
    role,
    joined_date
  )
  values (
    new.id,
    default_committee_id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), 'New Member'),
    new.email,
    'member',
    now()::date
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.refresh_hours_log_for_activity(p_activity_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rec record;
begin
  delete from public.hours_log
  where source_type = 'activity'
    and source_id = p_activity_id;

  for rec in
    select
      ap.member_id,
      ap.approved_minutes,
      to_char(a.date, 'YYYY') || '-S' ||
      case
        when extract(month from a.date) between 1 and 6 then '1'
        else '2'
      end as semester_key
    from public.activity_participants ap
    join public.activities a on a.id = ap.activity_id
    where ap.activity_id = p_activity_id
      and a.status = 'approved'
      and ap.approved_minutes > 0
  loop
    insert into public.hours_log (member_id, source_type, source_id, minutes, semester_key)
    values (rec.member_id, 'activity', p_activity_id, rec.approved_minutes, rec.semester_key);
  end loop;
end;
$$;

revoke all on function public.refresh_hours_log_for_activity(uuid) from public;
grant execute on function public.refresh_hours_log_for_activity(uuid) to service_role;

create or replace function public.refresh_hours_log_for_activity_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_hours_log_for_activity(coalesce(new.activity_id, old.activity_id));
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_refresh_hours_log_for_activity on public.activity_participants;
create trigger trg_refresh_hours_log_for_activity
after insert or update or delete on public.activity_participants
for each row execute function public.refresh_hours_log_for_activity_trigger();

create or replace function public.calculate_member_attendance_rate(p_member_id uuid, p_committee_id uuid)
returns numeric
language sql
stable
as $$
  with member_meetings as (
    select a.status
    from public.attendance a
    join public.meetings m on m.id = a.meeting_id
    join public.committees c on c.id = m.committee_id
    where a.member_id = p_member_id
      and m.committee_id = p_committee_id
      and m.scheduled_at::date between c.semester_start and c.semester_end
  )
  select
    case
      when count(*) filter (where status <> 'excused') = 0 then 0
      else (
        count(*) filter (where status = 'present')::numeric
        / nullif(count(*) filter (where status <> 'excused'), 0)::numeric
      ) * 100
    end
  from member_meetings;
$$;

drop view if exists public.low_activity_members;
drop view if exists public.member_semester_stats;

create or replace view public.member_semester_stats
with (security_invoker = true)
as
with attendance_rates as (
  select
    p.id as member_id,
    p.committee_id,
    round(public.calculate_member_attendance_rate(p.id, p.committee_id), 2) as attendance_rate
  from public.profiles p
),
hours_totals as (
  select
    h.member_id,
    sum(h.minutes) as total_minutes
  from public.hours_log h
  join public.profiles p on p.id = h.member_id
  join public.committees c on c.id = p.committee_id
  where h.logged_at::date between c.semester_start and c.semester_end
  group by h.member_id
)
select
  p.id as member_id,
  p.full_name,
  p.joined_date,
  p.committee_id,
  coalesce(ar.attendance_rate, 0) as attendance_rate,
  round(coalesce(ht.total_minutes, 0)::numeric / 60, 2) as total_hours,
  case
    when coalesce(ar.attendance_rate, 0) >= 60
      and coalesce(ht.total_minutes, 0) >= 600
      then 'active'
    else 'inactive'
  end as member_status
from public.profiles p
left join attendance_rates ar on ar.member_id = p.id
left join hours_totals ht on ht.member_id = p.id
where p.id = auth.uid()
  or (
    p.committee_id = public.current_user_committee_id()
    and public.is_committee_admin()
  );

create or replace view public.low_activity_members
with (security_invoker = true)
as
select
  mss.member_id,
  mss.full_name,
  mss.committee_id,
  mss.attendance_rate,
  mss.total_hours,
  greatest(0, 60 - mss.attendance_rate) as attendance_deficit,
  greatest(0, 10 - mss.total_hours) as hours_deficit
from public.member_semester_stats mss
where mss.member_status = 'inactive'
  and mss.committee_id = public.current_user_committee_id()
  and public.is_committee_admin()
order by attendance_deficit desc, hours_deficit desc;

create policy "members submit activities in own committee"
on public.activities for insert
to authenticated
with check (
  committee_id = public.current_user_committee_id()
  and created_by = auth.uid()
  and status = 'pending'
);

create policy "members update own pending activities"
on public.activities for update
to authenticated
using (
  created_by = auth.uid()
  and status in ('pending', 'needs_revision')
  and committee_id = public.current_user_committee_id()
)
with check (
  created_by = auth.uid()
  and status = 'pending'
  and committee_id = public.current_user_committee_id()
);

create policy "members submit own activity participation"
on public.activity_participants for insert
to authenticated
with check (
  member_id = auth.uid()
  and approved_minutes = 0
  and exists (
    select 1
    from public.activities a
    where a.id = activity_participants.activity_id
      and a.created_by = auth.uid()
      and a.committee_id = public.current_user_committee_id()
      and a.status = 'pending'
  )
);

create policy "members can update own pending participation"
on public.activity_participants for update
to authenticated
using (
  member_id = auth.uid()
  and exists (
    select 1
    from public.activities a
    where a.id = activity_participants.activity_id
      and a.created_by = auth.uid()
      and a.status in ('pending', 'needs_revision')
  )
)
with check (
  member_id = auth.uid()
  and approved_minutes = 0
);

create policy "attendance member update own open row"
on public.attendance for update
to authenticated
using (
  member_id = auth.uid()
  and exists (
    select 1
    from public.meetings m
    where m.id = attendance.meeting_id
      and m.committee_id = public.current_user_committee_id()
      and m.opened_at is not null
      and m.closed_at is null
      and (m.session_expires_at is null or m.session_expires_at > now())
  )
)
with check (
  member_id = auth.uid()
  and status = 'present'
);

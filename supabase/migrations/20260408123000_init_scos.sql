create extension if not exists "pgcrypto";

create type public.committee_role as enum ('chair', 'secretary', 'member');
create type public.attendance_status as enum ('present', 'absent', 'excused');
create type public.attendance_mode as enum ('button', 'code');
create type public.activity_participation_type as enum ('on_ground', 'virtual');
create type public.hours_source_type as enum ('activity', 'attendance_bonus');

create table public.committees (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  location text not null,
  logo_url text,
  chair_name text not null,
  secretary_name text not null,
  semester_start date not null,
  semester_end date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  committee_id uuid not null references public.committees (id) on delete restrict,
  full_name text not null,
  email text not null unique,
  role public.committee_role not null default 'member',
  bio text,
  joined_date date not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references public.committees (id) on delete cascade,
  title text not null,
  scheduled_at timestamptz not null,
  location text not null,
  opened_at timestamptz,
  closed_at timestamptz,
  attendance_mode public.attendance_mode not null default 'button',
  session_code_hash text,
  session_expires_at timestamptz,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  member_id uuid not null references public.profiles (id) on delete cascade,
  status public.attendance_status not null,
  marked_via public.attendance_mode not null,
  marked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (meeting_id, member_id)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references public.committees (id) on delete cascade,
  title text not null,
  date date not null,
  category text not null,
  description text not null,
  duration_minutes int not null check (duration_minutes > 0),
  location text not null,
  participation_type public.activity_participation_type not null,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_participants (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities (id) on delete cascade,
  member_id uuid not null references public.profiles (id) on delete cascade,
  approved_minutes int not null check (approved_minutes >= 0),
  evidence_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (activity_id, member_id)
);

create table public.activity_media (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities (id) on delete cascade,
  storage_path text not null,
  public_url text,
  mime_type text not null,
  uploaded_by uuid not null references public.profiles (id) on delete restrict,
  uploaded_at timestamptz not null default now()
);

create table public.hours_log (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  source_type public.hours_source_type not null,
  source_id uuid not null,
  minutes int not null check (minutes >= 0),
  logged_at timestamptz not null default now(),
  semester_key text not null,
  unique (source_type, source_id, member_id)
);

create index idx_profiles_committee on public.profiles (committee_id);
create index idx_meetings_committee on public.meetings (committee_id);
create index idx_attendance_member on public.attendance (member_id);
create index idx_activities_committee_date on public.activities (committee_id, date);
create index idx_hours_member_semester on public.hours_log (member_id, semester_key);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_committees_updated
before update on public.committees
for each row execute function public.touch_updated_at();

create trigger trg_profiles_updated
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger trg_meetings_updated
before update on public.meetings
for each row execute function public.touch_updated_at();

create trigger trg_attendance_updated
before update on public.attendance
for each row execute function public.touch_updated_at();

create trigger trg_activities_updated
before update on public.activities
for each row execute function public.touch_updated_at();

create trigger trg_activity_participants_updated
before update on public.activity_participants
for each row execute function public.touch_updated_at();

create or replace function public.current_user_committee_id()
returns uuid
language sql
stable
as $$
  select p.committee_id
  from public.profiles p
  where p.id = auth.uid()
$$;

create or replace function public.current_user_role()
returns public.committee_role
language sql
stable
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
$$;

create or replace function public.is_committee_admin()
returns boolean
language sql
stable
as $$
  select coalesce(public.current_user_role() in ('chair', 'secretary'), false)
$$;

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
  loop
    insert into public.hours_log (member_id, source_type, source_id, minutes, semester_key)
    values (rec.member_id, 'activity', p_activity_id, rec.approved_minutes, rec.semester_key);
  end loop;
end;
$$;

create or replace function public.calculate_member_attendance_rate(p_member_id uuid, p_committee_id uuid)
returns numeric
language sql
stable
as $$
  with member_meetings as (
    select a.status
    from public.attendance a
    join public.meetings m on m.id = a.meeting_id
    where a.member_id = p_member_id
      and m.committee_id = p_committee_id
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

create or replace view public.member_semester_stats as
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
  group by h.member_id
)
select
  p.id as member_id,
  p.full_name,
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
left join hours_totals ht on ht.member_id = p.id;

create or replace view public.low_activity_members as
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
order by attendance_deficit desc, hours_deficit desc;

alter table public.committees enable row level security;
alter table public.profiles enable row level security;
alter table public.meetings enable row level security;
alter table public.attendance enable row level security;
alter table public.activities enable row level security;
alter table public.activity_participants enable row level security;
alter table public.activity_media enable row level security;
alter table public.hours_log enable row level security;

create policy "read own committee committees"
on public.committees for select
to authenticated
using (id = public.current_user_committee_id());

create policy "admin update committee"
on public.committees for update
to authenticated
using (id = public.current_user_committee_id() and public.is_committee_admin())
with check (id = public.current_user_committee_id() and public.is_committee_admin());

create policy "read own or committee profiles"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or (
    committee_id = public.current_user_committee_id()
    and public.is_committee_admin()
  )
);

create policy "update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "admin insert profile in committee"
on public.profiles for insert
to authenticated
with check (
  committee_id = public.current_user_committee_id()
  and public.is_committee_admin()
);

create policy "committee meetings read"
on public.meetings for select
to authenticated
using (committee_id = public.current_user_committee_id());

create policy "committee meetings admin write"
on public.meetings for all
to authenticated
using (
  committee_id = public.current_user_committee_id()
  and public.is_committee_admin()
)
with check (
  committee_id = public.current_user_committee_id()
  and public.is_committee_admin()
);

create policy "attendance read own or admin"
on public.attendance for select
to authenticated
using (
  member_id = auth.uid()
  or (
    exists (
      select 1
      from public.meetings m
      where m.id = attendance.meeting_id
        and m.committee_id = public.current_user_committee_id()
    )
    and public.is_committee_admin()
  )
);

create policy "attendance insert self when meeting open"
on public.attendance for insert
to authenticated
with check (
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
);

create policy "attendance admin update"
on public.attendance for update
to authenticated
using (
  exists (
    select 1
    from public.meetings m
    where m.id = attendance.meeting_id
      and m.committee_id = public.current_user_committee_id()
      and public.is_committee_admin()
  )
)
with check (
  exists (
    select 1
    from public.meetings m
    where m.id = attendance.meeting_id
      and m.committee_id = public.current_user_committee_id()
      and public.is_committee_admin()
  )
);

create policy "activities committee read"
on public.activities for select
to authenticated
using (committee_id = public.current_user_committee_id());

create policy "activities committee write admin"
on public.activities for all
to authenticated
using (committee_id = public.current_user_committee_id() and public.is_committee_admin())
with check (committee_id = public.current_user_committee_id() and public.is_committee_admin());

create policy "activity participants read own or admin"
on public.activity_participants for select
to authenticated
using (
  member_id = auth.uid()
  or (
    exists (
      select 1
      from public.activities a
      where a.id = activity_participants.activity_id
        and a.committee_id = public.current_user_committee_id()
    )
    and public.is_committee_admin()
  )
);

create policy "activity participants admin write"
on public.activity_participants for all
to authenticated
using (
  exists (
    select 1
    from public.activities a
    where a.id = activity_participants.activity_id
      and a.committee_id = public.current_user_committee_id()
      and public.is_committee_admin()
  )
)
with check (
  exists (
    select 1
    from public.activities a
    where a.id = activity_participants.activity_id
      and a.committee_id = public.current_user_committee_id()
      and public.is_committee_admin()
  )
);

create policy "activity media read own or admin"
on public.activity_media for select
to authenticated
using (
  uploaded_by = auth.uid()
  or (
    exists (
      select 1
      from public.activities a
      where a.id = activity_media.activity_id
        and a.committee_id = public.current_user_committee_id()
    )
    and public.is_committee_admin()
  )
);

create policy "activity media insert committee members"
on public.activity_media for insert
to authenticated
with check (
  uploaded_by = auth.uid()
  and exists (
    select 1
    from public.activities a
    where a.id = activity_media.activity_id
      and a.committee_id = public.current_user_committee_id()
  )
);

create policy "hours log read own or admin"
on public.hours_log for select
to authenticated
using (
  member_id = auth.uid()
  or (
    exists (
      select 1
      from public.profiles p
      where p.id = hours_log.member_id
        and p.committee_id = public.current_user_committee_id()
    )
    and public.is_committee_admin()
  )
);

create policy "hours log admin write"
on public.hours_log for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = hours_log.member_id
      and p.committee_id = public.current_user_committee_id()
      and public.is_committee_admin()
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = hours_log.member_id
      and p.committee_id = public.current_user_committee_id()
      and public.is_committee_admin()
  )
);

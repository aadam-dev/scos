do $$
begin
  if not exists (select 1 from pg_type where typname = 'log_lifecycle_status') then
    create type public.log_lifecycle_status as enum ('draft', 'logged', 'exported', 'submitted_to_iou', 'iou_reviewed');
  end if;

  if not exists (select 1 from pg_type where typname = 'planning_status') then
    create type public.planning_status as enum ('idea', 'planned', 'scheduled', 'active', 'completed', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'email_event_status') then
    create type public.email_event_status as enum ('queued', 'sent', 'failed', 'cancelled');
  end if;
end
$$;

alter table public.profiles
  add column if not exists program_type text,
  add column if not exists target_hours int,
  add column if not exists location text,
  add column if not exists phone text,
  add column if not exists preferred_positions text[] not null default '{}',
  add column if not exists orientation_completed_at timestamptz;

alter table public.activities
  add column if not exists lifecycle_status public.log_lifecycle_status not null default 'logged',
  add column if not exists expected_minutes int check (expected_minutes is null or expected_minutes >= 0),
  add column if not exists exported_at timestamptz,
  add column if not exists submitted_to_iou_at timestamptz,
  add column if not exists external_review_notes text;

alter table public.activity_participants
  add column if not exists claimed_minutes int not null default 0 check (claimed_minutes >= 0);

update public.activity_participants
set claimed_minutes = greatest(submitted_minutes, approved_minutes)
where claimed_minutes = 0;

create table if not exists public.planning_items (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references public.committees (id) on delete cascade,
  title text not null,
  category text not null,
  description text not null,
  status public.planning_status not null default 'idea',
  owner_id uuid references public.profiles (id) on delete set null,
  target_date date,
  location text,
  expected_minutes int check (expected_minutes is null or expected_minutes >= 0),
  evidence_required boolean not null default true,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.planning_item_members (
  id uuid primary key default gen_random_uuid(),
  planning_item_id uuid not null references public.planning_items (id) on delete cascade,
  member_id uuid not null references public.profiles (id) on delete cascade,
  assigned_role text,
  created_at timestamptz not null default now(),
  unique (planning_item_id, member_id)
);

create table if not exists public.meeting_minutes (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null unique references public.meetings (id) on delete cascade,
  summary text not null,
  decisions text,
  action_items text,
  published_at timestamptz,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references public.committees (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references public.committees (id) on delete cascade,
  recipient_id uuid references public.profiles (id) on delete set null,
  to_email text not null,
  subject text not null,
  template text not null,
  payload jsonb not null default '{}',
  status public.email_event_status not null default 'queued',
  resend_message_id text,
  error_message text,
  scheduled_for timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create trigger trg_planning_items_updated
before update on public.planning_items
for each row execute function public.touch_updated_at();

create trigger trg_meeting_minutes_updated
before update on public.meeting_minutes
for each row execute function public.touch_updated_at();

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
      ap.claimed_minutes,
      to_char(a.date, 'YYYY') || '-S' ||
      case
        when extract(month from a.date) between 1 and 6 then '1'
        else '2'
      end as semester_key
    from public.activity_participants ap
    join public.activities a on a.id = ap.activity_id
    where ap.activity_id = p_activity_id
      and a.lifecycle_status in ('logged', 'exported', 'submitted_to_iou', 'iou_reviewed')
      and ap.claimed_minutes > 0
  loop
    insert into public.hours_log (member_id, source_type, source_id, minutes, semester_key)
    values (rec.member_id, 'activity', p_activity_id, rec.claimed_minutes, rec.semester_key);
  end loop;
end;
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

alter table public.planning_items enable row level security;
alter table public.planning_item_members enable row level security;
alter table public.meeting_minutes enable row level security;
alter table public.notifications enable row level security;
alter table public.email_events enable row level security;

create policy "planning items committee read"
on public.planning_items for select
to authenticated
using (committee_id = public.current_user_committee_id());

create policy "planning items admin write"
on public.planning_items for all
to authenticated
using (committee_id = public.current_user_committee_id() and public.is_committee_admin())
with check (committee_id = public.current_user_committee_id() and public.is_committee_admin());

create policy "planning item members committee read"
on public.planning_item_members for select
to authenticated
using (
  exists (
    select 1 from public.planning_items pi
    where pi.id = planning_item_members.planning_item_id
      and pi.committee_id = public.current_user_committee_id()
  )
);

create policy "planning item members admin write"
on public.planning_item_members for all
to authenticated
using (
  exists (
    select 1 from public.planning_items pi
    where pi.id = planning_item_members.planning_item_id
      and pi.committee_id = public.current_user_committee_id()
      and public.is_committee_admin()
  )
)
with check (
  exists (
    select 1 from public.planning_items pi
    where pi.id = planning_item_members.planning_item_id
      and pi.committee_id = public.current_user_committee_id()
      and public.is_committee_admin()
  )
);

create policy "meeting minutes committee read"
on public.meeting_minutes for select
to authenticated
using (
  exists (
    select 1 from public.meetings m
    where m.id = meeting_minutes.meeting_id
      and m.committee_id = public.current_user_committee_id()
  )
);

create policy "meeting minutes admin write"
on public.meeting_minutes for all
to authenticated
using (public.is_committee_admin())
with check (public.is_committee_admin());

create policy "notifications own read"
on public.notifications for select
to authenticated
using (recipient_id = auth.uid());

create policy "notifications own update"
on public.notifications for update
to authenticated
using (recipient_id = auth.uid())
with check (recipient_id = auth.uid());

create policy "notifications admin insert"
on public.notifications for insert
to authenticated
with check (committee_id = public.current_user_committee_id() and public.is_committee_admin());

create policy "email events admin read"
on public.email_events for select
to authenticated
using (committee_id = public.current_user_committee_id() and public.is_committee_admin());

create policy "email events admin insert"
on public.email_events for insert
to authenticated
with check (committee_id = public.current_user_committee_id() and public.is_committee_admin());

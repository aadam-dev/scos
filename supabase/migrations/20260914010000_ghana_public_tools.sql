-- Ghana SC public intake, asset archive, academy quiz, cross-SC webinars

alter table public.profiles
  add column if not exists academy_quiz_passed_at timestamptz,
  add column if not exists academy_quiz_score integer;

do $$ begin
  create type public.intake_status as enum ('new', 'contacted', 'accepted', 'declined');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.internship_track as enum ('local_internship', 'volunteer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.asset_category as enum (
    'branding', 'template', 'project', 'photo', 'report', 'other'
  );
exception when duplicate_object then null;
end $$;

-- Default Ghana Accra committee helper for public forms
create or replace function public.default_ghana_committee_id()
returns uuid
language sql
stable
as $$
  select id
  from public.committees
  where slug = 'accra'
     or name ilike '%Accra%'
  order by created_at
  limit 1
$$;

create table if not exists public.internship_applications (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references public.committees (id) on delete cascade
    default public.default_ghana_committee_id(),
  full_name text not null,
  email text not null,
  phone text,
  school_program text,
  track public.internship_track not null default 'local_internship',
  availability text,
  motivation text not null,
  status public.intake_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.outreach_opportunities (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references public.committees (id) on delete cascade,
  title text not null,
  summary text not null,
  location text,
  hours_estimate numeric(6,2),
  starts_on date,
  ends_on date,
  published boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.outreach_signups (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.outreach_opportunities (id) on delete cascade,
  committee_id uuid not null references public.committees (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  note text,
  status public.intake_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.committee_assets (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references public.committees (id) on delete cascade,
  title text not null,
  description text,
  category public.asset_category not null default 'other',
  year_term text,
  tags text[] not null default '{}',
  storage_path text not null,
  mime_type text,
  file_size integer,
  uploaded_by uuid references public.profiles (id) on delete set null,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cross-SC webinars / upcoming events board
create table if not exists public.sc_webinars (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references public.committees (id) on delete cascade,
  title text not null,
  summary text not null,
  host_label text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null default 'Africa/Accra',
  format text not null default 'webinar',
  join_url text not null,
  registration_url text,
  location text,
  audience text,
  contact_email text,
  published boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_internship_applications_status
  on public.internship_applications (status, created_at desc);
create index if not exists idx_outreach_opportunities_published
  on public.outreach_opportunities (published, starts_on);
create index if not exists idx_outreach_signups_status
  on public.outreach_signups (status, created_at desc);
create index if not exists idx_committee_assets_committee
  on public.committee_assets (committee_id, archived, category);
create index if not exists idx_sc_webinars_upcoming
  on public.sc_webinars (published, starts_at);

drop trigger if exists trg_internship_applications_updated on public.internship_applications;
create trigger trg_internship_applications_updated
before update on public.internship_applications
for each row execute function public.touch_updated_at();

drop trigger if exists trg_outreach_opportunities_updated on public.outreach_opportunities;
create trigger trg_outreach_opportunities_updated
before update on public.outreach_opportunities
for each row execute function public.touch_updated_at();

drop trigger if exists trg_outreach_signups_updated on public.outreach_signups;
create trigger trg_outreach_signups_updated
before update on public.outreach_signups
for each row execute function public.touch_updated_at();

drop trigger if exists trg_committee_assets_updated on public.committee_assets;
create trigger trg_committee_assets_updated
before update on public.committee_assets
for each row execute function public.touch_updated_at();

drop trigger if exists trg_sc_webinars_updated on public.sc_webinars;
create trigger trg_sc_webinars_updated
before update on public.sc_webinars
for each row execute function public.touch_updated_at();

alter table public.internship_applications enable row level security;
alter table public.outreach_opportunities enable row level security;
alter table public.outreach_signups enable row level security;
alter table public.committee_assets enable row level security;
alter table public.sc_webinars enable row level security;

-- Public can read published outreach + webinars (anon + authenticated)
create policy "public read published outreach"
on public.outreach_opportunities for select
using (published = true);

create policy "admin manage outreach opportunities"
on public.outreach_opportunities for all
to authenticated
using (public.is_committee_admin() and committee_id = public.current_user_committee_id())
with check (public.is_committee_admin() and committee_id = public.current_user_committee_id());

create policy "admin read outreach signups"
on public.outreach_signups for select
to authenticated
using (public.is_committee_admin() and committee_id = public.current_user_committee_id());

create policy "admin update outreach signups"
on public.outreach_signups for update
to authenticated
using (public.is_committee_admin() and committee_id = public.current_user_committee_id());

create policy "admin read internship applications"
on public.internship_applications for select
to authenticated
using (public.is_committee_admin() and committee_id = public.current_user_committee_id());

create policy "admin update internship applications"
on public.internship_applications for update
to authenticated
using (public.is_committee_admin() and committee_id = public.current_user_committee_id());

create policy "members read committee assets"
on public.committee_assets for select
to authenticated
using (
  committee_id = public.current_user_committee_id()
  and archived = false
);

create policy "admin manage committee assets"
on public.committee_assets for all
to authenticated
using (public.is_committee_admin() and committee_id = public.current_user_committee_id())
with check (public.is_committee_admin() and committee_id = public.current_user_committee_id());

create policy "public read published webinars"
on public.sc_webinars for select
using (published = true);

create policy "admin manage webinars"
on public.sc_webinars for all
to authenticated
using (public.is_committee_admin() and committee_id = public.current_user_committee_id())
with check (public.is_committee_admin() and committee_id = public.current_user_committee_id());

-- Also allow admins to read their own unpublished webinars (covered by manage policy)

insert into storage.buckets (id, name, public)
values ('committee-assets', 'committee-assets', false)
on conflict (id) do nothing;

create policy "committee assets upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'committee-assets'
  and public.is_committee_admin()
  and (storage.foldername(name))[1] = public.current_user_committee_id()::text
);

create policy "committee assets read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'committee-assets'
  and (storage.foldername(name))[1] = public.current_user_committee_id()::text
);

create policy "committee assets delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'committee-assets'
  and public.is_committee_admin()
  and (storage.foldername(name))[1] = public.current_user_committee_id()::text
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'membership_status') then
    create type public.membership_status as enum ('pending_review', 'active', 'suspended');
  end if;

  if not exists (select 1 from pg_type where typname = 'roster_status') then
    create type public.roster_status as enum ('invited', 'claimed', 'revoked');
  end if;

  if not exists (select 1 from pg_type where typname = 'membership_request_status') then
    create type public.membership_request_status as enum ('pending', 'approved', 'rejected');
  end if;
end
$$;

alter table public.committees
  add column if not exists slug text,
  add column if not exists country text,
  add column if not exists region text,
  add column if not exists is_active boolean not null default true;

update public.committees
set
  slug = coalesce(slug, 'accra-sc'),
  country = coalesce(country, 'Ghana'),
  region = coalesce(region, 'Greater Accra')
where name = 'Accra Student Committee';

create unique index if not exists idx_committees_slug on public.committees (slug)
  where slug is not null;

alter table public.profiles
  add column if not exists membership_status public.membership_status not null default 'pending_review';

alter table public.profiles
  alter column committee_id drop not null;

alter table public.profiles
  alter column joined_date drop not null;

update public.profiles
set membership_status = 'active'
where committee_id is not null
  and membership_status = 'pending_review';

create table if not exists public.committee_roster (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references public.committees (id) on delete cascade,
  email text not null,
  full_name text,
  suggested_role public.committee_role not null default 'member',
  status public.roster_status not null default 'invited',
  invited_by uuid references public.profiles (id) on delete set null,
  claimed_by uuid references public.profiles (id) on delete set null,
  claimed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (committee_id, email)
);

create table if not exists public.membership_requests (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid not null references public.committees (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.membership_request_status not null default 'pending',
  message text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (committee_id, user_id)
);

create index if not exists idx_committee_roster_email on public.committee_roster (lower(email));
create index if not exists idx_membership_requests_committee on public.membership_requests (committee_id, status);

create trigger trg_committee_roster_updated
before update on public.committee_roster
for each row execute function public.touch_updated_at();

create trigger trg_membership_requests_updated
before update on public.membership_requests
for each row execute function public.touch_updated_at();

create or replace function public.is_active_member()
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.membership_status = 'active'
      and p.committee_id is not null
  )
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  roster record;
  display_name text;
begin
  display_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(trim(concat_ws(' ', new.raw_user_meta_data ->> 'given_name', new.raw_user_meta_data ->> 'family_name')), ''),
    split_part(new.email, '@', 1),
    'New Member'
  );

  select r.*
  into roster
  from public.committee_roster r
  where lower(r.email) = lower(new.email)
    and r.status = 'invited'
  order by r.created_at asc
  limit 1;

  if roster.id is not null then
    insert into public.profiles (
      id,
      committee_id,
      full_name,
      email,
      role,
      joined_date,
      avatar_url,
      membership_status
    )
    values (
      new.id,
      roster.committee_id,
      coalesce(nullif(trim(roster.full_name), ''), display_name),
      new.email,
      roster.suggested_role,
      now()::date,
      nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
      'active'
    )
    on conflict (id) do update
    set
      committee_id = excluded.committee_id,
      full_name = excluded.full_name,
      email = excluded.email,
      role = excluded.role,
      avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
      membership_status = 'active';

    update public.committee_roster
    set
      status = 'claimed',
      claimed_by = new.id,
      claimed_at = now()
    where id = roster.id;

    return new;
  end if;

  insert into public.profiles (
    id,
    committee_id,
    full_name,
    email,
    role,
    membership_status,
    avatar_url
  )
  values (
    new.id,
    null,
    display_name,
    new.email,
    'member',
    'pending_review',
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

alter table public.committee_roster enable row level security;
alter table public.membership_requests enable row level security;

create policy "committee roster admin read"
on public.committee_roster for select
to authenticated
using (
  committee_id = public.current_user_committee_id()
  and public.is_committee_admin()
);

create policy "committee roster admin write"
on public.committee_roster for all
to authenticated
using (
  committee_id = public.current_user_committee_id()
  and public.is_committee_admin()
)
with check (
  committee_id = public.current_user_committee_id()
  and public.is_committee_admin()
);

create policy "membership requests own read"
on public.membership_requests for select
to authenticated
using (user_id = auth.uid());

create policy "membership requests own insert"
on public.membership_requests for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.membership_status = 'pending_review'
      and p.committee_id is null
  )
);

create policy "membership requests admin read"
on public.membership_requests for select
to authenticated
using (
  committee_id = public.current_user_committee_id()
  and public.is_committee_admin()
);

create policy "membership requests admin update"
on public.membership_requests for update
to authenticated
using (
  committee_id = public.current_user_committee_id()
  and public.is_committee_admin()
)
with check (
  committee_id = public.current_user_committee_id()
  and public.is_committee_admin()
);

create policy "authenticated list active committees"
on public.committees for select
to authenticated
using (is_active = true);

comment on table public.committee_roster is
  'Pre-approved member emails per SC. Google sign-in auto-claims invited roster rows.';

comment on table public.membership_requests is
  'Join requests from users not on the roster. Chair or secretary approves.';

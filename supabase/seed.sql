insert into public.committees (
  id,
  name,
  slug,
  location,
  country,
  region,
  logo_url,
  chair_name,
  secretary_name,
  semester_start,
  semester_end,
  is_active
)
values (
  '11111111-1111-1111-1111-111111111111',
  'Accra Student Committee',
  'accra-sc',
  'Accra, Ghana',
  'Ghana',
  'Greater Accra',
  null,
  'Chair Placeholder',
  'Secretary Placeholder',
  '2026-01-01',
  '2026-06-30',
  true
)
on conflict (name) do update
set
  slug = excluded.slug,
  country = excluded.country,
  region = excluded.region,
  is_active = excluded.is_active;

-- Replace with real chair and secretary Gmail addresses before go-live.
-- insert into public.committee_roster (committee_id, email, full_name, suggested_role, status)
-- values
--   ('11111111-1111-1111-1111-111111111111', 'chair@gmail.com', 'SC Chair', 'chair', 'invited'),
--   ('11111111-1111-1111-1111-111111111111', 'secretary@gmail.com', 'SC Secretary', 'secretary', 'invited');

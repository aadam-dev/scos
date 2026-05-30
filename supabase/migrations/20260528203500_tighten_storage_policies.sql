drop policy if exists "activity media authenticated upload" on storage.objects;
drop policy if exists "activity media authenticated read" on storage.objects;

create policy "activity media committee upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'activity-media'
  and exists (
    select 1
    from public.activities a
    where a.id::text = (storage.foldername(name))[1]
      and a.committee_id = public.current_user_committee_id()
      and (
        a.created_by = auth.uid()
        or public.is_committee_admin()
      )
  )
);

create policy "activity media committee read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'activity-media'
  and exists (
    select 1
    from public.activities a
    left join public.activity_participants ap on ap.activity_id = a.id
    where a.id::text = (storage.foldername(name))[1]
      and a.committee_id = public.current_user_committee_id()
      and (
        a.created_by = auth.uid()
        or ap.member_id = auth.uid()
        or public.is_committee_admin()
      )
  )
);

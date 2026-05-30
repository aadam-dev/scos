insert into storage.buckets (id, name, public)
values ('activity-media', 'activity-media', false)
on conflict (id) do nothing;

create policy "activity media authenticated upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'activity-media'
  and (storage.foldername(name))[1] is not null
);

create policy "activity media authenticated read"
on storage.objects
for select
to authenticated
using (bucket_id = 'activity-media');

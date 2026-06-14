-- Storage bucket for lesson attachments (and other course assets).
-- Public read so learners can download resources; writes restricted to admins,
-- matching the app_metadata role check used by the courses table policies.

insert into storage.buckets (id, name, public)
values ('course-assets', 'course-assets', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Course assets are publicly readable" on storage.objects;
create policy "Course assets are publicly readable"
  on storage.objects
  for select
  using (bucket_id = 'course-assets');

drop policy if exists "Admins can upload course assets" on storage.objects;
create policy "Admins can upload course assets"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'course-assets'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins can update course assets" on storage.objects;
create policy "Admins can update course assets"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'course-assets'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    bucket_id = 'course-assets'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins can delete course assets" on storage.objects;
create policy "Admins can delete course assets"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'course-assets'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

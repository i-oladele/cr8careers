-- Lesson attachments require an authenticated, enrolled learner or an admin.
-- Thumbnails remain readable so the public course catalogue can render them;
-- clients receive signed URLs rather than permanent public object URLs.

update storage.buckets set public = false where id = 'course-assets';

insert into storage.buckets (id, name, public)
values ('course-thumbnails', 'course-thumbnails', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Course assets are publicly readable" on storage.objects;
drop policy if exists "Course asset thumbnails are readable" on storage.objects;
create policy "Course asset thumbnails are readable"
  on storage.objects for select
  using (bucket_id = 'course-assets' and (storage.foldername(name))[2] = 'thumbnail');

drop policy if exists "Enrolled learners can read course assets" on storage.objects;
create policy "Enrolled learners can read course assets"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'course-assets'
    and (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
      or exists (
        select 1 from public.enrollments e
        where e.user_id = auth.uid()
          and e.course_id = (storage.foldername(name))[1]
      )
    )
  );

drop policy if exists "Course thumbnails are publicly readable" on storage.objects;
create policy "Course thumbnails are publicly readable"
  on storage.objects for select
  using (bucket_id = 'course-thumbnails');

drop policy if exists "Admins can upload course thumbnails" on storage.objects;
create policy "Admins can upload course thumbnails"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'course-thumbnails' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update course thumbnails" on storage.objects;
create policy "Admins can update course thumbnails"
  on storage.objects for update to authenticated
  using (bucket_id = 'course-thumbnails' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (bucket_id = 'course-thumbnails' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete course thumbnails" on storage.objects;
create policy "Admins can delete course thumbnails"
  on storage.objects for delete to authenticated
  using (bucket_id = 'course-thumbnails' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

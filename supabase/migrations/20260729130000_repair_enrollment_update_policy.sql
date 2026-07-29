-- mark_lesson_complete and submit_quiz are security definer functions, but
-- public.enrollments has force row level security enabled, so their internal
-- UPDATE is still filtered by RLS even though they run as the table owner.
-- The storage-hardening migration replaced the learner UPDATE policy with an
-- admin-only one, so every non-admin completion UPDATE matched zero rows and
-- the RPCs raised "Enrollment not found". Table-level UPDATE stays revoked
-- from `authenticated`, so this only unblocks the RPCs, not direct client
-- writes.

drop policy if exists "Admins can update enrollments" on public.enrollments;
create policy "Learners can update their own enrollments"
  on public.enrollments
  for update
  to authenticated
  using (
    auth.uid() = user_id
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    auth.uid() = user_id
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

notify pgrst, 'reload schema';

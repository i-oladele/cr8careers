-- Restore the minimum table privileges needed by the learner UI while keeping
-- completion fields protected from direct client updates. Safe to rerun.

alter table public.enrollments enable row level security;
alter table public.enrollments force row level security;

revoke update, delete on public.enrollments from authenticated;
grant select, insert on public.enrollments to authenticated;

drop policy if exists "Learners can read their own enrollments" on public.enrollments;
create policy "Learners can read their own enrollments"
  on public.enrollments
  for select
  to authenticated
  using (
    auth.uid() = user_id
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Learners can create their own enrollments" on public.enrollments;
drop policy if exists "Learners can create empty enrollments" on public.enrollments;
create policy "Learners can create empty enrollments"
  on public.enrollments
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and progress_percentage = 0
    and completed = false
    and cardinality(completed_lessons) = 0
  );

notify pgrst, 'reload schema';

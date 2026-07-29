-- Route learner enrollment access through narrow RPCs so the browser never
-- needs direct table privileges. Safe to run repeatedly.

create or replace function public.get_my_enrollment(course_id text)
returns public.enrollments
language plpgsql
security definer
set search_path = ''
as $$
declare
  learner_id uuid := auth.uid();
  result public.enrollments;
begin
  if learner_id is null then raise exception 'Authentication required'; end if;

  select e.* into result
  from public.enrollments e
  where e.user_id = learner_id and e.course_id = get_my_enrollment.course_id;

  return result;
end;
$$;

create or replace function public.ensure_course_enrollment(course_id text)
returns public.enrollments
language plpgsql
security definer
set search_path = ''
as $$
declare
  learner_id uuid := auth.uid();
  learner_email text := coalesce(auth.jwt() ->> 'email', '');
  selected_course public.courses;
  result public.enrollments;
begin
  if learner_id is null then raise exception 'Authentication required'; end if;

  select c.* into selected_course from public.courses c where c.id = course_id;
  if selected_course.id is null then raise exception 'Course not found'; end if;

  insert into public.enrollments (
    user_id, user_email, course_id, course_title,
    progress_percentage, completed, completed_lessons
  ) values (
    learner_id, learner_email, selected_course.id, selected_course.title,
    0, false, array[]::text[]
  )
  on conflict (user_id, course_id) do nothing;

  select e.* into result
  from public.enrollments e
  where e.user_id = learner_id and e.course_id = ensure_course_enrollment.course_id;

  return result;
end;
$$;

revoke all on function public.get_my_enrollment(text) from public;
revoke all on function public.ensure_course_enrollment(text) from public;
grant execute on function public.get_my_enrollment(text) to authenticated;
grant execute on function public.ensure_course_enrollment(text) to authenticated;

notify pgrst, 'reload schema';
